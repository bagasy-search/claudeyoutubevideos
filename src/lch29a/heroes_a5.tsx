// lch29a · componentes únicos 30-36.
import React from "react";
import * as THREE from "three";
import { AMB, GRN, H, ICE, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Motes, WallBB } from "./bb";

const PI = Math.PI;

// guante de goma amarillo: palma + cuatro dedos + pulgar
const Glove: React.FC<{ col?: string; curl?: number }> = ({ col = "#f2c230", curl = 0 }) => <group>
  <RBox s={[0.09, 0.1, 0.03]} r={0.014}><meshPhysicalMaterial color={col} roughness={0.25} clearcoat={0.7} /></RBox>
  {[0, 1, 2, 3].map((i) => <group key={i} position={[-0.032 + i * 0.021, 0.05, 0]} rotation={[-curl * 0.6, 0, (i - 1.5) * 0.06]}>
    <mesh position={[0, 0.035 - i % 3 * 0.003, 0]}><capsuleGeometry args={[0.0095, 0.05 - (i === 3 ? 0.012 : 0), 8, 14]} /><meshPhysicalMaterial color={col} roughness={0.25} clearcoat={0.7} /></mesh>
  </group>)}
  <mesh position={[0.058, 0.0, 0]} rotation={[0, 0, -0.9]}><capsuleGeometry args={[0.011, 0.04, 8, 14]} /><meshPhysicalMaterial color={col} roughness={0.25} clearcoat={0.7} /></mesh>
  <mesh position={[0, -0.075, 0]}><cylinderGeometry args={[0.05, 0.055, 0.06, 28, 1, true]} /><meshPhysicalMaterial color={col} roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
</group>;

