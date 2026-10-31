// so29d · los componentes ÚNICOS del video del moho del pan (uno por minuto; ninguno se repite en la tanda so29, ver D:/rtmp/so29_COMPONENTES.md).
// Maqueta sobre la mesada (hk.tsx). Cada uno = UNA idea con un objeto: el agua, el calor y las semillas del moho, y lo que hacía la mamá de Sachiko.
import React, { useMemo } from "react";
import * as THREE from "three";
import { F, Hero, C, it, lerp, pop, Pop, Ink, cardTex, Steam, Coin, Bill,
  cl, eio, orbita, Box, Cyl, AMB, V } from "./hk";
import { mk } from "./casa3d";

const RED = "#d62828", CRUST = "#b8742e", CRUMB = "#f3e6c8", MOLD = "#6f8a6a", WOOD = "#a8743a", ICE = "#cfe9ff", WATER = "#8fcfff";
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };   // semilla fija (nada de Math.random)

// feta de pan de molde: miga clara con corteza dorada y copete redondeado
const Slice: React.FC<{ p: V; rot?: V; s?: number; stale?: number; th?: number }> = ({ p, rot = [0, 0, 0], s = 1, stale = 0, th = 0.03 }) =>
  <group position={p} rotation={rot} scale={s}>
    <Box p={[0, 0.11, 0]} s={[0.24, 0.22, th]} c={CRUST} r={0.7} rad={0.012} />
    <mesh position={[0, 0.235, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1]}><cylinderGeometry args={[0.12, 0.12, th, 28, 1, false, 0, Math.PI]} /><meshStandardMaterial color={CRUST} roughness={0.7} /></mesh>
    <Box p={[0, 0.11, 0.0005]} s={[0.215, 0.2, th + 0.002]} c={col(CRUMB, "#d9c79a", stale)} r={0.95} rad={0.008} />
    <mesh position={[0, 0.225, 0.0005]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.105, 0.105, th + 0.002, 28, 1, false, 0, Math.PI]} /><meshStandardMaterial color={col(CRUMB, "#d9c79a", stale)} roughness={0.95} /></mesh>
  </group>;
// pan de molde entero (shokupan), largo L, con la cara cortada mirando a +x
const Loaf: React.FC<{ p: V; L?: number; rot?: V; s?: number; mold?: number }> = ({ p, L = 0.6, rot = [0, 0, 0], s = 1, mold = 0 }) =>
  <group position={p} rotation={rot} scale={s}>
    <Box p={[0, 0.11, 0]} s={[L, 0.22, 0.24]} c={CRUST} r={0.65} rad={0.03} />
    <mesh position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.12, 0.12, L, 28, 1, false, 0, Math.PI]} /><meshStandardMaterial color={col(CRUST, "#9a5a22", 0.3)} roughness={0.6} /></mesh>
    <Box p={[L / 2 + 0.001, 0.11, 0]} s={[0.002, 0.2, 0.215]} c={CRUMB} r={0.95} rad={0.001} />
    {mold > 0.01 && <Spot p={[L / 2 + 0.004, 0.12, 0.02]} k={mold} rot={[0, Math.PI / 2, 0]} />}
  </group>;
// mancha de moho: disco gris verdoso con pelusa (esferitas) que crece en círculo
const Spot: React.FC<{ p: V; k: number; r?: number; rot?: V; c?: string }> = ({ p, k, r = 0.05, rot = [0, 0, 0], c = MOLD }) => k < 0.01 ? null :
  <group position={p} rotation={rot}>
    <mesh><circleGeometry args={[r * k, 28]} /><meshStandardMaterial color={c} roughness={1} transparent opacity={0.9} /></mesh>
    <mesh position={[0, 0, 0.001]}><ringGeometry args={[r * k * 0.7, r * k * 1.05, 28]} /><meshStandardMaterial color="#cfd8c8" roughness={1} transparent opacity={0.7} /></mesh>
    {Array.from({ length: 14 }, (_, i) => { const a = i * 2.4, rr = r * k * (0.2 + 0.75 * rnd(i)); return <mesh key={i} position={[rr * Math.cos(a), rr * Math.sin(a), 0.004]}><sphereGeometry args={[0.006 + 0.006 * rnd(i + 9), 8, 6]} /><meshStandardMaterial color={i % 3 ? "#9fb09a" : "#e6ece0"} roughness={1} /></mesh>; })}
  </group>;
// esporas: motitas que flotan con deriva lenta (seno), sin azar
const Spores: React.FC<{ t: number; n?: number; box?: V; c?: V; k?: number; col?: string }> = ({ t, n = 40, box = [1.2, 0.6, 0.6], c = [0, 0.35, 0], k = 1, col: cc = "#d8e4cf" }) => k < 0.02 ? null :
  <group position={c}>{Array.from({ length: n }, (_, i) => <mesh key={i} position={[box[0] * (rnd(i) - 0.5) + 0.04 * Math.sin(t * 0.7 + i), box[1] * (rnd(i + 50) - 0.5) + 0.03 * Math.sin(t * 0.5 + i * 2), box[2] * (rnd(i + 99) - 0.5)]}>
    <sphereGeometry args={[0.009, 8, 6]} /><meshStandardMaterial color={cc} emissive={cc} emissiveIntensity={0.9} transparent opacity={0.85 * k} /></mesh>)}</group>;
// gota de agua (lágrima)
const Drop: React.FC<{ p: V; s?: number; op?: number }> = ({ p, s = 1, op = 0.85 }) =>
  <group position={p} scale={s}><mesh><sphereGeometry args={[0.02, 14, 10]} /><meshStandardMaterial color={WATER} roughness={0.05} metalness={0.1} transparent opacity={op} /></mesh>
    <mesh position={[0, 0.022, 0]}><coneGeometry args={[0.014, 0.03, 12]} /><meshStandardMaterial color={WATER} roughness={0.05} transparent opacity={op} /></mesh></group>;
// mano de arcilla (palma + 4 dedos + pulgar), mirando hacia abajo
const Hand: React.FC<{ p: V; rot?: V; s?: number; c?: string; wet?: number }> = ({ p, rot = [0, 0, 0], s = 1, c = "#f1d9c4", wet = 0 }) =>
  <group position={p} rotation={rot} scale={s}>
    <Box p={[0, 0, 0]} s={[0.16, 0.04, 0.14]} c={c} r={0.6 - 0.5 * wet} rad={0.02} />
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.11, 0, -0.05 + 0.034 * i]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.014, 0.07, 6, 10]} /><meshStandardMaterial color={c} roughness={0.6 - 0.5 * wet} /></mesh>)}
    <mesh position={[0.04, 0, 0.09]} rotation={[0, -0.6, Math.PI / 2]}><capsuleGeometry args={[0.016, 0.05, 6, 10]} /><meshStandardMaterial color={c} roughness={0.6 - 0.5 * wet} /></mesh>
    <Cyl p={[-0.13, 0, 0]} r={0.045} h={0.08} c="#8fb3d9" rough={0.9} rot={[0, 0, Math.PI / 2]} />
  </group>;
// panera de madera con tapa (ang = cuánto se abre)
const BreadBox: React.FC<{ p: V; ang?: number; s?: number; c?: string; cut?: boolean }> = ({ p, ang = 0, s = 1, c = WOOD, cut = false }) =>
  <group position={p} scale={s}>
    <Box p={[0, 0.03, 0]} s={[0.78, 0.02, 0.38]} c={c} r={0.7} rad={0.006} />
    <Box p={[0, 0.13, -0.19]} s={[0.8, 0.24, 0.02]} c={c} r={0.7} rad={0.006} />
    {!cut && <Box p={[0, 0.13, 0.19]} s={[0.8, 0.24, 0.02]} c={c} r={0.7} rad={0.006} />}
    {[-0.39, 0.39].map((x) => <Box key={x} p={[x, 0.13, 0]} s={[0.02, 0.24, 0.4]} c={c} r={0.7} rad={0.006} />)}
    <group position={[0, 0.25, -0.2]} rotation={[-ang, 0, 0]}><Box p={[0, 0.01, 0.2]} s={[0.82, 0.02, 0.42]} c={col(c, "#7a4e24", 0.15)} r={0.6} rad={0.008} />
      <Box p={[0, 0.03, 0.36]} s={[0.12, 0.02, 0.03]} c="#5a3a22" r={0.6} rad={0.008} /></group>
  </group>;
// bolsa plástica del súper con precinto: caja translúcida con nudo
const Bag: React.FC<{ p: V; L?: number; fog?: number; s?: number; rot?: V }> = ({ p, L = 0.7, fog = 0, s = 1, rot = [0, 0, 0] }) =>
  <group position={p} scale={s} rotation={rot}>
    <mesh position={[0, 0.13, 0]}><boxGeometry args={[L, 0.27, 0.27]} /><meshPhysicalMaterial color={col("#ffffff", "#dfe8ee", fog)} transmission={0.5} roughness={0.15 + 0.6 * fog} transparent opacity={0.28 + 0.35 * fog} depthWrite={false} /></mesh>
    <mesh position={[L / 2 + 0.06, 0.13, 0]} rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[0.07, 0.12, 12]} /><meshStandardMaterial color="#f4f6f8" transparent opacity={0.45} /></mesh>
    <Cyl p={[L / 2 + 0.01, 0.13, 0]} r={0.035} h={0.02} c="#d62828" rough={0.5} rot={[0, 0, Math.PI / 2]} />
  </group>;
// fondo de mesada para los componentes que no traen escenografía propia
const Board: React.FC<{ p?: V; w?: number; d?: number; c?: string }> = ({ p = [0, 0, 0], w = 1.2, d = 0.6, c = "#c9955a" }) =>
  <Box p={[p[0], p[1] + 0.012, p[2]]} s={[w, 0.024, d]} c={c} r={0.75} rad={0.01} />;

