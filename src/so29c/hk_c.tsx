// so29c · los componentes ÚNICOS del video de la papada «tontoro» (uno por minuto; ninguno se repite en la tanda so29, ver D:/rtmp/so29_COMPONENTES.md).
// Maqueta sobre la mesada (hk.tsx) con Blanquito-Sachiko haciendo lo que ella cuenta. Cada uno = UNA idea con un objeto.
import React, { useMemo } from "react";
import * as THREE from "three";
import { F, Hero, C, S, it, lerp, pop, Pop, Ink, cardTex, Pan, Steam, Ring, Bowl, Sticks, Coin,
  cl, eio, orbita, Sachi, secuencia, Box, Cyl, POSES, AMB, V } from "./hk";
import { mk } from "./casa3d";

const RED = "#d62828", PORK = "#f0b9a8", FAT = "#fbf3e8", GOLD = "#c9772e", PAPER = "#e9dcc0", ICE = "#cfe9ff";
const P0 = POSES.parado;
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();

// feta de papada: rosa con vetas blancas finas; g = cuánto se doró (bordes oscuros)
const JSlice: React.FC<{ p: V; rot?: V; s?: number; g?: number }> = ({ p, rot = [0, 0, 0], s = 1, g = 0 }) =>
  <group position={p} rotation={rot} scale={s}>
    <Box p={[0, 0.012, 0]} s={[0.3, 0.024, 0.2]} c={col(PORK, "#b8692e", g * 0.7)} r={0.5 - 0.3 * g} rad={0.01} />
    <Box p={[0, 0.011, 0]} s={[0.32, 0.02, 0.22]} c={col("#e8a090", "#6a3410", g)} r={0.5} rad={0.012} />
    {[0, 1, 2, 3].map((i) => <Box key={i} p={[-0.1 + 0.065 * i, 0.025, 0.02 * Math.sin(i * 2)]} s={[0.012, 0.004, 0.16]} c={col(FAT, "#f2c27a", g)} r={0.4} rad={0.002} rot={[0, 0.3 * Math.sin(i), 0]} />)}
  </group>;
// trozo entero de papada (cuadrado pálido)
const Jowl: React.FC<{ p: V; s?: number; glow?: number }> = ({ p, s = 1, glow = 0 }) =>
  <group position={p} scale={s}>
    <Box p={[0, 0.06, 0]} s={[0.36, 0.12, 0.32]} c={PORK} r={0.55} rad={0.04} e="#ffd27a" ei={0.35 * glow} />
    {[0, 1, 2, 3, 4].map((i) => <Box key={i} p={[0, 0.03 + 0.018 * i, 0.161]} s={[0.33, 0.006, 0.002]} c={FAT} r={0.4} rad={0.001} />)}
  </group>;
// personita de arcilla (fila, clientes)
const Folk: React.FC<{ p: V; c?: string; s?: number; bob?: number }> = ({ p, c = "#c9b8a6", s = 1, bob = 0 }) =>
  <group position={[p[0], p[1] + bob, p[2]]} scale={s}>
    <mesh position={[0, 0.12, 0]}><capsuleGeometry args={[0.05, 0.12, 6, 12]} /><meshStandardMaterial color={c} roughness={0.8} /></mesh>
    <mesh position={[0, 0.27, 0]}><sphereGeometry args={[0.045, 16, 12]} /><meshStandardMaterial color="#f1e6da" roughness={0.7} /></mesh>
  </group>;

// plancha rectangular de hierro (teppan): distinta de la sartén redonda de so29a/b
const Teppan: React.FC<{ p: V; w?: number; d?: number; heat?: number }> = ({ p, w = 0.9, d = 0.55, heat = 0.6 }) =>
  <group position={p}>
    <Box p={[0, 0.03, 0]} s={[w, 0.06, d]} c="#2b2c2f" r={0.45} m={0.7} rad={0.012} />
    <Box p={[0, 0.062, 0]} s={[w - 0.06, 0.004, d - 0.06]} c={col("#1d1e20", "#4a2a14", heat * 0.35)} r={0.35} m={0.7} rad={0.002} />
    {[-1, 1].map((k) => <Box key={k} p={[k * (w / 2 + 0.05), 0.05, 0]} s={[0.1, 0.03, 0.12]} c="#6b4a2e" r={0.7} rad={0.01} />)}
  </group>;
// cerdito de arcilla de frente/perfil reconocible: hocico con fosas, orejas, ojos, patas, colita
const Pig: React.FC<{ p: V; rotY?: number; s?: number; cheek?: number; jaw?: number; gold?: number }> = ({ p, rotY = 0, s = 1, cheek = 0, jaw = 0, gold = 0 }) =>
  <group position={p} rotation={[0, rotY, 0]} scale={s}>
    <mesh position={[0, 0.3, 0]} scale={[1.45, 1, 1]}><sphereGeometry args={[0.22, 32, 20]} /><meshStandardMaterial color="#f3b9ad" roughness={0.7} /></mesh>
    <mesh position={[0.34, 0.36, 0]}><sphereGeometry args={[0.15, 28, 18]} /><meshStandardMaterial color="#f3b9ad" roughness={0.7} /></mesh>
    <mesh position={[0.48, 0.34, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.065, 0.07, 0.06, 24]} /><meshStandardMaterial color="#e89a8e" roughness={0.6} /></mesh>
    {[-1, 1].map((k) => <mesh key={"n" + k} position={[0.512, 0.34, 0.022 * k]}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#8a3a34" /></mesh>)}
    <mesh position={[0.4, 0.24 - 0.03 * jaw, 0]} scale={[1, 0.45, 0.8]}><sphereGeometry args={[0.08, 20, 12]} /><meshStandardMaterial color="#e89a8e" roughness={0.7} /></mesh>
    {[-1, 1].map((k) => <mesh key={"e" + k} position={[0.43, 0.42, 0.075 * k]}><sphereGeometry args={[0.018, 12, 8]} /><meshStandardMaterial color="#231512" /></mesh>)}
    {[-1, 1].map((k) => <mesh key={"o" + k} position={[0.3, 0.5, 0.09 * k]} rotation={[0.5 * k, 0, -0.4]}><coneGeometry args={[0.06, 0.13, 4]} /><meshStandardMaterial color="#e89a8e" roughness={0.7} /></mesh>)}
    {[-1, 1].map((k) => <mesh key={"c" + k} position={[0.36, 0.3, 0.135 * k]} scale={[1, 0.8, 0.35]}><sphereGeometry args={[0.055 + 0.008 * cheek, 20, 12]} /><meshStandardMaterial color={col("#f3b9ad", "#e0453a", cheek)} emissive="#e0453a" emissiveIntensity={0.5 * cheek} /></mesh>)}
    {gold > 0.01 && [-1, 1].map((k) => <mesh key={"g" + k} position={[0.37, 0.29, 0.14 * k]} scale={[0.9, 0.8, 0.55]}><sphereGeometry args={[0.07 * Math.min(1, gold * 1.3), 20, 14]} /><meshStandardMaterial color="#ffd36a" emissive="#ffb347" emissiveIntensity={1.6 * gold} /></mesh>)}
    {[[-0.18, 0.1], [-0.18, -0.1], [0.18, 0.1], [0.18, -0.1]].map(([x, z], i) => <Cyl key={i} p={[x, 0.08, z]} r={0.04} h={0.16} c="#e89a8e" rough={0.7} />)}
    <mesh position={[-0.33, 0.36, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.03, 0.009, 8, 20, Math.PI * 1.6]} /><meshStandardMaterial color="#e89a8e" /></mesh>
  </group>;

// 0:08 · ESCONDIDA EN LA ESQUINA: la vitrina pasa de largo los cortes caros y un foco baja al rincón: el cuadrado pálido de $3.40
export const C_hidden: F = ({ t, h }) => {
  const a = it(h, 0, 4.0);
  const tags = useMemo(() => ["$11", "$9", "$14", "$3.40"].map((x, i) => cardTex([x], { bg: i === 3 ? "#fff6c2" : "#ffffff", fg: i === 3 ? RED : "#2a2a2a", w: 256, h: 128 })), []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([lerp(-0.4, 0.4, eio(tt, 0, a)), 0.85, 1.8], [lerp(-0.5, 0.42, eio(tt, 0, a)), 0.12, 0]), C([0.5, 0.62, 1.3], [0.45, 0.1, 0.05]), 10)}
    set={(tt: number) => ({ spot: [lerp(-0.6, 0.45, eio(tt, a - 0.5, a + 0.5)), 0, 0.1] as V, spotK: 0.2 + 0.4 * eio(tt, a - 0.5, a + 0.5) })}
    scene={(tt) => { const f = eio(tt, a - 0.6, a + 0.6), dim = 1 - 0.55 * f;
      return <>
        <Box p={[0, 0.02, 0]} s={[2.2, 0.04, 0.7]} c="#e8eef1" r={0.3} m={0.3} rad={0.01} />
        <Box p={[0, 0.3, -0.36]} s={[2.2, 0.6, 0.02]} c="#dfe7ea" r={0.2} m={0.2} rad={0.005} />
        {[[-0.75, "#c8564a", 0.3, 0], [-0.25, "#d98c7a", 0.22, 1], [0.15, "#b85a48", 0.28, 2]].map(([x, c, hh, i]) => <group key={i as number} position={[x as number, 0.04, -0.05]}>
          <Box p={[0, 0.05, 0]} s={[0.36, 0.08, 0.28]} c={col("#f4f1ea", "#8a8a86", 1 - dim)} r={0.5} rad={0.01} /><Box p={[0, 0.06 + (hh as number) * 0.1, 0]} s={[0.3, 0.06 + (hh as number) * 0.2, 0.22]} c={col(c as string, "#4a3632", 1 - dim)} r={0.55} rad={0.04} />
          <mesh position={[0.08, 0.16, 0.13]} rotation={[-0.4, 0, 0]}><planeGeometry args={[0.16, 0.08]} /><meshStandardMaterial map={tags[i as number]} color={col("#ffffff", "#777777", 1 - dim)} /></mesh></group>)}
        <group position={[0.55, 0.04, 0.12]}><Box p={[0, 0.03, 0]} s={[0.46, 0.06, 0.4]} c="#f4f1ea" r={0.5} rad={0.01} /><Jowl p={[0, 0.03, 0]} s={1.2} glow={f} />
          <Pop k={pop(tt, a + 0.3)} p={[0.12, 0.22, 0.18]}><mesh rotation={[-0.4, 0, 0]}><planeGeometry args={[0.24, 0.12]} /><meshStandardMaterial map={tags[3]} /></mesh></Pop></group>
        {f > 0.02 && <mesh position={[0.55, 0.62, 0.12]}><coneGeometry args={[0.32, 1.1, 40, 1, true]} /><meshBasicMaterial color="#fff1c4" transparent opacity={0.16 * f} depthWrite={false} side={THREE.DoubleSide} /></mesh>}
        <pointLight position={[0.55, 0.6, 0.3]} intensity={1.2 * f} distance={1.6} color="#ffe2a8" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 0.8} txt="$3.40 A POUND" col={AMB} />} />;
};

// 0:30 · LA FILA DE OSAKA: un puestito con noren rojo y farol; la fila de personitas crece hasta salir de cuadro
export const C_line: F = ({ t, h }) => {
  const a = 0.6;
  const nor = useMemo(() => cardTex(["とんトロ"], { bg: "#8a1f1f", fg: "#fff3d6", w: 256, h: 160 }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.9, 0.7, 1.9], [0.1, 0.25, 0]), C([1.2, 0.65, 1.6], [0.2, 0.25, 0]), 9)}
    set={{ spot: [-0.5, 0, 0] as V, spotK: 0.3, warm: 0.8 }}
    scene={(tt) => <>
      <group position={[-0.6, 0, -0.2]}><Box p={[0, 0.3, 0]} s={[0.6, 0.6, 0.4]} c="#6b4a2e" r={0.7} rad={0.02} />
        <mesh position={[0, 0.5, 0.21]}><planeGeometry args={[0.5, 0.18]} /><meshStandardMaterial map={nor} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0.36, 0.5, 0.15]}><sphereGeometry args={[0.07, 16, 12]} /><meshStandardMaterial color="#e23a2a" emissive="#ff5a2a" emissiveIntensity={0.8} /></mesh>
        <Steam p={[0, 0.62, 0]} t={tt} k={1} s={0.5} col="#d9d2c8" /></group>
      {Array.from({ length: 9 }, (_, i) => { const k = pop(tt, a + 0.35 * i); return <Pop key={i} k={k} p={[-0.15 + 0.2 * i, 0, 0.15 + 0.03 * Math.sin(i)]}><Folk p={[0, 0, 0]} c={["#c9b8a6", "#8fa6b8", "#b88f8f", "#a6b88f"][i % 4]} bob={0.01 * Math.sin(tt * 4 + i)} /></Pop>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={a + 2.6} txt="IN JAPAN, PEOPLE LINE UP" col={AMB} />} />;
};

// 1:06 · NUEVE BROCHETAS: un taco de madera con nueve palitos de bambú; cada uno se enciende con su número
export const C_nine: F = ({ t, h }) => {
  const a = 0.4, step = Math.min(0.75, Math.max(0.4, (it(h, 0, 8) - 1.0) / 9));
  const N = useMemo(() => Array.from({ length: 9 }, (_, i) => cardTex([String(i + 1)], { bg: "#fbf3df", fg: RED, w: 128, h: 128 })), []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.75, 1.75], [0, 0.42, 0]), C([0.25, 0.72, 1.65], [0, 0.42, 0]), 10)}
    set={{ spot: [0, 0.3, 0] as V, spotK: 0.3, warm: 0.4 }}
    scene={(tt) => <group scale={1.45}>
      <Box p={[0, 0.05, 0]} s={[1.12, 0.1, 0.18]} c="#8a5a34" r={0.7} rad={0.02} />
      {Array.from({ length: 9 }, (_, i) => { const k = pop(tt, a + step * i), on = eio(tt, a + step * i, a + step * i + 0.3);
        return k < 0.02 ? null : <group key={i} position={[-0.48 + 0.12 * i, 0.1, 0]}>
          <Cyl p={[0, 0.2 * Math.min(1, k), 0]} r={0.006} h={0.4 * Math.min(1, k)} c="#e2c48a" rough={0.7} />
          {[0, 1, 2].map((j) => <Box key={j} p={[0, 0.14 + 0.065 * j, 0]} s={[0.055, 0.048, 0.048]} c={col(PORK, GOLD, on * 0.85)} r={0.5} rad={0.015} />)}
          <mesh position={[0, 0.47, 0.01]} scale={0.6 + 0.4 * on}><planeGeometry args={[0.1, 0.1]} /><meshStandardMaterial map={N[i]} emissive="#ffb347" emissiveIntensity={0.7 * on} emissiveMap={N[i]} /></mesh></group>; })}
    </group>}
    over={(tt) => <Ink tt={tt} at={a + step * 9} txt="9 THINGS" col={AMB} />} />;
};

