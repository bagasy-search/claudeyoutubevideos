// lfh29e · componentes únicos 1-7 (la botella junto a la pileta, el jabón de lejía de la abuela, la capa de cera del pulgón, la botella más simple, el pulgar en la manguera, tres mañanas, la mariquita que trabaja gratis)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { SoapBottle, Leaf, Aphid, Ladybug, RoseBud } from "./ek";

const PI = Math.PI;

// ---- 0:25 · LA BOTELLA JUNTO A LA PILETA: la cámara baja por la ventana de la granja y aterriza en la botella verde al lado de la canilla ----
export const HSinkbottle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile" key1={[-0.8, 1.6, 1.4]} warm={0.8}
  cam={{ at: [0.05, 0.1, 0], at1: [0.12, 0.08, 0], az: [-0.3, 0.12], el: [0.5, 0.18], r: [1.0, 0.5], fov: 30 }}>{(tt) => {
  const land = phys(tt, 1.6, 6, 0.45), shine = eio(tt, 3.0, 4.2) * (1 - eio(tt, 4.6, 5.6));
  return <>
    {/* pileta enlozada blanca hundida en la mesada, con canilla de bronce */}
    <RBox s={[0.5, 0.08, 0.34]} p={[-0.12, -0.035, -0.02]} r={0.02}>{M.porcelain({ col: "#ece6da" })}</RBox>
    <mesh position={[-0.12, 0.006, -0.02]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.42, 0.26]} /><meshStandardMaterial color="#9aa3a8" roughness={0.3} metalness={0.4} /></mesh>
    <group position={[-0.12, 0.0, -0.2]}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.012, 0.014, 0.14, 16]} />{M.brass()}</mesh>
      <mesh position={[0, 0.14, 0.05]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.11, 16]} />{M.brass()}</mesh>
      <mesh position={[0, 0.125, 0.1]}><cylinderGeometry args={[0.008, 0.01, 0.03, 12]} />{M.brass()}</mesh>
    </group>
    {/* la botella llega con peso y se asienta al lado de la canilla */}
    <group position={[0.16, 0.18 * (1 - cl(land)), 0.0]} rotation={[0, 0.4, 0.15 * (1 - cl(land))]}><SoapBottle s={1.3} /></group>
    {/* un macetín de geranio y un frasco, lo que había en el alféizar */}
    <group position={[0.34, 0, -0.14]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.04, 0.03, 0.06, 20]} /><meshStandardMaterial color="#b4572e" roughness={0.8} /></mesh>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[Math.cos(i) * 0.02, 0.08 + 0.01 * rn(i, 2), Math.sin(i) * 0.02]}><sphereGeometry args={[0.014, 10, 8]} /><meshStandardMaterial color={i % 2 ? "#c8283a" : "#3c6a28"} roughness={0.6} /></mesh>)}
    </group>
    {/* el brillo que recorre la botella cuando la nombra */}
    <mesh position={[0.16 + 0.03, 0.04 + 0.2 * shine, 0.05]} visible={shine > 0.02}><planeGeometry args={[0.012, 0.06]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.6 * shine} /></mesh>
  </>;
}}</Scene3D>;

