// sk8pg · los componentes ÚNICOS de «30 Forgotten Japanese Grandmother Recipes» (registro: D:/rtmp/premium8n_sachiko_COMPONENTES.md).
// Cada uno = UN objeto que ES la idea, sobre la mesada (hk.tsx). Nada de carteles arriba a la izquierda; la palabra va adentro o abajo al centro.
import React, { useMemo } from "react";
import * as THREE from "three";
import { F, Hero, C, lerp, pop, Pop, Ink, cardTex, Steam, Coin, Bowl, Ring, Sachi, PZ, S, cl, eio, orbita, Box, Cyl, V, secuencia } from "./hk";
import { KSet as KSet0 } from "./hk";
import { mk } from "./casa3d";

const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const rel = (h: any, i: number, d: number) => Math.min((h.items?.[i]?.at ?? h.at + d) - h.at, h.out - h.at - 2.2);
const BOARD = "#c9955a", MISO = "#a8672c", TOFU = "#d8d0bb", SOY = "#2a1408", RICE = "#d9d6ca", LAC = "#17110d", GLASS = "#dfeef2";
const Board: React.FC<{ p?: V; w?: number; d?: number }> = ({ p = [0, 0.04, 0], w = 1.3, d = 0.7 }) => <Box p={[p[0], p[1] + 0.02, p[2]]} s={[w, 0.04, d]} c={BOARD} r={0.75} rad={0.012} />;
const Sph: React.FC<{ p: V; r: number; c: string; sc?: V; ro?: number; m?: number; e?: string; ei?: number; op?: number }> = ({ p, r, c, sc, ro = 0.6, m = 0, e, ei = 0, op }) =>
  <mesh position={p} scale={sc} castShadow><sphereGeometry args={[r, 28, 18]} /><meshStandardMaterial color={c} roughness={ro} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} depthWrite={op === undefined} /></mesh>;
// olla de vidrio: se ve lo de adentro (para los cortes)
const GlassPot: React.FC<{ p?: V; r?: number; h?: number }> = ({ p = [0, 0.05, 0], r = 0.5, h = 0.6 }) => <group position={p}>
  <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[r, r, h, 56, 1, true]} /><meshPhysicalMaterial color={GLASS} transparent opacity={0.2} roughness={0.04} side={THREE.DoubleSide} depthWrite={false} /></mesh>
  <Cyl p={[0, 0.012, 0]} r={r} h={0.024} c="#cdd6da" rough={0.25} m={0.5} /></group>;
const SteelPot: React.FC<{ p?: V; r?: number; h?: number; c?: string }> = ({ p = [0, 0.05, 0], r = 0.46, h = 0.42, c = "#b8bcc2" }) => <group position={p}>
  <mesh position={[0, h / 2, 0]} castShadow><cylinderGeometry args={[r, r * 0.97, h, 56, 1, true]} /><meshStandardMaterial color={c} metalness={0.8} roughness={0.28} side={THREE.DoubleSide} /></mesh>
  <Cyl p={[0, 0.012, 0]} r={r * 0.97} h={0.024} c={c} m={0.8} rough={0.3} />
  {[-1, 1].map((s) => <Box key={s} p={[s * (r + 0.08), h * 0.8, 0]} s={[0.16, 0.03, 0.09]} c="#26272a" r={0.5} rad={0.012} />)}</group>;
const Flame: React.FC<{ p: V; k: number; t: number }> = ({ p, k, t }) => k < 0.03 ? null : <group position={p}>{Array.from({ length: 9 }, (_, i) => { const a = i / 9 * 6.283, h = (0.12 + 0.34 * k) * (0.85 + 0.15 * Math.sin(t * 5 + i)); return <mesh key={i} position={[0.32 * Math.cos(a), h / 2, 0.32 * Math.sin(a)]}><coneGeometry args={[0.055, h, 10]} /><meshBasicMaterial color={col("#5a9bff", "#ff7a2a", k)} toneMapped={false} transparent opacity={0.9} /></mesh>; })}</group>;

// 0:10 · LA CUENTA: del fondo de la caja de delivery sube una tira de ticket que no termina nunca; arriba del todo, $19
const receipt: F = ({ t, h }) => { const T = useMemo(() => mk(512, 1536, (g) => { g.fillStyle = "#faf7ee"; g.fillRect(0, 0, 512, 1536); g.fillStyle = "#1c1915"; g.textBaseline = "middle"; g.textAlign = "center"; g.font = "900 124px Arial"; g.fillText("$19.00", 256, 130); g.font = "800 58px Arial"; g.fillText("ONE DINNER", 256, 260); [["BOX", "$12"], ["DELIVERY", "$4"], ["SERVICE", "$2"], ["TIP", "$1"]].forEach(([a, b], i) => { const y = 470 + i * 180; g.textAlign = "left"; g.font = "800 60px Arial"; g.fillText(a, 44, y); g.textAlign = "right"; g.fillText(b, 468, y); g.fillRect(44, y + 70, 424, 4); }); }), []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.25, 1.05, 3.3], [0, 0.98, 0]), C([-0.2, 1.05, 3.0], [0, 1.02, 0]), 9)} set={{ warm: 0.35, spot: [0, 0.4, 0] as V, spotK: 0.45 }}
    scene={(tt) => { const y = lerp(-0.62, 0.42, eio(tt, 0.3, 3.2));
      return <>
        <mesh position={[0, 0.44 + y, -0.02]}><planeGeometry args={[0.56, 1.68]} /><meshStandardMaterial map={T} color="#c9c3b4" roughness={0.8} side={THREE.DoubleSide} /></mesh>
        <Box p={[0, 0.3, 0.28]} s={[1.02, 0.5, 0.02]} c="#b98f5c" r={0.9} rad={0.004} /><Box p={[0, 0.3, -0.28]} s={[1.02, 0.5, 0.02]} c="#a67f4f" r={0.9} rad={0.004} />
        {[-1, 1].map((s) => <Box key={s} p={[s * 0.51, 0.3, 0]} s={[0.02, 0.5, 0.58]} c="#ab8453" r={0.9} rad={0.004} />)}
        <Box p={[0, 0.06, 0]} s={[1.02, 0.02, 0.58]} c="#9a764a" r={0.9} rad={0.004} />
        <group position={[-0.51, 0.55, 0]} rotation={[0, 0, 0.9 - 0.2 * eio(tt, 0.2, 1)]}><Box p={[-0.2, 0, 0]} s={[0.4, 0.015, 0.56]} c="#b98f5c" r={0.9} rad={0.004} /></group>
        <group position={[0.51, 0.55, 0]} rotation={[0, 0, -0.9 + 0.2 * eio(tt, 0.2, 1)]}><Box p={[0.2, 0, 0]} s={[0.4, 0.015, 0.56]} c="#b98f5c" r={0.9} rad={0.004} /></group>
        {Array.from({ length: 8 }, (_, i) => { const k = pop(tt, 1.6 + 0.18 * i); return <Pop key={i} k={k} p={[0.9, 0.05 + 0.02 * i, 0.15]}><Coin p={[0, 0, 0]} s={1.5} /></Pop>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={rel(h, 0, 3.4)} txt="TASTES LIKE THE BOX" />} />; };

// 0:40 · LA LATA: se levanta la tapa de la lata de galletas, el cuaderno sube y le brotan 30 banderitas de papel
const tin: F = ({ t, h }) => { const T = useMemo(() => mk(512, 128, (g) => { g.fillStyle = "#8b2f2a"; g.fillRect(0, 0, 512, 128); g.fillStyle = "#e7c26a"; for (let i = 0; i < 16; i++) { g.beginPath(); g.arc(16 + i * 32, 64, 11, 0, 7); g.fill(); } }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.7, 1.35, 1.9], [0, 0.42, 0]), C([-0.6, 1.25, 1.75], [0, 0.5, 0]), 10)} set={{ warm: 0.55, spot: [0, 0.3, 0] as V, spotK: 0.8 }}
    scene={(tt) => { const lid = eio(tt, 0.3, 1.5), up = eio(tt, 1.1, 2.7), n = Math.round(30 * cl((tt - 2.4) / 3.2));
      return <>
        <Cyl p={[0, 0.2, 0]} r={0.62} h={0.32} c="#ffffff" map={T} rough={0.35} m={0.35} /><Cyl p={[0, 0.355, 0]} r={0.58} h={0.012} c="#23150e" rough={0.8} />
        <group position={[-1.05 * lid, 0.38 + 0.22 * Math.sin(Math.PI * lid), 0.1 * lid]} rotation={[0, 0, -0.45 * lid]}><Cyl p={[0, 0, 0]} r={0.64} h={0.05} c="#8b2f2a" rough={0.35} m={0.35} /><Cyl p={[0, 0.03, 0]} r={0.42} h={0.012} c="#e7c26a" rough={0.4} m={0.4} /></group>
        <group position={[0, 0.38 + 0.3 * up, 0.08 * up]} rotation={[0.42 * up, 0.14 * up, 0]}>
          <Box p={[0, 0, 0]} s={[0.72, 0.1, 0.92]} c="#efe2c3" r={0.9} rad={0.02} /><Box p={[0, 0.056, 0]} s={[0.76, 0.012, 0.96]} c="#5a4632" r={0.85} rad={0.012} />
          {Array.from({ length: n }, (_, i) => { const k = pop(tt, 2.4 + i * 0.107, 11, 0.5); return <Box key={i} p={[0.38 + 0.08 * k, -0.02 + 0.003 * (i % 3), -0.42 + i * 0.029]} s={[0.18 * cl(k), 0.006, 0.022]} c={["#d95a4a", "#f2c14e", "#4d8f7a"][i % 3]} r={0.8} rad={0.002} cast={false} />; })}
        </group>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={rel(h, 0, 3)} txt="30 DISHES" /><Ink tt={tt} at={rel(h, 1, 5.5)} y={840} txt="UNDER $1 A PLATE" col="#ffd98a" size={60} /></>} />; };

// 1:20 · EL BAILE: las virutas de bonito se retuercen sobre el arroz caliente y caen tres gotas de soja, cada una abre su mancha
const dance: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.05, 0.92, 1.2], [0, 0.24, 0]), C([0.3, 0.8, 1.05], [0, 0.26, 0]), 9)} set={{ warm: 0.5, spot: [0, 0.25, 0] as V, spotK: 0.8 }}
  scene={(tt) => <><group position={[0, 0.05, 0]}>
      <mesh position={[0, 0.22, 0]} rotation={[Math.PI, 0, 0]} castShadow><sphereGeometry args={[0.56, 44, 22, 0, 6.283, 0, 1.57]} /><meshStandardMaterial color="#27345c" roughness={0.3} side={THREE.DoubleSide} /></mesh>
      <Sph p={[0, 0.2, 0]} r={0.5} c="#c8c4b6" sc={[1, 0.5, 1]} ro={0.95} />
      {Array.from({ length: 34 }, (_, i) => { const a = i * 2.4, r = 0.36 * Math.sqrt(rnd(i)), y = 0.44 - r * r * 0.5, k = pop(tt, 0.3 + i * 0.03);
        return k < 0.02 ? null : <mesh key={i} position={[r * Math.cos(a), y + 0.02, r * Math.sin(a)]} rotation={[-1.2 + 0.5 * Math.sin(tt * (3 + rnd(i + 5) * 2) + i), a, 0.6 * Math.sin(tt * (2.4 + rnd(i) * 2) + i * 1.7)]} scale={k}><planeGeometry args={[0.11, 0.05, 4, 1]} /><meshStandardMaterial color={col("#e8a38c", "#c98765", rnd(i + 9))} side={THREE.DoubleSide} roughness={0.75} /></mesh>; })}
      {[0, 1, 2].map((i) => { const at = rel(h, 1, 3) + i * 0.55 - (rel(h, 1, 3) > 0 ? 0 : 0), f = cl((tt - at + 0.38) / 0.38), sp = pop(tt, at, 8, 0.75); const x = [-0.14, 0.13, 0.02][i], z = [0.08, 0.05, -0.15][i];
        return <group key={i}>{f > 0 && f < 1 && <Sph p={[x, lerp(1.3, 0.47, f * f), z]} r={0.035} c={SOY} ro={0.05} />}{sp > 0.02 && <mesh position={[x, 0.468, z]} rotation={[-1.5708, 0, 0]} scale={Math.max(0.05, sp)}><circleGeometry args={[0.1, 28]} /><meshStandardMaterial color="#6a3b17" roughness={0.3} transparent opacity={0.85} /></mesh>}</group>; })}
      <Steam p={[0, 0.48, 0]} t={tt} k={0.8} n={7} s={1.4} /></group></>}
  over={(tt) => <Ink tt={tt} at={rel(h, 1, 3)} txt="THREE DROPS. THAT IS ALL." />} />;