// 2:12 · BAJO LAS VÍAS: el puestito bajo el puente del tren; pasa el tren y los vasos tiemblan sobre el mostrador
export const C_tracks: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 4.0), 6.0);
  const nor = useMemo(() => cardTex(["やきとり"], { bg: "#8a1f1f", fg: "#fff3d6", w: 384, h: 128 }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => { const tx = -2.6 + ((tt * 0.5 + 0.35) % 1) * 5.2, sh = cl(1 - Math.abs(tx) / 1.3) * 0.012 * Math.sin(tt * 40); return orbita(tt, C([0.3, 0.95 + sh, 2.45], [0, 0.82 + sh, 0]), C([0.55, 0.92 + sh, 2.3], [0, 0.82 + sh, 0]), 10); }}
    set={{ spot: [0, 0.2, 0.2] as V, spotK: 0.35, warm: 0.9 }}
    scene={(tt) => { const tx = -2.6 + ((tt * 0.5 + 0.35) % 1) * 5.2, over = cl(1 - Math.abs(tx) / 1.3), sh = Math.sin(tt * 55) * 0.008 * over;
      return <>
        {[-0.9, 0.9].map((x) => <Box key={x} p={[x, 0.55, -0.35]} s={[0.12, 1.1, 0.14]} c="#6a6e74" m={0.5} r={0.5} rad={0.01} />)}
        <Box p={[0, 1.14, -0.35]} s={[2.4, 0.1, 0.4]} c="#4a4f56" m={0.6} r={0.4} rad={0.01} />
        {Array.from({ length: 12 }, (_, i) => <Box key={"r" + i} p={[-1.1 + 0.2 * i, 1.2, -0.35]} s={[0.04, 0.03, 0.42]} c="#5a3a22" r={0.8} rad={0.004} />)}
        <group position={[tx, 1.3, -0.35]} scale={[1.6, 1.9, 1.4]}><Box p={[0, 0, 0]} s={[1.3, 0.24, 0.32]} c="#e6dfd0" r={0.4} rad={0.05} /><Box p={[0, -0.05, 0.161]} s={[1.28, 0.04, 0.004]} c="#2f6fb5" r={0.4} rad={0.002} />
          {[0, 1, 2, 3, 4].map((i) => <Box key={i} p={[-0.48 + 0.24 * i, 0.04, 0.162]} s={[0.15, 0.09, 0.004]} c="#ffe6a8" e="#ffd27a" ei={0.8} r={0.3} rad={0.005} />)}</group>
        <group position={[0, 0, 0.05]}>
          <Box p={[0, 0.5, -0.12]} s={[1.1, 0.06, 0.4]} c="#6b4a2e" r={0.7} rad={0.01} />
          <mesh position={[0, 0.4, 0.09]}><planeGeometry args={[0.9, 0.16]} /><meshStandardMaterial map={nor} side={THREE.DoubleSide} /></mesh>
          <Box p={[0, 0.24, 0.1]} s={[1.0, 0.04, 0.28]} c="#7a5634" r={0.6} rad={0.01} />
          {[-0.3, -0.1, 0.1, 0.3].map((x, i) => <group key={i} position={[x + sh * (i % 2 ? 1 : -1), 0.26 + Math.abs(sh) * 3, 0.12]}><Cyl p={[0, 0.06, 0]} r={0.04} h={0.12} c="#f4fbff" rough={0.05} op={0.4} /><Cyl p={[0, 0.045, 0]} r={0.036} h={0.08} c={i % 2 ? "#f2c64a" : "#e9eef0"} rough={0.1} op={0.85} /></group>)}
          {Array.from({ length: 6 }, (_, i) => <Cyl key={"s" + i} p={[-0.45 + 0.18 * i, 0.08, 0.36]} r={0.06} h={0.16} c="#5a3a22" rough={0.6} />)}
          <Steam p={[0.42, 0.3, 0]} t={tt} k={1} s={0.5} col="#d9d2c8" />
        </group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 0.4} txt="THE GLASSES SHOOK" col={AMB} />} />;
};

// 3:00 · TON + TORO: la feta de atún toro se transforma en la feta de cerdo; las dos fichas de palabra se juntan
export const C_toro: F = ({ t, h }) => {
  const a = 4.0;
  const T1 = useMemo(() => cardTex(["TON"], { bg: "#fbf3df", fg: "#3a2a18", w: 256, h: 128 }), []), T2 = useMemo(() => cardTex(["TORO"], { bg: "#fbf3df", fg: RED, w: 256, h: 128 }), []);
  const TT = useMemo(() => cardTex(["TONTORO"], { bg: "#8a1f1f", fg: "#fff3d6", w: 512, h: 128 }), []), PIG = useMemo(() => cardTex(["PIG"], { bg: "#fbf3df", fg: "#3a2a18", w: 256, h: 128 }), []), TUNA = useMemo(() => cardTex(["TUNA"], { bg: "#fbf3df", fg: "#3a2a18", w: 256, h: 128 }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.7, 1.55], [0, 0.25, 0]), C([0.2, 0.68, 1.45], [0, 0.25, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const m = eio(tt, 1.6, 5.2), j = eio(tt, 2.4, 5.0);
      return <>
        <Box p={[0, 0.06, 0]} s={[0.9, 0.04, 0.36]} c="#c9955a" r={0.7} rad={0.01} />{[-0.38, 0.38].map((x) => <Box key={x} p={[x, 0.02, 0]} s={[0.06, 0.04, 0.32]} c="#a8743a" r={0.7} rad={0.005} />)}
        <group position={[0, 0.1, 0]} scale={1 + 0.15 * Math.sin(Math.PI * m)}><Box p={[0, 0.02, 0]} s={[0.5, 0.05, 0.26]} c={col("#e0485a", PORK, m)} r={0.35} rad={0.02} e="#ff6a6a" ei={0.25 * Math.sin(Math.PI * m)} />
          {Array.from({ length: 7 }, (_, i) => <Box key={i} p={[-0.2 + 0.066 * i, 0.047, 0]} s={[0.012, 0.004, 0.22]} c={FAT} r={0.4} rad={0.002} rot={[0, 0.5 * Math.sin(i + m * 3), 0]} />)}</group>
        <group position={[0.3, 0.1, 0.25]}><mesh position={[0, 0, 0]} rotation={[-0.5, 0, 0]}><planeGeometry args={[0.16, 0.08]} /><meshStandardMaterial map={m < 0.5 ? TUNA : PIG} /></mesh></group>
        {j < 0.98 && <><Pop k={pop(tt, 0.4) * (1 - j)} p={[lerp(-0.32, -0.14, j), 0.38, 0.1]}><mesh><planeGeometry args={[0.3, 0.15]} /><meshStandardMaterial map={T1} /></mesh></Pop>
          <Pop k={pop(tt, 0.8) * (1 - j)} p={[lerp(0.32, 0.16, j), 0.38, 0.1]}><mesh><planeGeometry args={[0.3, 0.15]} /><meshStandardMaterial map={T2} /></mesh></Pop></>}
        <Pop k={pop(tt, 5.0)} p={[0, 0.38, 0.1]}><mesh><planeGeometry args={[0.62, 0.16]} /><meshStandardMaterial map={TT} emissive="#ff6a3a" emissiveIntensity={0.3} emissiveMap={TT} /></mesh></Pop>
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 1.4} txt="THE TORO OF THE PIG" col={AMB} />} />;
};

