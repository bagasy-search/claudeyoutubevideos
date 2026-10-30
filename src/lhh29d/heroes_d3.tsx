// lhh29d · componentes únicos 19-27: polvo sí / grasa no, poca sal en la mesa, los gusanitos que flotan, el brócoli que se ablanda,
// las doce docenas de huevos, la sal que sella la rajadura, la prueba del huevo que flota, la media cucharadita y las señales para ir al médico.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn, tubeG } from "./h3d";
import { Bowl, Egg, Grains, SaltPile, Stream, card, gk, lg, saltMat } from "./saltkit";

const PI = Math.PI;
type V = [number, number, number];
const Check: React.FC<{ k: number; p?: number[]; s?: number }> = ({ k, p = [0, 0, 0], s = 1 }) => k <= 0 ? null : <group position={p as V} scale={s * cl(k)}>
  <mesh position={[-0.03, -0.01, 0]} rotation={[0, 0, -PI / 4]}><planeGeometry args={[0.06, 0.022]} />{M.glow({ col: GRN })}</mesh>
  <mesh position={[0.025, 0.02, 0]} rotation={[0, 0, PI / 3.2]}><planeGeometry args={[0.12, 0.022]} />{M.glow({ col: GRN })}</mesh></group>;
// cabeza de brócoli: tallo + racimo de floretes
const Broccoli: React.FC<{ p?: number[]; rot?: number[]; s?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, col = "#3d7a2e" }) =>
  <group position={p as V} rotation={rot as V} scale={s}>
    <mesh position={[0, -0.06, 0]}><cylinderGeometry args={[0.014, 0.02, 0.1, 16]} /><meshStandardMaterial color="#8fb06a" roughness={0.7} /></mesh>
    {Array.from({ length: 14 }, (_, i) => { const a = i * 2.4, r = 0.012 + 0.03 * Math.sqrt(i / 14); return <mesh key={i} position={[Math.cos(a) * r, 0.01 - r * 0.6, Math.sin(a) * r]}>
      <sphereGeometry args={[0.024, 14, 10]} /><meshStandardMaterial color={col} roughness={0.9} bumpMap={tex.paper(4, 4)} bumpScale={6} /></mesh>; })}
  </group>;