// 2:10 · EL AGUA: en el bol de vidrio el repollo se desinfla y el agua sube desde el fondo
const cabbagewater: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.8, 0.8, 2], [0, 0.34, 0]), C([-0.6, 0.72, 2], [0, 0.32, 0]), 8)} set={{ warm: 0.25, spot: [0, 0.3, 0] as V, spotK: 0.6 }}
  scene={(tt) => { const k = eio(tt, 0.7, 5.5); return <>
    <GlassPot r={0.68} h={0.64} />
    <Cyl p={[0, 0.08 + 0.13 * k, 0]} r={0.66} h={Math.max(0.01, 0.26 * k)} c="#a9d6cc" rough={0.05} op={0.72} />
    {Array.from({ length: 56 }, (_, i) => { const a = i * 2.4, r = 0.58 * Math.sqrt(rnd(i)), H = lerp(0.1 + rnd(i + 2) * 0.48, 0.12 + rnd(i + 2) * 0.18, k);
      return <group key={i} position={[r * Math.cos(a), 0.09 + H, r * Math.sin(a)]} rotation={[rnd(i) * 3, i, rnd(i + 3) * 3]} scale={lerp(1, 0.72, k)}><Box p={[0, 0, 0]} s={[0.22, 0.012, 0.16]} c={col("#c7dc8d", "#a8c26a", rnd(i + 8))} r={0.55} rad={0.005} cast={false} /></group>; })}
    {Array.from({ length: 12 }, (_, i) => { const a = i * 1.7, r = 0.3 * rnd(i + 13); return <Box key={"c" + i} p={[r * Math.cos(a), 0.1 + lerp(0.54, 0.26, k), r * Math.sin(a)]} s={[0.14, 0.018, 0.018]} c="#ee8a3a" r={0.5} rad={0.006} cast={false} rot={[0, i, 0]} />; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="15 MINUTES · ONLY SALT" />} />;

// 2:35 · LO QUE SE LEE: las rodajas de pepino, tan finas que la letra de abajo se lee a través de ellas
const readthrough: F = ({ t, h }) => { const T = useMemo(() => cardTex(["ONE SPOON", "ONE SPOON", "ONE SPOON"], { bg: "#f3ead6", fg: "#120b05", w: 1024, h: 512, font: "Georgia, serif" }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 2.45, 0.75], [0, 0.04, 0.02]), C([0.18, 2.2, 0.85], [0, 0.04, 0]), 9)} set={{ warm: 0.3, back: false, spot: [0, 0.1, 0] as V, spotK: 0.55 }}
    scene={(tt) => <>
      <mesh position={[0, 0.05, 0]} rotation={[-1.5708, 0, 0]}><planeGeometry args={[2.3, 1.15]} /><meshStandardMaterial map={T} color="#b7ad97" roughness={0.85} /></mesh>
      {Array.from({ length: 11 }, (_, i) => { const k = pop(tt, 0.5 + 0.34 * i, 7, 0.55), x = -0.85 + (i % 6) * 0.34 + (i >= 6 ? 0.17 : 0), z = i >= 6 ? 0.26 : -0.18;
        return <Pop key={i} k={k} p={[x, 0.058 + 0.002 * (i % 3), z]}><mesh rotation={[-1.5708, 0, i]}><circleGeometry args={[0.2, 36]} /><meshPhysicalMaterial color="#9fd07a" transparent opacity={0.5} roughness={0.25} depthWrite={false} /></mesh><mesh position={[0, 0.001, 0]} rotation={[-1.5708, 0, 0]}><ringGeometry args={[0.185, 0.2, 40]} /><meshStandardMaterial color="#4f8a3b" transparent opacity={0.75} depthWrite={false} /></mesh></Pop>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={3.2} txt="THIN ENOUGH TO READ" />} />; };

// 3:10 · LA TIRA: una espiral de cáscara se desprende del nabo blanco y cae enroscada: el blanco para las visitas, la cáscara para la familia
const spiralpeel: F = ({ t, h }) => { const N = 70; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 0.95, 2.6], [0, 0.72, 0]), C([-0.5, 0.85, 2.4], [0, 0.65, 0]), 9)} set={{ warm: 0.3, spot: [0, 0.7, 0] as V, spotK: 0.45 }}
  scene={(tt) => { const k = cl(eio(tt, 0.3, 3.8)), rot = tt * 0.6; return <>
    <Board w={2} d={1.1} />
    <group position={[-0.34, 0.08, 0]} rotation={[0, rot, 0]}><Cyl p={[0, 0.65, 0]} r={0.24} r2={0.17} h={1.3} c="#d9d3c1" rough={0.5} seg={40} /><Cyl p={[0, 1.33, 0]} r={0.13} r2={0.17} h={0.06} c="#9fbb6b" rough={0.7} /></group>
    {Array.from({ length: N }, (_, i) => { const u = i / N, born = u < k; if (!born) return null; const a = i * 0.42, y = 1.3 - u * 1.2, f = cl((k - u) * 2.2); const cx = lerp(-0.34, 0.5, f), cy = lerp(0.08 + y, 0.12 + 0.012 * (i % 22), f), R = lerp(0.26, 0.09 + 0.1 * ((i % 22) / 22) + 0.15 * u, f); return <group key={i} position={[cx + R * Math.cos(a + rot * (1 - f)), cy, R * Math.sin(a + rot * (1 - f))]} rotation={[0, -a - rot * (1 - f), 0]}><Box p={[0, 0, 0]} s={[0.018, 0.1, 0.07]} c="#c9bd9d" r={0.6} rad={0.004} cast={false} /></group>; })}
  </>; }}
  over={(tt) => <><Ink tt={tt} x={560} at={rel(h, 0, 0.8)} y={850} txt="GUESTS" size={70} /><Ink tt={tt} x={1370} at={rel(h, 1, 3.4)} y={850} txt="FAMILY" col="#ffd98a" size={70} /></>} />; };

// 3:30 · EL TÍTERE: el guerrero de madera, colgado de sus hilos, levanta la raíz de bardana como una pesa
const puppet: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 1.05, 3.1], [0, 1.0, 0]), C([0.45, 1.1, 2.75], [0, 1.05, 0]), 9)} set={{ warm: 0.65, spot: [0, 1, 0] as V, spotK: 1, bg: "#2a1a12" }}
  scene={(tt) => { const lift = eio(tt, 1.1, 2.7) + 0.05 * Math.sin(tt * 2) * eio(tt, 2.7, 3.2), ax = lerp(0.2, 3.0, lift), by = 0.03 * Math.sin(tt * 1.6); const strs: [number, number, number][] = [[-0.52, 1.1 + 0.55 * lift, 0], [0.52, 1.1 + 0.55 * lift, 0], [-0.16, 1.82, 0], [0.16, 1.82, 0]];
    return <>
      <Box p={[0, 0.08, 0]} s={[2.6, 0.08, 1]} c="#6a3a22" r={0.5} rad={0.02} />
      {[-1.4, 1.4].map((x) => <Box key={x} p={[x, 1.5, -0.1]} s={[0.6, 2.9, 0.08]} c="#7a1f1e" r={0.85} rad={0.02} />)}<Box p={[0, 2.95, -0.1]} s={[3.4, 0.5, 0.08]} c="#7a1f1e" r={0.85} rad={0.02} />
      <group position={[0, by, 0]}>
        {strs.map(([x, y], i) => <Cyl key={i} p={[x, (y + 3) / 2, 0]} r={0.004} h={3 - y} c="#e9e2cc" rough={0.5} />)}
        <Box p={[0, 1.0, 0]} s={[0.46, 0.68, 0.24]} c="#a33b28" r={0.45} rad={0.05} />
        <Box p={[0, 0.58, 0]} s={[0.5, 0.2, 0.26]} c="#1e2c44" r={0.6} rad={0.04} />
        {[-1, 1].map((s) => <Cyl key={s} p={[s * 0.13, 0.3, 0]} r={0.075} h={0.44} c="#caa478" rough={0.55} />)}
        <Sph p={[0, 1.52, 0]} r={0.23} c="#d7b488" ro={0.45} />
        <Box p={[0, 1.76, -0.02]} s={[0.34, 0.12, 0.28]} c="#17110d" r={0.35} rad={0.05} />
        {[-1, 1].map((s) => <group key={s}><Box p={[s * 0.09, 1.59, 0.205]} s={[0.12, 0.028, 0.02]} rot={[0, 0, -s * 0.5]} c="#17110d" r={0.4} rad={0.004} /><Sph p={[s * 0.09, 1.54, 0.21]} r={0.026} c="#fff" ro={0.3} /><Sph p={[s * 0.09, 1.54, 0.232]} r={0.012} c="#111" /></group>)}
        {[-1, 1].map((s) => <group key={s} position={[s * 0.27, 1.26, 0]} rotation={[0, 0, s * ax]}><Cyl p={[0, -0.26, 0]} r={0.06} h={0.52} c="#caa478" rough={0.55} /></group>)}
        <group position={[0, 1.26 + Math.cos(ax) * -0.54, 0]}><Cyl p={[0, 0, 0.0]} r={0.05} h={1.6} c="#6a4a2b" rough={0.9} rot={[0, 0, 1.5708]} />{[-0.8, 0.8].map((x) => <Cyl key={x} p={[x, 0, 0]} r={0.14} h={0.1} c="#54381f" rough={0.95} rot={[0, 0, 1.5708]} />)}</group>
      </group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.9} txt="THE NAME MEANT STRENGTH" />} />;