// 3:25 · MASTICA TODO EL DÍA: cabeza de cerdo de perfil que mastica; el cachete late en rojo y salen las hebras de músculo
export const C_chew: F = ({ t, h }) => {
  const a = 4.0;
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.9, 0.55, 1.15], [0.2, 0.33, 0]), C([1.0, 0.55, 1.0], [0.2, 0.33, 0]), 8)}
    set={{ spot: [0.3, 0.3, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const ch = Math.abs(Math.sin(tt * 5)), hl = eio(tt, 1.0, 2.4);
      return <>
        <Pig p={[0, 0, 0]} rotY={-0.25} s={1.2} cheek={hl * (0.5 + 0.5 * ch)} jaw={ch} />
        {[0, 1, 2].map((i) => { const u = ((tt * 0.8 + i / 3) % 1); return <mesh key={i} position={[0.62, 0.22 + 0.3 * u, 0.1 + 0.05 * i]}><sphereGeometry args={[0.02, 8, 6]} /><meshStandardMaterial color="#7fc05a" transparent opacity={0.8 * (1 - u)} /></mesh>; })}
        <Box p={[0.75, 0.04, 0.05]} s={[0.3, 0.08, 0.22]} c="#8a6a4a" r={0.8} rad={0.02} />
        {Array.from({ length: 6 }, (_, i) => <mesh key={"f" + i} position={[0.68 + 0.03 * i, 0.1, 0.0 + 0.02 * Math.sin(i)]}><sphereGeometry args={[0.025, 10, 8]} /><meshStandardMaterial color={i % 2 ? "#c9a24a" : "#7fa04a"} roughness={0.8} /></mesh>)}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.6} txt="IT CHEWS ALL DAY" col={AMB} y={250} /><Ink tt={tt} at={a} txt="A HARD-WORKING MUSCLE" col="#ff8a7a" /></>} />;
};

// 3:45 · LA GRASA ADENTRO: corte de dos bloques: el lomo liso vs la papada con hilos de grasa; llega el calor y los hilos se derriten en gotitas doradas
export const C_marble: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 4.0), 6.0);
  const L = useMemo(() => ["TENDERLOIN", "JOWL"].map((x) => cardTex([x], { bg: "#fbf3df", fg: "#3a2a18", w: 320, h: 96 })), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.55, 1.75], [0, 0.22, 0]), C([0.2, 0.55, 1.65], [0, 0.22, 0]), 10)}
    set={(tt: number) => ({ spot: [0.45, 0, 0] as V, spotK: 0.3, warm: tt > a ? 0.8 : 0.2 })}
    scene={(tt) => { const mt = eio(tt, a, a + 2.0);
      return <>
        <Box p={[-0.45, 0.2, 0]} s={[0.55, 0.36, 0.3]} c="#c94a44" r={0.5} rad={0.02} />
        <Box p={[0.45, 0.2, 0]} s={[0.55, 0.36, 0.3]} c={col("#e88a7a", "#c46a3a", mt * 0.6)} r={0.5} rad={0.02} />
        {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0.45, 0.06 + 0.035 * i, 0.152]} rotation={[0, 0, 0.15 * Math.sin(i * 1.7)]} scale={[1, 1 - 0.7 * mt, 1]}><planeGeometry args={[0.5, 0.012]} /><meshStandardMaterial color={col(FAT, "#ffc04a", mt)} emissive="#ffb347" emissiveIntensity={0.5 * mt} /></mesh>)}
        {mt > 0.05 && Array.from({ length: 14 }, (_, i) => { const u = ((tt * 0.6 + i / 14) % 1); return <mesh key={"d" + i} position={[0.22 + 0.46 * ((i * 0.37) % 1), 0.36 - 0.3 * u, 0.16]}><sphereGeometry args={[0.014, 10, 8]} /><meshStandardMaterial color="#ffc04a" emissive="#ff9a2a" emissiveIntensity={0.8} transparent opacity={mt * Math.sin(Math.PI * u)} /></mesh>; })}
        {[-0.45, 0.45].map((x, i) => <mesh key={i} position={[x, 0.05, 0.26]} rotation={[-0.35, 0, 0]}><planeGeometry args={[0.36, 0.11]} /><meshStandardMaterial map={L[i]} /></mesh>)}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.8} txt="FAT INSIDE, LIKE THREADS" col={AMB} y={250} /><Ink tt={tt} at={a + 0.8} txt="FAST & HOT: IT MELTS IN" col="#ffb347" /></>} />;
};

// 4:15 · SÓLO DOS POR CERDO: el cerdo de arcilla con dos cuadraditos que brillan en los cachetes; al lado una montaña de chuletas
export const C_onlytwo: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 3.0), 5.0);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.55, 0.7, 1.75], [0.1, 0.3, 0]), C([0.75, 0.68, 1.6], [0.1, 0.3, 0]), 10)}
    set={{ spot: [-0.2, 0.3, 0] as V, spotK: 0.35 }}
    scene={(tt) => { const g = eio(tt, 0.6, 1.4), st = eio(tt, 1.2, 3.2);
      return <>
        <Pig p={[-0.3, 0, -0.1]} rotY={-Math.PI / 2} s={1.25} gold={g} />
        {[-1, 1].map((k) => <pointLight key={k} position={[-0.3 + 0.2 * k, 0.36, 0.35]} intensity={0.6 * g} distance={0.6} color="#ffcf6a" />)}
        {Array.from({ length: Math.round(st * 12) }, (_, i) => <Box key={i} p={[0.5 + 0.12 * (i % 3), 0.03 + 0.05 * Math.floor(i / 3), 0.05 * Math.sin(i)]} s={[0.2, 0.04, 0.14]} c="#e3a090" r={0.5} rad={0.015} rot={[0, 0.3 * Math.sin(i * 2), 0]} />)}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.2} txt="ONLY 2 PER PIG" col={AMB} y={250} /><Ink tt={tt} at={a + 1.0} txt="RARE · DELICIOUS" col="#ffb347" /></>} />;
};

// 4:55 · DÓNDE SE ESCONDE: tres frentes de tienda en fila (súper, mercado asiático, carnicería mexicana); a cada uno se le abre la puerta de atrás con un paquete
export const C_where: F = ({ t, h }) => {
  const ts = [0.5, Math.min(it(h, 0, 3.0), 3.5), Math.min(it(h, 1, 5.5), 6.5)];
  const L = useMemo(() => [["SUPERMARKET", "#2f6fb5"], ["ASIAN MARKET", "#c62828"], ["CARNICERÍA", "#2e8a4a"]].map(([x, c]) => cardTex([x], { bg: c, fg: "#ffffff", w: 384, h: 96 })), []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.8, 2.3], [0, 0.35, 0]), C([0.3, 0.75, 2.15], [0, 0.35, 0]), 10)}
    set={(tt: number) => ({ spot: [tt < ts[1] ? -0.65 : tt < ts[2] ? 0 : 0.65, 0, 0.2] as V, spotK: 0.35 })}
    scene={(tt) => <>
      {[-0.65, 0, 0.65].map((x, i) => { const k = pop(tt, ts[i]), d = eio(tt, ts[i] + 0.4, ts[i] + 1.0);
        return k < 0.02 ? null : <Pop key={i} k={k} p={[x, 0, 0]}>
          <Box p={[0, 0.3, 0]} s={[0.55, 0.6, 0.35]} c={["#e9e4da", "#f1e3c8", "#f2d8b8"][i]} r={0.7} rad={0.02} />
          <mesh position={[0, 0.5, 0.176]}><planeGeometry args={[0.48, 0.12]} /><meshStandardMaterial map={L[i]} /></mesh>
          <group position={[-0.1, 0.17, 0.176]} rotation={[0, -1.4 * d, 0]}><Box p={[0.1, 0, 0]} s={[0.2, 0.3, 0.01]} c="#7a5634" r={0.6} rad={0.005} /></group>
          {d > 0.3 && <Jowl p={[0, 0.0, 0.3 * d]} s={0.5} glow={d} />}
        </Pop>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={ts[2] + 1.2} txt="ASK: THEY KEEP IT IN THE BACK" col={AMB} />} />;
};

// 5:45 · EL PAQUETE DE DANNY (1988): papel de carnicero atado con hilo; el moño se desata, se abre y hay cuatro piezas; una notita «SAVED FOR YOU»
export const C_danny: F = ({ t, h }) => {
  const note = useMemo(() => cardTex(["SAVED", "FOR YOU · 1988"], { bg: "#fff8e0", fg: "#3a2a18", w: 320, h: 200 }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.9, 1.45], [0, 0.08, 0]), C([0.22, 0.85, 1.38], [0, 0.08, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.6 }}
    scene={(tt) => { const u = eio(tt, 0.5, 1.3), o = eio(tt, 1.3, 2.6);
      return <group position={[0, 0.03, 0]} scale={1.3}>
        <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.45]} /><meshStandardMaterial color={PAPER} roughness={0.95} /></mesh>
        {[[0, 0.225, 0], [0, -0.225, Math.PI], [0.3, 0, -Math.PI / 2], [-0.3, 0, Math.PI / 2]].map(([x, z, ry], i) => <group key={i} position={[x, 0.004, z]} rotation={[0, ry, 0]}>
          <group rotation={[(Math.PI / 2 + 0.6) * (1 - o) * -1 * 0 - (1 - o) * 2.2, 0, 0]}><mesh position={[0, 0, 0.11]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[i < 2 ? 0.6 : 0.45, 0.22]} /><meshStandardMaterial color={col(PAPER, "#d8c8a4", i * 0.1)} roughness={0.95} side={THREE.DoubleSide} /></mesh></group></group>)}
        {o > 0.35 && [0, 1, 2, 3].map((i) => <Jowl key={i} p={[-0.2 + 0.135 * i, 0.006, 0.03 * Math.sin(i)]} s={0.36} glow={0.25} />)}
        {u < 0.98 && <><Box p={[0, 0.25 * (1 - o) + 0.02, 0]} s={[0.66, 0.006, 0.006]} c="#f4efe2" r={0.9} rad={0.002} /><Box p={[0, 0.25 * (1 - o) + 0.02, 0]} s={[0.006, 0.006, 0.5]} c="#f4efe2" r={0.9} rad={0.002} />
          <mesh position={[0, 0.26 * (1 - o) + 0.03 + 0.1 * u, 0]} rotation={[0, 0, u * 2]}><torusGeometry args={[0.04 * (1 - u) + 0.005, 0.006, 6, 20]} /><meshStandardMaterial color="#f4efe2" /></mesh></>}
        <Pop k={pop(tt, 1.6)} p={[-0.3, 0.2, 0.22]}><mesh rotation={[-0.5, 0.25, -0.08]}><planeGeometry args={[0.3, 0.19]} /><meshStandardMaterial map={note} /></mesh></Pop>
      </group>; }}
    over={(tt) => <Ink tt={tt} at={2.0} txt="FOUR PIECES · ALMOST NOTHING" col={AMB} />} />;
};