// ---- 8:38 · POLVO SÍ, GRASA NO: dos pétalos; al de la izquierda la sal le saca el polvo; al de la derecha, brilloso de grasa, la sal se le queda pegada ----
export const HGreasyNo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.05, 0], az: [-0.05, 0.05], el: [0.42, 0.36], r: [0.56, 0.48], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="DUSTY YES · GREASY NO" col={AMB} /><Tag tt={tt} at={3.2} x={560} y={860} txt="SALT WORKS" col={GRN} size={42} />
    <Tag tt={tt} at={4.4} x={1360} y={860} txt="DAMP CLOTH" col={ICE} size={42} /></>}>{(tt, u) => {
  const k = eio(u, 0.56, 0.78), fall = cl((u - 0.08) / 0.4), rin = eio(u, 0.42, 0.54), rout = cl((u - 0.84) * 8);
  return <>{[-1, 1].map((s) => { const greasy = s > 0, c = greasy ? new THREE.Color("#c99a3a") : new THREE.Color("#8d8a86").lerp(new THREE.Color("#e86a8a"), k);
    return <group key={s} position={[s * 0.14, 0.0, 0]}>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[Math.cos(i * 1.256) * 0.048, 0.03, Math.sin(i * 1.256) * 0.048]} rotation={[-PI / 2 + 0.25, 0, i * 1.256]} scale={[1, 1.5, 1]}>
        <circleGeometry args={[0.042, 24]} /><meshPhysicalMaterial color={c} roughness={greasy ? 0.15 : 0.8} clearcoat={greasy ? 1 : 0} side={THREE.DoubleSide} /></mesh>)}
      <mesh position={[0, 0.036, 0]}><sphereGeometry args={[0.017, 14, 10]} /><meshStandardMaterial color="#f2d04a" /></mesh>
      <Grains n={44} r={0.095} p={[0, greasy ? 0.032 : 0.0, 0]} k={greasy ? fall : 1} seed={greasy ? 11 : 12} col={greasy ? "#d8c48a" : "#a8a49c"} />
      {greasy ? <group position={[-0.03, 0.05, 0.03]} rotation={[0, 0.4, 0]} scale={Math.max(0.001, cl((u - 0.66) * 8))}><RBox s={[0.11, 0.006, 0.08]} rot={[0.04, 0, 0.03]} r={0.003}><meshPhysicalMaterial map={tex.text("wetrag", 128, 128, (g) => { g.fillStyle = "#dfe7ea"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#4f78a8"; for (let i = 0; i < 128; i += 16) { g.fillRect(i, 0, 5, 128); g.fillRect(0, i, 128, 3); } g.fillStyle = "rgba(40,60,80,.35)"; g.beginPath(); g.arc(70, 64, 40, 0, 7); g.fill(); })} roughness={0.45} clearcoat={0.7} clearcoatRoughness={0.3} bumpMap={tex.paper(6, 6)} bumpScale={6} /></RBox>
          <RBox s={[0.07, 0.006, 0.05]} p={[0.012, 0.006, -0.008]} rot={[0.05, 0.5, -0.08]} r={0.003}><meshPhysicalMaterial map={tex.text("wetrag", 128, 128, (g) => { g.fillStyle = "#dfe7ea"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#4f78a8"; for (let i = 0; i < 128; i += 16) { g.fillRect(i, 0, 5, 128); g.fillRect(0, i, 128, 3); } g.fillStyle = "rgba(40,60,80,.35)"; g.beginPath(); g.arc(70, 64, 40, 0, 7); g.fill(); })} roughness={0.45} clearcoat={0.7} clearcoatRoughness={0.3} bumpMap={tex.paper(6, 6)} bumpScale={6} /></RBox>
          {[0, 1, 2].map((i) => <mesh key={i} position={[-0.03 + i * 0.03, -0.012, 0.038]}><sphereGeometry args={[0.004, 10, 8]} />{M.water({ op: 0.85 })}</mesh>)}</group>
        : <RBox s={[0.09, 0.008, 0.066]} p={[lerp(-0.3, 0, rin) + Math.sin(tt * 5) * 0.035 * cl((u - 0.54) * 8) * (1 - rout), 0.05 + 0.03 * rout, 0.02]} rot={[0.1, 0.4, 0.05]} r={0.007}><meshPhysicalMaterial map={tex.text("wetrag", 128, 128, (g) => { g.fillStyle = "#dfe7ea"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#4f78a8"; for (let i = 0; i < 128; i += 16) { g.fillRect(i, 0, 5, 128); g.fillRect(0, i, 128, 3); } g.fillStyle = "rgba(40,60,80,.35)"; g.beginPath(); g.arc(70, 64, 40, 0, 7); g.fill(); })} roughness={0.45} clearcoat={0.7} clearcoatRoughness={0.3} bumpMap={tex.paper(6, 6)} bumpScale={6} /></RBox>}
    </group>; })}</>;
}}</Scene3D>;

// ---- 9:46 · POCA EN LA MESA, A NUESTRA EDAD: el salero sobre el plato de carne asada; caen tres granos y nada más; un corazón late tranquilo ----
export const _heartG = () => gk("heart", () => { const s = new THREE.Shape(); s.moveTo(0, -0.05); s.bezierCurveTo(-0.06, -0.01, -0.06, 0.04, -0.03, 0.045); s.bezierCurveTo(-0.01, 0.05, 0, 0.035, 0, 0.03);
  s.bezierCurveTo(0, 0.035, 0.01, 0.05, 0.03, 0.045); s.bezierCurveTo(0.06, 0.04, 0.06, -0.01, 0, -0.05);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, bevelSegments: 4 }); g.center(); return g; });
export const HEasyAge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.07, 0], az: [0.4, 0.2], el: [0.42, 0.34], r: [0.66, 0.56], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="GO EASY AT THE TABLE" col={AMB} /><Tag tt={tt} at={2.6} x={1450} y={840} txt="A DOCTOR TIP" col={ICE} size={42} /></>}>{(tt, u) => {
  const tilt = eio(u, 0.3, 0.42) * (1 - eio(u, 0.66, 0.76)), beat = 1 + 0.08 * Math.max(0, Math.sin(tt * 6)) * cl(tt - 2.4);
  return <>
    <mesh position={[0, 0.006, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.13, 48]} />{M.porcelain({})}</mesh>
    <mesh position={[0, 0.007, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.115, 0.12, 48]} />{M.brass({})}</mesh>
    <RBox s={[0.1, 0.03, 0.06]} p={[-0.03, 0.022, 0.0]} rot={[0, 0.3, 0]} r={0.012}><meshPhysicalMaterial color="#7a3e22" roughness={0.45} clearcoat={0.5} /></RBox>
    {[[0.05, 0.03], [0.06, -0.03], [0.03, 0.06]].map(([x, z], i) => <mesh key={i} position={[x, 0.017, z]}><sphereGeometry args={[0.012, 14, 10]} /><meshStandardMaterial color={i === 2 ? "#4f8a3a" : "#e2862e"} roughness={0.6} /></mesh>)}
    <group position={[0.06, 0.1, 0.02]} rotation={[0, 0, 2.4 * tilt]}>
      <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[0.022, 0.025, 0.07, 32]} />{M.glass({ op: 0.4 })}</mesh>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.02, 0.023, 0.035, 32]} />{saltMat()}</mesh>
      <mesh position={[0, 0.076, 0]}><sphereGeometry args={[0.024, 24, 12, 0, PI * 2, 0, PI / 2]} />{M.chrome({})}</mesh>
    </group>
    {Array.from({ length: 16 }, (_, i) => { const k = cl((u - 0.44 - i * 0.012) / 0.08); return k > 0 && <mesh key={i} position={[0.02 + (rn(i, 5) - 0.5) * 0.04, 0.02 + (1 - k) * 0.1, 0.02 + (rn(i, 6) - 0.5) * 0.04]}><boxGeometry args={[0.006, 0.006, 0.006]} />{saltMat()}</mesh>; })}
    <group position={[-0.2, 0.006, 0.0]} rotation={[0, 0.5, 0]} scale={Math.max(0.001, cl(phys(tt, 1.8, 6, 0.5)))}>
      <mesh rotation={[-PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.0045, 12, 48, PI * 1.5]} /><meshPhysicalMaterial color="#1c1c1e" roughness={0.35} clearcoat={0.6} /></mesh>
      {[0, PI * 1.5].map((a, k) => <mesh key={k} position={[0.07 * Math.cos(a), 0.004, -0.07 * Math.sin(a)]}><sphereGeometry args={[0.007, 12, 8]} />{M.chrome({})}</mesh>)}
      <group position={[-0.07, 0.008, 0.0]} scale={beat}><mesh><cylinderGeometry args={[0.024, 0.024, 0.012, 40]} />{M.chrome({})}</mesh>
        <mesh position={[0, 0.0065, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.02, 40]} /><meshPhysicalMaterial color="#e8e6e0" roughness={0.3} clearcoat={0.7} /></mesh></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 10:18 · SUBEN FLOTANDO: el bol con agua salada y el brócoli boca abajo; los gusanitos verdes se sueltan y suben a la superficie ----
export const HWormFloat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.05, 0], az: [0.15, -0.1], el: [0.2, 0.32], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="THEY FLOAT RIGHT UP" col={GRN} /><Tag tt={tt} at={0.8} x={420} y={840} txt="2 TBSP · COLD WATER" col={ICE} size={38} anchor="l" />
    <Tag tt={tt} at={1.6} x={1450} y={840} txt="15 MINUTES" col={AMB} size={44} /></>}>{(tt) => {
  const m = 15 * eio(tt, 0.8, 6.0);
  return <>
    <Bowl water={0.85} s={1.15} />
    <Broccoli p={[0, 0.03, 0]} rot={[PI, 0, 0]} s={1.1} />
    {Array.from({ length: 7 }, (_, i) => { const a = 1.0 + i * 0.6, u = eio(tt, a, a + 1.6), x = Math.cos(i * 2.1) * (0.03 + u * 0.06), z = Math.sin(i * 2.1) * (0.03 + u * 0.06);
      return <mesh key={i} position={[x, lerp(0.035, 0.087, u), z]} rotation={[0, i, u * PI / 2]} geometry={tubeG("worm" + i, [[-0.012, 0, 0], [-0.004, 0.004 * Math.sin(tt * 3 + i), 0], [0.004, -0.003, 0], [0.012, 0.002, 0]], 0.0028, 16, 6)}>
        <meshStandardMaterial color="#7fc14a" roughness={0.6} /></mesh>; })}
    <group position={[0.22, 0.04, -0.06]} rotation={[0, -0.5, 0]}>
      <RBox s={[0.09, 0.07, 0.04]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
      <DigitDrum v={Math.floor(m / 10) + Math.max(0, (m % 10) - 9) } p={[-0.019, 0, 0.021]} r={0.022} w={0.03} /><DigitDrum v={m % 10} p={[0.019, 0, 0.021]} r={0.022} w={0.03} />
    </group>
  </>;
}}</Scene3D>;

// ---- 10:36 · NO POR HORAS: el reloj de pared gira las agujas a toda velocidad y el brócoli se dobla, se pone opaco y se ablanda ----
export const HLimp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="tile"
  cam={{ at: [0, 0.12, 0], az: [-0.25, 0.05], el: [0.18, 0.14], r: [0.66, 0.56], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="NOT FOR HOURS" col={RED} /><Tag tt={tt} at={3.4} x={1450} y={840} txt="LIMP AND SALTY" col={RED} size={42} /></>}>{(tt) => {
  const hrs = eio(tt, 0.5, 4.5), droop = eio(tt, 1.0, 4.6);
  return <>
    <group position={[0.18, 0.26, -0.12]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.08, 0.08, 0.015, 48]} />{M.porcelain({ col: "#f6f1e4" })}</mesh>
      <mesh position={[0, 0, 0.009]} rotation={[0, 0, 0]}><torusGeometry args={[0.08, 0.006, 8, 48]} />{M.brass({})}</mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.cos((i / 12) * PI * 2) * 0.065, Math.sin((i / 12) * PI * 2) * 0.065, 0.009]}><boxGeometry args={[0.004, 0.004, 0.002]} /><meshBasicMaterial color="#2a1e12" /></mesh>)}
      <group position={[0, 0, 0.011]} rotation={[0, 0, -hrs * PI * 2 * 3]}><mesh position={[0, 0.025, 0]}><boxGeometry args={[0.005, 0.05, 0.002]} /><meshBasicMaterial color="#2a1e12" /></mesh></group>
      <group position={[0, 0, 0.012]} rotation={[0, 0, -hrs * PI * 2 * 36]}><mesh position={[0, 0.03, 0]}><boxGeometry args={[0.003, 0.06, 0.002]} /><meshBasicMaterial color="#b8322a" /></mesh></group>
    </group>
    <Bowl water={0.85} />
    <group position={[-0.02, 0.07, 0]} rotation={[0, 0, droop * 1.1]}>
      <Broccoli p={[0, 0.06, 0]} s={0.9} col={"#" + new THREE.Color("#3d7a2e").lerp(new THREE.Color("#8a9a5a"), droop).getHexString()} />
    </group>
  </>;
}}</Scene3D>;