// 4:15 · EL TECHO: sobre las tejas se seca la cesta de nabo; el cuervo se acerca a saltitos y la nena sube a espantarlo
const roofcrow: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([-0.1, 1.5, 3.7], [-0.25, 0.85, 0]), C([0.3, 1.4, 3.4], [-0.15, 0.85, 0]), 9)} set={{ warm: 0.15, back: false, bg: "#b7cfe4", spot: [0, 0.7, 0] as V, spotK: 0.3 }}
  scene={(tt) => { const fly = eio(tt, rel(h, 0, 4.5) + 0.2, rel(h, 0, 4.5) + 1.8), hop = Math.abs(Math.sin(tt * 3.1)) * (1 - fly), cx = lerp(1.25, 0.62, cl(tt / 3.4)) + 2.6 * fly;
    return <group rotation={[0.16, 0, 0]}>
      {Array.from({ length: 9 }, (_, r) => Array.from({ length: 12 }, (_, i) => <Cyl key={r + "-" + i} p={[-2.6 + i * 0.47 + (r % 2) * 0.23, 0.13 + 0.002 * r, -1 + r * 0.32]} r={0.27} h={0.5} c={col("#58606a", "#3f464e", rnd(r * 13 + i))} rough={0.5} rot={[1.5708, 0, 0]} seg={18} />))}
      <Cyl p={[-0.35, 0.47, 0.2]} r={0.72} h={0.06} c="#b5905a" rough={0.9} seg={40} />
      {Array.from({ length: 70 }, (_, i) => { const a = i * 2.4, r = 0.64 * Math.sqrt(rnd(i)); return <Box key={i} p={[-0.35 + r * Math.cos(a), 0.51 + 0.006 * (i % 3), 0.2 + r * Math.sin(a)]} s={[0.26, 0.012, 0.014]} rot={[0, i, 0]} c="#efe7d3" r={0.7} rad={0.003} cast={false} />; })}
      <group position={[cx, 0.5 + 0.18 * hop + 1.8 * fly, 0.3]} rotation={[0, 0.6 - 1.5 * fly, 0]}><Sph p={[0, 0.2, 0]} r={0.17} c="#15151a" sc={[1.4, 0.95, 0.85]} ro={0.35} /><Sph p={[0.2, 0.33, 0]} r={0.095} c="#15151a" ro={0.3} /><mesh position={[0.34, 0.31, 0]} rotation={[0, 0, -1.5708]}><coneGeometry args={[0.04, 0.16, 10]} /><meshStandardMaterial color="#2f2f35" roughness={0.3} /></mesh><Sph p={[0.26, 0.36, 0.07]} r={0.016} c="#fff" />{[-1, 1].map((s) => <group key={s} position={[0, 0.25, s * 0.13]} rotation={[s * (0.15 + 1.1 * fly * Math.abs(Math.sin(tt * 8))), 0, 0]}><Box p={[-0.08, 0, s * 0.14]} s={[0.4, 0.02, 0.3]} c="#1b1b21" r={0.4} rad={0.008} /></group>)}</group>
      <Sachi p={secuencia([[0, PZ.stand], [rel(h, 0, 4.5), PZ.reach]], tt)} t={tt} x={-1.42} z={0.7} rotY={1.4} s={S * 2} expr="feliz" />
      {[[-3.4, 1.7], [0.3, 2.3], [3.6, 1.5]].map(([x, r], i) => <Sph key={"m" + i} p={[x, -0.2, -6.5]} r={r} c={["#6f8fa3", "#5e7e94", "#7c9aad"][i]} sc={[2, 1, 1]} ro={0.95} />)}
    </group>; }}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 4.5)} txt="CHASE OFF THE CROWS" />} />;

// 4:50 · LA FLOR: las migas pálidas de la tela se levantan y arman una flor blanca de cinco pétalos
const flower: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 1.75, 1.35], [0, 0.17, 0]), C([0.3, 1.55, 1.25], [0, 0.18, 0]), 8)} set={{ warm: 0.45, spot: [0, 0.2, 0] as V, spotK: 0.9 }}
  scene={(tt) => <>
    <Box p={[0, 0.055, 0]} s={[1.9, 0.014, 1.5]} c="#222b42" r={0.95} rad={0.006} />
    {Array.from({ length: 190 }, (_, i) => { const m = (i % 5) / 5 * 6.283, u = rnd(i + 7), w = rnd(i + 20) - 0.5, R = 0.08 + 0.58 * u, tx = R * Math.cos(m + w * (1.1 - u)), tz = R * Math.sin(m + w * (1.1 - u)), a = i * 2.4, r0 = 0.46 * Math.sqrt(rnd(i)), k = eio(tt, 0.8 + 0.8 * rnd(i + 2), 3.4 + 0.5 * rnd(i + 3));
      return <Sph key={i} p={[lerp(r0 * Math.cos(a), tx, k), lerp(0.08 + (0.46 - r0) * 0.5, 0.082, k) + 0.5 * Math.sin(Math.PI * k), lerp(r0 * Math.sin(a), tz, k)]} r={0.026} c={col("#e9e2c8", "#ffffff", k)} ro={0.8} e="#fff4d8" ei={0.25 * k} />; })}
    {Array.from({ length: 9 }, (_, i) => { const k = pop(tt, 3.4 + 0.08 * i), a = i * 0.7; return <Pop key={"s" + i} k={k} p={[0.07 * Math.cos(a), 0.09, 0.07 * Math.sin(a)]}><Sph p={[0, 0, 0]} r={0.022} c="#f2c14e" e="#f2c14e" ei={0.5} /></Pop>; })}
  </>}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 3.4)} txt="UNOHANA" />} />;