// 7:00 · LA VETA DE LA MADERA: una tabla de madera al lado de la carne con las mismas líneas; el cuchillo corta a través = hebras cortas, a lo largo = hebras largas que se estiran
export const C_grain: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 4.0), 5.0);
  const lines = (base: string, ln: string) => mk(512, 256, (g) => { g.fillStyle = base; g.fillRect(0, 0, 512, 256); g.strokeStyle = ln; g.lineWidth = 5; for (let y = 10; y < 256; y += 20) { g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= 512; x += 16) g.lineTo(x, y + 4 * Math.sin(x * 0.03 + y)); g.stroke(); } });
  const wood = useMemo(() => lines("#c9955a", "rgba(110,60,20,.75)"), []), meat = useMemo(() => lines("#e48a7a", "rgba(255,244,236,.95)"), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.85, 1.25], [0, 0.04, 0.05]), C([0.22, 0.82, 1.2], [0, 0.04, 0.05]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const k1 = eio(tt, 1.0, 2.2), k2 = eio(tt, a, a + 1.4);
      return <>
        <Box p={[-0.36, 0.02, -0.12]} s={[0.6, 0.04, 0.32]} c="#a8743a" r={0.8} rad={0.004} />
        <mesh position={[-0.36, 0.041, -0.12]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.32]} /><meshStandardMaterial map={wood} roughness={0.8} /></mesh>
        <Box p={[0.36, 0.03, -0.12]} s={[0.6, 0.06, 0.32]} c="#c86a5a" r={0.6} rad={0.01} />
        <mesh position={[0.36, 0.061, -0.12]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.32]} /><meshStandardMaterial map={meat} roughness={0.6} /></mesh>
        {k1 > 0.02 && k1 < 0.98 && <group position={[lerp(0.1, 0.62, k1), 0.12, -0.12]}><Box p={[0, 0, 0]} s={[0.01, 0.12, 0.4]} c="#d5d9dd" m={0.95} r={0.15} rad={0.003} /><Box p={[0, 0.08, 0.22]} s={[0.03, 0.04, 0.12]} c="#2a2018" r={0.6} rad={0.01} /></group>}
        {k2 > 0.02 && k2 < 0.98 && <group position={[0.36, 0.12, lerp(-0.28, 0.04, k2)]} rotation={[0, Math.PI / 2, 0]}><Box p={[0, 0, 0]} s={[0.01, 0.12, 0.66]} c="#d5d9dd" m={0.95} r={0.15} rad={0.003} /></group>}
        {k1 > 0.3 && [0, 1, 2, 3, 4].map((i) => <Box key={i} p={[0.1 + 0.11 * i, 0.03, 0.17]} s={[0.04, 0.03, 0.12]} c="#e48a7a" r={0.6} rad={0.008} />)}
        {k2 > 0.3 && [0, 1].map((i) => <Box key={"l" + i} p={[0.36, 0.03, 0.3 + 0.06 * i]} s={[0.58, 0.02, 0.035]} c="#d8786a" r={0.6} rad={0.008} />)}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.4} txt="ACROSS = SHORT · TENDER" col="#7fe0a0" y={250} /><Ink tt={tt} at={a + 0.6} txt="ALONG = LONG · CHEWY" col="#ff8a7a" /></>} />;
};

// 7:15 · EL GROSOR DE UNA MONEDA: una moneda parada al lado de la feta; una regla marca 6 mm
export const C_coin: F = ({ t, h }) => {
  const a = 0.6;
  const mmT = useMemo(() => mk(512, 64, (g) => { g.fillStyle = "#f2d48a"; g.fillRect(0, 0, 512, 64); g.fillStyle = "#3a2a18"; for (let i = 0; i <= 40; i++) g.fillRect(8 + i * 12, 0, 2, i % 5 ? 18 : 34); g.font = "700 22px Arial"; [0, 1, 2, 3].forEach((c) => g.fillText(String(c), 4 + c * 120, 56)); }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.05, 0.22, 0.75], [0, 0.07, 0]), C([0.18, 0.24, 0.7], [0, 0.07, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const k = pop(tt, a), sl = eio(tt, a + 0.8, a + 1.8), r = eio(tt, a + 2.0, a + 2.8);
      return <>
        <Box p={[0, 0.035, 0]} s={[0.9, 0.03, 0.5]} c="#c9a477" r={0.7} rad={0.005} />
        <Pop k={k} p={[-0.12, 0.05, 0]}><Coin p={[0, 0.07, 0]} s={1.6} rot={[0, 0.3, Math.PI / 2]} /></Pop>
        {sl > 0.02 && <group position={[lerp(0.6, 0.12, sl), 0.05, 0]}><JSlice p={[0, 0, 0]} rot={[0, 0, Math.PI / 2]} s={0.55} /></group>}
        {r > 0.02 && <mesh position={[0, 0.05 + 0.07 * r, 0.09]} rotation={[0, 0, Math.PI / 2]}><planeGeometry args={[0.16, 0.02]} /><meshStandardMaterial map={mmT} /></mesh>}
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 2.4} txt="1/4 INCH · 6 MM" col={AMB} />} />;
};

// 8:15 · LA BANDA ELÁSTICA: la feta hervida se estira entre dos tenedores como goma y rebota; al lado la sartén caliente
export const C_rubber: F = ({ t, h }) => {
  const a = 3.5;
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.62, 1.35], [0, 0.3, 0]), C([0.2, 0.6, 1.28], [0, 0.3, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const on = eio(tt, 0.4, 1.0), st = on * (0.5 + 0.5 * Math.sin(tt * 2.6 - 1.2)), L = 0.34 + 0.5 * st;
      return <>
        <group position={[-0.62, 0, -0.3]}><Cyl p={[0, 0.1, 0]} r={0.16} h={0.2} c="#7a8088" m={0.6} rough={0.3} /><Cyl p={[0, 0.19, 0]} r={0.145} h={0.03} c="#c9c2b4" rough={0.2} op={0.8} /><Steam p={[0, 0.25, 0]} t={tt} k={1} s={0.5} /></group>
        <group position={[0, 0.3, 0.05]}>
          <Box p={[0, 0, 0]} s={[L, 0.06 * (1 - 0.4 * st), 0.3 * (1 - 0.45 * st)]} c="#d9b8a8" r={0.3} rad={0.025} />
          {[-1, 0, 1].map((j) => <Box key={j} p={[0, 0.032 * (1 - 0.4 * st), 0.06 * j * (1 - 0.45 * st)]} s={[L * 0.9, 0.004, 0.012]} c="#f4e6dc" r={0.4} rad={0.002} />)}
          {[-1, 1].map((k) => <group key={k} position={[k * (L / 2 - 0.04), 0.02, 0]} rotation={[0, 0, -k * 0.45]}>
            <Cyl p={[0, 0.22, 0]} r={0.018} h={0.34} c="#d5d9dd" m={0.95} rough={0.18} />
            <Box p={[0, 0.05, 0]} s={[0.03, 0.03, 0.12]} c="#d5d9dd" m={0.95} r={0.18} rad={0.008} />
            {[-1.5, -0.5, 0.5, 1.5].map((q) => <Cyl key={q} p={[0, -0.0, 0.03 * q]} r={0.007} h={0.1} c="#d5d9dd" m={0.95} rough={0.18} />)}</group>)}
        </group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={a} txt="BOILED SLOWLY = RUBBER" col="#ff8a7a" />} />;
};

// 9:25 · EL MÚSCULO QUE RESPIRA: la vaca de arcilla con el diafragma como un fuelle que sube y baja; se separa la tira de harami
export const C_breathe: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 4.0), 6.0);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.15, 0.6, 1.9], [0.05, 0.36, 0]), C([0.35, 0.58, 1.8], [0.05, 0.36, 0]), 10)}
    set={{ spot: [0, 0.3, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const br = 0.5 + 0.5 * Math.sin(tt * 2.2), out = eio(tt, a, a + 1.2);
      return <>
        <group position={[-0.1, 0, 0]}>
          <Box p={[0, 0.42, 0]} s={[0.78, 0.36, 0.36]} c="#f6f2ea" r={0.75} rad={0.14} />
          {[[-0.22, 0.5, 0.12], [0.15, 0.38, 0.1], [-0.02, 0.55, 0.08]].map(([x, y, r], i) => <mesh key={i} position={[x, y, 0.181]} scale={[1.3, 1, 0.12]}><sphereGeometry args={[r, 16, 10]} /><meshStandardMaterial color="#2a201c" roughness={0.8} /></mesh>)}
          <Box p={[0.47, 0.56, 0]} s={[0.22, 0.2, 0.2]} c="#f6f2ea" r={0.75} rad={0.07} />
          <Box p={[0.59, 0.5, 0]} s={[0.07, 0.12, 0.16]} c="#f2b8b0" r={0.6} rad={0.04} />
          {[-1, 1].map((k) => <group key={k}><mesh position={[0.44, 0.69, 0.08 * k]} rotation={[0.6 * k, 0, 0.2]}><coneGeometry args={[0.018, 0.09, 10]} /><meshStandardMaterial color="#e8dcc4" /></mesh>
            <mesh position={[0.4, 0.6, 0.13 * k]} rotation={[0.9 * k, 0, 0]} scale={[1, 0.5, 0.25]}><sphereGeometry args={[0.05, 12, 8]} /><meshStandardMaterial color="#2a201c" /></mesh>
            <mesh position={[0.53, 0.6, 0.101 * k]}><sphereGeometry args={[0.014, 10, 8]} /><meshStandardMaterial color="#1a1210" /></mesh></group>)}
          {[[-0.27, 0.11], [-0.27, -0.11], [0.27, 0.11], [0.27, -0.11]].map(([x, z], i) => <Cyl key={i} p={[x, 0.13, z]} r={0.04} h={0.26} c="#f6f2ea" rough={0.7} />)}
          <Cyl p={[-0.4, 0.38, 0]} r={0.008} h={0.25} c="#2a201c" rough={0.7} rot={[0, 0, -0.3]} />
          <mesh position={[0.02, 0.42, 0.182]}><circleGeometry args={[0.13, 32]} /><meshStandardMaterial color="#3a1414" /></mesh>
          {[0, 1, 2, 3].map((i) => <mesh key={"b" + i} position={[0.02, 0.42, 0.19 + 0.012 * i]} scale={[1, 0.85 + 0.25 * br * (1 - out), 1]}><circleGeometry args={[0.11 - 0.022 * i, 32]} /><meshStandardMaterial color={i % 2 ? "#a83030" : "#d0504a"} emissive="#c8463e" emissiveIntensity={0.2 * br} /></mesh>)}
        </group>
        {out > 0.02 && <Box p={[lerp(-0.08, 0.7, out), 0.06 + 0.36 * (1 - out), 0.32]} s={[0.46, 0.035, 0.11]} c="#b8443a" r={0.5} rad={0.012} />}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.8} txt="IT HELPS THE COW BREATHE" col={AMB} y={250} /><Ink tt={tt} at={a + 0.8} txt="HARAMI · THE SKIRT" col="#ff8a7a" /></>} />;
};