// ---- 11:02 · DOCE DOCENAS: los maples aparecen en fila sobre la mesada de la iglesia y se llenan de a doce hasta 144 huevos ----
export const HDozen12: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile" lamp={[0, 0.6, 0.3]}
  cam={{ at: [0, 0.02, 0], az: [-0.3, 0.1], el: [0.8, 0.7], r: [0.9, 0.78], fov: 32 }}
  over={(tt) => { const n = Math.min(144, Math.floor(144 * eio(tt, 0.6, 4.4)));
    return <><Head tt={tt} kick="" title="12 DOZEN EGGS" col={AMB} /><Tag tt={tt} at={0.6} x={1450} y={840} txt={`${n} EGGS`} col={AMB} size={46} /></>; }}>{(tt) => {
  const n = 144 * eio(tt, 0.6, 4.4);
  return <>{Array.from({ length: 12 }, (_, c) => { const cx = -0.33 + (c % 6) * 0.132, cz = c < 6 ? -0.07 : 0.07;
    return <group key={c} position={[cx, 0, cz]}>
      <RBox s={[0.12, 0.012, 0.125]} p={[0, 0.006, 0]} r={0.004}><meshStandardMaterial color="#c9b9a0" roughness={1} bumpMap={tex.paper(2, 2)} bumpScale={3} /></RBox>
      {Array.from({ length: 12 }, (_, i) => { const idx = c * 12 + i, k = cl(n - idx); if (k <= 0) return null;
        return <Egg key={i} p={[-0.045 + (i % 4) * 0.03, 0.03 + (1 - k) * 0.08, -0.03 + Math.floor(i / 4) * 0.03]} s={0.55} brown={rn(idx, 3) > 0.7} />; })}
    </group>; })}</>;
}}</Scene3D>;