// 5:40 · EL MORTERO: el pilón gira en el mortero, las espinitas se vuelven polvo y el polvo nieva sobre el arroz
const mortar: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.2, 1.35, 2.2], [0.25, 0.5, 0]), C([0.7, 1.2, 2], [0.25, 0.48, 0]), 9)} set={{ warm: 0.5, spot: [0, 0.5, 0] as V, spotK: 0.6 }}
  scene={(tt) => { const g = eio(tt, 0.6, 4), pa = tt * 4.2; return <group position={[0, 0, 0]}>
    <Box p={[-0.3, 0.3, 0]} s={[1.05, 0.5, 1.05]} c="#6d4a2c" r={0.7} rad={0.02} />
    <group position={[-0.3, 0.55, 0]}><mesh position={[0, 0.24, 0]} rotation={[Math.PI, 0, 0]} castShadow><sphereGeometry args={[0.5, 48, 22, 0, 6.283, 0, 1.57]} /><meshStandardMaterial color="#c7b18f" roughness={0.75} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 22 }, (_, i) => { const a = i * 2.4, r = 0.3 * Math.sqrt(rnd(i)); const s = lerp(1, 0.14, g); return <Box key={i} p={[r * Math.cos(a), 0.05 + 0.03 * s + r * r * 0.5, r * Math.sin(a)]} s={[0.16 * s, 0.012, 0.012]} rot={[0, i, 0.2]} c="#efe9d8" r={0.5} rad={0.003} cast={false} />; })}
      <Cyl p={[0, 0.05 + 0.08 * g, 0]} r={0.28 * g + 0.01} h={0.01} c="#e7deca" rough={0.9} />
      <group position={[0.14 * Math.cos(pa), 0.42, 0.14 * Math.sin(pa)]} rotation={[0.25 * Math.sin(pa), 0, -0.25 * Math.cos(pa)]}><Cyl p={[0, 0.2, 0]} r={0.055} r2={0.085} h={0.85} c="#b48553" rough={0.7} /></group></group>
    <group position={[0.85, 0.05, 0.1]}><Bowl p={[0, 0.02, 0]} s={1.9} c="#7a2f28" /><Sph p={[0, 0.27, 0]} r={0.35} c={RICE} sc={[1, 0.42, 1]} ro={0.9} /></group>
    {Array.from({ length: 34 }, (_, i) => { const u = (tt * 0.42 + i / 34) % 1, on = cl((tt - 3.2) / 0.5), x = 0.85 + 0.3 * (rnd(i) - 0.5), z = 0.1 + 0.3 * (rnd(i + 4) - 0.5); return on < 0.02 ? null : <Sph key={"p" + i} p={[x, lerp(1.9, 0.4, u), z]} r={0.013} c="#d8a760" ro={0.6} op={on} />; })}
  </group>; }}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 1.8)} txt="GROUND FISH BONES" />} />;

// 6:35 · EL BILLETE: un billete de cinco dólares hace de mesa y llegan los diez platitos de a uno; sobran bordes
const fivebill: F = ({ t, h }) => { const T = useMemo(() => mk(1024, 440, (g) => { g.fillStyle = "#c9d6b6"; g.fillRect(0, 0, 1024, 440); g.strokeStyle = "#54704d"; g.lineWidth = 10; g.strokeRect(22, 22, 980, 396); g.fillStyle = "#54704d"; g.font = "900 130px Georgia"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("5", 110, 100); g.fillText("5", 914, 340); g.fillText("5", 914, 100); g.fillText("5", 110, 340); g.font = "700 40px Georgia"; g.fillText("FIVE DOLLARS", 512, 395); g.beginPath(); g.arc(512, 200, 120, 0, 7); g.lineWidth = 6; g.stroke(); }), []); const F0 = ["#e8a38c", "#c7dc8d", "#c5e6a6", "#efe6cf", "#7a4b22", "#efe7d3", "#f6f1e4", "#2d3a24", "#c7a56b", "#f4efe2"];
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 2.75, 1.65], [0, 0.05, 0.06]), C([0.35, 2.55, 1.55], [0, 0.05, 0.05]), 8)} set={{ warm: 0.4, back: false, spot: [0, 0.1, 0] as V, spotK: 0.5 }}
    scene={(tt) => <>
      <mesh position={[0, 0.05, 0]} rotation={[-1.5708, 0, 0]} scale={lerp(0.6, 1, cl(pop(tt, 0.1)))}><planeGeometry args={[3.5, 1.5]} /><meshStandardMaterial map={T} roughness={0.8} /></mesh>
      {Array.from({ length: 10 }, (_, i) => { const k = pop(tt, 0.7 + i * 0.33, 7, 0.5), x = -1.17 + (i % 5) * 0.585, z = i < 5 ? -0.32 : 0.34; return <Pop key={i} k={k} p={[x, 0.06, z]}><Cyl p={[0, 0.015, 0]} r={0.25} h={0.03} c="#f7f2e6" rough={0.25} /><Cyl p={[0, 0.045, 0]} r={0.17} h={0.05} c={F0[i]} rough={0.65} /></Pop>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={rel(h, 0, 4)} txt="UNDER FIVE DOLLARS" />} />; };

// 6:45 · LA OLLA GRITA: anillos de sonido rojos desde la olla sobre fuego alto; se baja el fuego y la olla se calla
const shoutpot: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 1.05, 2.6], [0, 0.6, 0]), C([0.5, 0.95, 2.35], [0, 0.6, 0]), 7)} set={(tt: number) => ({ warm: 0.5, spot: [0, 0.5, 0] as V, spotK: lerp(1.1, 0.35, eio(tt, 3.2, 4.3)) })}
  scene={(tt) => { const q = eio(tt, 3.2, 4.3), hi = 1 - q; return <>
    <Cyl p={[0, 0.08, 0]} r={0.62} h={0.08} c="#1e1f22" rough={0.5} m={0.6} />
    <Flame p={[0, 0.12, 0]} k={lerp(1, 0.12, q)} t={tt} />
    <SteelPot p={[0, 0.3, 0]} r={0.5} h={0.5} c="#34373d" />
    <group position={[0.035 * hi * Math.sin(tt * 19), 0.82 + 0.05 * hi * Math.abs(Math.sin(tt * 13)), 0]} rotation={[0.08 * hi * Math.sin(tt * 11), 0, 0.09 * hi * Math.sin(tt * 15)]}><Cyl p={[0, 0, 0]} r={0.53} r2={0.5} h={0.05} c="#3f434a" rough={0.3} m={0.75} /><Sph p={[0, 0.07, 0]} r={0.06} c="#1b1b1e" /></group>
    {Array.from({ length: 5 }, (_, i) => { const u = (tt * 0.8 + i / 5) % 1; return <mesh key={i} position={[0, 1.0 + 0.25 * u, 0]} rotation={[-1.1, 0, 0]}><ringGeometry args={[0.45 + 1.8 * u, 0.5 + 1.8 * u, 60]} /><meshBasicMaterial color="#ff5a3a" transparent opacity={0.65 * (1 - u) * hi} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} /></mesh>; })}
    <Steam p={[0, 0.9, 0]} t={tt} k={0.5 + 0.5 * hi} n={7} s={1.3} />
  </>; }}
  over={(tt) => <>{tt < 3.3 && <Ink tt={tt} at={0.8} txt="TOO HOT" col="#ff8a7a" />}<Ink tt={tt} at={3.6} txt="LOW AND PATIENT" col="#ffd98a" /></>} />;