// 10:35 · EL ASCENSOR DE PRECIOS: la feta de lengua sube por una escalera de precios y termina arriba del bife
export const C_sendai: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 4.0), 6.0);
  const P = useMemo(() => ["$", "$$", "$$$", "$$$$"].map((x) => cardTex([x], { bg: "#fbf3df", fg: RED, w: 256, h: 128 })), []);
  const ST = useMemo(() => cardTex(["STEAK"], { bg: "#ffffff", fg: "#3a2a18", w: 256, h: 96 }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.25, 0.75, 1.9], [0, 0.38, 0]), C([0.45, 0.72, 1.8], [0, 0.38, 0]), 10)}
    set={{ spot: [0.2, 0.3, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const up = eio(tt, 0.6, a + 0.4), lv = up * 3;
      return <>
        {[0, 1, 2, 3].map((i) => <group key={i} position={[-0.45 + 0.3 * i, 0, 0]}><Box p={[0, 0.06 + 0.1 * i, 0]} s={[0.3, 0.12 + 0.2 * i, 0.34]} c={["#eadfcc", "#e0d0b4", "#d6c09a", "#ccb180"][i]} r={0.7} rad={0.01} />
          <mesh position={[0, 0.06 + 0.1 * i, 0.172]}><planeGeometry args={[0.18, 0.09]} /><meshStandardMaterial map={P[i]} /></mesh></group>)}
        <group position={[-0.45 + 0.3 * lv, 0.14 + 0.2 * lv + 0.06 * Math.abs(Math.sin(lv * Math.PI)) + 0.05, 0.08]} rotation={[0, 0.3, 0]} scale={2.2}>
          <mesh scale={[1.6, 0.35, 0.8]}><sphereGeometry args={[0.08, 24, 12]} /><meshStandardMaterial color="#d48a94" roughness={0.5} emissive="#ffd27a" emissiveIntensity={0.2 * up} /></mesh>
          <mesh position={[0.1, 0, 0]} scale={[1, 0.33, 0.8]}><sphereGeometry args={[0.07, 20, 12]} /><meshStandardMaterial color="#d48a94" roughness={0.5} /></mesh>
          <Box p={[0.02, 0.026, 0]} s={[0.16, 0.002, 0.003]} c="#b86a74" r={0.6} rad={0.001} /></group>
        <group position={[-0.62, 0, 0.3]}><Box p={[0, 0.02, 0]} s={[0.2, 0.035, 0.14]} c="#9a3a30" r={0.5} rad={0.03} /><Box p={[0.09, 0.022, 0]} s={[0.03, 0.038, 0.14]} c={FAT} r={0.5} rad={0.01} />
          <mesh position={[0, 0.07, 0.04]} rotation={[-0.6, 0, 0]}><planeGeometry args={[0.14, 0.05]} /><meshStandardMaterial map={ST} /></mesh></group>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.8} txt="GYUTAN · BEEF TONGUE" col={AMB} y={250} /><Ink tt={tt} at={a + 0.8} txt="NOW MORE THAN A STEAK" col="#ff8a7a" /></>} />;
};

