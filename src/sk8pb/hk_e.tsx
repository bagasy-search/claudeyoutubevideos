// so29e · los componentes ÚNICOS del video del jengibre (uno por minuto; ninguno se repite en la tanda so29, ver D:/rtmp/so29_COMPONENTES.md).
// Maqueta sobre la mesada (hk.tsx). Cada uno = UNA idea con un objeto: la cucharita, la raíz con nudillos, el rallador, el frasco y el freezer.
import React, { useMemo } from "react";
import * as THREE from "three";
import { F, Hero, C, lerp, pop, Pop, Ink, cardTex, Steam, Coin,
  cl, eio, orbita, Box, Cyl, AMB, V } from "./hk";
import { mk } from "./casa3d";

const SKIN = "#c49a62", YEL = "#f2cf48", BOARD = "#c9955a", PINK = "#e87a96", STEEL = "#d5d9dd", WATER = "#8fcfff", COPPER = "#c8743a";
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };   // semilla fija

// raíz de jengibre: cuerpo + dedos (cápsulas) con nudillos; peel = cuánto de piel quedó amarilla; young = rosa y pálida
const FINGERS: [number, number, number, number][] = [[0.0, 0.0, 0, 0.16], [0.12, 0.03, 0.7, 0.12], [-0.12, 0.02, -0.6, 0.13], [0.06, 0.02, 1.4, 0.1], [-0.05, 0.02, -1.5, 0.1]];
const Ginger: React.FC<{ p: V; s?: number; rot?: V; peel?: number; young?: number; n?: number; wr?: number; fat?: number; tint?: string }> = ({ p, s = 1, rot = [0, 0, 0], peel = 0, young = 0, n = 5, wr = 0, fat = 1, tint }) => {
  const sk = tint ?? col(col(SKIN, "#f1e4cf", young), "#9a8466", wr), inn = YEL;
  return <group position={p} rotation={rot} scale={s}>
    <mesh scale={[1.5, 0.75 * fat, 0.9 * fat]}><sphereGeometry args={[0.07, 24, 16]} /><meshPhysicalMaterial color={col(sk, inn, peel)} roughness={lerp(0.85 - 0.3 * (1 - wr), 0.25, peel)} clearcoat={peel * 0.8} /></mesh>
    {FINGERS.slice(0, n).map(([x, z, a, L], i) => <group key={i} position={[x, 0.015, z]} rotation={[0, a, 0.55 + 0.1 * i]}>
      <mesh position={[0, L / 2, 0]} scale={[fat, 1, fat]}><capsuleGeometry args={[0.032 - 0.004 * (i % 2), L, 8, 14]} /><meshPhysicalMaterial color={col(sk, inn, peel)} roughness={lerp(0.85, 0.25, peel)} clearcoat={peel * 0.8} /></mesh>
      <mesh position={[0, L * 0.45, 0]} scale={[1.15 * fat, 0.35, 1.15 * fat]}><sphereGeometry args={[0.034, 12, 8]} /><meshStandardMaterial color={col(col(sk, "#8a6a42", 0.35), inn, peel)} roughness={0.8} /></mesh>
      {young > 0.02 && <mesh position={[0, L + 0.035, 0]}><sphereGeometry args={[0.03, 14, 10]} /><meshStandardMaterial color={PINK} emissive={PINK} emissiveIntensity={0.3 * young} roughness={0.5} /></mesh>}
      {wr > 0.05 && [0, 1, 2].map((j) => <mesh key={j} position={[0, L * (0.2 + 0.25 * j), 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.031, 0.003 * wr, 6, 18]} /><meshStandardMaterial color="#7a6446" /></mesh>)}
    </group>)}
  </group>;
};
// cucharita de acero (cazuela + mango)
const Spoon: React.FC<{ p: V; rot?: V; s?: number }> = ({ p, rot = [0, 0, 0], s = 1 }) =>
  <group position={p} rotation={rot} scale={s}>
    <mesh scale={[1, 0.35, 0.7]}><sphereGeometry args={[0.045, 22, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color={STEEL} metalness={0.95} roughness={0.12} side={THREE.DoubleSide} /></mesh>
    <Box p={[0.12, 0.012, 0]} s={[0.18, 0.006, 0.016]} c={STEEL} m={0.95} r={0.12} rad={0.003} />
  </group>;
// cuchillo de cocina
const Knife: React.FC<{ p: V; rot?: V; s?: number }> = ({ p, rot = [0, 0, 0], s = 1 }) =>
  <group position={p} rotation={rot} scale={s}>
    <mesh><boxGeometry args={[0.26, 0.004, 0.05]} /><meshStandardMaterial color={STEEL} metalness={0.95} roughness={0.15} /></mesh>
    <Box p={[0.19, 0, 0]} s={[0.12, 0.022, 0.028]} c="#2a2018" r={0.6} rad={0.008} />
  </group>;
// tira de cáscara: lámina curvada (gruesa con amarillo, o fina como papel)
const Peel: React.FC<{ p: V; rot?: V; thick?: number; s?: number }> = ({ p, rot = [0, 0, 0], thick = 0, s = 1 }) =>
  <group position={p} rotation={rot} scale={s}>
    <mesh rotation={[0, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.05, 12, 1, true, 0, Math.PI * 0.9]} /><meshStandardMaterial color={SKIN} roughness={0.85} side={THREE.DoubleSide} transparent opacity={thick ? 1 : 0.85} /></mesh>
    {thick > 0 && <mesh scale={[0.85, 1, 0.85]}><cylinderGeometry args={[0.03, 0.03, 0.05, 12, 1, true, 0, Math.PI * 0.9]} /><meshStandardMaterial color={YEL} roughness={0.5} side={THREE.DoubleSide} /></mesh>}
  </group>;
const Board: React.FC<{ p?: V; w?: number; d?: number; c?: string }> = ({ p = [0, 0, 0], w = 1.2, d = 0.6, c = BOARD }) =>
  <Box p={[p[0], p[1] + 0.012, p[2]]} s={[w, 0.024, d]} c={c} r={0.75} rad={0.01} />;
const Hand: React.FC<{ p: V; rot?: V; s?: number; c?: string; curl?: number }> = ({ p, rot = [0, 0, 0], s = 1, c = "#f1d9c4", curl = 0 }) =>
  <group position={p} rotation={rot} scale={s}>
    <Box p={[0, 0, 0]} s={[0.16, 0.04, 0.14]} c={c} r={0.6} rad={0.02} />
    {[0, 1, 2, 3].map((i) => <group key={i} position={[0.08, 0, -0.05 + 0.034 * i]} rotation={[0, 0, -curl * 1.3]}><mesh position={[0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.014, 0.07, 6, 10]} /><meshStandardMaterial color={c} roughness={0.6} /></mesh></group>)}
    <mesh position={[0.04, 0, 0.09]} rotation={[0, -0.6, Math.PI / 2]}><capsuleGeometry args={[0.016, 0.05, 6, 10]} /><meshStandardMaterial color={c} roughness={0.6} /></mesh>
    <Cyl p={[-0.13, 0, 0]} r={0.045} h={0.08} c="#7a5a8a" rough={0.9} rot={[0, 0, Math.PI / 2]} />
  </group>;
const Drop: React.FC<{ p: V; s?: number; op?: number; c?: string }> = ({ p, s = 1, op = 0.85, c = WATER }) =>
  <group position={p} scale={s}><mesh><sphereGeometry args={[0.02, 14, 10]} /><meshStandardMaterial color={c} roughness={0.05} transparent opacity={op} /></mesh>
    <mesh position={[0, 0.022, 0]}><coneGeometry args={[0.014, 0.03, 12]} /><meshStandardMaterial color={c} roughness={0.05} transparent opacity={op} /></mesh></group>;

// 0:20 · LA MONTAÑITA: el cuchillo baja una y otra vez; la raíz se achica y al lado crece una montaña de cáscaras gruesas con amarillo
export const E_pile: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 0.6, 1.25], [0, 0.12, 0]), C([0.3, 0.57, 1.15], [0, 0.12, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.5 }}
    scene={(tt) => { const k = eio(tt, 0.5, 6.0), cut = Math.abs(Math.sin(tt * 4.5));
      return <>
        <Board w={1.3} d={0.7} />
        <Ginger p={[-0.2, 0.07, 0]} s={lerp(2.2, 1.45, k)} peel={k} />
        <Knife p={[-0.08, 0.1 + 0.12 * cut, 0.04]} rot={[0.3, 0.4, -0.4 * cut]} s={1.5} />
        {Array.from({ length: Math.round(k * 26) }, (_, i) => { const r = 0.11 * Math.sqrt(1 - i / 30); return <Peel key={i} thick={1} s={1.3} p={[0.3 + r * Math.cos(i * 2.4), 0.03 + 0.009 * i * (1 - i / 60), r * Math.sin(i * 2.4)]} rot={[rnd(i) * 3, i, rnd(i + 3) * 3]} />; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.4} txt="A LITTLE MOUNTAIN · IN THE GARBAGE" col="#ff8a7a" size={72} />} />;
};
// 1:48 · EL PISO DE TIERRA: la cocina de Osaka en maqueta: piso de tierra apisonada, el escalón de madera, la cocinita de barro con la olla
export const E_dirtfloor: F = ({ t, h }) => {
  const earth = useMemo(() => mk(256, 256, (g) => { g.fillStyle = "#4e3a28"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${30 + (i * 7) % 90},${22 + (i * 3) % 60},${14 + (i * 5) % 30},.7)`; g.fillRect((i * 97) % 256, (i * 57 + (i >> 4)) % 256, 2 + (i % 3), 2 + (i % 2)); } }), []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.0, 0.62, 1.35], [0, 0.08, 0.05]), C([0.16, 0.6, 1.28], [0, 0.08, 0.05]), 10)}
    set={{ spot: [-0.2, 0.2, 0] as V, spotK: 0.4, warm: 0.8 }}
    scene={(tt) => { const f = eio(tt, 1.2, 2.2);
      return <>
        <mesh position={[-0.15, 0.028, 0.25]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.3, 1.3]} /><meshStandardMaterial map={earth} roughness={1} /></mesh>
        {Array.from({ length: 40 }, (_, i) => <mesh key={"pb" + i} position={[-0.75 + 0.95 * rnd(i), 0.034, 0.25 + 0.5 * rnd(i + 9)]} rotation={[i, i * 2, 0]}><dodecahedronGeometry args={[0.008 + 0.012 * rnd(i + 4), 0]} /><meshStandardMaterial color={rnd(i + 2) > 0.5 ? "#6a5440" : "#3a2c20"} roughness={1} /></mesh>)}
        <Box p={[0.45, 0.06, 0]} s={[0.4, 0.12, 0.8]} c="#a8743a" r={0.6} rad={0.008} />
        <Box p={[0.45, 0.14, 0]} s={[0.4, 0.04, 0.8]} c="#c9a070" r={0.5} rad={0.008} />
        <group position={[-0.35, 0.012, -0.1]}><Cyl p={[0, 0.1, 0]} r={0.16} r2={0.18} h={0.2} c="#b07a52" rough={0.95} />
          <Box p={[0, 0.06, 0.16]} s={[0.1, 0.07, 0.04]} c="#1a0e08" r={0.9} rad={0.01} e="#ff6a1a" ei={0.8 + 0.3 * Math.sin(tt * 2)} />
          <Cyl p={[0, 0.25, 0]} r={0.13} r2={0.1} h={0.1} c="#2a2a2c" m={0.6} rough={0.4} /><Steam p={[0, 0.32, 0]} t={tt} k={0.8} s={0.5} /></group>
        <Ginger p={[0.4, 0.19, 0.05]} s={1.5} peel={f * 0.4} />
        <Spoon p={[0.5, 0.18, -0.16]} rot={[0, 0.6, 0]} s={1.6} />
        <pointLight position={[-0.35, 0.25, 0.1]} intensity={0.6} distance={0.9} color="#ff9a4a" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.0} txt="OSAKA · 1957 · A FLOOR OF EARTH" col={AMB} size={74} />} />;
};
// 2:11 · EL CAMBIO DE MANO: el cuchillo sube y se va; la cucharita baja y se apoya en la palma abierta
export const E_spoonswap: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.6, 1.0], [0, 0.18, 0]), C([0.18, 0.58, 0.95], [0, 0.18, 0]), 10)}
    set={{ spot: [0, 0.1, 0] as V, spotK: 0.4, warm: 0.6 }}
    scene={(tt) => { const up = eio(tt, 0.6, 1.8), dn = eio(tt, 2.0, 3.4), cl1 = eio(tt, 3.3, 3.8);
      return <>
        <Board w={1.1} d={0.6} />
        <Hand p={[0, 0.16, 0.05]} rot={[0, 0, 0]} s={1.6} curl={0.4 * (1 - up) + 0.35 * cl1} c="#f3dcc6" />
        <Knife p={[0.08, 0.2 + 0.7 * up, 0.04]} rot={[0, 0.2, -0.3 + 1.2 * up]} s={1.4} />
        <Spoon p={[0.1, lerp(0.9, 0.22, dn), 0.03]} rot={[0, 0.2, lerp(1.0, 0, dn)]} s={1.7} />
        <pointLight position={[0.1, 0.5, 0.3]} intensity={0.6 * dn} distance={1} color="#fff1c8" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.2} txt="NOT THE KNIFE · THE SPOON" col={AMB} />} />;
};
// 2:25 · COMO MANTECA DE LA TOSTADA: el borde de la cucharita raspa y la piel sale en rulitos finos como papel; debajo, amarillo brillante
export const E_scrape: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 0.42, 0.8], [0, 0.12, 0]), C([0.25, 0.4, 0.74], [0, 0.12, 0]), 10)}
    set={{ spot: [0, 0.1, 0] as V, spotK: 0.45, warm: 0.6 }}
    scene={(tt) => { const k = eio(tt, 0.5, 5.5), sw = Math.sin(tt * 5);
      return <>
        <Board w={1.0} d={0.5} />
        <group position={[0, 0.1, 0]} rotation={[0, 0, 0.1]} scale={2.4}>
          <mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.035, 0.18, 10, 20]} /><meshPhysicalMaterial color={YEL} roughness={0.2} clearcoat={0.9} /></mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.11 * k, 0, 0]} scale={[1, Math.max(0.02, 1 - k), 1]}><capsuleGeometry args={[0.0365, 0.18 * (1 - k) + 0.001, 10, 20]} /><meshStandardMaterial color={SKIN} roughness={0.9} /></mesh></group>
        <Spoon p={[0.22 - 0.5 * k + 0.02 * sw, 0.2, 0.05]} rot={[0.4, Math.PI, -0.5]} s={1.8} />
        {Array.from({ length: Math.round(k * 12) }, (_, i) => <Peel key={i} s={1.6} p={[0.25 - 0.04 * i, 0.03 + 0.02 * rnd(i), 0.18 + 0.05 * rnd(i + 2)]} rot={[rnd(i) * 2, i * 0.7, 1.2]} />)}
        <Box p={[-0.38, 0.03, -0.12]} s={[0.2, 0.012, 0.14]} c="#e8b86a" r={0.6} rad={0.01} /><Box p={[-0.38, 0.04, -0.12]} s={[0.16, 0.004, 0.1]} c="#f8e48a" r={0.3} rad={0.002} />
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.0} txt="THIN AS PAPER · BRIGHT YELLOW" col={AMB} />} />;
};
// 2:51 · DIEZ SEGUNDOS: la raíz gira sola y la cucharita la pela en espiral; un segundero de 10 da la vuelta
export const E_tenseconds: F = ({ t, h }) => {
  const face = useMemo(() => mk(256, 256, (g) => { g.fillStyle = "#fbf3df"; g.beginPath(); g.arc(128, 128, 124, 0, Math.PI * 2); g.fill(); g.fillStyle = "#3a2a18"; g.font = "900 34px Arial"; g.textAlign = "center"; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; g.fillText(String(i === 0 ? 10 : i), 128 + 92 * Math.sin(a), 140 - 92 * Math.cos(a)); } }), []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.5, 1.15], [0, 0.22, 0]), C([0.18, 0.48, 1.08], [0, 0.22, 0]), 10)}
    set={{ spot: [0, 0.1, 0] as V, spotK: 0.35 }}
    scene={(tt) => { const k = eio(tt, 0.6, 6.6);
      return <>
        <Board w={1.2} d={0.6} />
        <group position={[-0.15, 0.2, 0]} rotation={[0, tt * 3, 0]}><Ginger p={[0, 0, 0]} s={1.9} peel={k} n={3} /></group>
        <Spoon p={[0.0, 0.22 + 0.05 * Math.sin(tt * 9), 0.08]} rot={[0.3, Math.PI, -0.6]} s={1.6} />
        {Array.from({ length: Math.round(k * 16) }, (_, i) => { const a = i * 0.8; return <Peel key={i} s={1.2} p={[-0.15 + 0.2 * Math.cos(a), 0.04 + 0.01 * i, 0.2 * Math.sin(a)]} rot={[0, a, 1.3]} />; })}
        <group position={[0.38, 0.3, -0.05]}><mesh><circleGeometry args={[0.15, 40]} /><meshStandardMaterial map={face} /></mesh>
          <mesh position={[0, 0, 0.002]} rotation={[0, 0, -k * Math.PI * 2]}><mesh position={[0, 0.06, 0]}><boxGeometry args={[0.008, 0.12, 0.004]} /><meshStandardMaterial color="#d62828" /></mesh></mesh>
          <Cyl p={[0, 0, -0.012]} r={0.16} h={0.02} c="#8a1f1f" rough={0.4} rot={[Math.PI / 2, 0, 0]} /></group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={6.8} txt="ONE FINGER · 10 SECONDS" col={AMB} />} />;
};
// 3:16 · DOS RAÍCES IGUALES: a la izquierda pela el cuchillo, a la derecha la cuchara; las dos pilas crecen y la del cuchillo se come un tercio
export const E_twopieces: F = ({ t, h }) => {
  const K = useMemo(() => cardTex(["KNIFE"], { bg: "#8a1f1f", fg: "#fff3d6", w: 192, h: 80 }), []), S = useMemo(() => cardTex(["SPOON"], { bg: "#2e5a2e", fg: "#fff3d6", w: 192, h: 80 }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.65, 1.35], [0, 0.15, 0]), C([0.18, 0.62, 1.28], [0, 0.15, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.4 }}
    scene={(tt) => { const k = eio(tt, 0.6, 5.0);
      return <>
        <Board w={1.4} d={0.7} />
        <Box p={[0, 0.03, 0]} s={[0.012, 0.012, 0.6]} c="#5a3a22" r={0.6} rad={0.004} />
        <Ginger p={[-0.35, 0.07, -0.1]} s={lerp(1.6, 1.07, k)} peel={k} />
        <Ginger p={[0.35, 0.07, -0.1]} s={lerp(1.6, 1.58, k)} peel={k} />
        {Array.from({ length: Math.round(k * 22) }, (_, i) => <Peel key={i} thick={1} s={1.2} p={[-0.32 + 0.09 * (rnd(i) - 0.5), 0.03 + 0.012 * i * 0.6, 0.18 + 0.08 * (rnd(i + 1) - 0.5)]} rot={[rnd(i) * 3, i, 1]} />)}
        {Array.from({ length: Math.round(k * 7) }, (_, i) => <Peel key={"s" + i} s={0.9} p={[0.35 + 0.05 * (rnd(i) - 0.5), 0.03 + 0.004 * i, 0.18]} rot={[0, i, 1.3]} />)}
        <mesh position={[-0.35, 0.45, -0.25]}><planeGeometry args={[0.4, 0.166]} /><meshStandardMaterial map={K} /></mesh>
        <mesh position={[0.35, 0.45, -0.25]}><planeGeometry args={[0.4, 0.166]} /><meshStandardMaterial map={S} /></mesh>
      </>; }}
    over={(tt) => <Ink tt={tt} at={4.4} txt="THE KNIFE TOOK A THIRD" col="#ff8a7a" />} />;
};
// 3:55 · MÁS FINA QUE EL PAPEL: corte de la raíz en capas; una hoja de papel baja al lado y es más gruesa que la piel
export const E_paper: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.35, 0.95], [0, 0.2, 0]), C([0.15, 0.35, 0.9], [0, 0.2, 0]), 10)}
    set={{ spot: [0, 0.1, 0] as V, spotK: 0.4 }}
    scene={(tt) => { const pp = eio(tt, 1.6, 3.0), glow = eio(tt, 3.6, 4.6);
      return <>
        <Board w={1.0} d={0.5} />
        <group position={[-0.06, 0.16, 0]} rotation={[0, -0.35, 0]} scale={1.5}>
          <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.1, 0.1, 0.32, 40, 1, true]} /><meshStandardMaterial color={SKIN} roughness={0.9} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0.161, 0, 0]} rotation={[0, Math.PI / 2, 0]}><circleGeometry args={[0.094, 40]} /><meshStandardMaterial color="#f2d24a" roughness={0.35} emissive="#ffcf3a" emissiveIntensity={0.15 + 0.6 * glow} /></mesh>
          <mesh position={[0.1615, 0, 0]} rotation={[0, Math.PI / 2, 0]}><ringGeometry args={[0.094, 0.1, 48]} /><meshStandardMaterial color="#8a5a2a" roughness={0.9} /></mesh>
          {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0.1618, 0.06 * Math.sin(i * 2.4) * rnd(i), 0.06 * Math.cos(i * 2.4) * rnd(i)]} rotation={[0, Math.PI / 2, i]}><planeGeometry args={[0.004, 0.05]} /><meshBasicMaterial color="#e2b832" /></mesh>)}
        </group>
        <group position={[0.22, lerp(0.75, 0.16, pp), 0.12]} rotation={[0, -0.35, 0]}><Box p={[0, 0, 0]} s={[0.012, 0.22, 0.16]} c="#fbfaf5" r={0.95} rad={0.001} />
          {[0, 1, 2, 3, 4].map((i) => <Box key={i} p={[0.0065, 0.07 - 0.035 * i, 0]} s={[0.001, 0.004, 0.12]} c="#9aa8c8" r={0.9} rad={0.0005} />)}</group>
        {glow > 0.1 && [0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[-0.25 + 0.08 * i, 0.4 + 0.08 * glow + 0.02 * Math.sin(tt * 3 + i), 0.05]}><torusGeometry args={[0.02, 0.003, 6, 16]} /><meshBasicMaterial color="#ffd84a" transparent opacity={0.7 * glow} /></mesh>)}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.0} txt="THE SKIN" col={AMB} y={250} /><Ink tt={tt} at={3.8} txt="RIGHT UNDER IT: THE BEST PART" col="#ffd84a" size={72} /></>} />;
};
// 4:22 · FILO CONTRA BORDE REDONDO: corte de capas; el cuchillo se hunde en lo amarillo, la cucharita resbala y se frena justo en la línea de la piel
export const E_roundedge: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.52, 1.45], [0, 0.17, 0]), C([0.08, 0.52, 1.4], [0, 0.17, 0]), 10)}
    set={{ spot: [0, 0.1, 0] as V, spotK: 0.35 }}
    scene={(tt) => { const kn = eio(tt, 0.6, 2.2), sp = eio(tt, 2.8, 4.4);
      return <>
        <Board w={1.3} d={0.5} />
        {[-0.3, 0.3].map((x, i) => <group key={i} position={[x, 0.13, 0]}><Box p={[0, 0, 0]} s={[0.4, 0.2, 0.08]} c="#e9c440" r={0.4} rad={0.004} /><Box p={[0, 0.103, 0]} s={[0.4, 0.008, 0.082]} c={SKIN} r={0.9} rad={0.001} /></group>)}
        <group position={[lerp(-0.5, -0.3, kn), 0.4 - 0.25 * kn, 0.0]} rotation={[0, 0, -0.5]}><mesh rotation={[0, 0, 0]}><coneGeometry args={[0.05, 0.2, 4]} /><meshStandardMaterial color={STEEL} metalness={0.95} roughness={0.1} /></mesh></group>
        {kn > 0.6 && <Peel p={[-0.2, 0.26, 0]} thick={1} s={2.2} rot={[0, 0, 1]} />}
        <group position={[lerp(0.1, 0.45, sp), 0.255, 0]}><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.03, 0.012, 10, 24, Math.PI]} /><meshStandardMaterial color={STEEL} metalness={0.95} roughness={0.1} /></mesh></group>
        {sp > 0.05 && <Box p={[0.1 + 0.175 * sp, 0.236, 0]} s={[0.35 * sp, 0.004, 0.084]} c="#fbe46a" r={0.2} rad={0.001} e="#ffd84a" ei={0.4} />}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.8} txt="SHARP: NEVER STOPS" col="#ff8a7a" y={250} size={72} /><Ink tt={tt} at={4.2} txt="ROUND: IT STOPS BY ITSELF" col="#7fe0a0" size={72} /></>} />;
};
// 5:01 · LA RAÍZ ES UNA MANO: la raíz se levanta, los dedos se separan y se curvan como una mano; los nudillos se encienden
export const E_hand: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.55, 1.05], [0, 0.25, 0]), C([0.18, 0.53, 1.0], [0, 0.25, 0]), 10)}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.4, warm: 0.4 }}
    scene={(tt) => { const up = eio(tt, 0.5, 2.0), kn = eio(tt, 2.5, 3.5);
      return <>
        <Board w={1.1} d={0.6} />
        <group position={[0, 0.07 + 0.18 * up, 0]} rotation={[lerp(0, -1.2, up), 0, 0]}><Ginger p={[0, 0, 0]} s={2.6} />
          {FINGERS.map(([x, z, a, L], i) => <mesh key={i} position={[(x + Math.sin(a) * L * 0.45) * 2.6 * Math.cos(0) , 0.06 + 0.02 * i, z * 2.6 + Math.cos(a) * 0.01]}><sphereGeometry args={[0.03, 14, 10]} /><meshBasicMaterial color="#ffd84a" transparent opacity={0.55 * kn * (0.6 + 0.4 * Math.sin(tt * 4 + i))} /></mesh>)}</group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.0} txt="NOT ONE ROOT · A HAND" col={AMB} />} />;
};
// 5:26 · CRAC: los dedos se separan uno por uno de la mano de jengibre con un chispazo de jugo y quedan alineados
export const E_snap: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.05, 0.4, 0.78], [0, 0.12, 0]), C([0.16, 0.4, 0.75], [0, 0.12, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35 }}
    scene={(tt) => <>
      <Board w={1.3} d={0.6} />
      <Ginger p={[-0.3, 0.07, -0.05]} s={1.8} n={1} />
      {[0, 1, 2, 3].map((i) => { const k = eio(tt, 0.6 + 1.0 * i, 1.2 + 1.0 * i), at = 0.9 + 1.0 * i;
        return <group key={i}>
          <group position={[lerp(-0.3 + 0.1 * Math.cos(i * 1.5), 0.05 + 0.13 * i, k), 0.08 + 0.12 * Math.sin(Math.PI * k), lerp(0.1 * Math.sin(i * 1.5), 0.15, k)]} rotation={[0, 0, lerp(0.6, Math.PI / 2, k)]}>
            <mesh><capsuleGeometry args={[0.055, 0.2, 8, 14]} /><meshStandardMaterial color={SKIN} roughness={0.85} /></mesh>
            <mesh position={[0, -0.13, 0]} scale={[2, 0.35, 2]}><sphereGeometry args={[0.054, 18, 12]} /><meshStandardMaterial color={YEL} roughness={0.25} emissive="#ffcf3a" emissiveIntensity={0.8} /></mesh></group>
          {tt > at && tt < at + 0.8 && Array.from({ length: 16 }, (_, j) => { const u = (tt - at) / 0.8; return <mesh key={j} position={[-0.15 + 0.22 * u * Math.cos(j), 0.12 + 0.16 * u * Math.sin(j * 1.7), 0.12 * u * Math.sin(j)]}><sphereGeometry args={[0.026, 10, 8]} /><meshBasicMaterial color="#ffd23a" transparent opacity={1 - u} /></mesh>; })}</group>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={2.0} txt="SNAP THE KNUCKLES FIRST" col={AMB} />} />;
};
// 6:10 · ADENTRO AMARILLO O GRIS: dos dedos se raspan a la vez; uno brilla amarillo y gotea jugo, el otro sale gris y seco
export const E_yellow: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.5, 1.05], [0, 0.15, 0]), C([0.16, 0.48, 1.0], [0, 0.15, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35 }}
    scene={(tt) => { const k = eio(tt, 0.6, 2.4), j = eio(tt, 2.6, 4.0);
      return <>
        <Board w={1.2} d={0.55} />
        <group position={[-0.25, 0.12, 0]} scale={2.2}><mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.035, 0.14, 10, 18]} /><meshPhysicalMaterial color={col(SKIN, YEL, k)} roughness={lerp(0.85, 0.1, k)} clearcoat={k} /></mesh></group>
        <group position={[0.25, 0.12, 0]} scale={2.2}><mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.035, 0.14, 10, 18]} /><meshStandardMaterial color={col(SKIN, "#a9a28e", k)} roughness={0.98} /></mesh></group>
        {[0, 1, 2].map((i) => { const u = (tt * 0.9 + i / 3) % 1; return j > 0.05 && <Drop key={i} c="#f6e27a" p={[-0.3 + 0.06 * i, lerp(0.07, 0.03, u), 0.06]} s={0.6} op={0.9 * j * (1 - u)} />; })}
        {[0, 1].map((i) => <Spoon key={i} p={[lerp(-0.1, -0.45, k) + 0.5 * i, 0.22, 0.06]} rot={[0.4, Math.PI, -0.5]} s={1.5} />)}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={2.6} txt="YELLOW · JUICY = FRESH" col="#ffd84a" y={250} /><Ink tt={tt} at={3.6} txt="GRAY · DRY = OLD" col="#c8c8c8" /></>} />;
};
// 6:35 · SHIN SHOGA: un manojo de jengibre joven, casi blanco, con puntas rosas y tallos verdes; el agua lo lava y no se pela
export const E_shinshoga: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.55, 1.25], [0, 0.2, 0]), C([0.2, 0.53, 1.18], [0, 0.2, 0]), 10)}
    set={{ spot: [0, 0.1, 0] as V, spotK: 0.4, warm: 0.3 }}
    scene={(tt) => { const w = eio(tt, 2.0, 4.0);
      return <>
        <Board w={1.3} d={0.6} c="#b8c4a8" />
        {[-0.25, 0, 0.25].map((x, i) => <group key={i} position={[x, 0.07, 0.02 * i]} rotation={[0, 0.4 * i - 0.4, 0]}><Ginger p={[0, 0, 0]} s={1.5} young={1} n={3} />
          {[0, 1, 2].map((j) => <mesh key={j} position={[-0.05 + 0.05 * j, 0.25, -0.05]} rotation={[0.3 * (j - 1), 0, 0.2 * (j - 1)]}><cylinderGeometry args={[0.008, 0.012, 0.4, 8]} /><meshStandardMaterial color="#5f9a4a" roughness={0.6} /></mesh>)}</group>)}
        {w > 0.02 && w < 0.98 && Array.from({ length: 24 }, (_, i) => { const u = (tt * 1.4 + rnd(i)) % 1; return <mesh key={i} position={[-0.35 + 0.7 * rnd(i + 3), lerp(0.6, 0.08, u), -0.05 + 0.1 * rnd(i + 7)]}><capsuleGeometry args={[0.004, 0.04, 4, 6]} /><meshStandardMaterial color={WATER} transparent opacity={0.8} /></mesh>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={1.2} txt="SHIN SHOGA · NEVER PEELED" col={PINK} />} />;
};
// 7:43 · PIEL TIRANTE: dos raíces con luz rasante; la tirante devuelve un brillo que se desliza, la arrugada se hunde como un globo desinflado
export const E_tight: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([-0.2, 0.42, 0.95], [-0.17, 0.13, 0]), C([-0.06, 0.41, 0.9], [-0.17, 0.13, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const sl = (tt * 0.35) % 1, wr = eio(tt, 1.0, 3.0);
      return <>
        <Board w={1.2} d={0.55} />
        <Ginger p={[-0.25, 0.08, 0]} s={1.8} tint="#d8ac66" peel={0.12} />
        <mesh position={[lerp(-0.42, -0.08, sl), 0.17, 0.13]} scale={[1.8, 0.5, 0.6]}><sphereGeometry args={[0.04, 16, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.95 * Math.sin(Math.PI * sl)} /></mesh>
        <Ginger p={[0.25, 0.08, 0]} s={lerp(1.8, 1.6, wr)} wr={wr} fat={1 - 0.2 * wr} />
        <pointLight position={[-0.8, 0.3, 0.4]} intensity={0.8} distance={2} color="#fff4e0" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.0} txt="TIGHT · SMOOTH · A LITTLE SHINY" col={AMB} size={72} />} />;
};
// 8:00 · PESADA PARA SU TAMAÑO: dos raíces iguales caen sobre almohadoncitos; la jugosa se hunde hondo, la seca rebota
export const E_heavy: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.66, 1.38], [0, 0.04, 0]), C([0.1, 0.65, 1.33], [0, 0.04, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35 }}
    scene={(tt) => { const f = eio(tt, 0.5, 1.2), b = Math.max(0, Math.sin((tt - 1.2) * 6)) * Math.exp(-(tt - 1.2) * 1.5) * (tt > 1.2 ? 1 : 0);
      return <>
        <Board w={1.2} d={0.55} />
        {[-0.21, 0.21].map((x, i) => { const sink = i === 0 ? 0.11 * f : 0.01 * f; return <group key={i}>
          <mesh position={[x, 0.05 - sink / 2, 0]} scale={[1, Math.max(0.05, 1 - sink * 4), 1]}><cylinderGeometry args={[0.2, 0.21, 0.1, 32]} /><meshStandardMaterial color={i ? "#c8d8e8" : "#e8c8c8"} roughness={0.95} /></mesh>
          <Ginger p={[x, lerp(0.55, 0.12 - sink, f) + (i ? 0.08 * b : 0), 0]} s={1.5} wr={i ? 0.6 : 0} /></group>; })}
        {f > 0.95 && <Drop c="#f6e27a" p={[-0.2, 0.1, 0.1]} s={0.9} />}
        {f > 0.9 && <mesh position={[-0.21, 0.4 + 0.025 * Math.sin(tt * 4), 0.08]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.09, 0.2, 20]} /><meshStandardMaterial color="#9a3a0a" emissive="#5a1e04" emissiveIntensity={0.4} roughness={0.4} /></mesh>}
      </>; }}
    over={(tt) => <Ink tt={tt} at={1.8} txt="HEAVY = JUICY" col={AMB} />} />;
};
// 8:47 · LA OROSHIGANE: la placa de cobre con dientitos martillados aparece de canto, gira y se acuesta sobre la tabla; los dientes brillan uno por uno
export const E_oroshigane: F = ({ t, h }) => {
  const teeth = useMemo(() => Array.from({ length: 70 }, (_, i) => [-0.09 + 0.18 * ((i % 7) / 6), -0.16 + 0.3 * (Math.floor(i / 7) / 9)]), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.62, 0.95], [0, 0.08, 0]), C([0.14, 0.6, 0.9], [0, 0.08, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.5 }}
    scene={(tt) => { const lay = eio(tt, 0.5, 2.2), sh = eio(tt, 2.4, 5.0);
      return <>
        <Board w={1.0} d={0.6} c="#8a6a4a" />
        <group position={[0, lerp(0.3, 0.06, lay), 0]} rotation={[lerp(0, -Math.PI / 2 + 0.25, lay), lerp(Math.PI, 0, lay), 0]} scale={1.7}>
          <Box p={[0, 0, 0]} s={[0.24, 0.42, 0.008]} c={COPPER} m={0.85} r={0.25} rad={0.02} />
          <Box p={[0, -0.27, 0]} s={[0.08, 0.14, 0.008]} c={COPPER} m={0.85} r={0.3} rad={0.02} />
          {teeth.map(([x, y], i) => <mesh key={i} position={[x, y + 0.04, 0.006]} rotation={[-0.6, 0, 0]}><coneGeometry args={[0.006, 0.012, 4]} /><meshStandardMaterial color={COPPER} metalness={0.9} roughness={0.2} emissive="#ffb070" emissiveIntensity={i / 70 < sh ? 0.5 : 0} /></mesh>)}</group>
        {lay > 0.95 && <group position={[0.06 * Math.sin(tt * 6), 0.16, -0.05 + 0.08 * Math.cos(tt * 6)]} rotation={[0.9, 0, 0]}><mesh scale={[1, 1.3 - 0.4 * sh, 1]}><capsuleGeometry args={[0.05, 0.2, 10, 18]} /><meshStandardMaterial color={SKIN} roughness={0.85} /></mesh>
          <mesh position={[0, -0.16 + 0.05 * sh, 0]} scale={[1, 0.25, 1]}><sphereGeometry args={[0.05, 16, 10]} /><meshStandardMaterial color={YEL} roughness={0.3} /></mesh></group>}
        <mesh position={[0, 0.1, 0.24]} scale={[1.4, 0.4, 1]}><sphereGeometry args={[0.07 * Math.max(0.02, sh), 20, 12]} /><meshPhysicalMaterial color="#f2dc7a" roughness={0.25} clearcoat={0.8} /></mesh>
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.4} txt="OROSHIGANE" col={AMB} />} />;
};
// 9:13 · EN CIRCULITOS: la raíz dibuja círculos sobre el rallador; queda una pasta lisa y las hebras se enrollan aparte
export const E_circles: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.46, 0.52], [0, 0.06, 0]), C([0.1, 0.44, 0.48], [0, 0.06, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.4 }}
    scene={(tt) => { const k = eio(tt, 0.5, 6.0), a = tt * 5;
      return <>
        <Board w={1.0} d={0.7} c="#8a6a4a" />
        <group position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}><Box p={[0, 0, 0]} s={[0.3, 0.46, 0.008]} c="#e8eaec" m={0.4} r={0.3} rad={0.02} /></group>
        <mesh position={[0, 0.036, -0.05]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.06, 0.004, 6, 48]} /><meshBasicMaterial color={AMB} transparent opacity={0.8} /></mesh>
        <group position={[0.06 * Math.cos(a), 0.12, 0.06 * Math.sin(a) - 0.05]} rotation={[0.9, a * 0.2, 0]}><mesh scale={[1, 1.3 - 0.4 * k, 1]}><capsuleGeometry args={[0.035, 0.14, 10, 18]} /><meshStandardMaterial color={SKIN} roughness={0.85} /></mesh></group>
        <mesh position={[0, 0.04, 0.12]} scale={[1, 0.3, 0.8]}><sphereGeometry args={[0.07 * Math.max(0.02, k), 24, 14]} /><meshPhysicalMaterial color="#f2dc7a" roughness={0.25} clearcoat={0.8} /></mesh>
        {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0, 0.035, -0.05]} rotation={[-Math.PI / 2, 0, i * 0.6 + tt]}><torusGeometry args={[0.02 + 0.007 * i, 0.0035, 6, 30, Math.PI * 1.6 * k]} /><meshStandardMaterial color="#d8b24a" roughness={0.6} /></mesh>)}
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.4} txt="CIRCLES · THE STRINGS STAY BEHIND" col={AMB} size={72} />} />;
};
// 9:38 · EL NIDO: la hebra forma un nidito en el rallador; dos dedos lo aprietan y caen gotas doradas sobre el tofu
export const E_nest: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.5, 0.95], [0, 0.22, 0]), C([0.14, 0.49, 0.9], [0, 0.22, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.5 }}
    scene={(tt) => { const sq = eio(tt, 1.8, 2.8);
      return <>
        <Board w={1.0} d={0.6} c="#8a6a4a" />
        <group position={[0, 0.36, 0]} scale={2.6}>{Array.from({ length: 18 }, (_, i) => <mesh key={i} rotation={[rnd(i) * 3, rnd(i + 5) * 3, rnd(i + 9) * 3]} scale={1 - 0.35 * sq}><torusGeometry args={[0.045, 0.003, 5, 24]} /><meshStandardMaterial color="#e6d29a" roughness={0.8} /></mesh>)}</group>
        {[-1, 1].map((sd) => <mesh key={sd} position={[sd * lerp(0.26, 0.12, sq), 0.36, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.04, 0.16, 8, 12]} /><meshStandardMaterial color="#f3dcc6" roughness={0.6} /></mesh>)}
        {sq > 0.3 && [0, 1, 2, 3].map((i) => { const u = (tt * 1.2 + i / 4) % 1; return <Drop key={i} c="#f6d64a" p={[-0.02 + 0.015 * i, lerp(0.26, 0.14, u), 0.0]} s={1.0} op={0.9 * (1 - u)} />; })}
        <Box p={[0, 0.08, 0]} s={[0.2, 0.1, 0.16]} c="#fbfaf2" r={0.4} rad={0.01} />
        <Cyl p={[0, 0.03, 0]} r={0.17} h={0.012} c="#2c4a8a" rough={0.3} />
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.6} txt="SQUEEZE · NOT ONE DROP WASTED" col={AMB} size={74} />} />;
};
// 10:03 · EL CAJÓN DE VERDURAS: el cajón sale de la heladera; en la bolsa, la raíz se arruga y le salen puntitos azules; el cajón se cierra
export const E_drawer: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.1, 0.7, 1.05], [0, 0.12, 0.15]), C([0.25, 0.68, 1.0], [0, 0.12, 0.15]), 10)}
    set={{ spot: [0, 0.1, 0] as V, spotK: 0.35 }}
    scene={(tt) => { const o = eio(tt, 0.4, 1.4) * (1 - eio(tt, 6.0, 6.8)), wr = eio(tt, 1.8, 5.0);
      return <>
        <Box p={[0, 0.25, -0.3]} s={[0.8, 0.5, 0.3]} c="#ecebe7" r={0.3} m={0.2} rad={0.02} />
        <group position={[0, 0.12, -0.15 + 0.4 * o]}>
          <Box p={[0, 0, 0]} s={[0.66, 0.02, 0.4]} c="#e8f2f6" r={0.15} rad={0.01} />
          {[-1, 1].map((sd) => <Box key={sd} p={[sd * 0.33, 0.07, 0]} s={[0.012, 0.14, 0.4]} c="#dfeef4" r={0.15} rad={0.004} />)}
          <Box p={[0, 0.07, 0.2]} s={[0.66, 0.14, 0.012]} c="#cfe6ee" r={0.15} rad={0.004} />
          <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.32, 0.1, 0.2]} /><meshPhysicalMaterial color="#ffffff" transmission={0.5} roughness={0.5 * wr} transparent opacity={0.25 + 0.2 * wr} depthWrite={false} /></mesh>
          <Ginger p={[-0.08, 0.05, 0]} s={1.3} wr={wr} fat={1 - 0.25 * wr} /><Ginger p={[0.1, 0.05, 0.03]} s={1.1} rot={[0, 2.2, 0]} wr={wr} fat={1 - 0.25 * wr} />
          {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-0.14 + 0.04 * i, 0.085 + 0.01 * (i % 2), 0.02 + 0.03 * rnd(i)]}><sphereGeometry args={[0.022 * Math.max(0.02, eio(tt, 3.2 + 0.25 * i, 4.0 + 0.25 * i)), 10, 8]} /><meshStandardMaterial color="#4f8a6a" roughness={1} /></mesh>)}</group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.8} txt="TWO WEEKS · SOFT · MOLDY" col="#ff8a7a" />} />;
};
// 10:18 · EL FRASCO DE AGUA: el frasco se llena de agua fría, la raíz entra y queda flotando firme; el agua se cambia (sube una ola nueva)
export const E_jar: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.5, 1.05], [0, 0.22, 0]), C([0.16, 0.48, 1.0], [0, 0.22, 0]), 10)}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.35 }}
    scene={(tt) => { const fill = eio(tt, 0.4, 1.8), dip = eio(tt, 2.0, 3.0), ref = eio(tt, 4.6, 5.6);
      return <>
        <Board w={1.0} d={0.5} />
        <Box p={[0, 0.32, -0.3]} s={[0.8, 0.64, 0.02]} c="#24323e" r={0.7} rad={0.01} />
        <Cyl p={[0, 0.2, 0]} r={0.14} h={0.36} c="#f4f8fa" rough={0.03} op={0.35} />
        <Cyl p={[0, 0.39, 0]} r={0.12} h={0.03} c="#c9a24a" m={0.7} rough={0.3} />
        <Cyl p={[0, 0.03 + 0.15 * fill, 0]} r={0.13} h={0.3 * fill + 0.001} c={col("#bfe6ff", "#d8f2ff", ref)} rough={0.02} op={0.45} />
        <mesh position={[0, 0.03 + 0.3 * fill + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.0, 0.13, 32]} /><meshBasicMaterial color="#e8f8ff" transparent opacity={0.4 * fill} /></mesh>
        <group position={[0, lerp(0.6, 0.17, dip), 0]} rotation={[0, tt * 0.2, Math.PI / 2]}><Ginger p={[0, 0, 0]} s={1.25} n={3} tint="#b8864a" /></group>
        {Array.from({ length: 8 }, (_, i) => { const u = (tt * 0.6 + i / 8) % 1; return dip > 0.9 && <mesh key={i} position={[-0.08 + 0.16 * rnd(i), 0.06 + 0.26 * u, -0.06 + 0.12 * rnd(i + 3)]}><sphereGeometry args={[0.006, 6, 4]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.7 * (1 - u)} /></mesh>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={4.8} txt="CHANGE THE WATER · 3 OR 4 DAYS" col={AMB} size={74} />} />;
};
// 10:48 · ENVUELTA EN PAPEL: una hoja de papel de cocina se enrolla alrededor de la raíz y la bolsita abierta la recibe
export const E_towel: F = ({ t, h }) => {
  const tex = useMemo(() => mk(256, 256, (g) => { g.fillStyle = "#fbfaf5"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(120,140,170,.9)"; g.lineWidth = 3; for (let i = 0; i < 256; i += 16) { g.beginPath(); g.arc(i, i % 32 ? 64 : 192, 8, 0, Math.PI * 2); g.stroke(); } }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.55, 1.05], [0, 0.1, 0]), C([0.16, 0.53, 1.0], [0, 0.1, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35 }}
    scene={(tt) => { const r = eio(tt, 0.6, 3.0), mv = eio(tt, 3.4, 4.6);
      return <>
        <Board w={1.2} d={0.6} />
        <group position={[lerp(-0.15, 0.3, mv), 0.1, 0]}>
          <Ginger p={[0, -0.03, 0]} s={1.3} n={3} />
          <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.1, 0.1, 0.3, 32, 1, true, 0, Math.PI * 2 * r]} /><meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.95} /></mesh></group>
        {r < 0.98 && <mesh position={[-0.15 + 0.0, 0.026, 0.12 + 0.25 * (1 - r)]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.5 * (1 - r) + 0.001]} /><meshStandardMaterial map={tex} roughness={0.95} /></mesh>}
        <group position={[0.38, 0.026, 0]}><mesh position={[0, 0.1, 0]}><boxGeometry args={[0.36, 0.2, 0.26]} /><meshPhysicalMaterial color="#dfeef6" transmission={0.4} roughness={0.15} transparent opacity={0.42} depthWrite={false} /></mesh>
          <Box p={[0, 0.2, 0.12]} s={[0.36, 0.012, 0.012]} c="#2a7ad6" r={0.4} rad={0.003} /><Box p={[0, 0.2, -0.12]} s={[0.36, 0.012, 0.012]} c="#2a7ad6" r={0.4} rad={0.003} /></group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.8} txt="DRY PAPER · OPEN BAG" col={AMB} />} />;
};
// 11:27 · TÉ DE CÁSCARAS: un puñado de cáscaras cae en la taza, el agua caliente cae en chorro y el color dorado sube por la taza
export const E_tea: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.5, 0.95], [0, 0.18, 0]), C([0.16, 0.48, 0.9], [0, 0.18, 0]), 10)}
    set={{ spot: [0, 0.1, 0] as V, spotK: 0.4, warm: 0.7 }}
    scene={(tt) => { const pe = eio(tt, 0.4, 1.4), w = eio(tt, 1.6, 3.4), gold = eio(tt, 3.0, 6.0);
      return <>
        <Board w={1.0} d={0.5} c="#6b4a2e" />
        <Cyl p={[0, 0.09, 0]} r={0.12} r2={0.1} h={0.16} c="#f4efe6" rough={0.2} op={0.55} />
        <Cyl p={[0, 0.03 + 0.065 * w, 0]} r={0.105} r2={0.1} h={0.13 * w + 0.001} c={col("#f4f1e2", "#d9a032", gold)} rough={0.05} op={0.8} />
        {[0, 1, 2, 3, 4, 5].map((i) => <Peel key={i} s={1.2} p={[-0.05 + 0.02 * i, lerp(0.5, 0.05 + 0.13 * w, pe) + 0.01 * Math.sin(tt + i), 0.03 * Math.sin(i * 2)]} rot={[i, i * 1.3, 1]} />)}
        {w > 0.02 && w < 0.98 && <group position={[0.05, 0.42, 0]}><Cyl p={[0, -0.12, 0]} r={0.008} h={0.26} c="#e8f2f4" rough={0.05} op={0.7} />
          <group position={[0.2, 0.12, 0]} rotation={[0, 0, 0.6]}><Cyl p={[0, 0, 0]} r={0.09} h={0.16} c="#2a2a2c" m={0.6} rough={0.3} /><Cyl p={[-0.1, 0.03, 0]} r={0.012} h={0.12} c="#2a2a2c" m={0.6} rough={0.3} rot={[0, 0, 1.0]} /></group></group>}
        <Steam p={[0, 0.2, 0]} t={tt} k={gold} s={0.45} />
      </>; }}
    over={(tt) => <Ink tt={tt} at={4.0} txt="PEELS → TEA" col={AMB} />} />;
};
// 12:50 · EL JENGIBRE ROJO: hojas de shiso rojo se estrujan, el jugo púrpura cae sobre las tiritas pálidas y las tiñe de rojo
export const E_beni: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.55, 1.0], [0, 0.15, 0]), C([0.16, 0.53, 0.95], [0, 0.15, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35 }}
    scene={(tt) => { const sq = eio(tt, 0.6, 1.6), red = eio(tt, 1.8, 4.6);
      return <>
        <Board w={1.1} d={0.55} />
        <Cyl p={[0, 0.04, 0]} r={0.18} h={0.03} c="#f4f1ea" rough={0.3} />
        {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[-0.12 + 0.24 * rnd(i), 0.065, -0.1 + 0.2 * rnd(i + 4)]} rotation={[0, rnd(i + 8) * 3, Math.PI / 2]}><capsuleGeometry args={[0.006, 0.08, 4, 8]} /><meshStandardMaterial color={col("#f2e4b4", "#d62838", red)} roughness={0.4} /></mesh>)}
        <group position={[0, 0.38 - 0.06 * sq, 0]} scale={[1 - 0.5 * sq, 1, 1 - 0.3 * sq]}>{[0, 1, 2].map((i) => <mesh key={i} position={[0.02 * i, 0.01 * i, 0]} rotation={[0.3 * i, i, 0.5]} scale={[1, 0.15, 0.7]}><sphereGeometry args={[0.08, 16, 10]} /><meshStandardMaterial color="#6a1a3a" roughness={0.6} /></mesh>)}</group>
        {sq > 0.5 && [0, 1, 2, 3, 4].map((i) => { const u = (tt * 1.3 + i / 5) % 1; return <Drop key={i} c="#9a1a4a" p={[-0.03 + 0.015 * i, lerp(0.32, 0.08, u), 0]} s={0.6} op={0.9 * (1 - u) * (1 - eio(tt, 4.4, 5.0))} />; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.6} txt="RED SHISO → BENI SHOGA" col="#ff7a8a" />} />;
};
// 13:07 · LIMPIAR LA BOCA: dos piezas de sushi distintas; entre las dos, una lámina de gari pasa como un limpiaparabrisas y el aire se aclara
export const E_gari: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.34, 0.66], [0, 0.06, 0]), C([0.05, 0.34, 0.64], [0, 0.06, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.4 }}
    scene={(tt) => { const sw = eio(tt, 1.4, 3.0);
      return <>
        <Box p={[0, 0.03, 0]} s={[1.0, 0.04, 0.34]} c="#2a1e16" r={0.4} rad={0.01} />
        {[-0.21, 0.21].map((x, i) => <group key={i} position={[x, 0.07, 0]}><Box p={[0, 0, 0]} s={[0.16, 0.06, 0.08]} c="#fbfaf2" r={0.9} rad={0.03} />
          <Box p={[0, 0.04, 0]} s={[0.18, 0.025, 0.09]} c={i ? "#c8d8e0" : "#ef7a4a"} r={0.3} rad={0.012} /></group>)}
        <group position={[lerp(-0.15, 0.15, sw), 0.12, 0]} rotation={[0, 0, Math.sin(sw * Math.PI * 3) * 0.6]}><mesh scale={[1, 0.15, 1]}><sphereGeometry args={[0.06, 20, 10]} /><meshStandardMaterial color="#f6c8c8" roughness={0.3} transparent opacity={0.9} /></mesh></group>
        {[0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} position={[-0.2 + 0.08 * i, 0.22 + 0.02 * Math.sin(tt * 2 + i), 0]}><sphereGeometry args={[0.03, 10, 8]} /><meshBasicMaterial color="#c8a080" transparent opacity={0} visible={false} /></mesh>)}
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.6} txt="GARI · CLEANS THE MOUTH" col={AMB} />} />;
};
// 14:00 · PIEDRITAS: el jengibre picado son piedritas que rebotan en la cuchara; el rallado se funde en la salsa como una gota
export const E_rocks: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.5, 0.85], [0, 0.08, 0]), C([0.12, 0.49, 0.8], [0, 0.08, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35 }}
    scene={(tt) => { const f = eio(tt, 0.5, 1.5), m = eio(tt, 2.2, 4.0);
      return <>
        <Board w={1.2} d={0.55} />
        {[-0.28, 0.28].map((x, i) => <Cyl key={i} p={[x, 0.05, 0]} r={0.15} r2={0.11} h={0.06} c="#f4f1ea" rough={0.3} />)}
        {[-0.28, 0.28].map((x, i) => <Cyl key={"s" + i} p={[x, 0.075, 0]} r={0.13} h={0.008} c="#5a2a10" rough={0.1} />)}
        {Array.from({ length: 12 }, (_, i) => { const b = Math.abs(Math.sin(tt * 4 + i)) * 0.03 * (1 - eio(tt, 3, 5)); return <mesh key={i} position={[-0.28 + 0.16 * (rnd(i) - 0.5), lerp(0.4, 0.09, f) + b, 0.16 * (rnd(i + 3) - 0.5)]} rotation={[i, i * 2, 0]}><boxGeometry args={[0.03, 0.03, 0.03]} /><meshStandardMaterial color={YEL} roughness={0.6} /></mesh>; })}
        <mesh position={[0.28, lerp(0.4, 0.085, f), 0]} scale={[1 + 1.4 * m, 0.6 - 0.4 * m, 1 + 1.4 * m]}><sphereGeometry args={[0.055, 20, 12]} /><meshPhysicalMaterial color={col("#f2dc7a", "#8a4a18", m)} roughness={0.2} clearcoat={1} transparent opacity={1 - 0.6 * m} /></mesh>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.6} txt="CHOPPED: LITTLE ROCKS" col="#ff8a7a" y={250} /><Ink tt={tt} at={3.6} txt="GRATED: MELTS IN" col="#7fe0a0" /></>} />;
};
// 15:31 · POLVO O FRESCO: el frasco de polvo vuelca una nube opaca sobre las galletas; el jengibre fresco cae como una lluvia brillante sobre el pescado
export const E_powder: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.6, 1.32], [0.05, 0.22, 0]), C([0.12, 0.59, 1.27], [0.05, 0.22, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.5 }}
    scene={(tt) => { const a = eio(tt, 0.5, 1.4), b = eio(tt, 2.4, 3.4);
      return <>
        <Board w={1.3} d={0.6} />
        <group position={[-0.3, 0.03, 0.05]}>{[0, 1, 2].map((i) => <Cyl key={i} p={[-0.08 + 0.08 * i, 0.012, 0.04 * (i % 2)]} r={0.05} h={0.02} c="#b8742e" rough={0.6} />)}
          <group position={[0.08, 0.2, 0]} rotation={[0, 0, 2.2 * a]} scale={1.3}><Cyl p={[0, 0, 0]} r={0.045} h={0.12} c="#f4f6f8" rough={0.1} op={0.6} /><Cyl p={[0, 0, 0]} r={0.04} h={0.1} c="#d9b45a" rough={0.9} /><Cyl p={[0, 0.07, 0]} r={0.048} h={0.02} c="#d62828" rough={0.4} /></group>
          {a > 0.6 && Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[-0.08 + 0.18 * rnd(i), 0.08 + 0.2 * rnd(i + 3) * (1 - eio(tt, 1.6, 3.0)), -0.06 + 0.12 * rnd(i + 5)]}><sphereGeometry args={[0.008, 6, 4]} /><meshStandardMaterial color="#d9b45a" transparent opacity={0.5} /></mesh>)}</group>
        <group position={[0.3, 0.03, 0.05]}><mesh scale={[1.8, 0.35, 0.8]}><sphereGeometry args={[0.07, 20, 12]} /><meshStandardMaterial color="#c99a5a" roughness={0.6} /></mesh>
          {Array.from({ length: 16 }, (_, i) => { const u = (tt * 1.1 + rnd(i)) % 1; return b > 0.02 && <mesh key={i} position={[-0.06 + 0.12 * rnd(i + 2), lerp(0.3, 0.03, u), -0.03 + 0.06 * rnd(i + 4)]}><sphereGeometry args={[0.007, 6, 4]} /><meshPhysicalMaterial color="#f6e27a" clearcoat={1} roughness={0.1} emissive="#ffd84a" emissiveIntensity={0.3} /></mesh>; })}
          <Ginger p={[0.0, 0.2, 0]} s={0.95} peel={1} n={2} /></group>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.4} txt="POWDER: FOR BAKING" col="#d9b45a" y={110} /><Ink tt={tt} at={3.2} txt="FRESH: FOR COOKING" col="#7fe0a0" /></>} />;
};
// 15:49 · UNA PULGADA = LA PUNTA DEL PULGAR: un pulgar se apoya junto a la raíz; una línea marca el largo y el trozo cae en una cucharada
export const E_thumb: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.42, 0.8], [0, 0.1, 0]), C([0.12, 0.41, 0.76], [0, 0.1, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35 }}
    scene={(tt) => { const th = eio(tt, 0.4, 1.4), cut = eio(tt, 2.0, 2.6), fall = eio(tt, 2.8, 3.8);
      return <>
        <Board w={1.1} d={0.55} />
        <group position={[-0.05, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}><mesh><capsuleGeometry args={[0.045, 0.3, 10, 18]} /><meshStandardMaterial color={SKIN} roughness={0.85} /></mesh></group>
        <group position={[lerp(-0.5, -0.17, th), 0.17, 0]}><mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.045, 0.1, 10, 14]} /><meshStandardMaterial color="#e8b898" roughness={0.6} /></mesh>
          <mesh position={[-0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.055, 0.12, 10, 14]} /><meshStandardMaterial color="#e2b090" roughness={0.6} /></mesh>
          <mesh position={[-0.02, 0.0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.046, 0.004, 6, 24, Math.PI]} /><meshStandardMaterial color="#b8806a" /></mesh>
          <mesh position={[0.055, 0.038, 0]} rotation={[0, 0, -0.25]} scale={[1, 0.25, 0.85]}><sphereGeometry args={[0.04, 16, 10]} /><meshPhysicalMaterial color="#fbe2dc" roughness={0.15} clearcoat={1} /></mesh></group>
        {cut > 0.02 && <Box p={[-0.025, 0.08, 0]} s={[0.004, 0.13 * cut, 0.12]} c="#d62828" r={0.4} rad={0.001} />}
        <group position={[lerp(-0.12, 0.35, fall), 0.08 + 0.15 * Math.sin(Math.PI * fall), 0]} rotation={[0, 0, Math.PI / 2 + fall * 3]}>{cut > 0.95 && <mesh><capsuleGeometry args={[0.044, 0.05, 10, 14]} /><meshStandardMaterial color={YEL} roughness={0.4} /></mesh>}</group>
        <group position={[0.38, 0.05, 0]}><mesh scale={[1.2, 0.5, 1]}><sphereGeometry args={[0.07, 22, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color={STEEL} metalness={0.95} roughness={0.12} side={THREE.DoubleSide} /></mesh>
          <Box p={[0.15, 0.03, 0]} s={[0.2, 0.008, 0.025]} c={STEEL} m={0.95} r={0.12} rad={0.004} /></group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.4} txt="1 INCH = THE TOP OF YOUR THUMB" col={AMB} size={72} />} />;
};
// 16:05 · BROTES VERDES: de los nudillos salen brotes; la raíz se va arrugando mientras el brote crece, y termina en una maceta
export const E_sprout: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.08, 0.46, 1.12], [0.12, 0.22, 0]), C([0.16, 0.46, 1.08], [0.12, 0.22, 0]), 10)}
    set={{ spot: [0, 0.1, 0] as V, spotK: 0.35, warm: 0.4 }}
    scene={(tt) => { const g = eio(tt, 0.15, 3.2), pot = eio(tt, 4.4, 5.6);
      return <>
        <Board w={1.2} d={0.55} />
        <group position={[lerp(-0.1, 0.25, pot), 0.07 + 0.1 * pot, 0]} scale={1 - 0.22 * pot}><Ginger p={[0, 0, 0]} s={1.5} wr={g * 0.7} fat={1 - 0.2 * g} />
          {[0, 1, 2].map((i) => <group key={i} position={[-0.08 + 0.08 * i, 0.06, 0]}><mesh position={[0, 0.14 * g, 0]}><cylinderGeometry args={[0.006, 0.01, 0.28 * g + 0.001, 8]} /><meshStandardMaterial color="#5fa84a" roughness={0.5} /></mesh>
            <mesh position={[0.03, 0.28 * g, 0]} rotation={[0, i, 0.8]} scale={[1, 0.2, 0.4]}><sphereGeometry args={[0.05 * Math.max(0.02, g), 12, 8]} /><meshStandardMaterial color="#6fb85a" roughness={0.5} /></mesh></group>)}</group>
        {pot > 0.02 && <group position={[0.25, 0, 0]} scale={Math.max(0.02, 0.8 * pot)}><Cyl p={[0, 0.1, 0]} r={0.16} r2={0.12} h={0.2} c="#c8643a" rough={0.8} /><Cyl p={[0, 0.19, 0]} r={0.15} h={0.02} c="#4a3220" rough={1} /></group>}
      </>; }}
    over={(tt) => <Ink tt={tt} at={4.6} txt="PLANT IT · A GINGER PLANT" col="#7fe0a0" x={540} y={985} size={44} />} />;
};
// 16:40 · EL TUBITO: el pomo se aprieta y sale un chorrito de pasta; al lado el rallado fresco brilla mucho más
export const E_tube: F = ({ t, h }) => {
  const lab = useMemo(() => cardTex(["しょうが", "GINGER"], { bg: "#f4f6f8", fg: "#2e7a3a", w: 256, h: 128 }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.4, 0.75], [0, 0.08, 0]), C([0.1, 0.39, 0.72], [0, 0.08, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35 }}
    scene={(tt) => { const sq = eio(tt, 0.6, 2.0), fr = eio(tt, 2.6, 3.6);
      return <>
        <Board w={1.2} d={0.55} />
        <group position={[-0.22, 0.08, 0]} rotation={[0, 0.2, -0.2]} scale={1.5}><mesh scale={[1, 1 - 0.4 * sq, 1]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.04, 0.05, 0.3, 24]} /><meshStandardMaterial color="#f4f6f8" roughness={0.3} /></mesh>
          <mesh position={[0, 0.0, 0.051]} rotation={[0, 0, 0]}><planeGeometry args={[0.2, 0.08]} /><meshStandardMaterial map={lab} /></mesh>
          <Cyl p={[0.18, 0, 0]} r={0.02} h={0.04} c="#2e7a3a" rough={0.4} rot={[0, 0, Math.PI / 2]} /></group>
        <mesh position={[-0.05, 0.04, 0.02]} scale={[2.2 * sq + 0.01, 0.5, 0.8]}><sphereGeometry args={[0.03, 16, 10]} /><meshStandardMaterial color="#d8c27a" roughness={0.7} /></mesh>
        <mesh position={[0.3, 0.05, 0.02]} scale={[1.4 * fr + 0.01, 0.7 * fr + 0.01, 1.2 * fr + 0.01]}><sphereGeometry args={[0.05, 20, 12]} /><meshPhysicalMaterial color="#f6e27a" roughness={0.1} clearcoat={1} emissive="#ffd84a" emissiveIntensity={0.2 * fr} /></mesh>
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.4} txt="TUBE: IN A HURRY · FRESH: WHEN YOU CAN" col={AMB} size={66} />} />;
};
// 17:40 · SE PONE ROSA: en el frasco de vinagre, las láminas finitas del jengibre joven pasan de pálidas a rosadas
export const E_pink: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.45, 0.95], [0, 0.2, 0]), C([0.16, 0.43, 0.9], [0, 0.2, 0]), 10)}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.35, warm: 0.4 }}
    scene={(tt) => { const pk = eio(tt, 1.0, 5.0);
      return <>
        <Board w={1.0} d={0.5} />
        <Cyl p={[0, 0.2, 0]} r={0.14} h={0.36} c="#f4f8fa" rough={0.03} op={0.3} />
        <Cyl p={[0, 0.15, 0]} r={0.13} h={0.26} c="#fff4e8" rough={0.03} op={0.3} />
        {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[0.09 * Math.cos(i * 2.4) * rnd(i), 0.05 + 0.2 * (i / 22), 0.09 * Math.sin(i * 2.4) * rnd(i)]} rotation={[rnd(i) * 3, i, rnd(i + 2)]}><circleGeometry args={[0.03, 16]} /><meshStandardMaterial color={col("#f6efd8", "#f4a0b0", pk)} side={THREE.DoubleSide} transparent opacity={0.85} roughness={0.3} /></mesh>)}
        <Cyl p={[0, 0.39, 0]} r={0.145} h={0.03} c="#d62828" rough={0.4} />
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.6} txt="YOUNG GINGER TURNS PINK" col={PINK} />} />;
};
// 18:55 · LA AMIGA DE KIOTO: la puerta del freezer se abre: nada; se cierra y se vuelve a abrir llena de raíces enteras alineadas con escarcha
export const E_kyoto: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.45, 0.8, 2.3], [0, 0.33, 0]), C([0.7, 0.76, 2.15], [0, 0.33, 0]), 10)}
    set={{ spot: [0, 0.3, 0] as V, spotK: 0.2 }}
    scene={(tt) => { const d1 = eio(tt, 0.5, 1.2) * (1 - eio(tt, 2.2, 2.8)), d2 = eio(tt, 3.2, 4.0), full = tt > 2.9;
      const d = Math.max(d1, d2);
      return <>
        <Box p={[0, 0.35, -0.22]} s={[0.6, 0.7, 0.1]} c="#aeb6be" r={0.4} m={0.2} rad={0.02} />
        {[-1, 1].map((sd) => <Box key={sd} p={[sd * 0.29, 0.35, -0.03]} s={[0.02, 0.7, 0.42]} c="#aeb6be" r={0.4} m={0.2} rad={0.006} />)}
        <Box p={[0, 0.69, -0.03]} s={[0.6, 0.02, 0.42]} c="#aeb6be" r={0.4} m={0.2} rad={0.006} /><Box p={[0, 0.03, -0.03]} s={[0.58, 0.02, 0.42]} c="#aeb6be" r={0.4} m={0.2} rad={0.006} />
        <Box p={[0, 0.35, -0.165]} s={[0.56, 0.66, 0.01]} c="#2a3a4a" r={0.6} rad={0.004} />
        {[0.24, 0.42].map((y) => <Box key={y} p={[0, y, -0.03]} s={[0.56, 0.008, 0.38]} c="#dfe8ee" r={0.2} op={0.7} rad={0.002} />)}
        {full && [0, 1, 2].map((r) => [0, 1, 2].map((c) => <group key={r + "_" + c} position={[-0.15 + 0.15 * c, 0.15 + 0.18 * r, 0.05]} rotation={[0, 0.3 * c, 0]}><Ginger p={[0, 0, 0]} s={0.9} tint="#c49a62" />
          <mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.08, 12, 8]} /><meshStandardMaterial color="#eaf6ff" transparent opacity={0.12} roughness={1} /></mesh></group>))}
        <group position={[-0.3, 0.35, 0.18]} rotation={[0, -1.35 * d, 0]}><Box p={[0.3, 0, 0]} s={[0.6, 0.7, 0.03]} c="#b8c0c8" r={0.4} m={0.2} rad={0.015} /><Box p={[0.55, 0.05, 0.03]} s={[0.02, 0.2, 0.02]} c="#b8bcc2" m={0.8} r={0.3} rad={0.006} /></group>
        <pointLight position={[0, 0.4, 0.4]} intensity={0.35 * d} distance={1.2} color="#cfe9ff" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={4.0} txt="THE FROZEN ROOT" col="#8fcfff" />} />;
};
// 19:46 · EL MONTE DE NIEVE: la raíz congelada roza el rallador fino y abajo crece una montañita blanca-amarilla con capuchón, como el Fuji
export const E_fuji: F = ({ t, h }) => {
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.45, 1.0], [0, 0.18, 0]), C([0.16, 0.43, 0.95], [0, 0.18, 0]), 10)}
    set={{ spot: [0, 0.1, 0] as V, spotK: 0.35, warm: 0.2 }}
    scene={(tt) => { const g = eio(tt, 0.5, 5.5), sw = Math.sin(tt * 7);
      return <>
        <Board w={1.1} d={0.55} c="#3a4a5a" />
        <group position={[0.15, 0.32, 0]} rotation={[0, 0, -0.8]}><Box p={[0, 0, 0]} s={[0.04, 0.4, 0.02]} c={STEEL} m={0.95} r={0.15} rad={0.004} /><Box p={[0, -0.27, 0]} s={[0.035, 0.14, 0.03]} c="#2a2a2c" r={0.6} rad={0.01} /></group>
        <group position={[0.05 + 0.04 * sw, 0.42, 0]} rotation={[0, 0, 0.6]}><Ginger p={[0, 0, 0]} s={1.0} n={2} tint="#cfc3b0" />
          <mesh><sphereGeometry args={[0.09, 12, 8]} /><meshStandardMaterial color="#eaf6ff" transparent opacity={0.3} /></mesh></group>
        <group position={[-0.05, 0.026, 0]}><mesh position={[0, 0.07 * g, 0]}><coneGeometry args={[0.16 * g + 0.001, 0.14 * g + 0.001, 32]} /><meshStandardMaterial color="#f6e9b0" roughness={0.95} /></mesh>
          <mesh position={[0, 0.115 * g, 0]}><coneGeometry args={[0.06 * g + 0.001, 0.05 * g + 0.001, 32]} /><meshStandardMaterial color="#ffffff" roughness={0.95} /></mesh></group>
        {Array.from({ length: 20 }, (_, i) => { const u = (tt * 1.4 + rnd(i)) % 1; return <mesh key={i} position={[0.02 + 0.08 * (rnd(i) - 0.5), lerp(0.36, 0.06, u), 0.06 * (rnd(i + 4) - 0.5)]}><sphereGeometry args={[0.006, 6, 4]} /><meshStandardMaterial color="#fffbea" /></mesh>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.2} txt="GINGER SNOW · SKIN AND ALL" col={AMB} />} />;
};
// 21:11 · LA CUENTA: la raíz de $2 se parte: dos tercios se ablandan y caen al tacho; con la cuchara y el freezer, todas las rodajas van a los platos
export const E_math: F = ({ t, h }) => {
  const A = useMemo(() => cardTex(["$2 → $0.70 USED"], { bg: "#2a1e16", fg: "#ff6a5a", w: 320, h: 96 }), []), B = useMemo(() => cardTex(["$2 → $2 USED"], { bg: "#2a1e16", fg: "#7fe0a0", w: 320, h: 96 }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.62, 1.45], [0, 0.3, 0]), C([0.14, 0.6, 1.38], [0, 0.3, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const f = eio(tt, 0.8, 2.2), b = eio(tt, 3.6, 5.6);
      return <>
        <Board w={1.4} d={0.6} />
        <Ginger p={[-0.45, 0.07, 0]} s={1.2} n={2} />
        <group position={[lerp(-0.3, -0.15, f), 0.07 + 0.2 * Math.sin(Math.PI * f), lerp(0, 0.2, f)]} rotation={[0, 0, f * 1.5]}><Ginger p={[0, 0, 0]} s={1.2} n={3} wr={f} /></group>
        <Cyl p={[-0.15, 0.08, 0.2]} r={0.09} r2={0.07} h={0.16} c="#8a9096" m={0.7} rough={0.35} />
        <Pop k={pop(tt, 2.4)} p={[-0.3, 0.46, 0.05]}><mesh><planeGeometry args={[0.56, 0.168]} /><meshStandardMaterial map={A} /></mesh></Pop>
        <group position={[0.35, 0.03, 0]}>{[0, 1, 2, 3, 4].map((i) => <group key={i} position={[-0.16 + 0.08 * i, 0, 0.1 * Math.sin(i)]}><Cyl p={[0, 0.006, 0]} r={0.05} h={0.012} c="#f4f1ea" rough={0.3} />
          <mesh position={[0, 0.02, 0]} scale={Math.max(0.02, eio(tt, 3.6 + 0.3 * i, 4.0 + 0.3 * i))}><cylinderGeometry args={[0.025, 0.025, 0.008, 16]} /><meshStandardMaterial color={YEL} roughness={0.4} /></mesh></group>)}
          </group>
        {Array.from({ length: Math.round(f * 3) }, (_, i) => <Coin key={"a" + i} p={[-0.02, 0.035 + 0.022 * i, 0.26]} s={1.0} />)}
        {Array.from({ length: Math.round(b * 9) }, (_, i) => <Coin key={"b" + i} p={[0.5, 0.035 + 0.022 * i, 0.24]} s={1.0} />)}
        <Pop k={pop(tt, 5.4)} p={[0.32, 0.46, 0.05]}><mesh><planeGeometry args={[0.56, 0.168]} /><meshStandardMaterial map={B} /></mesh></Pop>
        {b > 0 && null}
      </>; }}
    over={(tt) => <Ink tt={tt} at={5.8} txt="TWO DOLLARS · ALL OF IT" col="#7fe0a0" />} />;
};