// 7:15 · LA TAPA ADENTRO: las rodajas bailan en el caldo; baja una tapita de madera, se apoya sobre la comida y se quedan quietas
const otoshi: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.1, 1.3, 2.45], [0, 0.4, 0]), C([-0.4, 1.2, 2.3], [0, 0.42, 0]), 8)} set={{ warm: 0.45, spot: [0, 0.4, 0] as V, spotK: 0.7 }}
  scene={(tt) => { const d = eio(tt, 2.2, 3.5), jig = 1 - d; return <>
    <GlassPot r={0.72} h={0.62} />
    <Cyl p={[0, 0.27, 0]} r={0.7} h={0.38} c="#c79958" rough={0.1} op={0.55} />
    {Array.from({ length: 9 }, (_, i) => { const a = i * 2.4, r = 0.46 * Math.sqrt((i + 0.4) / 9); return <group key={i} position={[r * Math.cos(a) + 0.05 * jig * Math.sin(tt * 4 + i), 0.33 + 0.1 * jig * Math.sin(tt * 3.2 + i * 2), r * Math.sin(a)]} rotation={[0.6 * jig * Math.sin(tt * 2.5 + i), 0, 0.6 * jig * Math.cos(tt * 2.2 + i)]}><Cyl p={[0, 0, 0]} r={0.2} h={0.14} c="#f4ecd6" rough={0.5} /></group>; })}
    <group position={[0, lerp(1.7, 0.45, d) + 0.006 * Math.sin(tt * 5) * d, 0]}><Cyl p={[0, 0, 0]} r={0.62} h={0.05} c="#c9955a" rough={0.8} /><Box p={[0, 0.07, 0]} s={[0.46, 0.09, 0.08]} c="#a97a45" r={0.7} rad={0.02} /></group>
    <Steam p={[0, 0.62, 0]} t={tt} k={0.6} n={6} s={1.2} />
  </>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="RESTING ON THE FOOD" />} />;

// 8:05 · SEIS MINUTOS: en la olla de vidrio los bollos caen al fondo y seis marcas después suben de a uno a flotar
const sixfloat: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.3, 1.0, 3.3], [0, 0.46, 0.15]), C([-0.4, 0.95, 3.15], [0, 0.46, 0.15]), 9)} set={{ warm: 0.3, spot: [0, 0.4, 0] as V, spotK: 0.7 }}
  scene={(tt) => { const X = [-0.36, -0.1, 0.18, 0.4, -0.22, 0.1], Z = [0.1, -0.2, 0.15, -0.1, 0.25, -0.02]; return <>
    <GlassPot r={0.68} h={0.82} />
    <Cyl p={[0, 0.41, 0]} r={0.66} h={0.68} c="#d3b477" rough={0.08} op={0.42} />
    {X.map((x, i) => { const d = eio(tt, 0.2 + i * 0.32, 0.8 + i * 0.32), up = phys2(tt, Math.min(rel(h, 0, 8), (h.out - h.at) * 0.55) + i * 0.22); const y = lerp(1.2, 0.15, d) + 0.58 * up; return <Sph key={i} p={[x, y + 0.012 * Math.sin(tt * 2.4 + i) * up, Z[i]]} r={0.12} c="#f2ead5" sc={[1.2, 0.8, 1]} ro={0.7} />; })}
    {Array.from({ length: 6 }, (_, i) => { const k = pop(tt, 1.4 + i * 0.45); return <Ring key={i} p={[-0.75 + i * 0.3, 0.06, 0.95]} r={0.11} k={k} col="#ffd98a" />; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={Math.min(rel(h, 0, 8), (h.out - h.at) * 0.55) + 0.5} txt="THEY FLOAT" />} />;
const phys2 = (t: number, a: number) => cl(t < a ? 0 : 1 - Math.exp(-3.2 * (t - a)) * Math.cos(5 * (t - a)));

// 9:20 · EL ROLLO: se desenrolla un rollo pintado con la ruta de Tokaido; los viajeros caminan hasta la casita de té de Mariko
const emaki: F = ({ t, h }) => { const T0 = useMemo(() => mk(2048, 512, (g) => { g.fillStyle = "#e9dcbd"; g.fillRect(0, 0, 2048, 512); g.fillStyle = "#5e7e9c"; g.beginPath(); g.moveTo(150, 330); g.lineTo(520, 60); g.lineTo(900, 330); g.fill(); g.fillStyle = "#f2efe6"; g.beginPath(); g.moveTo(450, 112); g.lineTo(520, 60); g.lineTo(590, 112); g.fill(); g.fillStyle = "#6f8a55"; g.fillRect(0, 330, 2048, 200); g.strokeStyle = "#c8a874"; g.lineWidth = 56; g.beginPath(); g.moveTo(0, 430); g.bezierCurveTo(600, 330, 1200, 490, 2048, 380); g.stroke(); g.fillStyle = "#3a2a1a"; for (let i = 0; i < 12; i++) { const x = 170 + i * 150; g.fillRect(x, 240, 12, 100); g.fillStyle = "#2f4f2c"; g.beginPath(); g.arc(x + 6, 220, 46, 0, 7); g.fill(); g.fillStyle = "#3a2a1a"; } g.fillStyle = "#7a4b22"; g.fillRect(1660, 210, 300, 130); g.fillStyle = "#3a2a1a"; g.beginPath(); g.moveTo(1620, 214); g.lineTo(1810, 110); g.lineTo(2000, 214); g.fill(); g.fillStyle = "#c33"; g.font = "900 60px Georgia"; g.textAlign = "center"; g.fillText("MARIKO", 1810, 290); }), []);
  const T = useMemo(() => { const c = T0.clone(); c.needsUpdate = true; return c; }, [T0]);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([-0.3, 2.15, 2.15], [0, 0.03, 0]), C([0.4, 2.0, 2.05], [0, 0.03, 0]), 9)} set={{ warm: 0.4, back: false, spot: [0, 0.1, 0] as V, spotK: 0.45 }}
    scene={(tt) => { const k = Math.max(0.02, eio(tt, 0.2, 3)); T.repeat.set(k, 1); T.offset.set(0, 0); const w = 4.2 * k, x0 = -2.1; return <>
      <mesh position={[x0 + w / 2, 0.062, 0]} rotation={[-1.5708, 0, 0]}><planeGeometry args={[w, 1.05]} /><meshStandardMaterial map={T} roughness={0.85} /></mesh>
      <Cyl p={[x0 - 0.02, 0.1, 0]} r={0.07} h={1.2} c="#7a4b22" rough={0.45} rot={[1.5708, 0, 0]} />
      <Cyl p={[x0 + w, 0.135, 0]} r={lerp(0.16, 0.075, k)} h={1.15} c="#e9dcbd" rough={0.8} rot={[1.5708, 0, 0]} />
      {[0, 1, 2].map((i) => { const u = eio(tt, 3 + i * 0.25, 7.6 + i * 0.1) * 0.82 + 0.05 * i, x = x0 + 4.2 * u, by = 0.02 * Math.abs(Math.sin(tt * 7 + i * 2)); return tt < 2.9 ? null : <group key={i} position={[x, 0.08 + by, 0.15 - 0.17 * Math.sin(u * 3.14)]}><Cyl p={[0, 0.13, 0]} r={0.04} r2={0.07} h={0.24} c={["#3c5ea0", "#a33b28", "#3f6b4a"][i]} rough={0.7} /><Sph p={[0, 0.28, 0]} r={0.038} c="#e3c7a4" /><mesh position={[0, 0.33, 0]}><coneGeometry args={[0.09, 0.05, 20]} /><meshStandardMaterial color="#c79958" roughness={0.9} /></mesh></group>; })}
    </>; }}
    over={(tt) => <Ink tt={tt} at={3.8} txt="THE OLD TOKAIDO ROAD" />} />; };

// 10:20 · EL ZANCO: dos cubos de tofu con miso mantienen el equilibrio sobre un solo palito, como los bailarines
const stilts: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 2.0, 2.6], [0, 0.95, 0]), C([0.5, 1.9, 2.4], [0, 0.95, 0]), 8)} set={{ warm: 0.55, spot: [0, 0.8, 0] as V, spotK: 0.9, bg: "#1e1812" }}
  scene={(tt) => { const hop = Math.abs(Math.sin(tt * 2.4)); return <>
    {[-0.62, 0.62].map((x, i) => { const k = pop(tt, 0.4 + 0.45 * i, 6, 0.45), sway = 0.16 * Math.sin(tt * 2.4 + i * 1.3); return <Pop key={i} k={k} p={[x, 0.05 + 0.08 * hop, 0]}><group rotation={[0, 0.3 - 0.6 * i, sway]}>
      <Cyl p={[0, 0.5, 0]} r={0.018} h={1.0} c="#d9bb88" rough={0.8} />
      <Box p={[0, 1.15, 0]} s={[0.55, 0.32, 0.3]} c={TOFU} r={0.6} rad={0.03} />
      <Box p={[0, 1.33, 0]} s={[0.49, 0.05, 0.25]} c={MISO} r={0.55} rad={0.022} />
      {Array.from({ length: 10 }, (_, j) => <Sph key={j} p={[-0.21 + rnd(j) * 0.42, 1.365, -0.1 + rnd(j + 5) * 0.2]} r={0.02} c="#2a1408" sc={[1, 0.3, 1]} />)}
    </group></Pop>; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="FIELD DANCERS" />} />;

// 11:40 · NIEVE: la bandeja de tofu olvidada en la nieve de la montaña se vuelve esponja: le nacen los agujeros
const snowsponge: F = ({ t, h }) => { const T = useMemo(() => mk(512, 256, (g) => { g.fillStyle = "#e9dec2"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#bfae85"; for (let i = 0; i < 360; i++) { g.beginPath(); g.ellipse(rnd(i) * 512, rnd(i + 40) * 256, 3 + rnd(i + 90) * 9, 2 + rnd(i + 15) * 6, rnd(i) * 3, 0, 7); g.fill(); } }), []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.2, 1.1, 2.2], [0, 0.3, 0]), C([-0.4, 1.0, 2.05], [0, 0.32, 0]), 8)} set={{ warm: 0, back: false, bg: "#8aa3bb", spot: [0, 0.3, 0] as V, spotK: 0.4 }}
    scene={(tt) => { const k = eio(tt, rel(h, 0, 2.4), rel(h, 0, 2.4) + 2.4); return <>
      <Cyl p={[0, 0.03, 0]} r={3.6} h={0.05} c="#c7d2de" rough={0.8} seg={48} />
      <Box p={[0, 0.1, 0]} s={[1.7, 0.08, 1.05]} c="#8a6239" r={0.8} rad={0.02} />
      {[-0.42, 0.42].map((x, i) => <group key={i}><Box p={[x, 0.3, 0]} s={[0.7, 0.32, 0.72]} c={TOFU} r={0.55} rad={0.03} op={1 - k} /><Box p={[x, 0.3, 0]} s={[0.7, 0.32, 0.72]} c="#ffffff" map={T} r={0.85} rad={0.03} op={k} /></group>)}
      {Array.from({ length: 42 }, (_, i) => { const u = (tt * 0.26 + rnd(i + 8)) % 1; return <Sph key={i} p={[-1.8 + 3.6 * rnd(i), lerp(2.3, 0.05, u), -1 + 2 * rnd(i + 4) + 0.1 * Math.sin(tt + i)]} r={0.022 + 0.018 * rnd(i + 3)} c="#ffffff" ro={0.7} />; })}
    </>; }}
    over={(tt) => <Ink tt={tt} at={rel(h, 0, 2.4) + 1.6} txt="IT BECAME A SPONGE" />} />; };

// 12:50 · UNA OLLA, CUATRO DÍAS: de la olla del domingo saltan cuatro chorros curvos a cuatro frascos con su día
const sunpot: F = ({ t, h }) => { const D = useMemo(() => ["MON", "TUE", "WED", "THU"].map((d) => cardTex([d], { bg: "#f7f1e4", fg: "#7a2f28", w: 256, h: 128 })), []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 1.5, 3.25], [0, 0.42, 0]), C([0.4, 1.4, 3], [0, 0.42, 0]), 8)} set={{ warm: 0.4, spot: [0, 0.4, 0] as V, spotK: 0.6 }}
    scene={(tt) => <>
      <SteelPot p={[0, 0.05, -0.55]} r={0.55} h={0.55} />
      <Cyl p={[0, 0.54, -0.55]} r={0.53} h={0.02} c="#c79958" rough={0.15} />
      <Steam p={[0, 0.62, -0.55]} t={tt} k={0.8} n={7} s={1.3} />
      {[-1.35, -0.45, 0.45, 1.35].map((x, i) => { const at = 1 + i * 0.75, k = pop(tt, at), fill = eio(tt, at + 0.3, at + 1.4); return <group key={i}>
        <Pop k={k} p={[x, 0.05, 0.6]}><mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.24, 0.24, 0.5, 36, 1, true]} /><meshPhysicalMaterial color={GLASS} transparent opacity={0.25} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} /></mesh><Cyl p={[0, 0.02 + 0.2 * fill, 0]} r={0.225} h={Math.max(0.01, 0.4 * fill)} c="#c79958" rough={0.15} op={0.85} /><mesh position={[0, 0.25, 0.245]}><planeGeometry args={[0.3, 0.15]} /><meshStandardMaterial map={D[i]} roughness={0.8} /></mesh></Pop>
        {Array.from({ length: 16 }, (_, j) => { const u = (tt * 1.5 + j / 16) % 1, on = cl((tt - at) / 0.2) * (1 - cl((tt - at - 1.4) / 0.25)); return on < 0.02 ? null : <Sph key={j} p={[lerp(0, x, u), 0.62 + 1.0 * Math.sin(Math.PI * u) - 0.1 * u, lerp(-0.55, 0.6, u)]} r={0.028} c="#c79958" ro={0.15} op={on} />; })}
      </group>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={3.8} txt="ONE POT · FOUR DAYS" />} />; };

// 13:20 · LA DESPENSA: en el estante caen los siete frascos con su nombre, cada uno cuando ella lo nombra
const larder: F = ({ t, h }) => { const NM = ["KOMBU", "BONITO", "SHIITAKE", "MISO", "VINEGAR", "MIRIN", "SESAME"], CC = ["#2d3a24", "#c98765", "#5b3a22", "#a8672c", "#d9c79a", "#cda54f", "#8a5a23"]; const L = useMemo(() => NM.map((n) => cardTex([n], { bg: "#f7f1e4", fg: "#2a1d12", w: 320, h: 192, font: "Georgia, serif" })), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([-0.2, 0.75, 3.45], [0, 0.64, 0]), C([0.3, 0.72, 3.2], [0, 0.65, 0]), 11)} set={{ warm: 0.5, back: false, bg: "#3a2a1c", spot: [0, 0.6, 0] as V, spotK: 0.75 }}
    scene={(tt) => <>
      <Box p={[0, 0.8, -0.35]} s={[4.3, 1.9, 0.08]} c="#5c4028" r={0.8} rad={0.02} />
      <Box p={[0, 0.1, 0]} s={[4.3, 0.08, 0.72]} c="#8a6239" r={0.7} rad={0.015} />
      <Cyl p={[0, 1.62, -0.2]} r={0.008} h={4.2} c="#d9c79a" rough={0.8} rot={[0, 0, 1.5708]} />
      {Array.from({ length: 13 }, (_, i) => <group key={"h" + i} rotation={[0, 0, 0.05 * Math.sin(tt * 1.3 + i)]} position={[-1.92 + i * 0.32, 1.62, -0.2]}><Sph p={[0, -0.13, 0]} r={0.085} c={i % 3 === 2 ? "#3a2a1a" : "#c9722e"} sc={[0.9, 1.25, 0.9]} ro={0.8} /></group>)}
      {[-2.15, 2.15].map((x) => <Box key={x} p={[x, 0.8, 0]} s={[0.08, 1.9, 0.72]} c="#6d4a2c" r={0.75} rad={0.012} />)}
      {NM.map((_, i) => { const at = 0.45 + i * (h.out - h.at - 2.4) / 6, k = pop(tt, at, 6.5, 0.42), x = -1.44 + i * 0.48, y = 0.14 + 0.1 * (1 - cl(k)) * 8; return k < 0.02 ? null : <group key={i} position={[x, y, 0]}>
        <mesh position={[0, 0.34, 0]} castShadow><cylinderGeometry args={[0.21, 0.21, 0.68, 36]} /><meshPhysicalMaterial color={CC[i]} roughness={0.25} clearcoat={0.5} /></mesh>
        <Cyl p={[0, 0.72, 0]} r={0.2} h={0.1} c="#dcd2bb" rough={0.5} />
        <mesh position={[0, 0.3, 0.213]}><planeGeometry args={[0.34, 0.2]} /><meshStandardMaterial map={L[i]} roughness={0.8} /></mesh></group>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={h.out - h.at - 1.5} txt="SEVEN THINGS" />} />; };

// 14:25 · LA ESPINA: la cola de pescado entra al colador, pasa el chorro de agua hirviendo y baja al caldo que oscurece
const bones: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.15, 1.5, 2.6], [0, 0.48, 0]), C([0.55, 1.4, 2.4], [0, 0.48, 0]), 8)} set={{ warm: 0.35, spot: [0, 0.4, 0] as V, spotK: 0.75 }}
  scene={(tt) => { const d = eio(tt, 3.6, 5.2), c = eio(tt, 4.8, 7.6); return <>
    <GlassPot r={0.7} h={0.62} />
    <Cyl p={[0, 0.28, 0]} r={0.68} h={0.42} c={col("#e6dcbe", "#7c4f22", c)} rough={0.15} op={0.82} />
    <group position={[0, lerp(1.2, 0.4, d), 0]} rotation={[0, 0.3, 0]}>
      <Cyl p={[0, 0, 0]} r={0.018} h={1.05} c="#f4eedc" rough={0.4} rot={[0, 0, 1.5708]} />
      {Array.from({ length: 13 }, (_, i) => <group key={i} position={[-0.42 + i * 0.07, 0, 0]}><Box p={[0, 0.0, 0]} s={[0.008, 0.008, 0.34 - 0.012 * i]} c="#f4eedc" r={0.4} rad={0.003} cast={false} /><Box p={[0, 0.07, 0]} s={[0.008, 0.16 - 0.004 * i, 0.008]} c="#f4eedc" r={0.4} rad={0.003} cast={false} /></group>)}
      <Sph p={[0.58, 0, 0]} r={0.16} c="#b8b2a0" sc={[1.1, 0.8, 0.6]} ro={0.55} /><Sph p={[0.65, 0.04, 0.09]} r={0.03} c="#111" />
      <mesh position={[-0.58, 0, 0]} rotation={[0, 0, 1.5708]} scale={[1, 1, 0.12]}><coneGeometry args={[0.15, 0.22, 3]} /><meshStandardMaterial color="#c9c3af" roughness={0.6} /></mesh>
    </group>
    {tt < 3.3 && Array.from({ length: 22 }, (_, i) => { const u = (tt * 1.6 + i / 22) % 1; return <Sph key={i} p={[lerp(1.3, 0.1, u), 2.0 - u * u * 0.8 + 0.15 * u * (1 - u), 0.02 * Math.sin(i)]} r={0.03} c="#d8ecf8" ro={0.05} op={0.85 * cl(tt / 0.3)} />; })}
    <Steam p={[0.1, 1.25, 0]} t={tt} k={1 - d} n={6} s={1.2} /><Steam p={[0, 0.5, 0]} t={tt} k={d} n={6} s={1.2} />
  </>; }}
  over={(tt) => <Ink tt={tt} at={1.6} txt="SO IT WON'T TASTE OLD" />} />;

// 15:35 · EL OLOR EN LA ESCALERA: un rastro dorado sube escalón por escalón hasta el sobre del sueldo, y la nena lo huele
const stairsmell: F = ({ t, h }) => { const T = useMemo(() => cardTex(["PAY"], { bg: "#e3cf9f", fg: "#5a3a1a", w: 256, h: 160, font: "Georgia, serif" }), []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 1.5, 4.0], [0.05, 1.05, 0]), C([0.4, 1.4, 3.7], [0.05, 1.05, 0]), 8)} set={{ warm: 0.65, back: false, bg: "#2a1f16", spot: [0, 0.8, 0] as V, spotK: 0.9 }}
    scene={(tt) => { const N = 7; const P = (u: number): V => { const s = u * (N - 1), i = Math.floor(s), f = s - i; return [-1.85 + (i + f) * 0.6, 0.48 + (i + eio(f, 0, 1)) * 0.3 + 0.22, 0.08 * Math.sin(u * 9)]; }; const reach = eio(tt, 0.5, 4.8);
      return <>
        {Array.from({ length: N }, (_, i) => <Box key={i} p={[-1.85 + i * 0.6, 0.27 + i * 0.15, 0]} s={[0.6, 0.45 + i * 0.3, 0.95]} c={col("#6d4a2c", "#4f341e", (i % 2) * 0.6)} r={0.7} rad={0.012} />)}
        <group position={[-2.5, 0.05, 0]}><SteelPot p={[0, 0, 0]} r={0.33} h={0.34} /><Cyl p={[0, 0.3, 0]} r={0.31} h={0.02} c="#a8672c" rough={0.3} /></group>
        {Array.from({ length: 70 }, (_, i) => { const u = i / 70, a = cl((reach - u) * 8); if (a < 0.02) return null; const [x, y, z] = P(u); return <Sph key={i} p={[x + 0.04 * Math.sin(tt * 1.5 + i), y + 0.08 * Math.sin(tt * 1.2 + i * 0.7), z]} r={0.06 + 0.04 * Math.sin(i * 1.3) ** 2} c="#ffc36b" e="#ff9a3a" ei={0.7} op={0.3 * a} />; })}
        <Pop k={pop(tt, 4.6)} p={[1.72, 2.02, 0.2]} rot={[-0.6, 0, -0.14]}><Box p={[0, 0, 0]} s={[0.55, 0.012, 0.34]} c="#e3cf9f" r={0.85} rad={0.004} /><mesh position={[0, 0.0075, 0]} rotation={[-1.5708, 0, 0]}><planeGeometry args={[0.5, 0.3]} /><meshStandardMaterial map={T} roughness={0.85} /></mesh></Pop>
        <Sachi p={secuencia([[0, PZ.stand], [4.8, PZ.reach]], tt)} t={tt} x={0.85} z={0.1} rotY={-1.2} s={S * 1.1} expr="feliz" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={rel(h, 0, 5)} y={960} txt="FATHER HAD BEEN PAID" />} />; };