// ---- 18:30 · PELO DE PERRO: el guante húmedo pasa por el zócalo y el pelo dorado se enrolla en una bolita que se despega ----
export const HGloveHair: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none"
  cam={{ at: [0, 0.1, 0.03], az: [0.3, 0.1], el: [0.22, 0.24], r: [0.8, 0.7], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={140} txt="IT BALLS UP" col={AMB} size={48} />}>{(tt) => {
  const sw = eio(tt, 0.5, 3.4), gx = lerp(-0.32, 0.12, sw), lift = eio(tt, 3.8, 5.0);
  return <>
    <WallBB L={0.8} dust={0} />
    {/* mechones dorados sobre el labio y en la línea del piso; los que el guante ya pasó se juntan en la bola */}
    {Array.from({ length: 70 }, (_, i) => { const x0 = -0.35 + rn(i, 2) * 0.62, got = x0 < gx, top = i % 2 === 0; return !got && <mesh key={i} position={[x0, top ? 0.126 : 0.004, top ? 0.003 : 0.02 + 0.01 * rn(i, 3)]} rotation={[PI / 2, 0, rn(i, 4) * 3]}><torusGeometry args={[0.016 + 0.012 * rn(i, 5), 0.0024, 5, 18, 2.2]} /><meshStandardMaterial color={i % 3 ? "#d9a35a" : "#b98035"} roughness={0.6} /></mesh>; })}
    <group position={[gx, 0.12 + 0.05 * lift, 0.05 + 0.1 * lift]} rotation={[0.2 - 0.9 * lift, 0, -PI / 2 + 0.2 + lift * 1.2]}>
      <group scale={0.65}><Glove curl={lift} /></group>
      {/* la bolita de pelo pegada a la palma */}
      <mesh position={[0, 0, 0.022]} scale={Math.max(0.001, 0.4 + 0.6 * sw)}>{<sphereGeometry args={[0.03, 16, 12]} />}<meshStandardMaterial color="#c99248" roughness={1} /></mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0, 0, 0.025]} rotation={[rn(i, 6) * 3, rn(i, 7) * 3, 0]} scale={Math.max(0.001, sw)}><torusGeometry args={[0.024, 0.001, 4, 20, 2.5]} /><meshStandardMaterial color="#d9a35a" /></mesh>)}
    </group>
    {/* chorritos de agua: guante húmedo */}
    {Array.from({ length: 4 }, (_, i) => { const k = ((tt * 0.8 + i * 0.25) % 1); return sw > 0 && sw < 1 && <mesh key={i} position={[gx - 0.03 + 0.02 * i, 0.06 - 0.05 * k, 0.05]}><sphereGeometry args={[0.003, 8, 6]} />{M.water({ op: 0.7 * (1 - k) })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 19:20 · EL FRASCO DEL SECARROPAS: las hojas usadas vuelan arrugadas y se apilan dentro del frasco de vidrio ----
const sheetTex = () => tex.text("dsheet", 128, 128, (g) => { g.fillStyle = "#f7f4fb"; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(160,140,200,.25)"; for (let i = 0; i < 300; i++) g.fillRect(rn(i, 2) * 128, rn(i, 3) * 128, 2, 2); });
// hoja de secarropas arrugada: plano con pliegues (no una bola)
let _cr: THREE.BufferGeometry | null = null;
const crumple = () => { if (_cr) return _cr; const g = new THREE.PlaneGeometry(0.11, 0.11, 16, 16), a = g.attributes.position; for (let i = 0; i < a.count; i++) { const x = a.getX(i), y = a.getY(i); a.setZ(i, 0.01 * Math.sin(x * 90 + y * 40) + 0.008 * Math.sin(y * 120 - x * 30) + 0.006 * (rn(i, 7) - 0.5) - 0.25 * (x * x + y * y)); } g.computeVertexNormals(); return (_cr = g); };
const Crumpled: React.FC<{ em?: number }> = ({ em = 0 }) => <mesh geometry={crumple()} castShadow><meshStandardMaterial map={sheetTex()} roughness={0.85} flatShading side={THREE.DoubleSide} emissive="#3a3020" emissiveIntensity={em} /></mesh>;
export const HSheetJar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile"
  cam={{ at: [0, 0.18, 0], az: [-0.3, 0.1], el: [0.2, 0.22], r: [0.75, 0.62], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={140} txt="DON'T THROW IT OUT" col={GRN} size={44} />}>{(tt) => <>
  {/* tapa del secarropas: superficie blanca esmaltada */}
  <RBox s={[0.7, 0.04, 0.5]} p={[0, 0.02, 0]} r={0.01}>{M.porcelain()}</RBox>
  <group position={[0, 0.04, 0]}>
    <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.08, 0.08, 0.2, 40, 1, true]} />{M.glass({ side: THREE.DoubleSide, op: 0.25 })}</mesh>
    <mesh position={[0, 0.2, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.078, 0.005, 8, 40]} />{M.glass({ op: 0.5 })}</mesh>
    <mesh position={[0.2, 0.012, 0.05]} rotation={[0, 0.4, 0]}><cylinderGeometry args={[0.085, 0.085, 0.024, 40]} />{M.steel({ col: "#c9b06a" })}</mesh>
    {/* hojas arrugadas: caen desde la izquierda y se apilan */}
    {Array.from({ length: 7 }, (_, i) => { const k = phys(tt, 0.5 + i * 0.55, 8, 0.5), land = cl(k); const x = lerp(-0.35, (rn(i, 2) - 0.5) * 0.06, land), y = lerp(0.45, 0.025 + i * 0.022, land) + 0.12 * Math.sin(land * PI); return tt > 0.5 + i * 0.55 && <mesh key={i} position={[x, y, (rn(i, 3) - 0.5) * 0.05]} rotation={[rn(i, 4) * 3 + (1 - land) * 4, rn(i, 5) * 3, 0]} scale={0.6}><primitive object={crumple()} attach="geometry" /><meshStandardMaterial map={sheetTex()} roughness={0.9} flatShading side={THREE.DoubleSide} /></mesh>; })}
  </group>
</>}</Scene3D>;

// ---- 19:44 · LA ESTÁTICA: zócalo «cargado» (chispitas azules) atrae el polvo; una pasada de hoja y el polvo rebota ----
export const HStatic: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none"
  cam={{ at: [0, 0.12, 0.02], az: [0.25, 0.05], el: [0.2, 0.18], r: [0.6, 0.52], fov: 30 }}
>{(tt) => {
  const coat = eio(tt, 2.6, 3.8), pull = 1 - coat;
  return <>
    <WallBB L={0.8} top={0.3 * pull} dust={0} />
    {/* chispitas de estática sobre el zócalo, se apagan con la capa */}
    {Array.from({ length: 10 }, (_, i) => { const on = Math.sin(tt * 9 + i * 2.1) > 0.6; return on && pull > 0.1 && <mesh key={i} position={[-0.35 + rn(i, 2) * 0.7, 0.03 + rn(i, 3) * 0.08, 0.012]} rotation={[0, 0, rn(i, 4) * 3]}><boxGeometry args={[0.03, 0.003, 0.001]} />{M.glow({ col: "#8fd3ff", op: pull })}</mesh>; })}
    {Array.from({ length: 6 }, (_, i) => { const on = Math.sin(tt * 7 + i * 1.3) > 0.2; return on && pull > 0.1 && <group key={"z" + i} position={[-0.3 + i * 0.12, 0.06, 0.013]}>{[0, 1, 2].map((j) => <mesh key={j} position={[0.008 * (j % 2 ? 1 : -1), 0.012 * j - 0.012, 0]} rotation={[0, 0, (j % 2 ? 0.9 : -0.9)]}><boxGeometry args={[0.03, 0.004, 0.001]} />{M.glow({ col: "#bfe8ff", op: pull })}</mesh>)}</group>; })}
    {/* polvo: viene en arcos hacia el zócalo; con la capa, rebota y se va */}
    <Motes n={90} r={0.0042} col="#8f887b" pos={(i) => { const ph = (tt * 0.45 + rn(i, 2)) % 1, x = -0.35 + rn(i, 3) * 0.7, z0 = 0.25 * rn(i, 4) + 0.05; const zz = pull > 0.5 ? lerp(z0, 0.012, ph) : lerp(0.02, z0, ph); return [x + 0.02 * Math.sin(tt + i), 0.04 + 0.1 * rn(i, 5) + 0.03 * Math.sin(ph * PI), zz]; }} />
    {coat > 0 && <mesh position={[0, 0.07, 0.016]}><planeGeometry args={[0.8 * coat, 0.12]} /><meshBasicMaterial color="#cfeaff" transparent opacity={0.12 * Math.sin(PI * Math.min(1, coat * 1.4)) + 0.05} depthWrite={false} /></mesh>}
    {/* la hoja usada barre de izquierda a derecha */}
    {tt > 2.4 && tt < 4.0 && <group position={[lerp(-0.4, 0.4, eio(tt, 2.5, 3.9)), 0.07, 0.03]} rotation={[0, 0.2, 0.15]}><Crumpled /></group>}
  </>;
}}</Scene3D>;

// ---- 20:10 · COMO UN BILLETE DE CIEN: la hoja arrugada levantada a contraluz, con la gloria de rayos detrás ----
export const HHundredBill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" warm={0.6}
  cam={{ at: [0, 0.3, 0], az: [-0.1, 0.1], el: [0.05, 0.07], r: [0.62, 0.52], fov: 30 }}>{(tt) => {
  const up = phys(tt, 0.3, 7, 0.45), flat = eio(tt, 1.0, 3.0), bill = eio(tt, 3.0, 4.4);
  return <>
    {/* ventana de cocina detrás: contraluz cálido */}
    <mesh position={[0, 0.34, -0.35]}><planeGeometry args={[0.7, 0.5]} /><meshBasicMaterial color="#ffe9c0" /></mesh>
    {[-0.12, 0.12].map((x) => <mesh key={x} position={[x, 0.34, -0.34]}><boxGeometry args={[0.012, 0.5, 0.01]} /><meshStandardMaterial color="#efe8dc" /></mesh>)}
    <mesh position={[0, 0.34, -0.34]}><boxGeometry args={[0.7, 0.012, 0.01]} /><meshStandardMaterial color="#efe8dc" /></mesh>
    <pointLight position={[0, 0.34, -0.25]} intensity={1.6} distance={1.0} color="#ffd08a" />
    <group position={[0, lerp(0.08, 0.3, cl(up)), 0]} rotation={[0.08 * Math.sin(tt * 1.3), 0.25 * Math.sin(tt * 0.6), 0.04]}>
      {/* la hoja arrugada se va alisando en las manos... */}
      {flat < 1 && <group scale={[2.2, 2.2, 2.2 * (1 - flat) + 0.02]}><Crumpled /></group>}
      {/* ...y termina lisa y tirante, con el reflejo de un billete */}
      {flat >= 1 && <mesh><planeGeometry args={[0.24, 0.16]} /><meshStandardMaterial map={sheetTex()} side={THREE.DoubleSide} roughness={0.8} /></mesh>}
      {bill > 0 && <mesh position={[0, 0, 0.001]}><planeGeometry args={[0.24, 0.11]} /><meshStandardMaterial map={billTex()} transparent opacity={0.85 * bill} /></mesh>}
      {/* dos pulgares sosteniéndola por las puntas */}
      {[-1, 1].map((sx) => <mesh key={sx} position={[sx * 0.125, -0.02, 0.012]} rotation={[0, 0, sx * 0.3]}><capsuleGeometry args={[0.014, 0.035, 8, 14]} /><meshStandardMaterial color="#e2b896" roughness={0.6} /></mesh>)}
    </group>
  </>;
}}</Scene3D>;
const billTex = () => tex.text("bill100", 512, 232, (g) => { g.fillStyle = "#cfe0c4"; g.fillRect(0, 0, 512, 232); g.strokeStyle = "#3f6a45"; g.lineWidth = 8; g.strokeRect(10, 10, 492, 212); g.fillStyle = "#3f6a45"; g.font = "900 72px Georgia"; g.fillText("100", 28, 86); g.fillText("100", 376, 210); g.beginPath(); g.ellipse(256, 116, 62, 80, 0, 0, Math.PI * 2); g.fillStyle = "#b9cfae"; g.fill(); g.stroke(); g.font = "700 22px Georgia"; g.fillStyle = "#3f6a45"; g.textAlign = "center"; g.fillText("ONE HUNDRED", 256, 214); });

// ---- 20:44 · HOJA NUEVA = MANCHA GRASA: sobre zócalo oscuro, la hoja nueva deja una veta brillante; la usada, nada ----
export const HNewSheet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none"
  cam={{ at: [0, 0.07, 0], az: [-0.55, -0.7], el: [0.1, 0.13], r: [0.62, 0.55], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.6} x={760} y={170} txt="NEW" col={RED} size={40} /><Tag tt={tt} at={3.8} x={1220} y={170} txt="USED" col={GRN} size={40} /></>}>{(tt) => {
  const a = eio(tt, 0.5, 2.0), b = eio(tt, 2.6, 4.1);
  return <>
    <mesh position={[0, 0.45, -0.012]}><planeGeometry args={[1.2, 0.9]} /><meshStandardMaterial color="#d6cbb6" roughness={0.92} /></mesh>
    <RBox s={[0.8, 0.12, 0.018]} p={[0, 0.06, 0]} r={0.003}><meshStandardMaterial color="#3b3f45" roughness={0.75} /></RBox>
    {/* veta grasosa: sólo en la mitad izquierda, brilla con la luz rasante */}
    <mesh position={[-0.4 + 0.19 * a, 0.065, 0.0102]} scale={[Math.max(0.001, a), 1, 1]}><planeGeometry args={[0.38, 0.035]} /><meshPhysicalMaterial color="#6d7078" roughness={0.05} clearcoat={1} transparent opacity={0.8} iridescence={0.6} /></mesh>
    <pointLight position={[-0.6, 0.08, 0.1]} intensity={1.2} distance={1.2} color="#fff4e0" />
    {/* las dos hojas: nueva (lisa, recta) y usada (arrugada) */}
    {a > 0 && a < 1 && <mesh position={[-0.4 + 0.38 * a, 0.065, 0.03]} rotation={[0, 0.2, 0]}><planeGeometry args={[0.09, 0.09]} /><meshStandardMaterial map={sheetTex()} side={THREE.DoubleSide} /></mesh>}
    {b > 0 && b < 1 && <group position={[0.02 + 0.38 * b, 0.065, 0.03]} rotation={[0, 0.2, 0]} scale={0.85}><Crumpled /></group>}
  </>;
}}</Scene3D>;

// ---- 21:38 · TODA LA CASA CUIDADA: casita de corte; se encienden los zócalos de cada cuarto, de arriba hasta el piso ----
export const HCaredFor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" warm={0.8}
  cam={{ at: [0, 0.3, 0], az: [-0.55, -0.25], el: [0.25, 0.2], r: [1.7, 1.5], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={130} txt="ALL THE WAY DOWN" col={AMB} size={46} />}>{(tt) => {
  const R: [number, number, number][] = [[-0.25, 0.32, 0.5], [0.25, 0.32, 0.5], [-0.25, 0, 0.5], [0.25, 0, 0.5]];
  return <>
    {/* casa en corte: piso de abajo, piso de arriba, techo a dos aguas */}
    {R.map(([x, y, w], i) => { const on = cl((tt - 0.6 - i * 0.7) / 0.5); return <group key={i} position={[x, y, 0]}>
      <mesh position={[0, 0.01, 0]} receiveShadow><boxGeometry args={[w, 0.02, 0.4]} />{M.wood({ rx: 2, ry: 1 })}</mesh>
      <mesh position={[0, 0.16, -0.2]}><boxGeometry args={[w, 0.3, 0.01]} /><meshStandardMaterial color={["#e8d8bd", "#d7e2d0", "#e9d2c8", "#dcd6e8"][i]} roughness={0.9} /></mesh>
      <mesh position={[0, 0.035, -0.19]}><boxGeometry args={[w, 0.03, 0.012]} /><meshStandardMaterial color={new THREE.Color("#7d776c").lerp(new THREE.Color("#ffffff"), on).getStyle()} emissive="#fff3d6" emissiveIntensity={0.5 * on} /></mesh>
      <pointLight position={[0, 0.2, 0.1]} intensity={0.9 * on} distance={0.5} color="#ffd9a0" />
    </group>; })}
    <group position={[0, 0.64, 0]}>{[-1, 1].map((s) => <mesh key={s} position={[s * 0.25, 0.12, 0]} rotation={[0, 0, -s * 0.45]} castShadow><boxGeometry args={[0.58, 0.02, 0.44]} /><meshStandardMaterial color="#7a4a35" roughness={0.8} /></mesh>)}</group>
    <mesh position={[0, 0.32, 0]}><boxGeometry args={[1.0, 0.012, 0.42]} />{M.wood({ rx: 3, ry: 1 })}</mesh>
  </>;
}}</Scene3D>;

// ---- 22:30 · PRÓXIMO VIDEO: la alfombra con los cuatro cráteres del sillón; aparece la plancha y un cubito de hielo ----
const carpet = () => tex.text("carpet", 256, 256, (g) => { g.fillStyle = "#cdbb9c"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${150 + rn(i, 2) * 60},${130 + rn(i, 3) * 50},${100 + rn(i, 4) * 40},.5)`; g.fillRect(rn(i, 5) * 256, rn(i, 6) * 256, 2, 2); } });
export const HCraters: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="none" key1={[-1.6, 0.6, 1.0]}
  cam={{ at: [0.05, 0, 0], az: [-0.4, -0.15], el: [0.6, 0.55], r: [0.75, 0.62], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={140} txt="NEXT TIME" col={ICE} size={48} />}>{(tt) => {
  const ice = phys(tt, 2.2, 8, 0.45), iron = phys(tt, 3.0, 7, 0.45);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.003, 0]} receiveShadow><planeGeometry args={[3, 2.2]} /><meshStandardMaterial map={carpet()} roughness={1} /></mesh>
    {/* cuatro cráteres en cuadrado (patas del sillón), con su sombra por la luz rasante */}
    {[[-0.16, -0.12], [0.16, -0.12], [-0.16, 0.12], [0.16, 0.12]].map(([x, z], i) => <group key={i} position={[x, 0.0045, z]} scale={Math.max(0.001, cl(phys(tt, 0.3 + i * 0.25, 9, 0.5)))}>
      <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.035, 28]} /><meshStandardMaterial color="#9f8e72" roughness={1} /></mesh>
      <mesh rotation={[-PI / 2, 0, 0]} position={[0.008, 0.0003, 0]}><ringGeometry args={[0.03, 0.036, 28, 1, PI * 0.6, PI]} /><meshStandardMaterial color="#6f604a" transparent opacity={0.7} /></mesh>
    </group>)}
    {/* cubito de hielo que cae en el primer cráter */}
    <group position={[-0.16, lerp(0.35, 0.018, cl(ice)), -0.12]} rotation={[0.3, tt * 0.3, 0.2]}><RBox s={[0.03, 0.03, 0.03]} r={0.005}>{M.glass({ col: "#dff3ff", op: 0.55 })}</RBox></group>
    {/* la plancha llega planeando desde la derecha */}
    <group position={[lerp(0.8, 0.22, cl(iron)), 0.06 + 0.1 * (1 - cl(iron)), 0.0]} rotation={[0, -0.6, 0]}>
      <mesh scale={[1, 0.3, 0.6]} castShadow><sphereGeometry args={[0.1, 32, 16, 0, PI * 2, 0, PI / 2]} />{M.plastic({ col: "#3a7bd5" })}</mesh>
      <mesh position={[0, -0.002, 0]} rotation={[-PI / 2, 0, 0]} scale={[1, 0.6, 1]}><circleGeometry args={[0.1, 32]} />{M.chrome()}</mesh>
      <mesh position={[0.01, 0.06, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.04, 0.01, 10, 24, PI]} />{M.plastic({ col: "#2b2b2b" })}</mesh>
    </group>
  </>;
}}</Scene3D>;