// ---- 2:05 · UNA BARRA DE JABÓN DE LEJÍA: la barra marrón se corta en virutas que caen al balde de la ropa ----
export const HLyebar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[-0.6, 1.5, 1.2]} warm={0.7}
  cam={{ at: [0, 0.08, 0], az: [0.3, -0.05], el: [0.45, 0.35], r: [0.78, 0.66], fov: 30 }}>{(tt) => {
  const cut = eio(tt, 0.8, 4.6), N = 22, done = Math.floor(cut * N);
  return <>
    {/* balde galvanizado con agua */}
    <group position={[0.16, 0, 0.02]}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.1, 0.085, 0.14, 40, 1, true]} />{M.steel({ col: "#9aa1a6", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.11, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.097, 40]} />{M.water({ col: "#c7d4cf", op: 0.75 })}</mesh>
      <mesh position={[0, 0.14, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.1, 0.004, 8, 40]} />{M.steel()}</mesh>
    </group>
    {/* la barra de jabón casero, color caramelo, que se va acortando */}
    <RBox s={[0.14 * (1 - cut * 0.7) + 0.005, 0.045, 0.06]} p={[-0.14 + 0.07 * cut * 0.7, 0.0225, 0.02]} r={0.008}><meshPhysicalMaterial color="#c99a52" roughness={0.55} clearcoat={0.3} /></RBox>
    {/* el cuchillo que raspa */}
    <group position={[-0.07 - 0.0 * cut, 0.06 + 0.01 * Math.sin(tt * 14), 0.02]} rotation={[0, 0, -0.5 + 0.2 * Math.sin(tt * 14)]}>
      <RBox s={[0.12, 0.022, 0.003]} p={[0.05, 0, 0]} r={0.001}>{M.steel()}</RBox>
      <RBox s={[0.07, 0.02, 0.014]} p={[-0.04, 0, 0]} r={0.005}>{M.wood({ base: [86, 52, 30] })}</RBox>
    </group>
    {/* virutas en espiral que vuelan en arco al balde */}
    {Array.from({ length: N }, (_, i) => { const k = i < done ? cl((tt - 0.8 - (i / N) * 3.8) / 0.6) : 0; if (k <= 0) return null;
      return <mesh key={i} position={[lerp(-0.07, 0.16 + (rn(i, 2) - 0.5) * 0.1, k), 0.07 + Math.sin(k * PI) * 0.1 + (k >= 1 ? 0.045 : 0), lerp(0.02, (rn(i, 3) - 0.5) * 0.1, k)]} rotation={[k * 6, k * 3, 0]}>
        <torusGeometry args={[0.008, 0.0025, 6, 14, PI * 1.4]} /><meshStandardMaterial color="#d8ad66" roughness={0.6} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 2:35 · LA CAPA DE CERA: el pulgón gigante con su abrigo brillante; la gota de jabón lo derrite y el abrigo se va ----
export const HWaxcoat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#18221a" key1={[-0.6, 1.4, 1.2]}
  cam={{ at: [0, 0.03, 0], az: [0.35, -0.2], el: [0.3, 0.22], r: [0.42, 0.34], fov: 30 }}>{(tt) => {
  const drop = cl((tt - 1.2) / 0.6), melt = eio(tt, 1.9, 4.4), wob = Math.sin(tt * 5) * 0.02;
  return <>
    {/* la hoja enorme como piso, con nervadura */}
    <group rotation={[-PI / 2, 0, 0.3]} position={[0, 0, 0]}><group scale={6}><Leaf col="#3d7a28" /></group></group>
    {/* el pulgón gigante */}
    <group position={[0.0, 0.03, 0]} rotation={[0, 0.5 + wob, 0]} scale={9}>
      <Aphid col={melt > 0.5 ? "#6aa83a" : "#8fcf4a"} />
    </group>
    {/* la capa de cera: cáscara brillante que se derrite */}
    <mesh position={[0, 0.032 - 0.01 * melt, 0]} rotation={[0, 0.5 + wob, 0]} scale={[1.08 * 9 * (1 - 0.15 * melt), 0.85 * 9 * (1 - 0.6 * melt), 1.42 * 9 * (1 - 0.15 * melt)]}>
      <sphereGeometry args={[0.004, 24, 16]} /><meshPhysicalMaterial color="#eef6ff" roughness={0.02} clearcoat={1} transmission={0.6} thickness={0.01} transparent opacity={0.55 * (1 - melt)} />
    </mesh>
    {/* la gota de agua jabonosa con burbujas */}
    <mesh visible={drop < 1} position={[0, lerp(0.22, 0.05, drop), 0]} scale={[1, 1.3, 1]}><sphereGeometry args={[0.012, 16, 12]} />{M.water({ col: "#dff0ff", op: 0.7 })}</mesh>
    {Array.from({ length: 16 }, (_, i) => { const u = (tt * 0.6 + rn(i, 2)) % 1; return <mesh key={i} visible={drop >= 1 && melt < 0.95} position={[Math.cos(i) * 0.03 * rn(i, 3), 0.04 + u * 0.05, Math.sin(i) * 0.03 * rn(i, 4)]}><sphereGeometry args={[0.003 + 0.003 * rn(i, 5), 10, 8]} />{M.glass({ op: 0.5 })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 3:07 · LA BOTELLA MÁS SIMPLE: tres botellas en fila; las de la lejía y el antibacterial se apagan y la lisa se adelanta ----
export const HPlainbottle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" key1={[-0.7, 1.5, 1.3]} warm={0.8}
  cam={{ at: [0, 0.11, 0], az: [-0.12, 0.1], el: [0.18, 0.12], r: [0.82, 0.68], fov: 30 }}>{(tt) => {
  const out = eio(tt, 2.2, 3.4), step = phys(tt, 3.6, 6, 0.45);
  const B = [{ x: -0.2, col: "#d8cf3a", tag: "#c63a2a" }, { x: 0, col: "#3fa35a", tag: "" }, { x: 0.2, col: "#4a7ad0", tag: "#7a40b0" }];
  return <>
    {B.map((b, i) => { const enter = phys(tt, 0.3 + i * 0.35, 6, 0.4), extra = b.tag !== "", dim = extra ? out : 0;
      return <group key={i} position={[b.x * (extra ? 1 + 0.25 * out : 1), 0.12 * (1 - cl(enter)), i === 1 ? 0.12 * cl(step) : -0.05 * out]} rotation={[0, 0, extra ? 0.12 * out * Math.sign(b.x) : 0]}>
        <SoapBottle col={b.col} s={1.25} lab={extra ? "#f6f2e6" : "#f6f2e6"} />
        {/* la estrella de «extra» (lejía, antibacterial) que la marca */}
        {extra && <mesh position={[0, 0.09, 0.047]} scale={1 - dim * 0.4}><circleGeometry args={[0.022, 5]} /><meshStandardMaterial color={b.tag} roughness={0.5} /></mesh>}
      </group>; })}
    {/* aro de luz en el piso debajo de la botella lisa */}
    <mesh position={[0, 0.002, 0.12 * cl(step)]} rotation={[-PI / 2, 0, 0]} visible={step > 0.05}><ringGeometry args={[0.055, 0.065, 48]} /><meshBasicMaterial color="#f4d58a" transparent opacity={0.7 * cl(step)} /></mesh>
  </>;
}}</Scene3D>;

// ---- 4:03 · EL PULGAR EN LA MANGUERA: el chorro se abre en abanico y barre los pulgones del pimpollo ----
export const HHosethumb: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#24402a" key1={[-0.8, 1.6, 1.2]}
  cam={{ at: [0.04, 0.12, 0], az: [0.2, -0.1], el: [0.12, 0.08], r: [0.62, 0.52], fov: 30 }}>{(tt) => {
  const press = eio(tt, 0.6, 1.4), spray = eio(tt, 1.3, 1.8), wash = eio(tt, 1.8, 4.8);
  return <>
    {/* el rosal: tallo y pimpollo lleno de pulgones */}
    <group position={[0.16, 0.14, 0]}><RoseBud s={3} open={0.15} /></group>
    {[[0.12, 0.08, 0.6], [0.2, 0.1, -0.7]].map(([x, y, r], i) => <group key={i} position={[x, y, 0.01]} rotation={[0, 0, r]}><group scale={1.6}><Leaf /></group></group>)}
    {Array.from({ length: 40 }, (_, i) => { const gone = wash * 40 > i; const fall = gone ? cl((tt - 1.8 - (i / 40) * 3) / 0.8) : 0; const a = rn(i, 2) * PI * 2, y = 0.13 + rn(i, 3) * 0.07;
      return <group key={i} visible={fall < 1} position={[0.16 + Math.cos(a) * 0.03 + fall * 0.08, y - fall * 0.2, Math.sin(a) * 0.03 + 0.02]} rotation={[fall * 4, a, 0]}><Aphid s={2.4} /></group>; })}
    {/* la manguera verde y el pulgar que tapa la boca */}
    <group position={[-0.26, 0.14, 0.02]} rotation={[0, 0, -0.05]}>
      <mesh rotation={[0, 0, PI / 2]} position={[-0.1, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.22, 20]} /><meshStandardMaterial color="#2f8a3a" roughness={0.5} /></mesh>
      <mesh rotation={[0, 0, PI / 2]} position={[0.02, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.03, 20]} />{M.brass()}</mesh>
      <mesh position={[0.04, 0.012 - 0.006 * press, 0]} scale={[1.4, 0.8, 1]}><sphereGeometry args={[0.016, 16, 12]} /><meshStandardMaterial color="#e1aa86" roughness={0.6} /></mesh>
    </group>
    {/* el abanico de gotitas finas */}
    {Array.from({ length: 70 }, (_, i) => { const u = (tt * 2.2 + rn(i, 2)) % 1, ang = (rn(i, 3) - 0.5) * 0.7 * spray; return <mesh key={"d" + i} visible={spray > 0.05} position={[-0.2 + u * 0.38, 0.14 + Math.sin(ang) * u * 0.38 - u * u * 0.05, (rn(i, 4) - 0.5) * 0.04 * u]}><sphereGeometry args={[0.0025, 6, 5]} />{M.water({ col: "#e8f6ff", op: 0.8 })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 4:31 · TRES MAÑANAS SEGUIDAS: tres soles salen sobre el rosal y cada mañana quedan menos pulgones ----
export const HThreemornings: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#2a3a4a" key1={[-0.8, 1.4, 1.4]}
  cam={{ at: [0, 0.14, 0], az: [-0.1, 0.1], el: [0.1, 0.06], r: [0.8, 0.7], fov: 30 }}>{(tt) => {
  const day = Math.min(2.999, tt / 1.8), d = Math.floor(day), f = day - d, sunY = Math.sin(f * PI);
  const left = [36, 16, 4, 0][Math.min(3, d + (f > 0.6 ? 1 : 0))];
  return <>
    {/* cielo que aclara en cada mañana y pasto */}
    <mesh position={[0, 0.2, -0.4]}><planeGeometry args={[3, 1.2]} /><meshBasicMaterial color={new THREE.Color("#3a4a6a").lerp(new THREE.Color("#e8b07a"), 0.35 + 0.15 * (d + f) / 3)} /></mesh>
    <mesh position={[0, -0.02, -0.1]} rotation={[-PI / 2 + 0.05, 0, 0]}><planeGeometry args={[3, 1]} /><meshStandardMaterial color="#4c6a2c" roughness={1} /></mesh>
    {/* el sol de esa mañana subiendo y bajando */}
    <mesh position={[-0.25 + d * 0.25, -0.05 + sunY * 0.3, -0.38]}><sphereGeometry args={[0.075, 24, 16]} />{M.glow({ col: "#ffd27a" })}</mesh>
    {/* tres palitos de calendario: se tachan con cada mañana */}
    {[0, 1, 2].map((i) => <group key={i} position={[-0.3 + i * 0.075, 0.27, -0.05]} scale={1.3}>
      <RBox s={[0.05, 0.06, 0.006]} p={[0, 0, 0]} r={0.004}><meshStandardMaterial color="#f2ead8" roughness={0.7} /></RBox>
      <mesh position={[0, 0, 0.004]} rotation={[0, 0, 0.7]} scale={[i < d || (i === d && f > 0.6) ? 1 : 0.001, 1, 1]}><boxGeometry args={[0.06, 0.006, 0.002]} /><meshStandardMaterial color="#c2302a" /></mesh>
    </group>)}
    {/* el rosal con pulgones que disminuyen */}
    <group position={[0.12, 0.14, 0]}><RoseBud s={3.4} open={0.2 + 0.25 * (d + f) / 3} /></group>
    {Array.from({ length: 36 }, (_, i) => { const a = rn(i, 2) * PI * 2; return <group key={i} visible={i < left} position={[0.12 + Math.cos(a) * 0.034, 0.12 + rn(i, 3) * 0.06, Math.sin(a) * 0.034 + 0.02]}><Aphid s={2.6} /></group>; })}
  </>;
}}</Scene3D>;

// ---- 5:08 · LA MARIQUITA TRABAJA GRATIS: la mariquita aterriza en el tallo y se come la fila de pulgones uno por uno ----
export const HLadybug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1c2a1c" key1={[-0.6, 1.5, 1.3]}
  cam={{ at: [0.0, 0.1, 0], az: [0.3, -0.15], el: [0.2, 0.12], r: [0.42, 0.34], fov: 30 }}>{(tt) => {
  const fly = cl((tt - 0.3) / 1.2), walk = eio(tt, 1.6, 5.6), lx = lerp(-0.12, 0.12, walk);
  return <>
    {/* el tallo horizontal con espinas */}
    <mesh position={[0, 0.08, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.009, 0.5, 14]} /><meshStandardMaterial color="#3c6a28" roughness={0.5} /></mesh>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.2 + i * 0.08, 0.09, 0]} rotation={[0, 0, -0.4]}><coneGeometry args={[0.003, 0.014, 6]} /><meshStandardMaterial color="#8a4a2a" /></mesh>)}
    <group position={[0.22, 0.11, -0.02]} rotation={[0, 0, -0.6]}><group scale={2}><Leaf /></group></group>
    {/* fila de pulgones; desaparece el que alcanza la mariquita */}
    {Array.from({ length: 12 }, (_, i) => { const x = -0.1 + i * 0.02; return <group key={i} visible={x > lx + 0.012} position={[x, 0.09, 0.004]} rotation={[0, PI / 2, 0]}><Aphid s={2.6} /></group>; })}
    {/* la mariquita que llega volando y camina por el tallo */}
    <group position={[lerp(-0.3, lx, fly), 0.089 + (1 - fly) * 0.18 + Math.sin(fly * PI) * 0.03, 0.0]} rotation={[0, -PI / 2, 0]} scale={2.8}>
      <Ladybug />
      {fly < 1 && [-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.006, 0.006, -0.002]} rotation={[0.4, 0, sd * (0.6 + 0.4 * Math.sin(tt * 70))]}><planeGeometry args={[0.012, 0.016]} />{M.glass({ op: 0.4 })}</mesh>)}
    </group>
  </>;
}}</Scene3D>;