// 16:20 · EL GANSO FALSO: las croquetas doradas se ordenan, forman un ganso y aletean sobre la mesa
const goose: F = ({ t, h }) => { const N = 26; const shape = (i: number): [number, number] => { if (i < 8) { return [-0.1 + i * 0.13, 0.12 * Math.sin(i * 0.5)]; } if (i < 16) { const j = i - 8; return [-0.2 - j * 0.1, 0.1 + j * 0.13]; } if (i < 24) { const j = i - 16; return [-0.2 - j * 0.1, -0.1 - j * 0.13]; } return [0.95 + (i - 24) * 0.12, 0.05]; };
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 2.35, 2.05], [0.1, 0.25, 0]), C([0.3, 2.15, 1.85], [0.1, 0.32, 0]), 8)} set={{ warm: 0.5, back: false, spot: [0, 0.2, 0] as V, spotK: 0.6 }}
    scene={(tt) => { const k = eio(tt, 0.7, 2.8), lift = eio(tt, 4.2, 7.5); return <group position={[0.7 * lift, 0.5 * lift, 0]}>
      {Array.from({ length: N }, (_, i) => { const [sx, sz] = shape(i), wing = i >= 8 && i < 24 ? (i < 16 ? 1 : -1) * (i % 8 + 1) * 0.1 * Math.sin(tt * 4.5) * eio(tt, 3.4, 4) : 0, rx = -1.5 + (i % 7) * 0.5, rz = -0.35 + Math.floor(i / 7) * 0.26;
        return <group key={i} position={[lerp(rx, sx, k), 0.08 + 0.5 * Math.sin(Math.PI * k) * rnd(i) + Math.abs(wing) * 0.6, lerp(rz, sz, k)]}><Cyl p={[0, 0, 0]} r={0.065} h={0.045} c={col("#c98a3a", "#e8b562", rnd(i + 1))} rough={0.5} /></group>; })}
      <Sph p={[lerp(-1.6, 1.34, k), 0.13, lerp(0.6, 0.05, k)]} r={0.05} c="#111" />
    </group>; }}
    over={(tt) => <Ink tt={tt} at={3.2} txt="IT FOOLED THE MONKS" />} />; };