// 0:05 · LA BOLSA DEL SÁBADO: las fetas salen de la bolsa en abanico, una por una; en la tercera crece un círculo gris verdoso
export const D_bag: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 0.42, 0.9], [0.18, 0.16, 0.05]), C([0.33, 0.405, 0.845], [0.18, 0.165, 0.05]), 10)}
    set={{ spot: [0.1, 0.2, 0] as V, spotK: 0.35, warm: 0.5 }}
    scene={(tt) => { const o = eio(tt, 0.3, 1.0);
      return <>
        <Board w={1.4} d={0.7} />
        <Bag p={[-0.35, 0.024, 0]} L={0.5} s={0.95} />
        {[0, 1, 2, 3, 4].map((i) => { const k = eio(tt, 0.6 + 0.35 * i, 1.2 + 0.35 * i);
          return <Slice key={i} p={[lerp(-0.25, 0.0 + 0.13 * i, k), 0.026, lerp(0, 0.08 - 0.03 * i, k)]} rot={[lerp(0, -1.2, k), lerp(0, -0.25 + 0.08 * i, k), 0]} s={1.1} />; })}
        <Spot p={[0.26, 0.15, 0.1]} rot={[-1.2 - 0.37, -0.09, 0]} k={eio(tt, 2.4, 4.4)} r={0.075} />
        <pointLight position={[0.26, 0.3, 0.3]} intensity={0.5 * o} distance={0.9} color="#fff1d0" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.2} txt="BOUGHT WEDNESDAY" col={AMB} />} />;
};
// 0:40 · CUATRO DÓLARES AL TACHO: el pan entero cae al tacho; el billete de $4 lo sigue revoloteando
export const D_fourdollars: F = ({ t, h }) => {
  const four = useMemo(() => cardTex(["$4"], { bg: "#e6efd8", fg: "#2e5a2e", w: 256, h: 128 }), []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.3, 0.75, 1.6], [0, 0.3, 0]), C([0.5, 0.72, 1.5], [0, 0.3, 0]), 10)}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const f = eio(tt, 0.6, 2.4), b = eio(tt, 2.4, 4.6), lid = eio(tt, 0.4, 0.9) * (1 - eio(tt, 3.8, 4.4));
      return <>
        <group position={[0.42, 0, -0.2]}><Cyl p={[0, 0.22, 0]} r={0.22} r2={0.18} h={0.44} c="#8a9096" m={0.7} rough={0.35} />
          {[0, 1, 2, 3, 4, 5].map((i) => <Box key={i} p={[0.2 * Math.cos(i), 0.22, 0.2 * Math.sin(i)]} s={[0.01, 0.4, 0.01]} c="#6a7076" m={0.7} r={0.35} rad={0.002} rot={[0, -i, 0]} />)}
          <group position={[0, 0.45, -0.22]} rotation={[-1.6 * lid, 0, 0]}><Cyl p={[0, 0, 0.22]} r={0.235} h={0.03} c="#9aa0a6" m={0.7} rough={0.3} /></group></group>
        <Loaf p={[lerp(-0.45, 0.42, f), lerp(0.02, 0.32, f) + 0.35 * Math.sin(Math.PI * f) - 0.3 * eio(tt, 2.2, 2.5), lerp(0.15, -0.2, f)]} rot={[0, 0, f * 2.4]} L={0.4} mold={0.8} />
        {b > 0.01 && b < 0.99 && <group position={[lerp(-0.5, 0.42, b), 0.45 + 0.25 * Math.sin(Math.PI * b), 0.15 * Math.sin(b * 6)]} rotation={[Math.sin(tt * 5) * 0.6, b * 3, Math.cos(tt * 4) * 0.4]}>
          <mesh scale={1.8}><planeGeometry args={[0.22, 0.11]} /><meshStandardMaterial map={four} side={THREE.DoubleSide} /></mesh></group>}
        <Pop k={pop(tt, 4.4)} p={[-0.25, 0.42, 0.15]} s={2.6}><mesh><planeGeometry args={[0.22, 0.11]} /><meshStandardMaterial map={four} /></mesh></Pop>
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.4} txt="$4 IN THE GARBAGE" col="#ff8a7a" />} />;
};
// 3:00 · TSUYU, LLUVIA DE CIRUELAS: la rama del ciruelo con ciruelas verdes; la lluvia no para y la ropa colgada gotea sin secarse
export const D_tsuyu: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.7, 1.7], [0, 0.45, 0]), C([0.25, 0.68, 1.6], [0, 0.45, 0]), 10)}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.25, warm: 0.1 }}
    scene={(tt) => <>
      <group position={[-0.35, 0.75, -0.1]} rotation={[0, 0, -0.25]}><Cyl p={[0.3, 0, 0]} r={0.022} h={0.75} c="#5a3a22" rough={0.9} rot={[0, 0, Math.PI / 2]} />
        {Array.from({ length: 7 }, (_, i) => <group key={i} position={[0.05 + 0.1 * i, -0.04 - 0.02 * (i % 2), 0.03 * Math.sin(i)]}>
          <mesh position={[0, -0.03, 0]}><sphereGeometry args={[0.035, 18, 12]} /><meshPhysicalMaterial color="#9cbf4a" roughness={0.2} clearcoat={1} /></mesh>
          <mesh position={[0.03, 0.01, 0.02]} rotation={[0.3, 0, 0.8]} scale={[1, 0.4, 0.15]}><sphereGeometry args={[0.05, 12, 8]} /><meshStandardMaterial color="#4f7f36" roughness={0.6} /></mesh>
          <Drop p={[0, -0.075 - 0.04 * ((tt * 0.8 + i * 0.3) % 1), 0]} s={0.6} op={0.8 * (1 - ((tt * 0.8 + i * 0.3) % 1))} /></group>)}</group>
      {[-0.5, 0.5].map((x) => <Cyl key={x} p={[x, 0.3, -0.25]} r={0.012} h={0.6} c="#6b4a2e" rough={0.8} />)}
      <Cyl p={[0, 0.6, -0.25]} r={0.005} h={1.0} c="#e8dccb" rough={0.8} rot={[0, 0, Math.PI / 2]} />
      {[[-0.3, "#e8eef4"], [-0.05, "#d9b8a8"], [0.22, "#c8d8e8"]].map(([x, c], i) => <group key={i} position={[x as number, 0.5, -0.25]} rotation={[0, 0, 0.04 * Math.sin(tt * 0.8 + i)]}>
        <Box p={[0, 0, 0]} s={[0.18, 0.2, 0.01]} c={c as string} r={0.9} rad={0.005} />
        <Drop p={[0, -0.12 - 0.12 * ((tt * 0.6 + i * 0.4) % 1), 0.01]} s={0.7} op={0.85} /></group>)}
      {Array.from({ length: 40 }, (_, i) => { const u = (tt * 1.2 + rnd(i)) % 1; return <mesh key={"r" + i} position={[-0.7 + 1.4 * rnd(i + 5), lerp(1.2, 0.02, u), -0.4 + 0.8 * rnd(i + 7)]}><capsuleGeometry args={[0.004, 0.05, 4, 6]} /><meshStandardMaterial color={WATER} transparent opacity={0.7} /></mesh>; })}
      <Board w={1.5} d={0.9} c="#7a6a5a" />
    </>}
    over={(tt) => <Ink tt={tt} at={1.0} txt="TSUYU · PLUM RAIN" col={AMB} />} />;
};
// 3:40 · TRES LLAVES: tres faroles (gota, llama, semilla) sobre una feta; con los tres encendidos el moho crece; se apaga la gota y se encoge
export const D_triad: F = ({ t, h }) => {
  const L = useMemo(() => ["WATER", "WARMTH", "SEEDS"].map((x, i) => cardTex([x], { bg: ["#2f6fb5", "#d9822b", "#6f8a6a"][i], fg: "#ffffff", w: 256, h: 96 })), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.6, 1.1], [0, 0.3, 0]), C([0.15, 0.58, 1.05], [0, 0.3, 0]), 10)}
    set={{ spot: [0, 0, 0.1] as V, spotK: 0.35 }}
    scene={(tt) => { const on = [eio(tt, 0.5, 0.9), eio(tt, 1.6, 2.0), eio(tt, 2.7, 3.1)], off = eio(tt, 6.0, 6.6), w = on[0] * (1 - off), g = cl(on[0] * on[1] * on[2] * eio(tt, 3.1, 5.0) - off * 1.2);
      return <>
        <Board w={1.3} d={0.6} />
        <Slice p={[0, 0.03, 0.14]} rot={[-Math.PI / 2 + 0.55, 0, 0]} s={1.8} />
        <Spot p={[0.0, 0.16, 0.0]} rot={[-Math.PI / 2 + 0.55, 0, 0]} k={g} r={0.15} />
        {[0, 1, 2].map((i) => { const k = i === 0 ? w : on[i], x = -0.45 + 0.45 * i;
          return <group key={i} position={[x * 0.8, 0.48, -0.1]} scale={1.3}>
            <mesh><sphereGeometry args={[0.08, 24, 16]} /><meshStandardMaterial color={["#8fcfff", "#ffb347", "#c9d8b8"][i]} emissive={["#4aa8ff", "#ff7a1a", "#9fb09a"][i]} emissiveIntensity={1.4 * k} roughness={0.3} transparent opacity={0.4 + 0.6 * k} /></mesh>
            <pointLight intensity={0.5 * k} distance={0.8} color={["#4aa8ff", "#ff7a1a", "#cfe0c0"][i]} />
            {i === 0 && <Drop p={[0, -0.012, 0]} s={1.9} op={0.95} />}
            {i === 1 && <group rotation={[0, 0, tt * 0.6]}><mesh><sphereGeometry args={[0.03, 16, 12]} /><meshStandardMaterial color="#ffd23a" emissive="#ffb000" emissiveIntensity={1.2} /></mesh>{Array.from({ length: 8 }, (_, j) => <mesh key={j} position={[0.048 * Math.cos(j * 0.785), 0.048 * Math.sin(j * 0.785), 0]} rotation={[0, 0, j * 0.785 - Math.PI / 2]}><coneGeometry args={[0.008, 0.022, 6]} /><meshStandardMaterial color="#ffd23a" emissive="#ffb000" emissiveIntensity={1} /></mesh>)}</group>}
            {i === 2 && [0, 1, 2].map((j) => <mesh key={j} position={[-0.025 + 0.025 * j, 0.008 * (j % 2), 0]} rotation={[0, 0, 0.6 * j]} scale={[0.6, 1, 0.6]}><sphereGeometry args={[0.018, 12, 8]} /><meshStandardMaterial color="#6a5a3a" roughness={0.7} /></mesh>)}
            <mesh position={[0, -0.14, 0.01]}><planeGeometry args={[0.2, 0.075]} /><meshStandardMaterial map={L[i]} /></mesh>
            {i === 0 && off > 0.05 && <Box p={[0, 0, 0.09]} s={[0.22, 0.025, 0.01]} c={RED} r={0.4} rad={0.004} rot={[0, 0, 0.7]} />}</group>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={6.4} txt="TAKE AWAY ONE" col={AMB} />} />;
};
// 4:10 · LAS SEMILLAS INVISIBLES: un haz de luz de ventana sobre la mesada revela miles de esporas flotando sobre la mano, el pan y la tabla
export const D_spores: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.2, 0.6, 1.4], [0, 0.3, 0]), C([0.45, 0.58, 1.3], [0, 0.3, 0]), 12)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.1, warm: 0.2 }}
    scene={(tt) => { const b = eio(tt, 0.6, 2.0);
      return <>
        <Board w={1.4} d={0.7} />
        <Loaf p={[-0.25, 0.024, 0]} L={0.5} s={1.3} />
        <Hand p={[0.36, 0.12, 0.05]} rot={[0, Math.PI, 0]} s={1.3} />
        <mesh position={[0.15, 0.55, -0.1]} rotation={[0, 0, 0.6]}><cylinderGeometry args={[0.08, 0.3, 1.2, 32, 1, true]} /><meshBasicMaterial color="#fff4d6" transparent opacity={0.14 * b} depthWrite={false} side={THREE.DoubleSide} /></mesh>
        <Spores t={tt} n={140} box={[1.1, 0.7, 0.5]} c={[0.05, 0.4, 0.0]} k={b} col="#f4ffe8" />
        <pointLight position={[0.5, 1.0, 0.2]} intensity={0.9 * b} distance={2} color="#fff1c8" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={1.2} txt="ALWAYS THERE · FLOATING" col={AMB} />} />;
};
// 5:00 · EL CARBÓN QUE BEBE EL AIRE: bolsitas de tela con carbón en el estante; las gotitas del aire viajan hacia ellas y desaparecen
export const D_charcoal: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.65, 1.35], [0, 0.32, 0]), C([0.2, 0.63, 1.28], [0, 0.32, 0]), 10)}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.3 }}
    scene={(tt) => <>
      <Box p={[0, 0.2, -0.05]} s={[1.0, 0.03, 0.35]} c={WOOD} r={0.7} rad={0.006} />
      <Box p={[0, 0.4, -0.22]} s={[1.0, 0.8, 0.02]} c="#d9c8a8" r={0.9} rad={0.004} />
      {[-0.25, 0.25].map((x, i) => <group key={i} position={[x, 0.29, -0.02]}>
        <mesh scale={[1, 1.2, 0.9]}><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color="#efe6d0" roughness={1} transparent opacity={0.45} depthWrite={false} /></mesh>
        <Cyl p={[0, 0.12, 0]} r={0.025} h={0.04} c="#8a6a4a" rough={0.9} />
        {Array.from({ length: 16 }, (_, j) => <mesh key={j} position={[0.13 * (rnd(j + 20 * i) - 0.5), -0.07 + 0.11 * rnd(j + 40), 0.1 * (rnd(j + 60) - 0.5)]} rotation={[j, j * 2, 0]}><dodecahedronGeometry args={[0.024, 0]} /><meshStandardMaterial color="#1c1c1e" roughness={0.55} metalness={0.2} /></mesh>)}</group>)}
      <Loaf p={[0, 0.215, -0.02]} L={0.26} s={0.8} />
      {Array.from({ length: 22 }, (_, i) => { const u = (tt * 0.35 + rnd(i)) % 1, tx = i % 2 ? 0.25 : -0.25, sx = -0.6 + 1.2 * rnd(i + 3), sy = 0.4 + 0.4 * rnd(i + 8);
        return <Drop key={i} p={[lerp(sx, tx, u * u), lerp(sy, 0.3, u * u), lerp(0.25, 0, u)]} s={0.5 * (1 - u)} op={0.8} />; })}
    </>}
    over={(tt) => <Ink tt={tt} at={1.4} txt="CHARCOAL DRINKS THE AIR" col={AMB} />} />;
};
// 5:20 · EL DIARIO DEBAJO: la panera se levanta y el diario doblado tiene una mancha húmeda; tres días pasan en las hojitas y se cambia por uno seco
export const D_newspaper: F = ({ t, h }) => {
  const news = useMemo(() => mk(256, 192, (g) => { g.fillStyle = "#ece6d6"; g.fillRect(0, 0, 256, 192); g.fillStyle = "#3a3a3a"; g.font = "900 26px Georgia"; g.fillText("大阪新聞", 12, 32); for (let y = 48; y < 190; y += 10) { g.fillStyle = "rgba(60,60,60,.55)"; g.fillRect(12, y, 110 + 100 * ((y * 7) % 3 === 0 ? 1 : 0.9), 4); } }), []);
  const D = useMemo(() => ["DAY 1", "DAY 2", "DAY 3"].map((x) => cardTex([x], { bg: "#fbf3df", fg: "#3a2a18", w: 192, h: 96 })), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.85, 1.3], [0, 0.1, 0]), C([0.2, 0.82, 1.22], [0, 0.1, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.4 }}
    scene={(tt) => { const up = eio(tt, 0.4, 1.4), wet = eio(tt, 1.6, 4.6), sw = eio(tt, 5.0, 6.0);
      return <>
        <Board w={1.4} d={0.8} />
        <group position={[lerp(0, -0.9, sw), 0.026, 0]}><mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.7, 0.5]} /><meshStandardMaterial map={news} roughness={0.95} /></mesh>
          <mesh position={[0.05, 0.002, 0.02]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.3, 1, 1]}><circleGeometry args={[0.18 * wet, 32]} /><meshStandardMaterial color="#5e5644" transparent opacity={0.88 * wet} roughness={0.3} /></mesh></group>
        {sw > 0.02 && <group position={[lerp(0.9, 0, sw), 0.026, 0]}><mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.7, 0.5]} /><meshStandardMaterial map={news} roughness={0.95} /></mesh></group>}
        <BreadBox p={[0.66 * up, 0.03 + 0.3 * Math.sin(Math.PI * up), -0.12 * up]} s={0.7} />
        {[0, 1, 2].map((i) => { const k = pop(tt, 1.8 + 1.0 * i) * (1 - eio(tt, 4.8, 5.2)); return <Pop key={i} k={k} p={[-0.5 + 0.22 * i, 0.62, -0.2]}><mesh><planeGeometry args={[0.18, 0.09]} /><meshStandardMaterial map={D[i]} /></mesh></Pop>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={1.0} txt="THAT WATER WAS FOR YOUR BREAD" col={AMB} size={70} />} />;
};
// 6:40 · EL INVERNADERO: la bolsa plástica al sol se empaña, las gotas corren por adentro y se transforma en un invernadero de vidrio donde brotan matitas de moho
export const D_greenhouse: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 0.6, 1.4], [0, 0.22, 0]), C([0.3, 0.58, 1.3], [0, 0.22, 0]), 10)}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.3, warm: 0.9 }}
    scene={(tt) => { const fog = eio(tt, 0.4, 2.4), gh = eio(tt, 3.0, 4.2);
      return <>
        <Board w={1.4} d={0.7} />
        <mesh position={[0.6, 0.85, -0.3]}><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color="#ffd27a" emissive="#ffb347" emissiveIntensity={1.5} /></mesh>
        <pointLight position={[0.6, 0.85, -0.3]} intensity={1.0} distance={2} color="#ffcf8a" />
        <Loaf p={[0, 0.024, 0]} L={0.5} />
        {gh < 0.98 && <Bag p={[0, 0.024, 0]} L={0.58} fog={fog} s={1 - 0.1 * gh} />}
        {fog > 0.2 && gh < 0.9 && Array.from({ length: 14 }, (_, i) => { const u = (tt * 0.25 + rnd(i)) % 1; return <Drop key={i} p={[-0.27 + 0.54 * rnd(i + 1), lerp(0.27, 0.05, u), 0.136]} s={0.45} op={0.8 * fog} />; })}
        {gh > 0.02 && <group scale={[1, gh, 1]}>
          <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.76, 0.34, 0.4]} /><meshPhysicalMaterial color="#eef8f2" transmission={0.6} roughness={0.25} transparent opacity={0.3} depthWrite={false} /></mesh>
          <mesh position={[0, 0.37, 0]} rotation={[0, 0, Math.PI / 4]} scale={[1, 1, 2.85]}><boxGeometry args={[0.2, 0.2, 0.14]} /><meshPhysicalMaterial color="#eef8f2" transmission={0.6} roughness={0.25} transparent opacity={0.3} depthWrite={false} /></mesh>
          {[-0.38, 0, 0.38].map((x) => <Box key={x} p={[x, 0.2, 0.2]} s={[0.01, 0.34, 0.01]} c="#4f6f4a" m={0.5} r={0.4} rad={0.002} />)}</group>}
        {gh > 0.3 && Array.from({ length: 6 }, (_, i) => <Spot key={i} p={[-0.2 + 0.08 * i, 0.27, -0.06 + 0.12 * rnd(i)]} rot={[-Math.PI / 2, 0, 0]} k={eio(tt, 4.0 + 0.3 * i, 5.0 + 0.3 * i)} r={0.035} />)}
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.6} txt="A GREENHOUSE FOR MOLD" col="#ff8a7a" />} />;
};
// 7:05 · ARRIBA DE LA HELADERA: la heladera de perfil; el motor de atrás larga ondas de calor que suben y el pan de arriba se pone rojo como un mapa de calor
export const D_fridgetop: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.9, 1.45, 1.75], [0, 0.98, 0]), C([1.1, 1.4, 1.62], [0, 0.98, 0]), 10)}
    set={{ spot: [0, 0.5, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const hot = eio(tt, 1.0, 3.5);
      return <>
        <Box p={[0, 0.55, 0]} s={[0.55, 1.1, 0.5]} c="#ecebe7" r={0.3} m={0.2} rad={0.03} />
        <Box p={[0.28, 0.75, 0]} s={[0.012, 0.5, 0.46]} c="#d9d8d4" r={0.3} m={0.2} rad={0.004} /><Box p={[0.29, 0.75, 0.15]} s={[0.02, 0.2, 0.02]} c="#b8bcc2" m={0.8} r={0.3} rad={0.006} />
        <group position={[-0.29, 0.15, 0]}>{Array.from({ length: 6 }, (_, i) => <Box key={i} p={[0, 0.05 * i, 0]} s={[0.02, 0.012, 0.42]} c={col("#2a2a2a", "#c8462a", hot * 0.7)} m={0.6} r={0.4} rad={0.003} e="#ff4a1a" ei={0.6 * hot} />)}</group>
        {Array.from({ length: 6 }, (_, i) => { const u = (tt * 0.4 + i / 6) % 1; return <mesh key={i} position={[-0.32 + 0.05 * Math.sin(u * 8 + i), 0.25 + 0.95 * u, -0.1 + 0.04 * i]} rotation={[0, 0, Math.sin(u * 6) * 0.4]}><torusGeometry args={[0.08 + 0.06 * u, 0.011, 6, 20, Math.PI]} /><meshBasicMaterial color="#ff7a3a" transparent opacity={0.85 * hot * (1 - u)} /></mesh>; })}
        <group position={[0, 1.1, 0]} scale={1.7}><Bag p={[0, 0, 0]} L={0.4} fog={hot * 0.5} s={0.9} />
          <Loaf p={[0, 0, 0]} L={0.36} s={0.88} />
          <mesh position={[0, 0.16, 0]}><boxGeometry args={[0.44, 0.3, 0.26]} /><meshBasicMaterial color="#ff3a1a" transparent opacity={0.28 * hot} depthWrite={false} /></mesh></group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.0} txt="THE WORST PLACE IN THE HOUSE" col="#ff8a7a" size={72} />} />;
};
// 8:10 · LOS HILOS DEL ALMIDÓN: dentro de la miga, hilos blandos ondulados; el termómetro baja a la temperatura de heladera y los hilos se enderezan en palitos duros
export const D_threads: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.05, 0.62, 1.6], [0.05, 0.3, 0]), C([0.2, 0.6, 1.52], [0.05, 0.3, 0]), 10)}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const cold = eio(tt, 2.5, 5.0);
      return <>
        <Board w={1.4} d={0.6} c="#d9c8a8" />
        <mesh position={[-0.05, 0.32, -0.05]}><sphereGeometry args={[0.36, 40, 28]} /><meshPhysicalMaterial color={col(CRUMB, "#cfe0ea", cold * 0.5)} transmission={0.4} roughness={0.5} transparent opacity={0.35} depthWrite={false} /></mesh>
        {Array.from({ length: 9 }, (_, i) => { const y = 0.12 + 0.045 * i, pts = Array.from({ length: 24 }, (_, j) => new THREE.Vector3(-0.28 + 0.48 * j / 23, y + (1 - cold) * 0.035 * Math.sin(j * 0.9 + i + tt * 1.2), -0.05 + (1 - cold) * 0.04 * Math.cos(j * 0.7 + i)));
          return <mesh key={i}><tubeGeometry args={[new THREE.CatmullRomCurve3(pts), 48, 0.008 + 0.004 * cold, 8, false]} /><meshStandardMaterial color={col("#f6ead0", "#e8f2f8", cold)} roughness={lerp(0.9, 0.1, cold)} metalness={0.2 * cold} /></mesh>; })}
        <group position={[0.4, 0.05, 0.05]}><Cyl p={[0, 0.3, 0]} r={0.035} h={0.55} c="#f4f6f8" rough={0.1} op={0.6} />
          <mesh position={[0, 0.04, 0]}><sphereGeometry args={[0.055, 20, 14]} /><meshStandardMaterial color={col(RED, "#3a7ad6", cold)} /></mesh>
          <Cyl p={[0, 0.06 + 0.25 * (1 - 0.65 * cold) / 2, 0]} r={0.016} h={0.25 * (1 - 0.65 * cold)} c={col(RED, "#3a7ad6", cold)} rough={0.3} /></group>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.8} txt="SOFT THREADS" col={AMB} y={250} /><Ink tt={tt} at={4.6} txt="FRIDGE COLD = HARD AGAIN" col="#8fcfff" /></>} />;
};
// 9:10 · DURO COMO CARTÓN: la feta de la heladera se dobla en una caja de cartón corrugado; la tapa se cierra sola
export const D_cardboard: F = ({ t, h }) => {
  const corr = useMemo(() => mk(256, 256, (g) => { g.fillStyle = "#c69a62"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(120,80,40,.5)"; g.lineWidth = 3; for (let x = 0; x < 256; x += 10) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); } }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.15, 0.55, 1.2], [0, 0.22, 0]), C([0.32, 0.52, 1.12], [0, 0.22, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const m = eio(tt, 1.0, 3.0), fold = eio(tt, 0.4, 1.8);
      return <>
        <Board w={1.2} d={0.6} />
        {<group position={[-0.24, 0.03, 0.05]} rotation={[-0.25, 0.3, 0]} scale={1.4}><Slice p={[0, 0, 0]} stale={m} />
          <mesh position={[0, 0.11, 0.017]}><planeGeometry args={[0.2, 0.2]} /><meshStandardMaterial map={corr} transparent opacity={m * 0.75} /></mesh></group>}
        {fold > 0.02 && <group position={[0.26, 0.03, 0]} scale={0.9 + 0.1 * fold}>
          <mesh position={[0, 0.1 * fold, 0]}><boxGeometry args={[0.34, 0.2 * fold, 0.26]} /><meshStandardMaterial map={corr} roughness={0.95} /></mesh>
          <group position={[0, 0.2 * fold, -0.13]} rotation={[-(1 - eio(tt, 3.6, 4.4)) * 1.6, 0, 0]}><mesh position={[0, 0, 0.13]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.34, 0.26]} /><meshStandardMaterial map={corr} side={THREE.DoubleSide} /></mesh></group></group>}
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.0} txt="BREAD OR THE BOX?" col={AMB} />} />;
};
// 10:00 · LA MADERA RESPIRA: corte de la panera; el aire entra por la rendija como flechitas, el vaho del pan entra en la madera (se oscurece) y sale lento
export const D_woodbox: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.6, 1.3], [0, 0.2, 0]), C([0.2, 0.58, 1.22], [0, 0.2, 0]), 10)}
    set={{ spot: [0, 0.1, 0] as V, spotK: 0.3, warm: 0.4 }}
    scene={(tt) => { const soak = eio(tt, 1.0, 3.5) * (1 - eio(tt, 5.0, 7.5));
      return <>
        <Board w={1.4} d={0.7} c="#7a5634" />
        <BreadBox p={[0, 0.024, 0]} ang={0.08} c={col(WOOD, "#6a4520", soak)} cut />
        <Loaf p={[0, 0.045, 0]} L={0.5} />
        {Array.from({ length: 10 }, (_, i) => { const u = (tt * 0.3 + i / 10) % 1, side = i % 2 ? 1 : -1; return <mesh key={i} position={[side * lerp(0.1, 0.38, u), 0.28 - 0.1 * u, -0.05 + 0.1 * rnd(i)]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#e8f2f8" transparent opacity={0.8 * (1 - u)} /></mesh>; })}
        {Array.from({ length: 5 }, (_, i) => { const u = (tt * 0.5 + i / 5) % 1; return <group key={"a" + i} position={[lerp(-0.6, 0.6, u), 0.3, 0.1]}><mesh rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.02, 0.05, 10]} /><meshStandardMaterial color="#cfe9ff" transparent opacity={0.8 * Math.sin(Math.PI * u)} /></mesh></group>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={1.4} txt="WOOD BREATHES" col={AMB} />} />;
};
// 10:30 · EL FUROSHIKI: un paño cuadrado estampado se pliega sobre el pan; las cuatro puntas suben y se anudan arriba
export const D_furoshiki: F = ({ t, h }) => {
  const cloth = useMemo(() => mk(256, 256, (g) => { g.fillStyle = "#2f4f8a"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#f2e6c8"; g.lineWidth = 3; for (let y = 0; y < 256; y += 32) for (let x = 0; x < 256; x += 32) { g.beginPath(); g.arc(x + 16, y + 16, 10, 0, Math.PI); g.stroke(); } }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.75, 1.15], [0, 0.12, 0]), C([0.2, 0.72, 1.08], [0, 0.12, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.5 }}
    scene={(tt) => { const fo = eio(tt, 0.8, 3.0), kn = pop(tt, 3.2);
      return <>
        <Board w={1.3} d={0.8} />
        <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}><planeGeometry args={[0.5 * (1 - 0.6 * fo), 0.5 * (1 - 0.6 * fo)]} /><meshStandardMaterial map={cloth} roughness={0.9} /></mesh>
        <Loaf p={[0, 0.03, 0]} L={0.36} s={0.9} />
        {[0, 1, 2, 3].map((i) => { const a = Math.PI / 2 * i; return <group key={i} rotation={[0, a, 0]}><group position={[0, 0.03, 0.12]} rotation={[-fo * 1.45, 0, 0]}>
          <mesh position={[0, 0, 0.17]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.34 - 0.14 * fo, 0.34]} /><meshStandardMaterial map={cloth} roughness={0.9} side={THREE.DoubleSide} /></mesh></group></group>; })}
        <Pop k={kn} p={[0, 0.39, 0]}><mesh scale={[1.4, 0.7, 1]}><sphereGeometry args={[0.05, 18, 12]} /><meshStandardMaterial map={cloth} roughness={0.9} /></mesh>
          {[-1, 1].map((k) => <mesh key={k} position={[0.07 * k, 0.03, 0]} rotation={[0, 0, k * 0.8]} scale={[1, 0.3, 0.6]}><sphereGeometry args={[0.06, 14, 10]} /><meshStandardMaterial map={cloth} /></mesh>)}</Pop>
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.4} txt="FUROSHIKI · COTTON BREATHES" col={AMB} size={74} />} />;
};
// 11:10 · LA HARINA QUE CRUZÓ EL MAR: mapa del Pacífico en la mesada; un barquito con sacos de harina va de América a Japón y en el puerto aparece la bandeja escolar con un pancito
export const D_schoolbread: F = ({ t, h }) => {
  const map = useMemo(() => mk(512, 256, (g) => { g.fillStyle = "#9cc8e0"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#d9c79a"; g.beginPath(); g.ellipse(70, 100, 60, 90, 0.2, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(455, 110, 18, 60, -0.5, 0, Math.PI * 2); g.fill(); g.fillStyle = "#3a5a7a"; g.font = "900 24px Arial"; g.fillText("USA", 40, 110); g.fillText("JAPAN", 395, 190); g.fillText("1952", 230, 40); }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 1.2, 1.15], [0, 0.03, 0.02]), C([0.12, 1.17, 1.1], [0, 0.03, 0.02]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const u = eio(tt, 0.6, 4.2), tr = pop(tt, 4.4);
      return <>
        <Box p={[0, 0.015, 0]} s={[1.44, 0.03, 0.74]} c="#5a3a22" r={0.8} rad={0.01} /><mesh position={[0, 0.031, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.4, 0.7]} /><meshStandardMaterial map={map} roughness={0.8} /></mesh>
        <mesh position={[0, 0.033, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.4 * u, 0.006]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8} /></mesh>
        <group scale={1.5} position={[lerp(-0.45, 0.42, u), 0.04 + 0.006 * Math.sin(tt * 3), 0.02 * Math.sin(u * 6)]} rotation={[0.04 * Math.sin(tt * 2.5), 0, 0]}>
          <Box p={[0, 0.02, 0]} s={[0.2, 0.04, 0.08]} c="#3a3a3a" m={0.5} r={0.4} rad={0.015} /><Box p={[-0.05, 0.06, 0]} s={[0.05, 0.05, 0.05]} c="#e8e8e8" r={0.5} rad={0.008} />
          {[0, 1, 2].map((i) => <mesh key={i} position={[0.03 + 0.035 * i, 0.06, 0]} scale={[1, 1.2, 0.9]}><sphereGeometry args={[0.02, 12, 8]} /><meshStandardMaterial color="#f2ead6" roughness={1} /></mesh>)}</group>
        <Pop k={tr} s={1.5} p={[0.42, 0.05, 0.2]}><Box p={[0, 0, 0]} s={[0.26, 0.02, 0.18]} c="#c9ccd0" m={0.7} r={0.3} rad={0.01} />
          <mesh position={[-0.05, 0.04, 0]} scale={[1.3, 0.8, 1]}><sphereGeometry args={[0.04, 20, 14]} /><meshStandardMaterial color={CRUST} roughness={0.6} /></mesh>
          <Cyl p={[0.07, 0.04, 0]} r={0.03} h={0.05} c="#f4f1ea" rough={0.3} /></Pop>
      </>; }}
    over={(tt) => <Ink tt={tt} at={4.6} txt="SCHOOL BREAD · 1952" col={AMB} />} />;
};
// 11:40 · EL PAÑUELO DEL HERMANO: un pañuelo doblado se abre solo y adentro hay medio pancito; los mordisquitos lo achican despacio
export const D_handkerchief: F = ({ t, h }) => {
  const hk = useMemo(() => mk(256, 256, (g) => { g.fillStyle = "#f4efe2"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#7a9ac8"; g.lineWidth = 8; g.strokeRect(14, 14, 228, 228); g.lineWidth = 3; g.strokeRect(30, 30, 196, 196); }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.7, 0.95], [0, 0.06, 0]), C([0.18, 0.68, 0.9], [0, 0.06, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.8 }}
    scene={(tt) => { const o = eio(tt, 0.5, 2.0), bite = eio(tt, 2.6, 7.0);
      return <>
        <Board w={1.1} d={0.7} c="#8a6a4a" />
        <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.32, 0.32]} /><meshStandardMaterial map={hk} roughness={0.95} /></mesh>
        {[0, 1, 2, 3].map((i) => <group key={i} rotation={[0, Math.PI / 2 * i, 0]}><group position={[0, 0.027, 0.16]} rotation={[-(1 - o) * 2.9, 0, 0]}><mesh position={[0, 0, 0.12]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.32, 0.24]} /><meshStandardMaterial map={hk} side={THREE.DoubleSide} roughness={0.95} /></mesh></group></group>)}
        {o > 0.5 && <group position={[0, 0.03, 0]} scale={[1.5 * (1 - 0.55 * bite), 1.5, 1.5]}><mesh position={[0.0, 0.04, 0]} scale={[1, 0.75, 0.85]}><sphereGeometry args={[0.09, 28, 18, 0, Math.PI]} /><meshStandardMaterial color={CRUST} roughness={0.6} /></mesh>
          <mesh position={[0, 0.04, 0]} rotation={[0, 0, 0]} scale={[1, 0.75, 0.85]}><circleGeometry args={[0.088, 28]} /><meshStandardMaterial color={CRUMB} roughness={1} side={THREE.DoubleSide} /></mesh></group>}
        {Array.from({ length: Math.round(bite * 10) }, (_, i) => <mesh key={i} position={[-0.12 + 0.24 * rnd(i), 0.03, 0.1 + 0.05 * rnd(i + 4)]}><sphereGeometry args={[0.006, 6, 4]} /><meshStandardMaterial color={CRUMB} /></mesh>)}
      </>; }}
    over={(tt) => <Ink tt={tt} at={1.0} txt="TINY BITES · TO MAKE IT LAST" col={AMB} size={72} />} />;
};
// 12:40 · MANOS MOJADAS: la mano mojada gotea sobre la feta y en cada gota nace un puntito de moho; la toalla la seca y la mano seca no deja nada
export const D_wethands: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.7, 1.25], [0, 0.2, 0]), C([0.2, 0.68, 1.18], [0, 0.2, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const dr = eio(tt, 0.5, 2.5), tw = eio(tt, 3.2, 4.4);
      return <>
        <Board w={1.4} d={0.7} />
        {[-0.3, 0.3].map((x, j) => <group key={j}><Slice p={[x, 0.03, 0.05]} rot={[-Math.PI / 2, 0, 0]} s={1.3} />
          {j === 0 && [0, 1, 2].map((i) => <Spot key={i} p={[x - 0.05 + 0.06 * i, 0.075, 0.18 - 0.07 * i]} rot={[-Math.PI / 2, 0, 0]} k={eio(tt, 1.2 + 0.5 * i, 2.6 + 0.5 * i)} r={0.03} />)}</group>)}
        <Hand p={[-0.3, 0.42, 0.1]} rot={[0, Math.PI / 2, 0.1]} s={1.4} wet={1} />
        {Array.from({ length: 6 }, (_, i) => { const u = (tt * 1.1 + i / 6) % 1; return dr > 0.01 && <Drop key={i} p={[-0.34 + 0.03 * (i % 3), lerp(0.38, 0.08, u), 0.13 - 0.04 * (i % 2)]} s={0.7} op={0.85 * (1 - eio(tt, 2.6, 2.9))} />; })}
        <group position={[lerp(0.9, 0.3, tw), 0.42, 0.1]}><Box p={[0, 0, 0]} s={[0.26, 0.04, 0.18]} c="#e8eef4" r={0.95} rad={0.02} /><Box p={[0, -0.01, 0]} s={[0.24, 0.03, 0.16]} c="#c8d8e8" r={0.95} rad={0.02} /></group>
        <Hand p={[0.3, lerp(0.6, 0.2, eio(tt, 4.6, 5.6)), 0.1]} rot={[0, Math.PI / 2, 0.1]} s={1.4} />
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.8} txt="WET HANDS = MOLD" col="#ff8a7a" y={250} /><Ink tt={tt} at={5.2} txt="DRY HANDS · NOTHING" col="#7fe0a0" /></>} />;
};
// 13:20 · EL CUCHILLO DE LA MERMELADA: el cuchillo con mermelada entra a la bolsa y deja una mancha roja en la feta; ahí brota el moho primero
export const D_jamknife: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.15, 0.5, 1.0], [0.0, 0.18, 0]), C([0.3, 0.48, 0.94], [0.0, 0.18, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const k = eio(tt, 0.5, 1.6), out = eio(tt, 1.8, 2.6), sm = eio(tt, 1.2, 1.8);
      return <>
        <Board w={1.3} d={0.7} />
        <group position={[-0.2, 0.02, 0]}><Bag p={[0, 0, 0]} L={0.6} s={1.0} /><Loaf p={[0, 0.005, 0]} L={0.55} s={0.98} /></group>
        <group position={[0.38, 0.02, -0.2]} scale={1.5}><Cyl p={[0, 0.07, 0]} r={0.07} h={0.14} c="#f4f6f8" rough={0.05} op={0.5} /><Cyl p={[0, 0.05, 0]} r={0.064} h={0.1} c="#a01a2a" rough={0.2} /><Cyl p={[0, 0.15, 0]} r={0.072} h={0.02} c="#c9a24a" m={0.7} rough={0.3} /></group>
        <group position={[lerp(0.42, 0.12, k) + 0.25 * out, 0.2 - 0.05 * k + 0.2 * out, 0.06]} rotation={[0, 0, 0.3 - 0.3 * k]} scale={1.6}><Box p={[0, 0, 0]} s={[0.24, 0.006, 0.035]} c="#d5d9dd" m={0.95} r={0.15} rad={0.003} />
          <Box p={[-0.06, 0.004, 0]} s={[0.1, 0.006, 0.03]} c="#a01a2a" r={0.2} rad={0.003} /><Box p={[0.17, 0, 0]} s={[0.12, 0.02, 0.03]} c="#2a2018" r={0.6} rad={0.008} /></group>
        <mesh position={[0.08, 0.22, 0.02]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.1 * sm, 0.03 * sm]} /><meshStandardMaterial color="#a01a2a" roughness={0.2} /></mesh>
        <Spot p={[0.086, 0.2, 0.02]} rot={[0, Math.PI / 2, 0]} k={eio(tt, 3.0, 5.0)} r={0.09} />
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.6} txt="FOOD FOR THE MOLD" col="#ff8a7a" />} />;
};
// 14:05 · BOCA ABAJO: el pan gira en el aire y apoya la cara cortada contra la tabla; las flechitas del aire rebotan contra la corteza
export const D_cutdown: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.5, 0.6, 1.4], [0, 0.25, 0]), C([0.7, 0.58, 1.3], [0, 0.25, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.4 }}
    scene={(tt) => { const r = eio(tt, 0.8, 2.2);
      return <>
        <Board w={1.2} d={0.6} c="#b8834a" />
        <group position={[0, lerp(0.024 + 0.17, 0.024 + 0.25, r) + 0.18 * Math.sin(Math.PI * r), 0]} rotation={[0, 0, -Math.PI / 2 * r]}><Loaf p={[0, -0.17, 0]} L={0.5} />
          <mesh position={[0.252, -0.06, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.21, 0.2]} /><meshBasicMaterial color="#fff2c8" transparent opacity={0.5 * (1 - r)} /></mesh></group>
        {r > 0.02 && r < 0.99 && <group position={[0, 0.3, 0.2]}><mesh rotation={[0, 0, 0.2]}><torusGeometry args={[0.32, 0.012, 8, 40, Math.PI * 0.75 * r]} /><meshStandardMaterial color={AMB} emissive={AMB} emissiveIntensity={0.5} /></mesh>
          <mesh position={[0.32 * Math.cos(0.2 + Math.PI * 0.75 * r), 0.32 * Math.sin(0.2 + Math.PI * 0.75 * r), 0]} rotation={[0, 0, 0.2 + Math.PI * 0.75 * r]}><coneGeometry args={[0.03, 0.06, 12]} /><meshStandardMaterial color={AMB} emissive={AMB} emissiveIntensity={0.5} /></mesh></group>}
        {Array.from({ length: 6 }, (_, i) => { const u = (tt * 0.6 + i / 6) % 1, bounce = u > 0.5, x = bounce ? lerp(0.0, 0.45, (u - 0.5) * 2) : lerp(-0.6, -0.0, u * 2) - 0.0;
          return r > 0.9 && <group key={i} position={[x, 0.3 + 0.06 * i, -0.15 + 0.06 * i]}><mesh rotation={[0, 0, bounce ? 0.4 : -Math.PI / 2 - 0.4]}><coneGeometry args={[0.018, 0.05, 10]} /><meshStandardMaterial color="#8fcfff" transparent opacity={0.85 * Math.sin(Math.PI * u)} /></mesh></group>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.4} txt="CUT SIDE DOWN · ONE SECOND" col={AMB} size={74} />} />;
};
// 14:50 · VINAGRE Y SOL: el interior de la panera con migas y esporas; el paño con vinagre barre y las esporas se apagan; la caja sale al sol y se seca
export const D_vinegar: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.85, 1.1], [0, 0.1, 0]), C([0.2, 0.82, 1.04], [0, 0.1, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.5 }}
    scene={(tt) => { const sw = eio(tt, 1.2, 3.2), sun = eio(tt, 4.0, 5.0);
      return <>
        <Board w={1.4} d={0.8} c="#7a6a5a" />
        <BreadBox p={[0, 0.024, 0]} ang={1.5} c={col("#8a5a2e", WOOD, sw)} />
        {Array.from({ length: 22 }, (_, i) => { const x = -0.3 + 0.6 * rnd(i), gone = x < lerp(-0.4, 0.45, sw) ? 1 : 0; return gone ? null : <mesh key={i} position={[x, 0.05, -0.15 + 0.3 * rnd(i + 3)]}><dodecahedronGeometry args={[0.022, 0]} /><meshStandardMaterial color="#c99a5a" /></mesh>; })}
        <Spores t={tt} n={70} box={[0.6, 0.18, 0.3]} c={[0.1 + 0.3 * sw, 0.15, 0]} k={1 - sw} />
        <group position={[lerp(-0.35, 0.35, sw), 0.08, 0]} rotation={[0, 0.2 * Math.sin(tt * 4), 0]} scale={1.5}><Box p={[0, 0, 0]} s={[0.2, 0.05, 0.26]} c="#f4efe2" r={0.95} rad={0.02} /><Box p={[0, -0.005, 0]} s={[0.21, 0.04, 0.27]} c="#e8d890" r={0.6} rad={0.02} /></group>
        <group position={[-0.36, 0.02, 0.34]} scale={2.0}><Cyl p={[0, 0.12, 0]} r={0.045} h={0.24} c="#f4f8fa" rough={0.05} op={0.55} /><Cyl p={[0, 0.08, 0]} r={0.04} h={0.15} c="#f2e8b0" rough={0.05} op={0.6} /><Cyl p={[0, 0.27, 0]} r={0.02} h={0.05} c="#d62828" rough={0.4} /></group>
        <Steam p={[0, 0.14, 0]} t={tt} k={sun} s={0.45} />
        <mesh position={[0.42, 0.62, -0.42]}><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color="#ffe08a" emissive="#ffb347" emissiveIntensity={1.6 * sun} /></mesh>
        <pointLight position={[0.3, 0.6, 0]} intensity={2.2 * sun} distance={2.2} color="#ffd890" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={1.6} txt="VINEGAR · THEN SUN" col={AMB} />} />;
};
// 15:40 · EL TAMAÑO DE DOS DÍAS: el pan chico mide exactamente dos hojas de almanaque; el grande se estira a cinco y las tres últimas hojas se ponen verdes
export const D_twodays: F = ({ t, h }) => {
  const D = useMemo(() => ["WED", "THU", "FRI", "SAT", "SUN"].map((x) => cardTex([x], { bg: "#fbf3df", fg: "#3a2a18", w: 192, h: 160 })), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.7, 1.5], [0, 0.18, 0]), C([0.2, 0.68, 1.4], [0, 0.18, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const g = eio(tt, 2.0, 3.4), bad = eio(tt, 4.0, 5.5);
      return <>
        <Board w={1.5} d={0.7} />
        {[0, 1, 2, 3, 4].map((i) => { const k = i < 2 ? pop(tt, 0.4 + 0.3 * i) : pop(tt, 2.2 + 0.3 * (i - 2)); return <Pop key={i} k={k} p={[-0.48 + 0.24 * i, 0.5, -0.05]}>
          <mesh><planeGeometry args={[0.2, 0.16]} /><meshStandardMaterial map={D[i]} color={i >= 2 ? col("#ffffff", "#9fc08a", bad) : "#ffffff"} /></mesh></Pop>; })}
        <Loaf p={[-0.36, 0.024, 0.08]} L={lerp(0.46, 1.18, g) - 0.0} s={1} />
        {[0, 1, 2].map((i) => <Spot key={i} p={[0.0 + 0.24 * i, 0.27, 0.08]} rot={[-Math.PI / 2, 0, 0]} k={bad * g} r={0.06} />)}
      </>; }}
    over={(tt) => <Ink tt={tt} at={1.2} txt="THE SIZE OF TWO DAYS" col={AMB} />} />;
};
// 16:20 · LAS PUNTAS AL FRASCO: las dos puntas del pan entran al horno tibio, salen tostadas, el palote las aplasta y las migas llueven sobre la milanesa
export const D_panko: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.7, 1.4], [0, 0.2, 0]), C([0.2, 0.68, 1.32], [0, 0.2, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.6 }}
    scene={(tt) => { const into = eio(tt, 0.4, 1.4), out = eio(tt, 2.4, 3.0), roll = eio(tt, 3.2, 5.0), fall = eio(tt, 5.0, 6.8);
      return <>
        <Board w={1.5} d={0.7} />
        <group position={[-0.45, 0, -0.1]}><Box p={[0, 0.17, 0]} s={[0.42, 0.34, 0.34]} c="#8a8e94" m={0.6} r={0.3} rad={0.02} /><Box p={[0, 0.17, 0.172]} s={[0.3, 0.2, 0.004]} c="#3a1a10" r={0.1} rad={0.004} e="#ff6a1a" ei={0.5 + 0.3 * into * (1 - out)} /></group>
        {[0, 1].map((i) => { const x = lerp(0.0 + 0.12 * i, -0.45 + 0.08 * i, into * (1 - out)) + 0.25 * out; return roll < 0.3 && <group key={i} position={[x, 0.03 + 0.12 * into * (1 - out), 0.05]} rotation={[0, 0, Math.PI / 2]}><Slice p={[0, 0, 0]} s={0.6} stale={out} th={0.06} /></group>; })}
        {roll > 0.02 && <group position={[0.25 + 0.1 * Math.sin(roll * 9), 0.06, 0.05]}><Cyl p={[0, 0, 0]} r={0.035} h={0.5} c="#c9955a" rough={0.6} rot={[Math.PI / 2, 0, 0]} />
          {Array.from({ length: Math.round(roll * 70) }, (_, i) => <mesh key={i} position={[-0.12 + 0.24 * rnd(i), -0.03 + 0.03 * rnd(i + 11) * (1 - Math.abs(rnd(i) - 0.5) * 2), -0.15 + 0.3 * rnd(i + 2)]}><dodecahedronGeometry args={[0.014, 0]} /><meshStandardMaterial color="#e2b86a" /></mesh>)}</group>}
        <group position={[0.4, 0.03, 0.2]}><Cyl p={[0, 0.006, 0]} r={0.16} h={0.012} c="#f4f1ea" rough={0.3} /><mesh position={[0, 0.03, 0]} scale={[1.4, 0.35, 1]}><sphereGeometry args={[0.09, 24, 14]} /><meshStandardMaterial color="#c9862e" roughness={0.8} /></mesh>
          {fall > 0.02 && Array.from({ length: 50 }, (_, i) => { const u = (fall * 1.6 + rnd(i)) % 1; return <mesh key={i} position={[-0.12 + 0.24 * rnd(i + 5), lerp(0.3, 0.07, u), -0.07 + 0.14 * rnd(i + 9)]}><dodecahedronGeometry args={[0.012, 0]} /><meshStandardMaterial color="#e2b86a" /></mesh>; })}</group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={5.4} txt="HEELS = PANKO" col={AMB} />} />;
};
// 16:50 · LA REVIVIDA: tres gotitas sobre la corteza opaca, la tapa baja sobre la plancha, sube el vapor y la corteza vuelve a brillar
export const D_revive: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.6, 1.1], [0, 0.16, 0]), C([0.18, 0.58, 1.04], [0, 0.16, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.6 }}
    scene={(tt) => { const dr = eio(tt, 0.4, 1.4), lid = eio(tt, 1.6, 2.2) * (1 - eio(tt, 4.4, 5.0)), shine = eio(tt, 4.6, 5.6);
      return <>
        <Board w={1.2} d={0.6} c="#6b4a2e" />
        <Box p={[0, 0.05, 0]} s={[0.7, 0.05, 0.45]} c="#2b2c2f" m={0.7} r={0.45} rad={0.012} />
        <group position={[0, 0.075, 0]}><Box p={[0, 0.07, 0]} s={[0.36, 0.14, 0.2]} c={col("#a07a52", "#c46a1e", shine)} r={lerp(0.95, 0.25, shine)} rad={0.04} />
          <mesh position={[0, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.1, 0.1, 0.36, 24, 1, false, 0, Math.PI]} /><meshPhysicalMaterial color={col("#a07a52", "#c46a1e", shine)} roughness={lerp(0.95, 0.2, shine)} clearcoat={shine} /></mesh></group>
        {[0, 1, 2].map((i) => { const u = eio(tt, 0.4 + 0.3 * i, 0.8 + 0.3 * i); return u < 0.98 && <Drop key={i} p={[-0.08 + 0.08 * i, lerp(0.5, 0.25, u), 0]} s={0.8} op={0.85} />; })}
        {dr > 0.9 && lid < 0.5 && [0, 1, 2].map((i) => <mesh key={"w" + i} position={[-0.08 + 0.08 * i, 0.252, 0]}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color={WATER} roughness={0.05} transparent opacity={0.7 * (1 - lid)} /></mesh>)}
        <group position={[0, lerp(0.75, 0.33, lid), 0]}><mesh scale={[1.5, 0.55, 1]}><sphereGeometry args={[0.26, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#e8f2f4" transmission={0.5} roughness={0.15} transparent opacity={0.4} depthWrite={false} side={THREE.DoubleSide} /></mesh>
          <Cyl p={[0, 0.15, 0]} r={0.03} h={0.04} c="#2a1810" rough={0.5} /></group>
        <Steam p={[0, 0.3, 0]} t={tt} k={lid} s={0.6} />
        {shine > 0.3 && <mesh position={[0.06, 0.26, 0.08]} rotation={[-0.6, 0, 0]}><circleGeometry args={[0.03, 16]} /><meshBasicMaterial color="#fff6dc" transparent opacity={0.6 * shine} /></mesh>}
      </>; }}
    over={(tt) => <Ink tt={tt} at={5.0} txt="LIKE NEW · ONE MINUTE" col={AMB} />} />;
};
// 18:05 · LAS RAÍCES: la feta se parte al medio en corte; debajo del puntito verde, las raíces grises bajan ramificándose por toda la miga
export const D_roots: F = ({ t, h }) => {
  const roots = useMemo(() => { const out: THREE.Vector3[][] = []; for (let r = 0; r < 9; r++) { const pts = [new THREE.Vector3(0, 0.36, 0)]; let x = 0, y = 0.36; for (let j = 0; j < 6; j++) { x = cl((x + (rnd(r * 9 + j) - 0.5) * 0.05 + (r - 4) * 0.006 + 0.1) / 0.2) * 0.2 - 0.1; y -= 0.03 + 0.012 * rnd(r + j * 3); pts.push(new THREE.Vector3(x, y, 0.02)); } out.push(pts); } return out; }, []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.42, 1.25], [0, 0.3, 0]), C([0.16, 0.42, 1.18], [0, 0.3, 0]), 10)}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.35 }}
    scene={(tt) => { const sp = eio(tt, 0.6, 1.6), gr = eio(tt, 2.0, 5.5);
      return <>
        <Board w={1.2} d={0.5} />
        <group position={[0, 0.024, 0]} scale={1.5}><Slice p={[0, 0, 0]} th={0.04} />
          <Spot p={[0, 0.23, 0.022]} k={sp} r={0.035} />
          {roots.map((pts, i) => { const n = Math.max(2, Math.round(2 + gr * (pts.length - 2))); return <mesh key={i}><tubeGeometry args={[new THREE.CatmullRomCurve3(pts.slice(0, n)), 20, 0.0025, 6, false]} /><meshStandardMaterial color="#6f7f6a" roughness={1} /></mesh>; })}</group>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.0} txt="THE SPOT YOU SEE" col={AMB} y={250} /><Ink tt={tt} at={4.0} txt="THE ROOTS YOU DON'T" col="#ff8a7a" /></>} />;
};
// 19:30 · LLUEVE ADENTRO DE LA BOLSA: el pan recién horneado echa vapor en la bolsa cerrada; arriba se arma una nube y llueve sobre la corteza
export const D_warmbag: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.55, 1.25], [0, 0.2, 0]), C([0.2, 0.53, 1.18], [0, 0.2, 0]), 10)}
    set={{ spot: [0, 0.1, 0] as V, spotK: 0.65, warm: 0.7 }}
    scene={(tt) => { const cl1 = eio(tt, 1.0, 2.6), rain = eio(tt, 2.8, 3.4);
      return <>
        <Board w={1.3} d={0.6} />
        <group scale={1.25}><Loaf p={[0, 0.02, 0]} L={0.5} />
          <Steam p={[0, 0.2, 0]} t={tt} k={1 - cl1 * 0.6} s={0.4} />
          {[[-0.12, 0], [0, 0.02], [0.12, 0]].map(([x, z], i) => <mesh key={i} position={[x, 0.31, z]} scale={cl1}><sphereGeometry args={[0.055, 16, 12]} /><meshStandardMaterial color="#eef2f6" roughness={1} transparent opacity={0.9} /></mesh>)}
          {rain > 0.02 && Array.from({ length: 14 }, (_, i) => { const u = (tt * 0.5 + rnd(i)) % 1; return <mesh key={i} position={[-0.26 + 0.52 * rnd(i + 3), lerp(0.25, 0.03, u), 0.128]}><capsuleGeometry args={[0.013, 0.045, 6, 8]} /><meshStandardMaterial color="#4aa8ff" emissive="#2a7ad6" emissiveIntensity={0.3} transparent opacity={0.95 * rain} /></mesh>; })}
          <Bag p={[0, 0.02, 0]} L={0.58} fog={cl1 * 0.08} /></group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.0} txt="ITS OWN RAIN" col="#8fcfff" />} />;
};
// 21:00 · HARINA O MOHO: la lupa pasa sobre la corteza: polvo blanco parejo y seco; sigue hasta un círculo con pelusa que crece
export const D_powder: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.75, 1.05], [0, 0.12, 0]), C([0.18, 0.72, 1.0], [0, 0.12, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const mv = eio(tt, 0.6, 3.6);
      return <>
        <Board w={1.3} d={0.6} />
        <group position={[0, 0.03, 0]}><Box p={[0, 0.06, 0]} s={[0.9, 0.12, 0.34]} c={CRUST} r={0.7} rad={0.05} />
          {Array.from({ length: 60 }, (_, i) => <mesh key={i} position={[-0.42 + 0.4 * rnd(i), 0.123, -0.15 + 0.3 * rnd(i + 7)]}><sphereGeometry args={[0.006, 6, 4]} /><meshStandardMaterial color="#fbfaf5" roughness={1} /></mesh>)}
          <Spot p={[0.22, 0.123, 0]} rot={[-Math.PI / 2, 0, 0]} k={eio(tt, 3.0, 5.0)} r={0.07} c="#5f7a8a" /></group>
        <group position={[lerp(-0.2, 0.22, mv), 0.3, 0.02]}><mesh rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.11, 0.012, 10, 40]} /><meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.3} /></mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.105, 40]} /><meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.02} transparent opacity={0.2} /></mesh>
          <Cyl p={[0.2, 0, 0.0]} r={0.016} h={0.2} c="#5a3a22" rough={0.6} rot={[0, 0, Math.PI / 2]} /></group>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.0} txt="FLOUR: EVEN · DRY · DAY 1" col="#ffffff" y={250} size={70} /><Ink tt={tt} at={3.8} txt="MOLD: FUZZY · A CIRCLE" col="#ff8a7a" size={70} /></>} />;
};
// 21:20 · FLORIDA = OSAKA EN JUNIO: el alfiler cae sobre Florida, la gota del higrómetro sube al 90 % y el mapa se tiñe de lluvia de ciruelas
export const D_florida: F = ({ t, h }) => {
  const map = useMemo(() => mk(512, 256, (g) => { g.fillStyle = "#6fa8cc"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#c9a866"; g.beginPath(); g.moveTo(60, 40); g.lineTo(330, 40); g.lineTo(330, 120); g.lineTo(300, 130); g.lineTo(310, 220); g.lineTo(290, 230); g.lineTo(270, 140); g.lineTo(80, 140); g.closePath(); g.fill(); g.fillStyle = "#3a2a18"; g.font = "900 30px Arial"; g.fillText("USA", 150, 100); g.fillStyle = "#ffffff"; g.font = "900 22px Arial"; g.fillText("FLORIDA", 320, 175); }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.8, 1.0], [0, 0.1, 0]), C([0.15, 0.78, 0.95], [0, 0.1, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const pin = pop(tt, 0.6), hum = eio(tt, 1.4, 3.4);
      return <>
        <Box p={[0, 0.015, 0]} s={[1.34, 0.03, 0.69]} c="#5a3a22" r={0.8} rad={0.01} /><mesh position={[0, 0.031, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.3, 0.65]} /><meshStandardMaterial map={map} color={col("#ffffff", "#c8e0d0", hum * 0.3)} roughness={0.8} /></mesh>
        <Pop k={pin} s={1.6} p={[0.27, 0.03, 0.12]}><Cyl p={[0, 0.08, 0]} r={0.004} h={0.16} c="#d5d9dd" m={0.9} rough={0.2} /><mesh position={[0, 0.17, 0]}><sphereGeometry args={[0.03, 16, 12]} /><meshStandardMaterial color={RED} roughness={0.3} /></mesh></Pop>
        <group position={[-0.5, 0.03, 0.05]} scale={0.7}><Cyl p={[0, 0.25, 0]} r={0.05} h={0.48} c="#f4f6f8" rough={0.1} op={0.5} /><Cyl p={[0, 0.03 + 0.21 * hum, 0]} r={0.04} h={0.42 * hum + 0.02} c="#3a8ad6" rough={0.2} /></group>
        {hum > 0.3 && Array.from({ length: 30 }, (_, i) => { const u = (tt * 1.0 + rnd(i)) % 1; return <mesh key={i} position={[-0.6 + 1.2 * rnd(i + 1), lerp(0.7, 0.01, u), -0.3 + 0.6 * rnd(i + 2)]}><capsuleGeometry args={[0.003, 0.04, 4, 6]} /><meshStandardMaterial color={WATER} transparent opacity={0.7 * hum} /></mesh>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.0} txt="OSAKA IN JUNE · ALL YEAR" col={AMB} />} />;
};
// 22:10 · DE A PARES: las fetas se juntan de a dos y un rollo de film gira envolviendo cada par como un regalito; los paquetes caen en la bolsa con fecha
export const D_pairs: F = ({ t, h }) => {
  const date = useMemo(() => cardTex(["OCT 31"], { bg: "#ffffff", fg: "#2a2a2a", w: 256, h: 96 }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.65, 1.35], [0, 0.2, 0]), C([0.2, 0.63, 1.28], [0, 0.2, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => <>
      <Board w={1.4} d={0.7} />
      {[0, 1, 2].map((p) => { const j = eio(tt, 0.4 + 0.9 * p, 0.8 + 0.9 * p), w = eio(tt, 0.8 + 0.9 * p, 1.3 + 0.9 * p), d = eio(tt, 3.6 + 0.3 * p, 4.3 + 0.3 * p);
        return <group key={p} position={[lerp(-0.4 + 0.3 * p, 0.42, d), 0.03 + 0.25 * Math.sin(Math.PI * d), lerp(0.05, -0.05, d)]} rotation={[-Math.PI / 2, 0, 0]} scale={1 - 0.3 * d}>
          {[0, 1].map((s) => <Slice key={s} p={[0, -0.12, 0.016 + (s ? 1 : -1) * lerp(0.05, 0.016, j)]} />)}
          {w > 0.02 && <mesh position={[0, 0, 0.016]} rotation={[0, 0, w * Math.PI * 2]}><boxGeometry args={[0.27, 0.27, 0.075 * w]} /><meshPhysicalMaterial color="#f4fbff" transmission={0.7} roughness={0.08} transparent opacity={0.35} depthWrite={false} /></mesh>}</group>; })}
      <group position={[0.42, 0.03, -0.05]}><mesh position={[0, 0.12, 0]}><boxGeometry args={[0.36, 0.24, 0.3]} /><meshPhysicalMaterial color="#eef8ff" transmission={0.6} roughness={0.15} transparent opacity={0.3} depthWrite={false} /></mesh>
        <Box p={[0, 0.25, 0]} s={[0.36, 0.02, 0.3]} c="#3a8ad6" r={0.4} rad={0.004} />
        <Pop k={pop(tt, 4.8)} p={[0, 0.12, 0.152]}><mesh><planeGeometry args={[0.2, 0.075]} /><meshStandardMaterial map={date} /></mesh></Pop></group>
    </>}
    over={(tt) => <Ink tt={tt} at={1.4} txt="TWO AT A TIME" col={AMB} />} />;
};
// 23:40 · LA RUEDA DE LA SEMANA: una bandeja giratoria con siete gajos; en cada día sale una feta distinta (tostada, sándwich, tamago sando, tostada francesa) y el tacho queda vacío
export const D_week: F = ({ t, h }) => {
  const D = useMemo(() => ["WED", "THU", "FRI", "SAT", "SUN", "MON", "WED"].map((x) => cardTex([x], { bg: "#8a1f1f", fg: "#fff3d6", w: 160, h: 80 })), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.9, 1.2], [0, 0.1, 0]), C([0.2, 0.88, 1.14], [0, 0.1, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.15, warm: 0.15 }}
    scene={(tt) => { const rot = -eio(tt, 0.5, 7.0) * Math.PI * 2 * 6 / 7;
      return <>
        <Board w={1.4} d={0.8} c="#8a6a4a" />
        <group position={[0, 0.03, 0]} rotation={[0, rot, 0]}><Cyl p={[0, 0.015, 0]} r={0.42} h={0.03} c="#b89a74" rough={0.6} />
          {D.map((m, i) => { const a = (i / 7) * Math.PI * 2, x = 0.3 * Math.sin(a), z = 0.3 * Math.cos(a), here = cl(1 - Math.abs(((i / 7) * Math.PI * 2 + rot + Math.PI * 4) % (Math.PI * 2) - 0) * 2);
            return <group key={i} position={[x, 0.032, z]} rotation={[0, a, 0]}>
              <Box p={[0, 0.0, 0]} s={[0.003, 0.004, 0.24]} c="#b8a88a" r={0.6} rad={0.001} rot={[0, Math.PI / 7, 0]} />
              <mesh position={[0, 0.002, 0.08]} rotation={[-Math.PI / 2, 0, Math.PI]}><planeGeometry args={[0.1, 0.05]} /><meshStandardMaterial map={m} emissive="#ff6a3a" emissiveIntensity={0.4 * here} emissiveMap={m} /></mesh>
              <group position={[0, 0.01, -0.04]} rotation={[-Math.PI / 2, 0, 0]} scale={0.62}>{i === 4 ? <><Slice p={[0, -0.12, 0]} /><Box p={[0, 0, 0.02]} s={[0.2, 0.2, 0.02]} c="#f2d46a" r={0.6} rad={0.01} /></> : <Slice p={[0, -0.12, 0]} stale={0} />}</group></group>; })}
        </group>
        <group position={[0.6, 0.02, 0.3]}><Cyl p={[0, 0.08, 0]} r={0.07} r2={0.06} h={0.16} c="#8a9096" m={0.7} rough={0.35} /><Cyl p={[0, 0.162, 0]} r={0.06} h={0.004} c="#2a2a2a" rough={0.9} /></group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={6.6} txt="NOT ONE SLICE THROWN AWAY" col={AMB} size={72} />} />;
};
// 24:20 · LA CUENTA DEL TACHO: un tercio del pan se separa y cae al tacho; las monedas se apilan al lado hasta $69 y una segunda torre hasta $140
export const D_math: F = ({ t, h }) => {
  const A = useMemo(() => cardTex(["$69 / YEAR"], { bg: "#2a1e16", fg: "#ff6a5a", w: 320, h: 96 }), []), B = useMemo(() => cardTex(["$140"], { bg: "#2a1e16", fg: "#ff6a5a", w: 256, h: 96 }), []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.58, 1.25], [0, 0.22, 0]), C([0.14, 0.56, 1.18], [0, 0.22, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const sp = eio(tt, 0.4, 1.2), fall = eio(tt, 1.3, 2.3), s1 = eio(tt, 2.4, 4.6), s2 = eio(tt, 4.8, 6.4);
      return <>
        <Board w={1.5} d={0.7} />
        <Loaf p={[-0.5, 0.024, -0.05]} L={0.32} />
        <group position={[lerp(-0.14 + 0.06 * sp, -0.3, fall), 0.024 + 0.3 * Math.sin(Math.PI * fall) - 0.15 * fall, lerp(0, -0.25, fall)]} rotation={[0, 0, fall * 1.5]}><Loaf p={[0, 0, 0]} L={0.2} mold={1} /></group>
        <group position={[-0.3, 0, -0.25]}><Cyl p={[0, 0.1, 0]} r={0.11} r2={0.09} h={0.2} c="#8a9096" m={0.7} rough={0.35} /></group>
        {Array.from({ length: Math.round(s1 * 7) }, (_, i) => <Coin key={i} p={[-0.04, 0.035 + 0.02 * i, 0.08]} s={1.0} />)}
        {Array.from({ length: Math.round(s2 * 14) }, (_, i) => <Coin key={"b" + i} p={[0.26, 0.035 + 0.02 * i, 0.08]} s={1.0} />)}
        <Pop k={pop(tt, 4.4)} p={[-0.04, 0.36, 0.06]}><mesh><planeGeometry args={[0.3, 0.09]} /><meshStandardMaterial map={A} /></mesh></Pop>
        <Pop k={pop(tt, 6.2)} p={[0.26, 0.4, 0.14]}><mesh><planeGeometry args={[0.24, 0.09]} /><meshStandardMaterial map={B} /></mesh></Pop>
      </>; }}
    over={(tt) => <Ink tt={tt} at={6.8} txt="WITH THE SAME-DAY SLICE: $0" col="#7fe0a0" size={70} />} />;
};