// 11:50 · UNA CHULETA = SEIS BROCHETAS: la etiqueta de precio de la chuleta se corta en seis y cada tira se vuelve una brocheta dorada
export const C_skewers: F = ({ t, h }) => {
  const a = 0.6;
  const tag = useMemo(() => cardTex(["1 PORK CHOP"], { bg: "#ffffff", fg: "#2a2a2a", w: 384, h: 128 }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.8, 1.8], [0, 0.22, 0]), C([0.3, 0.75, 1.7], [0, 0.22, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.4 }}
    scene={(tt) => { const cut = eio(tt, a + 0.6, a + 1.6), fly = eio(tt, a + 1.6, a + 3.0);
      return <>
        <group position={[-0.5, 0, 0]}><Box p={[0, 0.03, 0]} s={[0.36, 0.05, 0.26]} c="#e8a090" r={0.5} rad={0.05} /><Box p={[0.12, 0.035, 0]} s={[0.1, 0.055, 0.2]} c={FAT} r={0.5} rad={0.04} /></group>
        {Array.from({ length: 6 }, (_, i) => { const x0 = -0.5 - 0.15 + 0.06 * i + 0.03 * cut * (i - 2.5), x1 = 0.05 + 0.13 * i;
          return <group key={i} position={[lerp(x0, x1, fly), lerp(0.25, 0.18, fly) + 0.25 * Math.sin(Math.PI * fly), lerp(0.12, 0.05, fly)]} rotation={[0, 0, fly * Math.PI / 2]}>
            {fly < 0.6 && <mesh rotation={[-0.3, 0, 0]}><planeGeometry args={[0.058, 0.1]} /><meshStandardMaterial map={tag} transparent opacity={1 - fly * 1.6} /></mesh>}
            {fly > 0.4 && <group rotation={[0, 0, -Math.PI / 2]}><Cyl p={[0, 0, 0]} r={0.005} h={0.36} c="#e2c48a" rough={0.7} />{[0, 1, 2].map((j) => <Box key={j} p={[0, -0.06 + 0.06 * j, 0]} s={[0.05, 0.045, 0.045]} c={col("#f2e2c8", GOLD, 0.8)} r={0.45} rad={0.015} />)}</group>}</group>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 3.0} txt="6 SKEWERS = 1 CHOP" col={AMB} />} />;
};

// 12:15 · LA SALSA DE MAMÁ: tres cucharas medidoras vuelcan en la ollita; las burbujas se vuelven lentas y la salsa brilla espesa sobre la feta
export const C_sauce: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 5.0), 6.5);
  const L = useMemo(() => ["SOY ×2", "MIRIN", "SUGAR"].map((x) => cardTex([x], { bg: "#fbf3df", fg: "#3a2a18", w: 256, h: 96 })), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 1.05, 1.0], [0, 0.22, 0]), C([0.2, 1.02, 0.95], [0, 0.22, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.6 }}
    scene={(tt) => { const th = eio(tt, 1.0, a + 0.6);
      return <>
        <Cyl p={[0, 0.15, 0]} r={0.26} r2={0.24} h={0.3} c="#a33a2a" m={0.2} rough={0.25} />
        <mesh position={[0, 0.30, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.26, 0.012, 10, 48]} /><meshStandardMaterial color="#e8dccb" roughness={0.3} /></mesh>
        <group position={[0.44, 0.2, -0.12]} rotation={[0, 0, 1.2]}><Cyl p={[0, 0, 0]} r={0.25} h={0.02} c="#a33a2a" m={0.2} rough={0.25} /><Cyl p={[0, 0.03, 0]} r={0.03} h={0.04} c="#2a1810" rough={0.5} /></group>
        <mesh position={[0, 0.303, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.25, 48]} /><meshPhysicalMaterial color={col("#6a3a14", "#2a0c02", th)} roughness={lerp(0.35, 0.02, th)} clearcoat={1} clearcoatRoughness={0.03} metalness={0.2} /></mesh>
        <pointLight position={[0.2, 0.8, 0.5]} intensity={0.9} distance={1.6} color="#fff4e0" />
        {[0, 1, 2].map((i) => <group key={i} position={[-0.11 + 0.11 * i, 0.3, 0.03 * Math.sin(i * 2)]} rotation={[0, i, 0]}><JSlice p={[0, 0, 0]} s={0.55} g={0.9} />
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.13, 0.09]} /><meshStandardMaterial color="#3a1404" transparent opacity={0.55 * th} roughness={0.02} metalness={0.3} /></mesh></group>)}
        {Array.from({ length: 8 }, (_, i) => { const sp = lerp(2.0, 0.45, th), u = ((tt * sp + i / 8) % 1); return <mesh key={i} position={[0.18 * Math.cos(i * 2.4), 0.306, 0.18 * Math.sin(i * 2.4)]} scale={0.5 + 1.6 * u}><sphereGeometry args={[0.014, 10, 8]} /><meshPhysicalMaterial clearcoat={1} color="#7a4a22" transparent opacity={1 - u} roughness={0.03} /></mesh>; })}
        <group rotation={[0, tt * 1.4, 0]}><group position={[0.12, 0.42, 0]} rotation={[0, 0, 0.35]}><Cyl p={[0, 0, 0]} r={0.014} h={0.36} c="#c9955a" rough={0.6} /><mesh position={[0, -0.17, 0]} scale={[1, 0.4, 0.6]}><sphereGeometry args={[0.045, 16, 10]} /><meshStandardMaterial color="#c9955a" roughness={0.6} /></mesh></group></group>
        {[0, 1, 2].map((i) => { const k = eio(tt, 0.2 + 0.7 * i, 0.6 + 0.7 * i), pour = eio(tt, 0.6 + 0.7 * i, 0.85 + 0.7 * i), out = eio(tt, 0.85 + 0.7 * i, 1.05 + 0.7 * i);
          return k < 0.02 || out > 0.98 ? null : <group key={"sp" + i} position={[lerp(0.6, 0.1, k), 0.5, 0.12]} rotation={[0, 0, 1.3 * pour]} scale={2.3}>
            <mesh scale={[1, 0.45, 1]}><sphereGeometry args={[0.06, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#d5d9dd" metalness={0.95} roughness={0.15} side={THREE.DoubleSide} /></mesh>
            <Cyl p={[0.14, 0.01, 0]} r={0.008} h={0.18} c="#d5d9dd" m={0.95} rough={0.15} rot={[0, 0, Math.PI / 2]} />
            {pour > 0.2 && <Cyl p={[-0.04, -0.06, 0]} r={0.008} h={0.1} c={["#2a0e04", "#e2b34a", "#f6f1e2"][i]} rough={0.1} />}
            <mesh position={[0, 0.09, 0]} rotation={[-0.8, 0, 0]}><planeGeometry args={[0.12, 0.045]} /><meshStandardMaterial map={L[i]} /></mesh></group>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 0.4} txt="THICK AND SHINY" col={AMB} />} />;
};

// 13:05 · UNA PIEZA, CINCO CENAS: el trozo se parte en cinco fetas que vuelan a cinco recipientes distintos (plato, bol de arroz, wok, olla de sopa, sartén de fideos)
export const C_five: F = ({ t, h }) => {
  const ts = [1.4, 2.6, 3.8, 5.0, 6.2];
  const D = useMemo(() => ["MON", "TUE", "WED", "THU", "FRI"].map((x) => cardTex([x], { bg: "#8a1f1f", fg: "#fff3d6", w: 192, h: 96 })), []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.85, 1.5], [0, 0.18, 0]), C([0.22, 0.82, 1.42], [0, 0.18, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.5 }}
    scene={(tt) => { const cut = eio(tt, 0.4, 1.2);
      return <group scale={1.02}>
        <group position={[0, 0, -0.3]}>{[0, 1, 2, 3, 4].map((i) => tt > ts[i] ? null : <Box key={i} p={[-0.12 + 0.06 * i + 0.012 * cut * (i - 2), 0.06, 0]} s={[0.055, 0.12, 0.26]} c={PORK} r={0.55} rad={0.012} />)}</group>
        {ts.map((s, i) => { const x = -0.56 + 0.28 * i, f = eio(tt, s, s + 0.7);
          return <group key={i}>
            <group position={[x, 0, 0.12]}>{i === 0 ? <Cyl p={[0, 0.012, 0]} r={0.11} h={0.024} c="#f4f1ea" rough={0.3} />
              : i === 1 ? <Bowl p={[0, 0, 0]} s={0.45} />
              : i === 2 ? <Cyl p={[0, 0.03, 0]} r={0.12} r2={0.07} h={0.06} c="#2a2a2a" rough={0.4} />
              : i === 3 ? <group><Cyl p={[0, 0.06, 0]} r={0.1} h={0.12} c="#a33a2a" rough={0.4} /><Steam p={[0, 0.13, 0]} t={tt} k={f} s={0.3} /></group>
              : <Box p={[0, 0.02, 0]} s={[0.22, 0.04, 0.16]} c="#2b2c2f" m={0.6} r={0.4} rad={0.01} />}
              <mesh position={[0, 0.28, 0]}><planeGeometry args={[0.14, 0.07]} /><meshStandardMaterial map={D[i]} emissive="#ff6a3a" emissiveIntensity={0.35 * f} emissiveMap={D[i]} /></mesh></group>
            {f > 0.02 && <group position={[lerp(-0.12 + 0.06 * i, x, f), lerp(0.08, 0.1 + 0.02 * i, f) + 0.3 * Math.sin(Math.PI * f), lerp(-0.3, 0.12, f)]} rotation={[lerp(0, Math.PI / 2, f), 0, 0]}><Box p={[0, 0, 0]} s={[0.055, 0.12, 0.2]} c={col(PORK, GOLD, f * 0.6)} r={0.5} rad={0.012} /></group>}
          </group>; })}
      </group>; }}
    over={(tt) => <Ink tt={tt} at={7.0} txt="5 DINNERS · ONE PIECE · $7" col={AMB} />} />;
};

// 14:20 · KUIDAORE: un monedero abierto; las monedas saltan y en el aire se vuelven bolitas de comida de Osaka
export const C_kuidore: F = ({ t, h }) => {
  const a = 0.6;
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.6, 1.35], [0, 0.26, 0]), C([0.2, 0.58, 1.28], [0, 0.26, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.8 }}
    scene={(tt) => <>
      <group position={[-0.42, 0, 0]}><Box p={[0, 0.1, 0]} s={[0.36, 0.2, 0.2]} c="#8a2a3a" r={0.7} rad={0.08} /><Box p={[0, 0.21, 0]} s={[0.34, 0.02, 0.18]} c="#c9a24a" m={0.85} r={0.3} rad={0.008} />
        {[-1, 1].map((k) => <mesh key={k} position={[0.03 * k, 0.24, 0]}><sphereGeometry args={[0.018, 12, 8]} /><meshStandardMaterial color="#c9a24a" metalness={0.85} roughness={0.25} /></mesh>)}</group>
      <Box p={[0.25, 0.02, 0.05]} s={[0.5, 0.04, 0.3]} c="#2b2c2f" m={0.6} r={0.4} rad={0.01} />
      {Array.from({ length: 6 }, (_, i) => { const f = eio(tt, a + 0.45 * i, a + 0.45 * i + 1.0), m = eio(tt, a + 0.45 * i + 0.45, a + 0.45 * i + 0.75), x1 = 0.08 + 0.12 * (i % 3), z1 = -0.03 + 0.14 * Math.floor(i / 3);
        return f < 0.02 ? null : <group key={i} position={[lerp(-0.42, x1, f), lerp(0.24, 0.085, f) + 0.4 * Math.sin(Math.PI * f), lerp(0, z1, f)]}>
          {m < 0.5 ? <Coin p={[0, 0, 0]} s={0.9} rot={[f * 7, 0, 0.3]} /> : <group scale={0.6 + 0.4 * m}><mesh><sphereGeometry args={[0.05, 20, 14]} /><meshStandardMaterial color="#c9862e" roughness={0.6} /></mesh>
            <mesh position={[0, 0.032, 0]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.042, 16, 10]} /><meshStandardMaterial color="#4a1e08" roughness={0.15} /></mesh>
            <Box p={[0, 0.048, 0]} s={[0.06, 0.005, 0.008]} c="#fff6dc" r={0.3} rad={0.002} rot={[0, 0.6, 0]} />
            {[0, 1, 2].map((j) => <mesh key={j} position={[0.015 * (j - 1), 0.055, 0.01 * j]} rotation={[0.5, j, 0.3]}><planeGeometry args={[0.02, 0.014]} /><meshStandardMaterial color="#e2b88a" side={THREE.DoubleSide} /></mesh>)}</group>}</group>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={a + 2.2} txt="KUIDAORE · EAT YOURSELF BROKE" col={AMB} />} />;
};

// 15:10 · SU PROPIO ACEITE: la botella de aceite se acerca y se frena; de la feta en la sartén seca sale el charquito dorado sola
export const C_ownoil: F = ({ t, h }) => {
  const a = 0.5;
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 0.75, 1.45], [0.1, 0.15, 0]), C([0.3, 0.72, 1.38], [0.1, 0.15, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.6 }}
    scene={(tt) => { const b = eio(tt, a, a + 0.8), no = pop(tt, a + 0.9), oil = eio(tt, a + 1.4, a + 4.0);
      return <>
        <Teppan p={[-0.12, 0, 0]} w={0.8} d={0.5} heat={0.8} />
        <mesh position={[-0.12, 0.066, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.4 + 0.6 * oil, 0.4 + 0.6 * oil, 1]}><planeGeometry args={[0.66, 0.38]} /><meshStandardMaterial color="#f2b84a" transparent opacity={0.65 * oil} roughness={0.02} emissive="#ffb347" emissiveIntensity={0.3 * oil} /></mesh>
        {[0, 1, 2].map((i) => <JSlice key={i} p={[-0.32 + 0.2 * i, 0.068, 0.02 * Math.sin(i * 2)]} rot={[0, 0.4 * i, 0]} s={0.75} g={oil * 0.7} />)}
        {oil > 0.02 && Array.from({ length: 12 }, (_, i) => { const u = ((tt * 0.9 + i / 12) % 1); return <mesh key={i} position={[-0.42 + 0.06 * i, 0.075 + 0.02 * Math.sin(Math.PI * u), 0.09 * Math.sin(i * 1.7)]} scale={0.5 + u}><sphereGeometry args={[0.01, 8, 6]} /><meshStandardMaterial color="#ffd27a" emissive="#ffb347" emissiveIntensity={0.8} transparent opacity={oil * (1 - u)} /></mesh>; })}
        <group position={[lerp(0.9, 0.55, b), 0.2, 0.05]} rotation={[0, 0, 0.35 * b * (1 - no)]}><Cyl p={[0, 0, 0]} r={0.09} h={0.4} c="#e8c25a" rough={0.1} op={0.85} /><Cyl p={[0, 0.25, 0]} r={0.03} h={0.1} c="#2a6a3a" rough={0.4} /></group>
        <Pop k={no} p={[0.55, 0.22, 0.17]}><mesh><ringGeometry args={[0.1, 0.13, 40]} /><meshStandardMaterial color={RED} side={THREE.DoubleSide} /></mesh><Box p={[0, 0, 0.002]} s={[0.24, 0.028, 0.004]} c={RED} r={0.4} rad={0.003} rot={[0, 0, 0.75]} /></Pop>
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 2.4} txt="NO OIL · IT MAKES ITS OWN" col={AMB} />} />;
};