// ---- 11:19 · LA SAL SELLA LA RAJADURA: dos ollas hirviendo; sin sal la clara sale como un fantasma; con sal se cuaja en la grieta y queda adentro ----
export const HSealCrack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark"
  cam={{ at: [0, 0.08, 0], az: [-0.05, 0.05], el: [0.24, 0.2], r: [0.7, 0.62], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="SALT SEALS THE CRACK" col={GRN} /><Tag tt={tt} at={1.0} x={560} y={860} txt="NO SALT" col={RED} size={42} />
    <Tag tt={tt} at={1.4} x={1360} y={860} txt="1 TBSP SALT" col={GRN} size={42} /></>}>{(tt, u) => {
  const ribbon = eio(u, 0.1, 0.8), seal = eio(u, 0.36, 0.76);
  return <>{[-1, 1].map((s) => { const salted = s > 0;
    return <group key={s} position={[s * 0.145, 0, 0]}>
      <mesh geometry={lg("pot", [[0, 0], [0.12, 0], [0.12, 0.14], [0.125, 0.14], [0.125, 0.0]], 48)}>{M.steel({ op: 0.35, side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.118, 0.118, 0.12, 48]} />{M.water({ op: 0.35 })}</mesh>
      {Array.from({ length: 10 }, (_, i) => { const u = ((tt * 1.2 + i / 10) % 1); return <mesh key={i} position={[(rn(i + s * 20, 2) - 0.5) * 0.18, 0.005 + u * 0.115, (rn(i + s * 20, 3) - 0.5) * 0.12]}><sphereGeometry args={[0.004 + 0.004 * u, 8, 6]} />{M.glass({ op: 0.5 })}</mesh>; })}
      <Egg p={[0, 0.04, 0]} rot={[0, 0, PI / 2]} s={1.2} />
      <mesh position={[0.0, 0.07, 0.0]} rotation={[0, 0, 0.3]}><boxGeometry args={[0.002, 0.03, 0.03]} /><meshBasicMaterial color="#5a4a3a" /></mesh>
      {!salted ? Array.from({ length: 44 }, (_, i) => { const v = i / 44; if (v > ribbon) return null; return <mesh key={i} position={[0.006 + Math.sin(v * 5 + tt * 1.5) * 0.028 * v, 0.068 + v * 0.07, 0.03 * v]} scale={[1 + v * 1.4, 1, 1 + v * 0.8]}><sphereGeometry args={[0.0075, 10, 8]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.25} roughness={0.5} /></mesh>; })
        : <mesh position={[0.004, 0.074, 0.012]} scale={Math.max(0.001, 0.3 + 0.7 * seal)}><sphereGeometry args={[0.017, 18, 12]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.25} roughness={0.6} /></mesh>}
      {salted && <Grains n={24} r={0.09} p={[0, 0.11, 0]} k={eio(u, 0.03, 0.12)} seed={14} />}
    </group>; })}</>;
}}</Scene3D>;

// ---- 11:37 · LA PRUEBA DEL AGUA: el bol de vidrio; un huevo se acuesta en el fondo, otro se para de punta y el tercero sube a flotar ----
export const HFloatTest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark" lamp={[-0.4, 0.3, 0.4]}
  cam={{ at: [0, 0.07, 0], az: [0.04, -0.04], el: [0.26, 0.2], r: [1.0, 0.9], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="THE FLOAT TEST" col={ICE} /><Tag tt={tt} at={1.4} x={520} y={930} txt="FRESH" col={GRN} size={36} />
    <Tag tt={tt} at={3.6} x={960} y={930} txt="USE SOON" col={AMB} size={36} /><Tag tt={tt} at={5.8} x={1400} y={930} txt="THROW OUT" col={RED} size={36} /></>}>{(tt) => {
  const a = phys(tt, 0.6, 6, 0.5), b = eio(tt, 2.6, 3.6), c = eio(tt, 4.6, 6.0);
  return <>
    <mesh geometry={lg("gbowl", [[0, 0], [0.28, 0], [0.3, 0.02], [0.3, 0.16], [0.305, 0.16], [0.305, 0.0]], 64)} scale={[1, 1, 0.45]}>{M.glass({ op: 0.14 })}</mesh>
    <mesh position={[0, 0.07, 0]} scale={[1, 1, 0.45]}><cylinderGeometry args={[0.295, 0.295, 0.14, 64]} />{M.water({ col: "#7fb8d0", op: 0.22 })}</mesh>
    <Egg p={[-0.18, 0.02 + (1 - cl(a)) * 0.15, 0]} rot={[0, 0, PI / 2]} s={1.7} />
    <Egg p={[0, lerp(0.022, 0.04, b), 0]} rot={[0, 0, lerp(PI / 2, 0.05, b)]} s={1.7} brown />
    <Egg p={[0.18, lerp(0.025, 0.09, c), 0]} rot={[0, 0, lerp(PI / 2, 0.5, c)]} s={1.7} />
    
  </>;
}}</Scene3D>;

// ---- 12:13 · MEDIA CUCHARADITA EN UNA TAZA: la cucharita medidora vuelca la sal en la taza de agua tibia; los granos bajan y desaparecen ----
export const HHalfTeaspoon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[-0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.07, 0], az: [0.35, 0.2], el: [0.42, 0.36], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="HALF A TEASPOON" col={AMB} /><Tag tt={tt} at={1.6} x={1450} y={840} txt="ONE CUP · WARM" col={ICE} size={42} /></>}>{(tt, u) => {
  const tip = eio(u, 0.12, 0.24), dis = eio(u, 0.62, 0.92);
  return <>
    <mesh geometry={lg("cup", [[0, 0], [0.045, 0], [0.055, 0.09], [0.058, 0.09], [0.05, 0.0]], 48)} castShadow>{M.porcelain({ col: "#f6efe0", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0.065, 0.05, 0]}><torusGeometry args={[0.022, 0.006, 12, 24, PI * 1.2]} />{M.porcelain({ col: "#f6efe0" })}</mesh>
    <mesh position={[0, 0.075, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.052, 40]} />{M.water({ col: "#d9ecf2", op: 0.75 })}</mesh>
    {Array.from({ length: 5 }, (_, i) => { const u = ((tt * 0.5 + i / 5) % 1); return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.04, 0.09 + u * 0.1, 0]} scale={1 + u}><sphereGeometry args={[0.01, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.16 * (1 - u)} depthWrite={false} /></mesh>; })}
    {Array.from({ length: 22 }, (_, i) => { const st = 0.22 + rn(i, 3) * 0.3, uu = cl((u - st) / 0.2), u2 = uu; if (u2 <= 0 || u2 >= 1 || dis > 0.95) return null;
      return <mesh key={i} position={[(rn(i, 4) - 0.5) * 0.06, lerp(0.075, 0.01, u2), (rn(i, 5) - 0.5) * 0.06]} scale={1 - dis}><boxGeometry args={[0.004, 0.004, 0.004]} />{saltMat()}</mesh>; })}
    {(() => { const fl = Math.sin(PI * cl((u - 0.16) / 0.5)); return fl > 0.02 && Array.from({ length: 26 }, (_, j) => { const q = (tt * 1.6 + j / 26) % 1; return <mesh key={"st" + j} position={[0.012 + (rn(j, 7) - 0.5) * 0.008, lerp(0.195, 0.076, q), (rn(j, 8) - 0.5) * 0.008]} scale={fl}><boxGeometry args={[0.008, 0.008, 0.008]} />{saltMat()}</mesh>; }); })()}
    <group position={[0.02, 0.2, 0]} rotation={[0, 0, 2.2 * tip]}>
      <mesh position={[0, 0, 0]} scale={[1, 0.45, 1]}><sphereGeometry args={[0.016, 24, 12, 0, PI * 2, PI / 2, PI / 2]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <RBox s={[0.1, 0.003, 0.012]} p={[-0.06, 0, 0]} r={0.0015}>{M.steel({})}</RBox>
      {tip < 0.5 && <mesh position={[0, -0.002, 0]} scale={[1, 0.3, 1]}><sphereGeometry args={[0.014, 16, 8]} />{saltMat()}</mesh>}
    </group>
  </>;
}}</Scene3D>;

// ---- 12:33 · Y SI NO, AL MÉDICO: tres tarjetas se levantan: el termómetro con fiebre, la garganta con puntos blancos y el almanaque de varios días ----
export const HDoctorSigns: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0, 0.6, 0.3]}
  cam={{ at: [0, 0.1, 0], az: [-0.15, 0.15], el: [0.18, 0.14], r: [0.8, 0.68], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="THEN SEE THE DOCTOR" col={RED} /><Tag tt={tt} at={1.0} x={540} y={230} txt="FEVER" col={RED} size={38} />
    <Tag tt={tt} at={2.2} x={960} y={230} txt="WHITE SPOTS" col={AMB} size={38} /><Tag tt={tt} at={3.4} x={1390} y={230} txt="3+ DAYS" col={ICE} size={38} /></>}>{(tt) => <>
  {[0, 1, 2].map((i) => { const k = phys(tt, 0.6 + i * 1.2, 6, 0.5); if (k <= 0) return null; const x = -0.22 + i * 0.22;
    return <group key={i} position={[x, 0, 0]} rotation={[-(1 - cl(k)) * PI / 2, 0, 0]}>
      <RBox s={[0.18, 0.2, 0.012]} p={[0, 0.1, 0]} r={0.01}><meshStandardMaterial color="#f4ead2" roughness={0.9} bumpMap={tex.paper(2, 2)} bumpScale={2} /></RBox>
      {i === 0 && <group position={[0, 0.1, 0.01]} rotation={[0, 0, 0.5]}>
        <mesh><cylinderGeometry args={[0.008, 0.008, 0.15, 16]} />{M.glass({ op: 0.5 })}</mesh>
        <mesh position={[0, -0.075, 0]}><sphereGeometry args={[0.013, 16, 12]} /><meshStandardMaterial color="#c8322a" emissive="#c8322a" emissiveIntensity={0.5} /></mesh>
        <mesh position={[0, -0.075 + 0.06 * eio(tt, 1.0, 2.2), 0]} scale={[1, eio(tt, 1.0, 2.2) + 0.01, 1]}><cylinderGeometry args={[0.004, 0.004, 0.12, 8]} /><meshStandardMaterial color="#c8322a" emissive="#c8322a" emissiveIntensity={0.5} /></mesh></group>}
      {i === 1 && <group position={[0, 0.1, 0.008]}>
        <mesh scale={[1, 1.2, 0.3]}><sphereGeometry args={[0.05, 32, 16]} /><meshStandardMaterial color="#c4565a" roughness={0.5} /></mesh>
        {Array.from({ length: 6 }, (_, k) => <mesh key={k} position={[Math.cos(k * 1.1) * 0.025, Math.sin(k * 1.1) * 0.03, 0.016]}><sphereGeometry args={[0.005, 8, 6]} /><meshStandardMaterial color="#ffffff" /></mesh>)}</group>}
      {i === 2 && <mesh position={[0, 0.1, 0.007]}><planeGeometry args={[0.14, 0.15]} /><meshStandardMaterial map={card("days3", 256, 280, ["3+", "DAYS"], 110, "#b8322a", "#fbf6e8")} roughness={0.9} /></mesh>}
    </group>; })}</>}</Scene3D>;