// 16:50 · SE VA LO BLANCO: la taza lechosa se aclara sobre la llamita hasta dejar ver lo que hay detrás
const clearing: F = ({ t, h }) => { const T = useMemo(() => cardTex(["READY"], { bg: "#7a2f28", fg: "#ffe7bf", w: 512, h: 256, font: "Georgia, serif" }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 0.72, 2.25], [0, 0.6, 0]), C([-0.25, 0.7, 2.1], [0, 0.6, 0]), 7)} set={{ warm: 0.5, spot: [0, 0.5, 0] as V, spotK: 0.65 }}
    scene={(tt) => { const k = eio(tt, 1.1, 2.7); return <>
      <Cyl p={[0, 0.07, 0]} r={0.5} h={0.05} c="#1e1f22" rough={0.5} m={0.6} /><Flame p={[0, 0.1, 0]} k={0.12} t={tt} />
      <group position={[0, 0.34, -0.22]} rotation={[-0.08, 0, 0]}><mesh position={[0, 0.4, 0]}><planeGeometry args={[0.72, 0.36]} /><meshStandardMaterial map={T} roughness={0.8} /></mesh></group>
      <group position={[0, 0.2, 0]}><mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.48, 0.42, 0.85, 56, 1, true]} /><meshPhysicalMaterial color={GLASS} transparent opacity={0.2} roughness={0.04} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        <Cyl p={[0, 0.37, 0]} r={0.46} r2={0.415} h={0.7} c={col("#d9d3c1", "#f0dfae", k)} rough={0.2} op={lerp(0.96, 0.08, k)} /></group>
    </>; }}
    over={(tt) => <Ink tt={tt} at={2.6} txt="MILKY TO CLEAR" />} />; };

// 17:35 · FUWA FUWA: una nube de huevo sube por la olla y levanta la tapa mientras el aro de sesenta se cierra
const fuwarise: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.15, 1.15, 2.3], [0, 0.55, 0]), C([0.5, 1.05, 2.1], [0, 0.6, 0]), 8)} set={{ warm: 0.5, spot: [0, 0.5, 0] as V, spotK: 0.8 }}
  scene={(tt) => { const k = eio(tt, 1, 6); return <>
    <SteelPot p={[0, 0.05, 0]} r={0.46} h={0.4} c="#8f4a32" />
    <group position={[0, 0.42, 0]}>{Array.from({ length: 11 }, (_, i) => { const a = i * 2.4, r = 0.3 * Math.sqrt(i / 11); return <Sph key={i} p={[r * Math.cos(a), 0.02 + 0.32 * k * (1 - r), r * Math.sin(a)]} r={0.08 + 0.2 * k} c={col("#f2c14e", "#ffe89f", k)} ro={0.8} />; })}</group>
    <group position={[0, 0.5 + 0.56 * k, 0.04 * k]} rotation={[0, 0, -0.2 * k]}><Cyl p={[0, 0, 0]} r={0.49} r2={0.46} h={0.05} c="#b0623f" rough={0.35} m={0.3} /><Sph p={[0, 0.07, 0]} r={0.05} c="#2a1d12" /></group>
    {Array.from({ length: 60 }, (_, i) => { const a = i / 60 * 6.283 - 1.5708, on = (i + 1) / 60 <= cl(tt / 6.4); return on ? <Box key={i} p={[1.02 * Math.cos(a), 0.06, 1.02 * Math.sin(a)]} s={[0.05, 0.012, 0.09]} rot={[0, -a, 0]} c="#f2c14e" e="#f2c14e" ei={0.6} r={0.5} rad={0.003} cast={false} /> : null; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={1.5} txt="COUNT TO SIXTY" />} />;

// 18:50 · LA QUE NO SE SIENTA: cinco cuencos llenos, todos sentados; ella de pie atrás, con la bandeja
const standing: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.1, 0.95, 2.9], [0, 0.55, 0]), C([-0.3, 0.85, 2.55], [0, 0.58, 0]), 9)} set={{ warm: 0.65, spot: [0, 0.4, 0.2] as V, spotK: 0.8 }}
  scene={(tt) => <>
    <Box p={[0, 0.2, 0.35]} s={[2.5, 0.06, 1.05]} c="#3a241a" r={0.3} rad={0.02} />
    {[-1, 1].map((s) => <Box key={s} p={[s * 1.08, 0.1, 0.35]} s={[0.1, 0.18, 0.9]} c="#2a1b13" r={0.5} rad={0.012} />)}
    {[-0.86, -0.43, 0, 0.43, 0.86].map((x, i) => { const k = pop(tt, 0.4 + i * 0.3); return <Pop key={i} k={k} p={[x, 0.235, 0.5]}><Bowl p={[0, 0, 0]} s={0.66} c={["#27345c", "#7a2f28", "#3c5a4a", "#27345c", "#7a2f28"][i]} /></Pop>; })}
    {[-0.82, 0.82].map((x, i) => <Sachi key={i} p={PZ.seiza} t={tt + i} x={x} z={1.25} rotY={3.14} s={S * 1.05} expr="feliz" contacto={0} />)}
    {[-0.3, 0.3].map((x, i) => <Sachi key={"b" + i} p={PZ.seiza} t={tt + i * 2} x={x} z={1.3} rotY={3.14} s={S * 0.85} expr="feliz" contacto={0} />)}
    <Sachi p={secuencia([[0, PZ.stand]], tt)} t={tt} x={0} z={-0.62} rotY={0} s={S * 1.5} expr="feliz" />
  </>}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 2.2)} txt="NOT ONE TIME" />} />;