// 15:30 · DEJALA DESCANSAR: dos entrañas: una cortada enseguida suelta un charco rojo; la otra bajo una carpita de aluminio guarda los jugos que brillan adentro
export const C_rest: F = ({ t, h }) => {
  const a = 0.6;
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.8, 1.75], [0, 0.1, 0]), C([0.25, 0.75, 1.65], [0, 0.1, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const c1 = eio(tt, a, a + 0.6), j = eio(tt, a + 0.6, a + 2.4), tent = eio(tt, a + 0.4, a + 1.2), gl = 0.5 + 0.5 * Math.sin(tt * 3);
      return <>
        {[-0.45, 0.45].map((x) => <Box key={x} p={[x, 0.015, 0]} s={[0.7, 0.03, 0.42]} c="#c9a477" r={0.7} rad={0.01} />)}
        <group position={[-0.45, 0.03, 0]}>{[-1, 1].map((k) => <Box key={k} p={[k * (0.12 + 0.04 * c1), 0.03, 0]} s={[0.24, 0.05, 0.14]} c="#7a3a2a" r={0.5} rad={0.02} />)}
          <mesh position={[0, 0.003, 0.05]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.2 + 1.2 * j, 0.2 + 0.8 * j, 1]}><circleGeometry args={[0.12, 32]} /><meshStandardMaterial color="#b0262a" transparent opacity={0.85 * j} roughness={0.05} /></mesh></group>
        <group position={[0.45, 0.03, 0]}><Box p={[0, 0.03, 0]} s={[0.5, 0.05, 0.14]} c="#7a3a2a" r={0.5} rad={0.02} e="#ff6a4a" ei={0.25 * gl * tent} />
          {[-1, 1].map((k) => <mesh key={k} position={[0, 0.1 * tent, 0.06 * k]} rotation={[k * 0.9, 0, 0]}><planeGeometry args={[0.56, 0.18 * tent + 0.001]} /><meshStandardMaterial color="#d5d9dd" metalness={0.9} roughness={0.25} side={THREE.DoubleSide} /></mesh>)}</group>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={a + 0.8} txt="CUT NOW: JUICE ON THE BOARD" col="#ff8a7a" y={250} /><Ink tt={tt} at={a + 2.4} txt="REST A FEW MINUTES" col="#7fe0a0" /></>} />;
};

// 16:40 · LA CARRERA A 145: dos termómetros pinchados: en la feta fina la aguja llega a 145 enseguida; en el trozo grueso apenas se mueve
export const C_thermo: F = ({ t, h }) => {
  const a = 0.6;
  const face = useMemo(() => mk(256, 256, (g) => { g.fillStyle = "#fbf8f1"; g.beginPath(); g.arc(128, 128, 124, 0, Math.PI * 2); g.fill(); g.strokeStyle = "#2a2a2a"; g.lineWidth = 6; g.beginPath(); g.arc(128, 128, 122, 0, Math.PI * 2); g.stroke(); g.lineWidth = 4; for (let i = 0; i <= 10; i++) { const an = Math.PI * (0.75 + 1.5 * i / 10); g.beginPath(); g.moveTo(128 + 92 * Math.cos(an), 128 + 92 * Math.sin(an)); g.lineTo(128 + 112 * Math.cos(an), 128 + 112 * Math.sin(an)); g.stroke(); }
    g.strokeStyle = "#2e8a4a"; g.lineWidth = 18; g.beginPath(); g.arc(128, 128, 100, Math.PI * (0.75 + 1.5 * 0.66), Math.PI * (0.75 + 1.5 * 0.78)); g.stroke(); g.fillStyle = "#2e8a4a"; g.font = "900 54px Arial"; g.textAlign = "center"; g.fillText("145°", 128, 200); }), []);
  const Th: React.FC<{ x: number; k: number }> = ({ x, k }) => <group position={[x, 0.5, 0.05]}>
    <Cyl p={[0, 0, -0.012]} r={0.21} h={0.02} c="#c9ccd0" m={0.8} rough={0.3} rot={[Math.PI / 2, 0, 0]} />
    <mesh><circleGeometry args={[0.19, 48]} /><meshStandardMaterial map={face} /></mesh>
    <group position={[0, 0, 0.006]} rotation={[0, 0, -Math.PI * (1.5 * 0.72 * k) + Math.PI * 0.75]}><Box p={[0.075, 0, 0]} s={[0.15, 0.014, 0.004]} c={RED} r={0.4} rad={0.004} /></group>
    <Cyl p={[0, -0.33, -0.01]} r={0.008} h={0.28} c="#d5d9dd" m={0.95} rough={0.2} /></group>;
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.42, 1.5], [0, 0.33, 0]), C([0.18, 0.42, 1.42], [0, 0.33, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.4 }}
    scene={(tt) => { const f1 = eio(tt, a, a + 1.6), f2 = eio(tt, a, a + 14) * 0.45;
      return <>
        <JSlice p={[-0.42, 0.02, 0.05]} s={1.0} g={f1 * 0.8} />
        <Box p={[0.42, 0.11, 0.05]} s={[0.34, 0.22, 0.28]} c={col(PORK, "#b8692e", f2)} r={0.5} rad={0.04} />
        <Th x={-0.42} k={f1} /><Th x={0.42} k={f2} />
      </>; }}
    over={(tt) => <><Ink tt={tt} at={a + 1.8} txt="THIN: 145° IN 1-2 MIN" col="#7fe0a0" y={250} /><Ink tt={tt} at={a + 3.0} txt="SAFE · AND JUICY" col={AMB} /></>} />;
};

// 18:00 · EL SHICHIRIN: la estufita de barro junto a la puerta abierta; las brasas se encienden y el humo sale por la puerta hacia el patio
export const C_shichirin: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 4.0), 6.0);
  const yard = useMemo(() => mk(256, 384, (g) => { const gr = g.createLinearGradient(0, 0, 0, 384); gr.addColorStop(0, "#cfe7f7"); gr.addColorStop(0.55, "#eaf4e0"); gr.addColorStop(0.56, "#7fae5a"); gr.addColorStop(1, "#5f8f42"); g.fillStyle = gr; g.fillRect(0, 0, 256, 384); g.fillStyle = "#4f7f36"; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(30 + 40 * i, 210, 26, 0, Math.PI * 2); g.fill(); } }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.15, 0.95, 1.7], [0, 0.3, -0.1]), C([0.35, 0.92, 1.6], [0, 0.3, -0.1]), 10)}
    set={{ spot: [0, 0.2, 0.2] as V, spotK: 0.35, warm: 0.9 }}
    scene={(tt) => { const fire = eio(tt, 0.4, 1.6), flick = 0.85 + 0.15 * Math.sin(tt * 1.6);
      return <>
        <Box p={[0, 0.6, -0.62]} s={[1.6, 1.2, 0.04]} c="#b89a74" r={0.8} rad={0.005} />
        <mesh position={[0.05, 0.5, -0.595]}><planeGeometry args={[0.6, 0.95]} /><meshBasicMaterial map={yard} /></mesh>
        {[-0.27, 0.37].map((x) => <Box key={x} p={[x, 0.5, -0.58]} s={[0.05, 1.0, 0.06]} c="#5a3a22" r={0.7} rad={0.005} />)}
        <Box p={[0.05, 1.0, -0.58]} s={[0.7, 0.05, 0.06]} c="#5a3a22" r={0.7} rad={0.005} />
        <group position={[0.62, 0.48, -0.56]}><Box p={[0, 0, 0]} s={[0.5, 0.92, 0.02]} c="#efe4cc" r={0.85} rad={0.004} />{[-0.12, 0.12].map((x) => <Box key={x} p={[x, 0, 0.012]} s={[0.012, 0.9, 0.006]} c="#5a3a22" r={0.7} rad={0.002} />)}{[-0.2, 0, 0.2].map((y) => <Box key={y} p={[0, y, 0.012]} s={[0.48, 0.012, 0.006]} c="#5a3a22" r={0.7} rad={0.002} />)}</group>
        <group position={[0, 0, 0.05]}><Cyl p={[0, 0.15, 0]} r={0.19} r2={0.16} h={0.3} c="#c48a5a" rough={0.9} />
          <Cyl p={[0, 0.3, 0]} r={0.165} h={0.01} c="#3a2a22" rough={0.8} />
          {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[0.11 * Math.cos(i * 2.1) * ((i % 4) / 3), 0.31, 0.11 * Math.sin(i * 2.1) * ((i % 4) / 3)]}><dodecahedronGeometry args={[0.032, 0]} /><meshStandardMaterial color="#3a1a10" emissive="#ff4a10" emissiveIntensity={1.8 * fire * flick} /></mesh>)}
          {Array.from({ length: 7 }, (_, i) => <Box key={"g" + i} p={[0, 0.335, -0.12 + 0.04 * i]} s={[0.3, 0.004, 0.004]} c="#2a2a2a" m={0.7} r={0.4} rad={0.001} />)}
          <Box p={[0, 0.07, 0.185]} s={[0.12, 0.08, 0.02]} c="#2a1810" r={0.9} rad={0.005} e="#ff4a10" ei={0.9 * fire} />
          {[0, 1, 2].map((i) => <JSlice key={i} p={[-0.08 + 0.08 * i, 0.338, 0]} s={0.38} g={eio(tt, a, a + 2.0)} />)}
          <pointLight position={[0, 0.4, 0.1]} intensity={0.8 * fire} distance={1.0} color="#ff7a3a" /></group>
        {Array.from({ length: 10 }, (_, i) => { const u = ((tt * 0.28 + i / 10) % 1); return <mesh key={"h" + i} position={[lerp(0.02, 0.06, u), 0.42 + 0.4 * u, lerp(0.05, -0.6, u)]}><sphereGeometry args={[0.05 + 0.08 * u, 12, 8]} /><meshStandardMaterial color="#e6e1d8" transparent opacity={0.4 * fire * Math.sin(Math.PI * u)} depthWrite={false} /></mesh>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={1.4} txt="SHICHIRIN · BY THE OPEN DOOR" col={AMB} />} />;
};

// 18:55 · BLANCA, NO NEGRA: dos molinillos espolvorean sobre dos fetas: la pimienta negra deja puntos oscuros, la blanca desaparece en la carne
export const C_pepper: F = ({ t, h }) => {
  const a = 0.6;
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.85, 1.4], [0, 0.12, 0]), C([0.2, 0.8, 1.3], [0, 0.12, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const g = eio(tt, a, a + 2.0);
      return <>
        {[-0.38, 0.38].map((x, i) => <group key={i}>
          <JSlice p={[x, 0.02, 0.05]} s={1.1} />
          <group position={[x, 0.48, 0]} rotation={[0, 0, 0.2 * Math.sin(tt * 6) * (g > 0 && g < 1 ? 1 : 0)]}><Cyl p={[0, 0, 0]} r={0.05} h={0.22} c={i ? "#f4f1ea" : "#2a2a2a"} rough={0.4} /><Cyl p={[0, 0.13, 0]} r={0.03} h={0.05} c="#c9a24a" m={0.8} rough={0.3} /></group>
          {Array.from({ length: 40 }, (_, j) => { const u = ((j * 0.37) % 1) * g * 1.3; if (u < 0.02) return null; const land = Math.min(1, u);
            return <mesh key={j} position={[x - 0.14 + 0.28 * ((j * 0.61) % 1), lerp(0.36, 0.05, land), 0.05 - 0.09 + 0.18 * ((j * 0.29) % 1)]}><sphereGeometry args={[0.006, 6, 4]} /><meshStandardMaterial color={i ? col("#f4efe2", PORK, land * 0.9) : "#1a1a1a"} /></mesh>; })}
        </group>)}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={a + 1.0} txt="BLACK: DARK SPOTS" col="#ff8a7a" x={560} y={250} size={56} /><Ink tt={tt} at={a + 1.8} txt="WHITE: INVISIBLE" col="#7fe0a0" x={1380} y={250} size={56} /></>} />;
};