// 20:00 · LAS DOCE: las doce bolitas llegan a la bandeja de laca, se cierra la caja y la tela azul la envuelve con un nudo
const twelve: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.25, 1.45, 2.15], [0, 0.22, 0]), C([-0.2, 1.3, 1.95], [0, 0.26, 0]), 9)} set={{ warm: 0.7, spot: [0, 0.2, 0] as V, spotK: 1, bg: "#20160f" }}
  scene={(tt) => { const lid = 0, wrap = 0; return <>
    <Box p={[0, 0.13, 0]} s={[1.5, 0.18, 1.14]} c={LAC} r={0.15} rad={0.02} />
    <Box p={[0, 0.22, 0]} s={[1.38, 0.012, 1.02]} c="#6b1f1a" r={0.25} rad={0.005} />
    {Array.from({ length: 12 }, (_, i) => { const k = pop(tt, 0.4 + i * 0.5, 7.5, 0.5), x = -0.5 + (i % 4) * 0.334, z = -0.33 + Math.floor(i / 4) * 0.33; return <Pop key={i} k={k} p={[x, 0.3, z]}><Sph p={[0, 0, 0]} r={0.13} c="#3a1712" sc={[1.1, 0.78, 1]} ro={0.72} /></Pop>; })}
    <group position={[0, lerp(1.2, 0.27, lid), lerp(-0.2, 0, lid)]} rotation={[lerp(-0.6, 0, lid), 0, 0]}>{lid > 0.01 && <><Box p={[0, 0, 0]} s={[1.55, 0.09, 1.19]} c={LAC} r={0.12} rad={0.02} /><Box p={[0, 0.05, 0]} s={[1.0, 0.004, 0.7]} c="#b78b3c" r={0.25} m={0.75} rad={0.002} /></>}</group>
    {wrap > 0.02 && <><group position={[-0.8, 0.05, 0]} rotation={[0, 0, -1.2 * wrap]}><Box p={[0.75, 0, 0]} s={[1.5, 0.02, 1.25]} c="#26406b" r={0.9} rad={0.008} /></group>
      <group position={[0.8, 0.05, 0]} rotation={[0, 0, 1.2 * wrap]}><Box p={[-0.75, 0, 0]} s={[1.5, 0.02, 1.25]} c="#2c4a7a" r={0.9} rad={0.008} /></group></>}
    {wrap > 0.82 && <Pop k={pop(tt, 6.7)} p={[0, 0.62, 0]}><Sph p={[0, 0, 0]} r={0.14} c="#203a63" sc={[1.4, 0.8, 1]} ro={0.9} />{[-1, 1].map((s) => <group key={s} position={[s * 0.2, 0, 0]} rotation={[0, 0, s * 0.6]}><Box p={[s * 0.12, 0, 0]} s={[0.3, 0.02, 0.16]} c="#26406b" r={0.9} rad={0.006} /></group>)}</Pop>}
  </>; }}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 6.5)} txt="SHE HAD MADE TWELVE" />} />;

// 20:15 · EL ÚLTIMO: mar de noche, el barquito se aleja y queda la última bolita en la caja abierta
const lastboat: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 1.05, 3.5], [0.2, 0.72, 0]), C([0.25, 1.0, 3.2], [0.2, 0.72, 0]), 8)} set={{ warm: 0, back: false, bg: "#10203a", spot: [0.9, 0.6, -1] as V, spotK: 0.55 }}
  scene={(tt) => { const w = eio(tt, 0.2, 8); return <>
    {Array.from({ length: 16 }, (_, z) => Array.from({ length: 22 }, (_, x) => { const X = -5.2 + x * 0.5, Z = -6 + z * 0.5; return <Box key={z + "-" + x} p={[X, 0.1 + 0.05 * Math.sin(tt * 0.9 + X * 1.2 + Z * 0.9), Z]} s={[0.5, 0.06, 0.5]} c={col("#17365a", "#1f4a72", ((x + z) % 3) * 0.4)} r={0.3} m={0.4} rad={0.008} cast={false} />; }))}
    <Sph p={[2.3, 2.25, -5]} r={0.3} c="#fff4d8" e="#fff4d8" ei={1.1} />
    <group position={[lerp(-1.3, 1.5, w), 0.26 + 0.03 * Math.sin(tt * 1.2), -3.8]} rotation={[0, 0, 0.04 * Math.sin(tt * 1.1)]} scale={0.8}><Box p={[0, 0.12, 0]} s={[1.5, 0.22, 0.36]} c="#1a1c20" r={0.45} rad={0.05} /><Box p={[-0.05, 0.36, 0]} s={[0.9, 0.24, 0.26]} c="#e7dfcb" r={0.5} rad={0.02} /><Cyl p={[0.18, 0.62, 0]} r={0.08} h={0.34} c="#7a2f28" rough={0.4} />{[0, 1, 2, 3].map((i) => <Sph key={i} p={[-0.34 + i * 0.2, 0.37, 0.135]} r={0.022} c="#ffd98a" e="#ffc36b" ei={1.1} />)}</group>
    <group position={[0, 0.62, 0.45]} rotation={[0.35, 0, 0]}><Box p={[0, 0, 0]} s={[1.05, 0.12, 0.74]} c={LAC} r={0.15} rad={0.02} /><Box p={[0, 0.062, 0]} s={[0.92, 0.008, 0.62]} c="#6b1f1a" r={0.25} rad={0.004} />
      <Sph p={[0, 0.13, 0]} r={0.135} c="#3a1712" sc={[1.1, 0.78, 1]} ro={0.75} /></group>
  </>; }}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 3)} txt="FOUR DAYS OUT" />} />;

// 20:25 · LA ÚLTIMA PÁGINA: hoja en blanco; aparece sólo el nombre del plato, trazo por trazo; ninguna medida
const lastpage: F = ({ t, h }) => { const T0 = useMemo(() => mk(1024, 700, (g) => { g.fillStyle = "#efe5cb"; g.fillRect(0, 0, 1024, 700); g.strokeStyle = "rgba(90,70,40,.18)"; g.lineWidth = 2; for (let y = 60; y < 700; y += 58) { g.beginPath(); g.moveTo(40, y); g.lineTo(984, y); g.stroke(); } }), []);
  const W = useMemo(() => mk(1024, 700, (g) => { g.clearRect(0, 0, 1024, 700); g.fillStyle = "#0a1020"; g.font = "italic 700 140px Georgia"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("Botamochi", 180, 320); }), []);
  const Wm = useMemo(() => { const c = W.clone(); c.needsUpdate = true; return c; }, [W]);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 2.05, 0.95], [0, 0.06, 0]), C([0.14, 1.75, 0.88], [0, 0.06, 0]), 9)} set={{ warm: 0.5, back: false, spot: [0, 0.1, 0] as V, spotK: 0.8 }}
    scene={(tt) => { const k = Math.max(0.01, eio(tt, 1.2, 4)); Wm.repeat.set(k, 1); return <>
      <Box p={[0, 0.06, 0]} s={[2.3, 0.04, 1.6]} c="#5a4632" r={0.85} rad={0.012} />
      <mesh position={[0, 0.085, 0]} rotation={[-1.5708, 0, 0]}><planeGeometry args={[2.1, 1.44]} /><meshStandardMaterial map={T0} color="#bcb29c" roughness={0.9} /></mesh>
      <mesh position={[-1.05 + 1.05 * k, 0.087, 0]} rotation={[-1.5708, 0, 0]}><planeGeometry args={[2.1 * k, 1.44]} /><meshStandardMaterial map={Wm} transparent roughness={0.9} depthWrite={false} /></mesh>
    </>; }}
    over={(tt) => <Ink tt={tt} at={5} txt="NO MEASURES AT ALL" size={60} />} />; };

// CUADRO 0: la miniatura sin texto ni flecha, rehecha en código: ella con el cuaderno viejo abierto entre las fuentes
export const Cover0: React.FC = () => { const T = useMemo(() => cardTex(["祖母の", "料理帳"], { bg: "#d8c693", fg: "#3a2a18", w: 512, h: 360 }), []); return <KSet0 cam={C([0.0, 2.2, 3.1], [0.0, 1.98, 0.0])} warm={0.65} spot={[0, 0.8, 0] as V} spotK={0.8}>
  <Sachi p={PZ.stand} t={0.4} x={0} z={-0.7} rotY={0} s={S * 3.6} expr="feliz" />
  <group position={[0, 1.0, 0]}>
  <group position={[0, 0.88, 0.55]} rotation={[-0.55, 0, 0]}><Box p={[0, 0, 0]} s={[1.3, 0.04, 0.9]} c="#5a3a20" r={0.7} rad={0.015} /><mesh position={[0, 0.028, 0]} rotation={[-1.5708, 0, 0]}><planeGeometry args={[1.22, 0.82]} /><meshStandardMaterial map={T} color="#cfc7b2" roughness={0.85} /></mesh></group>
  {[[-1.35, 0.25, 0.9, "#e0792f"], [1.35, 0.25, 0.9, "#7da04a"], [-1.0, 0.25, 1.5, "#d9b24a"], [1.0, 0.25, 1.5, "#a0312b"]].map(([x, y, z, c], i) => <group key={i}><Bowl p={[x as number, y as number, z as number]} s={2} c={i % 2 ? "#2c4a8a" : "#e9e1cc"} fill={c as string} /></group>)}
</group>
</KSet0>; };

export const ALL: Record<string, F> = { receipt, tin, dance, cabbagewater, readthrough, spiralpeel, puppet, roofcrow, flower, mortar, fivebill, shoutpot, otoshi, sixfloat, emaki, stilts, snowsponge, sunpot, larder, bones, stairsmell, goose, clearing, fuwarise, standing, twelve, lastboat, lastpage };