// 19:25 · LLUVIA SOBRE CHAPA: arriba de la sartén caen gotas sobre un techito de chapa; abajo cada gota es una chispa del chisporroteo
export const C_rain: F = ({ t, h }) => {
  const a = 0.6;
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.85, 1.75], [0, 0.32, -0.1]), C([0.25, 0.82, 1.65], [0, 0.32, -0.1]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.6 }}
    scene={(tt) => { const on = eio(tt, a, a + 0.8);
      return <>
        <group position={[0, 0.78, -0.2]} rotation={[0.35, 0, 0]}>{Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[-0.5 + 0.1 * i, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.6, 16, 1, true, 0, Math.PI]} /><meshStandardMaterial color="#a8b0b8" metalness={0.85} roughness={0.3} side={THREE.DoubleSide} /></mesh>)}</group>
        {[-0.52, 0.52].map((x) => <Box key={x} p={[x, 0.4, -0.45]} s={[0.04, 0.8, 0.04]} c="#6b4a2e" r={0.7} rad={0.005} />)}
        {Array.from({ length: 22 }, (_, i) => { const u = ((tt * 1.4 + (i * 0.37) % 1) % 1); return <mesh key={"r" + i} position={[-0.45 + 0.043 * i, lerp(0.7, 0.08, u), lerp(0.05, 0.02, u)]}><capsuleGeometry args={[0.007, 0.04, 4, 6]} /><meshStandardMaterial color="#8fcfff" transparent opacity={0.85 * on} /></mesh>; })}
        <Teppan p={[0, 0, 0.05]} w={1.0} d={0.5} heat={0.9} />
        {[0, 1, 2].map((i) => <JSlice key={i} p={[-0.25 + 0.25 * i, 0.068, 0.05 + 0.03 * Math.sin(i * 3)]} rot={[0, i * 0.8, 0]} s={0.75} g={0.3 + 0.3 * on} />)}
        {Array.from({ length: 22 }, (_, i) => { const u = ((tt * 1.4 + (i * 0.37) % 1 + 0.02) % 1), k = cl((u - 0.9) * 10); return k <= 0 ? null : <mesh key={"s" + i} position={[-0.45 + 0.043 * i + 0.03 * Math.sin(i), 0.08 + 0.06 * k, 0.03]} scale={0.5 + k}><sphereGeometry args={[0.009, 6, 4]} /><meshStandardMaterial color="#ffd27a" emissive="#ffb347" emissiveIntensity={1.2} transparent opacity={on * (1 - k * 0.6)} /></mesh>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 1.0} txt="LISTEN: RAIN ON A TIN ROOF" col={AMB} />} />;
};

// 19:40 · LA VUELTA: los palillos dan vuelta las fetas de a una y aparece el lado dorado oscuro
export const C_flip: F = ({ t, h }) => {
  const a = 0.6;
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.62, 0.95], [0, 0.1, 0]), C([0.18, 0.6, 0.9], [0, 0.1, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.6 }}
    scene={(tt) => <>
      <Teppan p={[0, 0, 0]} w={0.8} d={0.42} heat={0.8} />
      {[0, 1, 2].map((i) => { const f = eio(tt, a + 0.55 * i, a + 0.55 * i + 0.7), x = -0.22 + 0.22 * i;
        return <group key={i}><group position={[x, 0.07 + 0.14 * Math.sin(Math.PI * f), 0]} rotation={[Math.PI * f, 0, 0]}><JSlice p={[0, 0, 0]} s={0.6} g={0.25} /><JSlice p={[0, -0.002, 0]} rot={[Math.PI, 0, 0]} s={0.6} g={1} /></group>
          {f > 0.02 && f < 0.98 && <group position={[x + 0.02, 0.2 + 0.14 * Math.sin(Math.PI * f), 0.22]} rotation={[-0.9, 0.2, 0]}>{[-1, 1].map((k) => <Cyl key={k} p={[0.012 * k, 0, 0]} r={0.007} h={0.42} c="#c9955a" rough={0.6} rot={[0, 0, 0.03 * k]} />)}</group>}</group>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={a + 1.2} txt="DARK GOLD · TURN ONCE" col={AMB} />} />;
};

// 21:00 · CENA PARA CUATRO POR $9: los platos de la mesa aparecen con su etiquetita y un contador suma hasta $9
export const C_nine9: F = ({ t, h }) => {
  const ts = [0.6, it(h, 0, 2.0), it(h, 1, 3.4), it(h, 2, 4.8), it(h, 3, 6.2)];
  const P = useMemo(() => ["$3.50", "$1", "$1.20", "$0.70", "$1.50"].map((x) => cardTex([x], { bg: "#fff6c2", fg: RED, w: 192, h: 96 })), []);
  const tot = useMemo(() => Array.from({ length: 10 }, (_, i) => cardTex(["$" + i], { bg: "#1d2b22", fg: "#8dff9a", w: 192, h: 128 })), []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 1.05, 1.9], [0, 0.12, 0]), C([0.3, 1.0, 1.8], [0, 0.12, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.6 }}
    scene={(tt) => { const n = ts.filter((s) => tt > s + 0.3).length, sum = [0, 4, 5, 6, 7, 9][n];
      return <>
        {ts.map((s, i) => { const k = pop(tt, s), x = -0.6 + 0.3 * i;
          return k < 0.02 ? null : <Pop key={i} k={k} p={[x, 0, 0.05]}>
            {i === 0 ? <><Cyl p={[0, 0.015, 0]} r={0.13} h={0.03} c="#f4f1ea" rough={0.3} />{[0, 1, 2].map((j) => <JSlice key={j} p={[-0.05 + 0.05 * j, 0.03, 0]} rot={[0, j, 0]} s={0.35} g={0.9} />)}</>
              : i === 1 ? <Bowl p={[0, 0, 0]} s={0.5} />
              : i === 2 ? <Bowl p={[0, 0, 0]} s={0.5} c="#3a2418" fill="#c9a46a" />
              : i === 3 ? <><Cyl p={[0, 0.02, 0]} r={0.1} h={0.04} c="#2c4a8a" rough={0.3} />{[0, 1, 2, 3].map((j) => <Cyl key={j} p={[-0.04 + 0.025 * j, 0.045, 0]} r={0.025} h={0.006} c="#bfe08a" rough={0.5} />)}</>
              : <><Cyl p={[-0.03, 0.02, 0]} r={0.025} h={0.04} c="#f2e04a" rough={0.4} />{[0, 1, 2].map((j) => <Cyl key={j} p={[0.04, 0.005 + 0.012 * j, -0.05 + 0.05 * j]} r={0.006} h={0.2} c="#7fc05a" rough={0.6} rot={[Math.PI / 2, 0, 0]} />)}</>}
            <mesh position={[0, 0.2, 0]}><planeGeometry args={[0.16, 0.08]} /><meshStandardMaterial map={P[i]} /></mesh></Pop>; })}
        <group position={[0, 0.25, -0.4]}><Box p={[0, 0, -0.01]} s={[0.34, 0.24, 0.02]} c="#1d2b22" r={0.3} rad={0.01} /><mesh><planeGeometry args={[0.3, 0.2]} /><meshStandardMaterial map={tot[sum]} emissive="#8dff9a" emissiveIntensity={0.5} emissiveMap={tot[sum]} /></mesh></group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={ts[4] + 0.8} txt="DINNER FOR FOUR · $9" col={AMB} />} />;
};

// 22:50 · LA VUELTA A LA ESQUINA: el paquete pálido de la vitrina se ilumina y sobre él se enciende un farol rojo de Osaka
export const C_corner: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 3.0), 4.0);
  const tag = useMemo(() => cardTex(["$3.40"], { bg: "#fff6c2", fg: RED, w: 256, h: 128 }), []), lan = useMemo(() => cardTex(["とんトロ"], { bg: "#d62828", fg: "#fff3d6", w: 256, h: 256 }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.15, 0.62, 1.45], [0.1, 0.3, 0]), C([0.32, 0.58, 1.35], [0.1, 0.3, 0]), 12)}
    set={{ spot: [0.2, 0, 0] as V, spotK: 0.45, warm: 0.9 }}
    scene={(tt) => { const g = eio(tt, 0.6, 2.0), dn = eio(tt, 0.8, a), l = eio(tt, a, a + 0.8);
      return <>
        <Box p={[0, 0.02, 0]} s={[1.3, 0.04, 0.6]} c="#e8eef1" r={0.3} m={0.3} rad={0.01} />
        <Box p={[0, 0.25, -0.3]} s={[1.3, 0.5, 0.02]} c="#dfe7ea" r={0.2} m={0.2} rad={0.005} /><Box p={[0.64, 0.25, 0]} s={[0.02, 0.5, 0.6]} c="#dfe7ea" r={0.2} m={0.2} rad={0.005} />
        {[-0.5, -0.15].map((x, i) => <Box key={i} p={[x, 0.07, -0.05]} s={[0.28, 0.08, 0.22]} c={["#b85a48", "#c8564a"][i]} r={0.55} rad={0.03} />)}
        <group position={[0.42, 0.04, -0.1]}><Box p={[0, 0.02, 0]} s={[0.36, 0.04, 0.3]} c="#f4f1ea" r={0.5} rad={0.01} /><Jowl p={[0, 0.02, 0]} s={0.9} glow={g} />
          <mesh position={[0.08, 0.17, 0.15]} rotation={[-0.4, 0, 0]}><planeGeometry args={[0.16, 0.08]} /><meshStandardMaterial map={tag} /></mesh></group>
        <group position={[0.42, lerp(1.3, 0.62, dn), -0.05]}><Cyl p={[0, 0.3, 0]} r={0.004} h={0.6} c="#2a1a14" rough={0.6} />
          <mesh scale={[1, 1.3, 1]}><sphereGeometry args={[0.12, 28, 18]} /><meshStandardMaterial color="#d62828" emissive="#ff4a2a" emissiveIntensity={0.2 + 1.0 * l} /></mesh>
          <mesh position={[0, 0, 0.122]} scale={[1, 1.3, 1]}><planeGeometry args={[0.12, 0.12]} /><meshStandardMaterial map={lan} transparent opacity={0.9} /></mesh>
          {[-1, 1].map((k) => <Cyl key={k} p={[0, k * 0.155, 0]} r={0.06} h={0.025} c="#2a1a14" rough={0.6} />)}
          <pointLight position={[0, -0.1, 0.15]} intensity={1.2 * l} distance={1.4} color="#ff8a5a" /></group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 1.0} txt="NOW YOU KNOW ITS NAME" col={AMB} />} />;
};
