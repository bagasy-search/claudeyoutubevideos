// sk8ph · los componentes ÚNICOS de «25 Japanese Kitchen Tricks My Mother Never Wrote Down» (registro: D:/rtmp/premium8n_sachiko_COMPONENTES.md).
import React, { useMemo } from "react";
import * as THREE from "three";
import { F, Hero, C, lerp, pop, Pop, Ink, cardTex, Steam, Bowl, Ring, Sachi, PZ, S, cl, eio, orbita, Box, Cyl, V, secuencia } from "./hk";
import { KSet as KSet0 } from "./hk";
import { mk } from "./casa3d";

const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const dur = (h: any) => h.out - h.at;
const rel = (h: any, i: number, d: number) => Math.min((h.items?.[i]?.at ?? h.at + d) - h.at, dur(h) - 2.2);
const BOARD = "#c9955a", TOFU = "#d8d0bb", WHITE = "#d9d3c1", GLASS = "#dfeef2", SKIN = "#caa17c", DARK = "#1e1f22";
const Board: React.FC<{ p?: V; w?: number; d?: number }> = ({ p = [0, 0.04, 0], w = 1.3, d = 0.7 }) => <Box p={[p[0], p[1] + 0.02, p[2]]} s={[w, 0.04, d]} c={BOARD} r={0.75} rad={0.012} />;
const Sph: React.FC<{ p: V; r: number; c: string; sc?: V; ro?: number; m?: number; e?: string; ei?: number; op?: number }> = ({ p, r, c, sc, ro = 0.6, m = 0, e, ei = 0, op }) =>
  <mesh position={p} scale={sc} castShadow><sphereGeometry args={[r, 28, 18]} /><meshStandardMaterial color={c} roughness={ro} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} depthWrite={op === undefined} /></mesh>;
const GlassPot: React.FC<{ p?: V; r?: number; h?: number }> = ({ p = [0, 0.05, 0], r = 0.5, h = 0.6 }) => <group position={p}>
  <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[r, r, h, 56, 1, true]} /><meshPhysicalMaterial color={GLASS} transparent opacity={0.2} roughness={0.04} side={THREE.DoubleSide} depthWrite={false} /></mesh>
  <Cyl p={[0, 0.012, 0]} r={r} h={0.024} c="#cdd6da" rough={0.25} m={0.5} /></group>;
const Flame: React.FC<{ p: V; k: number; t: number; n?: number; R?: number }> = ({ p, k, t, n = 9, R = 0.32 }) => k < 0.03 ? null : <group position={p}>{Array.from({ length: n }, (_, i) => { const a = i / n * 6.283, h = (0.12 + 0.34 * k) * (0.85 + 0.15 * Math.sin(t * 5 + i)); return <mesh key={i} position={[R * Math.cos(a), h / 2, R * Math.sin(a)]}><coneGeometry args={[0.055, h, 10]} /><meshBasicMaterial color={col("#5a9bff", "#ff7a2a", k)} toneMapped={false} transparent opacity={0.9} /></mesh>; })}</group>;
// mano sencilla de madera: palma + cuatro dedos + pulgar; apunta a -x
const Hand: React.FC<{ p: V; rot?: V; s?: number; curl?: number }> = ({ p, rot = [0, 0, 0], s = 1, curl = 0 }) => <group position={p} rotation={rot} scale={s}>
  <Box p={[0, 0, 0]} s={[0.42, 0.09, 0.36]} c={SKIN} r={0.6} rad={0.04} />
  {[-0.13, -0.045, 0.045, 0.13].map((z, i) => <group key={i} position={[-0.21, 0, z]} rotation={[0, 0, curl]}><Cyl p={[-0.13, 0, 0]} r={0.038} h={0.28 - 0.012 * Math.abs(i - 1.5)} c={SKIN} rough={0.6} rot={[0, 0, 1.5708]} /></group>)}
  <group position={[0.02, 0, 0.2]} rotation={[0, 0.8, 0]}><Cyl p={[-0.1, 0, 0]} r={0.043} h={0.2} c={SKIN} rough={0.6} rot={[0, 0, 1.5708]} /></group>
  <Cyl p={[0.42, 0, 0]} r={0.12} h={0.45} c="#c9a227" rough={0.8} rot={[0, 0, 1.5708]} /></group>;
const Knife: React.FC<{ p: V; rot?: V; s?: number }> = ({ p, rot = [0, 0, 0], s = 1 }) => <group position={p} rotation={rot} scale={s}><Box p={[-0.32, 0, 0]} s={[0.7, 0.14, 0.012]} c="#c6ccd2" r={0.2} m={0.85} rad={0.004} /><Box p={[0.2, 0, 0]} s={[0.36, 0.09, 0.05]} c="#3b2616" r={0.6} rad={0.02} /></group>;

// 1:50 · LA BALANZA: cinco pellizcos caen uno por uno; la aguja salta y se aprende lo que pesa tu mano
const handscale: F = ({ t, h }) => { const T = useMemo(() => mk(512, 512, (g) => { g.fillStyle = "#e9e1cc"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.strokeStyle = "#2a1d12"; g.lineWidth = 8; g.beginPath(); g.arc(256, 256, 246, 0, 7); g.stroke(); g.fillStyle = "#2a1d12"; g.font = "900 62px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; [0, 1, 2, 3, 4, 5].forEach((n) => { const a = -2.4 + n * 0.96; g.fillText(String(n), 256 + 170 * Math.sin(a), 256 - 170 * Math.cos(a)); }); g.font = "700 40px Arial"; g.fillText("GRAMS", 256, 330); }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.25, 1.35, 3.5], [0, 0.72, 0]), C([-0.3, 1.3, 3.25], [0, 0.72, 0]), 9)} set={{ warm: 0.5, spot: [0, 0.5, 0] as V, spotK: 0.7 }}
    scene={(tt) => { const at = (i: number) => 0.7 + i * Math.max(0.9, (dur(h) - 2.2) / 5), P = [0, 1, 2, 3, 4].map((i) => cl(pop(tt, at(i) + 0.55, 7, 0.45))), n = P.reduce((a, b) => a + b, 0), aN = -2.4 + n * 0.96;
      return <>
        <Box p={[0, 0.3, 0]} s={[1.05, 0.5, 0.86]} c="#a0312b" r={0.3} m={0.2} rad={0.05} />
        <Cyl p={[0, 0.58, 0]} r={0.5} h={0.04} c="#b8bcc2" m={0.8} rough={0.3} />
        <mesh position={[0, 0.3, 0.436]}><circleGeometry args={[0.235, 48]} /><meshStandardMaterial map={T} color="#c9c3b4" roughness={0.6} /></mesh>
        <group position={[0, 0.3, 0.442]} rotation={[0, 0, -aN]}><Box p={[0, 0.09, 0]} s={[0.014, 0.2, 0.006]} c="#b3201c" r={0.4} rad={0.002} cast={false} /></group>
        <Sph p={[0, 0.6, 0]} r={0.22} c="#d9d6ca" sc={[1, Math.max(0.02, 0.1 * n), 1]} ro={0.9} />
        {[0, 1, 2, 3, 4].map((i) => Array.from({ length: 12 }, (_, j) => { const u = (tt - at(i) - j * 0.03) / 0.55; return u < 0 || u > 1 ? null : <Sph key={i + "-" + j} p={[(rnd(j) - 0.5) * 0.16, lerp(1.45, 0.62, u * u), (rnd(j + 9) - 0.5) * 0.16]} r={0.016} c="#e9e6db" />; }))}
        <Hand p={[0.42, 1.55, 0]} rot={[0, 0, 0.5]} s={0.8} curl={0.4 + 0.15 * Math.sin(tt * 6)} />
      </>; }}
    over={(tt) => <Ink tt={tt} at={rel(h, 0, 4)} txt="WHAT YOUR HAND WEIGHS" />} />; };

// 2:30 · EL PLATITO: el cucharón sirve al platito; el caldo se enfría de rojo a azul y recién ahí aparecen los cristales de sal
const saucer: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.6, 1.25, 2.3], [0.4, 0.28, 0]), C([0.15, 1.15, 2.1], [0.45, 0.28, 0]), 8)} set={{ warm: 0.5, spot: [0.8, 0.2, 0] as V, spotK: 0.8 }}
  scene={(tt) => { const pour = eio(tt, 0.3, 1.2) * (1 - eio(tt, 2, 2.7)), cool = eio(tt, 2.4, 5), fill = eio(tt, 1.1, 2); return <>
    <group position={[-0.62, 0.05, -0.1]}><mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.55, 0.52, 0.6, 56, 1, true]} /><meshStandardMaterial color="#34373d" metalness={0.7} roughness={0.35} side={THREE.DoubleSide} /></mesh><Cyl p={[0, 0.52, 0]} r={0.53} h={0.02} c="#c98a3a" rough={0.15} /><Steam p={[0, 0.6, 0]} t={tt} k={1} n={6} s={1.3} /></group>
    <group position={[lerp(-0.25, 0.45, pour), 1.0 + 0.1 * pour, 0.05]} rotation={[0, 0, -0.9 * pour]}><Sph p={[0, 0, 0]} r={0.13} c="#b8bcc2" m={0.8} ro={0.3} sc={[1, 0.5, 1]} /><Box p={[-0.42, 0.14, 0]} s={[0.72, 0.03, 0.04]} c="#7a4b22" r={0.6} rad={0.01} rot={[0, 0, -0.35]} /></group>
    {pour > 0.6 && Array.from({ length: 10 }, (_, i) => { const u = (tt * 2.2 + i / 10) % 1; return <Sph key={i} p={[0.72, lerp(0.92, 0.17, u), 0.05]} r={0.024} c="#c98a3a" ro={0.1} />; })}
    <group position={[0.72, 0.05, 0.05]}><Cyl p={[0, 0.04, 0]} r={0.42} r2={0.28} h={0.08} c="#ede7d7" rough={0.25} />
      <mesh position={[0, 0.086, 0]} rotation={[-1.5708, 0, 0]} scale={Math.max(0.03, fill)}><circleGeometry args={[0.36, 44]} /><meshStandardMaterial color={col("#d9682a", "#c9a15a", cool)} roughness={0.12} emissive={col("#ff4a10", "#000000", cool)} emissiveIntensity={0.55 * (1 - cool)} /></mesh>
      {Array.from({ length: 26 }, (_, i) => { const k = pop(tt, 3 + i * 0.07, 7, 0.5), a = i * 2.4, r = 0.3 * Math.sqrt(rnd(i)); return k < 0.02 ? null : <Pop key={i} k={k} p={[r * Math.cos(a), 0.095, r * Math.sin(a)]} rot={[0, i, 0]}><Box p={[0, 0, 0]} s={[0.04, 0.03, 0.04]} c="#efeee7" r={0.15} rad={0.004} cast={false} /></Pop>; })}
      {cool < 0.9 && <Steam p={[0, 0.1, 0]} t={tt} k={1 - cool} n={4} s={0.8} />}</group>
  </>; }}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 3.2)} txt="HOT FOOD LIES" col="#ffd98a" />} />;

// 3:05 · LA TOALLA: la tabla patina con el cuchillo temblando; entra la toalla azul debajo y la tabla queda clavada
const towelgrip: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.15, 1.55, 2.5], [0, 0.1, 0]), C([-0.35, 1.45, 2.3], [0, 0.1, 0]), 8)} set={{ warm: 0.45, spot: [0, 0.1, 0] as V, spotK: 0.5 }}
  scene={(tt) => { const K = eio(tt, 2.1, 3), slide = (1 - K) * Math.sin(tt * 6.5), tx = lerp(-3.2, 0, K), y = 0.05 + 0.1 * Math.sin(Math.PI * cl((tt - 2) / 1.1)); return <>
    <Box p={[tx, 0.06, 0]} s={[2.2, 0.03, 1.3]} c="#34557f" r={0.95} rad={0.012} />
    <group position={[0.4 * slide, y + 0.03 * K, 0]} rotation={[0, 0.1 * slide, 0]}><Box p={[0, 0.07, 0]} s={[1.7, 0.1, 1.05]} c={BOARD} r={0.72} rad={0.02} />
      <Knife p={[0.25, 0.14, 0.1]} rot={[1.5708, 0, 0.2 + 0.06 * (1 - K) * Math.sin(tt * 19)]} /><Cyl p={[-0.5, 0.2, -0.15]} r={0.1} h={0.55} c="#e0792f" rough={0.55} rot={[0, 0.3, 1.5708]} /></group>
  </>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="NOT ONE INCH" />} />;

// 3:35 · EL BOL AFILADOR: bol boca abajo, se enciende el anillo de barro; la hoja pasa, salen chispitas y se cuentan diez trazos
const bowlsharp: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.45, 1.35, 2.05], [0, 0.42, 0]), C([-0.35, 1.25, 1.9], [0, 0.42, 0]), 8)} set={{ warm: 0.4, spot: [0, 0.4, 0] as V, spotK: 0.6 }}
  scene={(tt) => { const n = Math.min(10, Math.floor(cl((tt - 0.8) / (dur(h) - 2.4)) * 10.99)), u = ((tt - 0.8) * 1.55) % 1, on = tt > 0.8 && n < 10; return <>
    <mesh position={[0, 0.05, 0]} castShadow><sphereGeometry args={[0.62, 48, 22, 0, 6.283, 0, 1.57]} /><meshStandardMaterial color="#29497a" roughness={0.18} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.667, 0]} rotation={[-1.5708, 0, 0]}><ringGeometry args={[0.16, 0.26, 56]} /><meshStandardMaterial color="#b89b72" roughness={0.95} emissive="#ffb347" emissiveIntensity={0.15 + 0.5 * eio(tt, 0.2, 0.9)} /></mesh>
    <Cyl p={[0, 0.655, 0]} r={0.16} h={0.03} c="#29497a" rough={0.2} />
    <group position={[lerp(-0.06, 0.32, on ? u : 1), 0.72, 0.21]}><Knife p={[0, 0, 0]} rot={[0.1, -0.12, 0.26]} s={1.25} /></group>
    {on && Array.from({ length: 8 }, (_, i) => { const v = (tt * 3 + i / 8) % 1; return <Sph key={i} p={[lerp(-0.06, 0.32, u) + 0.5 * v * (rnd(i) - 0.5), 0.72 + 0.35 * v - 0.5 * v * v, 0.22 + 0.2 * v]} r={0.012} c="#ffd36b" e="#ffb347" ei={1.2} />; })}
    {Array.from({ length: n }, (_, i) => <Pop key={"m" + i} k={pop(tt, 0.8 + (i + 1) * (dur(h) - 2.4) / 10.99)} p={[-0.82 + i * 0.18, 0.06, 0.95]}><Box p={[0, 0.03, 0]} s={[0.05, 0.05, 0.22]} c="#ffd98a" e="#ffb347" ei={0.5} r={0.5} rad={0.01} cast={false} /></Pop>)}
  </>; }}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 3)} txt="TEN TIMES EACH SIDE" />} />;

const Carrot: React.FC<{ c?: string }> = ({ c = "#e0792f" }) => <group><mesh position={[0, 0.34, 0]} rotation={[Math.PI, 0, 0]} castShadow><coneGeometry args={[0.07, 0.68, 22]} /><meshStandardMaterial color={c} roughness={0.55} /></mesh><mesh position={[0, 0.8, 0]}><coneGeometry args={[0.06, 0.26, 10]} /><meshStandardMaterial color="#5b8a3a" roughness={0.75} /></mesh></group>;
// 4:10 · DE PIE: las zanahorias tumbadas se doblan para arriba en el cajón; se paran solas de a una en el vaso alto
const standup: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.15, 1.3, 2.75], [0, 0.42, 0]), C([-0.4, 1.2, 2.6], [0, 0.46, 0]), 8)} set={{ warm: 0.25, spot: [0, 0.4, 0] as V, spotK: 0.5 }}
  scene={(tt) => <>
    <Box p={[0, 0.08, 0.1]} s={[3.1, 0.08, 1.15]} c="#d5dde2" r={0.25} rad={0.02} />
    {[-1, 1].map((s) => <Box key={s} p={[0, 0.16, 0.1 + s * 0.58]} s={[3.1, 0.14, 0.03]} c="#bfc9cf" r={0.3} rad={0.008} />)}
    <mesh position={[0, 0.54, -0.12]}><cylinderGeometry args={[0.3, 0.27, 0.86, 48, 1, true]} /><meshPhysicalMaterial color={GLASS} transparent opacity={0.22} roughness={0.04} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    {Array.from({ length: 6 }, (_, i) => { const at = rel(h, 0, 4) - 1.2 + i * 0.32, k = eio(tt, at, at + 0.75), lx = -1.3 + i * 0.5 + (i > 2 ? 0.5 : 0), lz = 0.42 - (i % 2) * 0.22, a = i / 6 * 6.283, wob = (1 - k) * 0.12 * Math.sin(tt * 3 + i); return <group key={i} position={[lerp(lx, 0.14 * Math.cos(a), k), lerp(0.2, 0.2, k) + 0.55 * Math.sin(Math.PI * k), lerp(lz, -0.12 + 0.14 * Math.sin(a), k)]} rotation={[0, 0, lerp(1.5708 + wob - 0.22, 0.04 * Math.cos(a), k)]}><Carrot c={col("#a86a3c", "#e8802f", k)} /></group>; })}
  </>}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 4)} txt="THE WAY THEY GREW" />} />;

// 4:45 · MIZU AGE: los tallos desmayados reciben el agua: sube un hilo de luz y se enderezan de a uno, firmes
const soldiers: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.15, 1.05, 2.5], [0, 0.72, 0]), C([-0.35, 1.0, 2.3], [0, 0.72, 0]), 8)} set={{ warm: 0.45, spot: [0, 0.8, 0] as V, spotK: 0.8 }}
  scene={(tt) => <>
    <GlassPot r={0.42} h={0.7} /><Cyl p={[0, 0.3, 0]} r={0.4} h={0.5} c="#a9d6e8" rough={0.05} op={0.5} />
    {Array.from({ length: 7 }, (_, i) => { const at = 1 + i * 0.42, k = eio(tt, at, at + 1.2), x = -0.24 + i * 0.08, b = (i - 3) * 0.32 + (i % 2 ? 0.3 : -0.3), lean = lerp(b * 2, (i - 3) * 0.05, k), L = 0.72; return <group key={i} position={[x, 0.42, 0.1 * Math.sin(i * 2)]} rotation={[0, 0, -lean]}>
      <Cyl p={[0, L / 2, 0]} r={0.016} h={L} c={col("#7c8a4a", "#4f9a3a", k)} rough={0.7} e="#a8ff7a" ei={0.6 * cl(k * 4) * (1 - cl((k - 0.7) * 3))} />
      <group position={[0, L, 0]} rotation={[0, 0, lerp(1.0, 0, k)]}>{[0, 1, 2, 3, 4, 5].map((j) => <Sph key={j} p={[0.08 * Math.cos(j * 2.1), 0.05 + 0.03 * j, 0.08 * Math.sin(j * 2.1)]} r={0.07} c={col("#88935a", "#3f9a3a", k)} sc={[1, 0.6, 1]} ro={0.75} />)}</group></group>; })}
  </>}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 4.5)} txt="RAISING THE WATER" />} />;

const Potato: React.FC<{ p: V; s?: number }> = ({ p, s = 1 }) => <Sph p={p} r={0.13 * s} c="#a98454" sc={[1.25, 0.9, 1]} ro={0.9} />;
// 5:15 · LA LÍNEA DEL SUELO: corte de la tierra; lo de abajo salta a la olla fría, lo de arriba a la olla que hierve
const groundline: F = ({ t, h }) => { const items: [number, number, number][] = [[-1.15, -0.34, 0], [-0.7, -0.5, 1], [-0.28, -0.3, 2]];
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 1.55, 4.9], [0, 1.2, 0]), C([0.3, 1.5, 4.6], [0, 1.2, 0]), 9)} set={{ warm: 0.3, back: false, bg: "#a9c4d8", spot: [0, 0.8, 0] as V, spotK: 0.5 }}
    scene={(tt) => { const a0 = rel(h, 0, 4.2), cold = (i: number) => eio(tt, 2.2 + i * 0.5, 3.2 + i * 0.5), hot = (i: number) => eio(tt, a0 + 1 + i * 0.4, a0 + 2 + i * 0.4); return <group position={[0, 1.05, 0]}>
      <Box p={[0, -0.55, 0.3]} s={[6.5, 1.6, 0.9]} c="#55381f" r={0.95} rad={0.01} />
      {Array.from({ length: 16 }, (_, i) => <Sph key={"st" + i} p={[-3 + rnd(i) * 6, -0.05 - rnd(i + 4) * 0.72, 0.76]} r={0.035 + rnd(i + 7) * 0.05} c="#3b2615" sc={[1.4, 0.8, 0.5]} ro={0.95} />)}
      <Box p={[0, 0.27, 0.3]} s={[6.5, 0.05, 0.92]} c="#5f9a3f" r={0.9} rad={0.008} />
      <Box p={[0, 0.31, 0.78]} s={[6.5, 0.012, 0.014]} c="#ffd98a" e="#ffb347" ei={1} r={0.5} rad={0.002} cast={false} />
      {[-1, 1].map((s) => <group key={s} position={[s * 1.75, 0.3, 0.2]}><GlassPot p={[0, 0, 0]} r={0.5} h={0.72} /><Cyl p={[0, 0.3, 0]} r={0.48} h={0.52} c={s < 0 ? "#a9d6e8" : "#e8c3a6"} rough={0.06} op={0.55} />{s > 0 ? <><Flame p={[0, -0.02, 0]} k={1} t={tt} /><Steam p={[0, 0.6, 0]} t={tt} k={0.9} n={5} s={1.2} />{Array.from({ length: 9 }, (_, i) => { const u = (tt * 1.2 + i / 9) % 1; return <Sph key={i} p={[0.36 * Math.cos(i * 2.4), 0.05 + 0.45 * u, 0.36 * Math.sin(i * 2.4)]} r={0.03} c="#fff" op={0.7} />; })}</> : Array.from({ length: 4 }, (_, i) => <Box key={i} p={[0.22 * Math.cos(i * 1.7), 0.5, 0.22 * Math.sin(i * 1.7)]} s={[0.1, 0.09, 0.1]} c="#e9f4fa" r={0.1} rad={0.01} rot={[i, i, 0]} cast={false} />)}</group>)}
      {items.map(([x, y, i]) => { const k = cold(i), Q: V = [lerp(x, -1.75 + (i - 1) * 0.22, k), lerp(y, 0.5, k) + 0.75 * Math.sin(Math.PI * k), lerp(0.78, 0.25, k)]; return <Potato key={i} p={Q} s={i === 1 ? 1.1 : 0.9} />; })}
      {[0.28, 0.72, 1.12].map((x, i) => { const k = hot(i), Q: V = [lerp(x, 1.75 + (i - 1) * 0.2, k), lerp(0.3, 0.55, k) + 0.7 * Math.sin(Math.PI * k), lerp(0.6, 0.25, k)]; return <group key={i} position={Q}>{[0, 1, 2, 3, 4].map((j) => <Sph key={j} p={[0.1 * Math.cos(j * 1.3), 0.09 + 0.05 * j, 0.1 * Math.sin(j * 1.3)]} r={0.075} c="#468a37" sc={[1, 0.55, 1]} ro={0.7} />)}</group>; })}
    </group>; }}
    over={(tt) => <><Ink tt={tt} x={520} at={1} y={900} txt="COLD" col="#bfe6ff" /><Ink tt={tt} x={1400} at={rel(h, 0, 4.2)} y={900} txt="BOILING" col="#ff8a7a" /></>} />; };

// 5:50 · LOS TALLOS PRIMERO: el atado baja sólo por los tallos; suelta las hojas y sale verde brillante
const dipstems: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 1.2, 3.1], [0, 0.7, 0]), C([-0.35, 1.15, 2.9], [0, 0.7, 0]), 8)} set={{ warm: 0.4, spot: [0, 0.6, 0] as V, spotK: 0.7 }}
  scene={(tt) => { const a1 = rel(h, 0, 5), d = eio(tt, 0.4, 1.4), drop = eio(tt, a1, a1 + 0.7), c = eio(tt, a1 + 0.3, a1 + 1.8); return <>
    <GlassPot r={0.68} h={0.7} /><Cyl p={[0, 0.3, 0]} r={0.66} h={0.52} c="#9fc4c9" rough={0.08} op={0.42} /><Flame p={[0, 0.02, 0]} k={0.85} t={tt} R={0.42} /><Steam p={[0, 0.65, 0]} t={tt} k={0.7} n={5} s={1.2} />
    <group position={[0, lerp(1.6, 0.86, d) - 0.55 * drop, 0]} rotation={[0, 0.25 * tt, 0.5 * drop]}>{Array.from({ length: 9 }, (_, i) => { const a = i * 2.4, r = 0.12 * Math.sqrt(i / 9); return <group key={i} position={[r * Math.cos(a), 0, r * Math.sin(a)]}><Cyl p={[0, -0.32, 0]} r={0.014} h={0.66} c={col("#c98a8a", "#6fb04d", c)} rough={0.6} /><Sph p={[0.05 * Math.cos(a * 2), 0.14 + rnd(i) * 0.1, 0.05 * Math.sin(a * 2)]} r={0.15} c={col("#59734a", "#2fa23a", c)} sc={[1, 0.45, 1.2]} ro={0.65} /></group>; })}</group>
    {Array.from({ length: 10 }, (_, i) => { const k = pop(tt, 1.4 + i * Math.min(0.32, (a1 - 1.4) / 10), 7, 0.5); return <Ring key={i} p={[-0.9 + i * 0.2, 0.06, 1.0]} r={0.08} k={k} col="#ffd98a" />; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 5) + 0.3} txt="STEMS FIRST" />} />;

// 6:20 · SA SHI SU SE SO: cinco potes saltan en orden y vuelcan; cada letra cae a la olla, la sal cierra la puerta si llega antes
const sashi: F = ({ t, h }) => { const NM = ["SA", "SHI", "SU", "SE", "SO"], SUB = ["SUGAR", "SALT", "VINEGAR", "SOY", "MISO"], CC = ["#efe8d8", "#c6ced6", "#d6c07e", "#3a1f10", "#a8672c"]; const L = useMemo(() => NM.map((n, i) => cardTex([n, SUB[i]], { bg: "#f7f1e4", fg: "#7a2f28", w: 320, h: 256, font: "Georgia, serif" })), []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 1.7, 5], [0, 0.6, 0]), C([0.35, 1.6, 4.6], [0, 0.6, 0]), 10)} set={{ warm: 0.5, spot: [0, 0.4, 0] as V, spotK: 0.65 }}
    scene={(tt) => <>
      <group position={[0, 0.05, -0.4]}><mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.6, 0.56, 0.6, 56, 1, true]} /><meshStandardMaterial color="#6d3a23" metalness={0.4} roughness={0.4} side={THREE.DoubleSide} /></mesh><Cyl p={[0, 0.52, 0]} r={0.58} h={0.02} c={col("#e8d7a8", "#7c4f22", cl((tt - 1) / 7))} rough={0.15} /><Steam p={[0, 0.6, 0]} t={tt} k={0.7} n={5} s={1.2} /></group>
      {NM.map((_, i) => { const at = 0.6 + i * Math.max(1.1, (dur(h) - 2.2) / 5), k = eio(tt, at, at + 0.45) * (1 - eio(tt, at + 0.75, at + 1.15)), x = -1.6 + i * 0.8; return <group key={i} position={[lerp(x, 0.4 * Math.sign(x || 1), k), 0.06 + 0.86 * k, lerp(0.8, 0, k)]} rotation={[0, 0, 1.25 * k * Math.sign(x || 1)]}>
        <mesh position={[0, 0.28, 0]} castShadow><cylinderGeometry args={[0.24, 0.24, 0.56, 36]} /><meshPhysicalMaterial color={CC[i]} roughness={0.28} clearcoat={0.5} /></mesh>
        <mesh position={[0, 0.27, 0.243]}><planeGeometry args={[0.36, 0.29]} /><meshStandardMaterial map={L[i]} color="#c9c3b4" roughness={0.8} /></mesh>
        {k > 0.75 && Array.from({ length: 8 }, (_, j) => { const u = (tt * 2.4 + j / 8) % 1; return <Sph key={j} p={[-0.02 + 0.4 * u * -Math.sign(x || 1) * 0, 0.6 + 0.3 * u, 0]} r={0.02} c={CC[i]} />; })}</group>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={dur(h) - 1.9} txt="SUGAR FIRST" />} />; };

// 7:15 · LA ESPONJA: el hongo debajo de la canilla se hincha y gotea, como esponja
const mushsponge: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 0.95, 2.1], [0, 0.55, 0]), C([-0.3, 0.9, 1.9], [0, 0.55, 0]), 7)} set={{ warm: 0.35, spot: [0, 0.5, 0] as V, spotK: 0.7 }}
  scene={(tt) => { const k = eio(tt, 0.3, Math.min(3, dur(h) - 0.8)), s0 = 1 + 0.55 * k; return <>
    <Cyl p={[0, 1.65, 0]} r={0.08} h={0.2} c="#a8adb3" m={0.85} rough={0.25} />
    {Array.from({ length: 16 }, (_, i) => { const u = (tt * 2.2 + i / 16) % 1; return <Sph key={i} p={[0.01 * Math.sin(i), lerp(1.55, 0.72 + 0.14 * k, u), 0]} r={0.022} c="#cfe7f4" ro={0.05} />; })}
    <group position={[0, 0.06, 0]} scale={s0}><Cyl p={[0, 0.16, 0]} r={0.09} r2={0.13} h={0.32} c="#d8cab0" rough={0.8} />
      <mesh position={[0, 0.3, 0]} scale={[1, 0.72, 1]} castShadow><sphereGeometry args={[0.3, 36, 20, 0, 6.283, 0, 1.57]} /><meshStandardMaterial color={col("#8a6848", "#5c4530", k)} roughness={0.72} /></mesh>
      {Array.from({ length: 26 }, (_, i) => { const a = i * 2.4, r = 0.25 * Math.sqrt(rnd(i)); return <Sph key={i} p={[r * Math.cos(a), 0.31 + 0.2 * (1 - r * r * 14), r * Math.sin(a)]} r={0.011} c="#3a2a1c" sc={[1, 0.5, 1]} />; })}</group>
    {Array.from({ length: 8 }, (_, i) => { const u = (tt * 1.1 + i / 8) % 1; return <Sph key={"d" + i} p={[(i % 2 ? 1 : -1) * 0.38 * k, lerp(0.44, 0.06, u * u), 0.1 * Math.sin(i)]} r={0.02} c="#7f94a0" op={k} ro={0.05} />; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={0.9} txt="A SPONGE" />} />;

// 7:30 · DOS TANDAS: la sartén abarrotada se ahoga en vapor; la mitad salta a otra y se doran
const crowdpan: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 2.2, 2.3], [0, 0.1, 0]), C([0.35, 2.05, 2.15], [0, 0.1, 0]), 8)} set={{ warm: 0.5, spot: [0, 0.1, 0] as V, spotK: 0.6 }}
  scene={(tt) => { const k = eio(tt, 2.2, 3.3), b = eio(tt, 3.2, 5.5), PN = (x: number, w: number) => <group position={[x, 0.08, 0]}><Cyl p={[0, 0, 0]} r={w} h={0.06} c={DARK} rough={0.35} m={0.7} /><Box p={[w + 0.3, 0.02, 0]} s={[0.6, 0.04, 0.08]} c="#2a1b13" r={0.5} rad={0.01} /></group>; return <>
    {PN(lerp(0, -0.95, k), 0.72)}{<group position={[lerp(3.4, 1.02, k), 0, 0]}>{PN(0, 0.72)}</group>}
    {Array.from({ length: 16 }, (_, i) => { const half = i % 2 === 1, a = i * 2.4, r = 0.58 * Math.sqrt((i + 0.5) / 16); const hx = (half ? 1.02 : -0.95) + (0.42 * Math.cos(i * 0.3927)), hz = 0.42 * Math.sin(i * 0.3927); return <group key={i} position={[lerp(r * Math.cos(a), hx, k), 0.16 + 0.5 * Math.sin(Math.PI * k) * (half ? 1 : 0.15), lerp(r * Math.sin(a), hz, k)]} rotation={[0, i, 0]}><Box p={[0, 0, 0]} s={[0.26, 0.06, 0.18]} c={col("#d4b6a0", "#7a4a22", b)} r={0.55} rad={0.018} cast={false} /></group>; })}
    {k < 0.6 && <Steam p={[0, 0.22, 0]} t={tt} k={1 - k * 1.4} n={9} s={1.7} />}
  </>; }}
  over={(tt) => <Ink tt={tt} at={3.4} txt="TWO ROUNDS" />} />;

// 9:40 · EL PULGAR: el pescado sobre la tabla; un pulgar aprieta justo detrás de la cabeza y la carne devuelve el latido
const thumbfish: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 1.15, 1.9], [0, 0.2, 0]), C([-0.25, 1.05, 1.75], [0.05, 0.2, 0]), 8)} set={{ warm: 0.3, back: false, bg: "#2a1f16", spot: [0.35, 0.2, 0] as V, spotK: 1 }}
  scene={(tt) => { const press = eio(tt, 0.9, 1.7) * (1 - 0.3 * eio(tt, 3, 3.6)) + 0.05 * Math.sin(tt * 4), r = (tt * 0.8) % 1; return <>
    <Board w={2.9} d={1.3} />
    <group position={[0, 0.2, 0]}><Sph p={[0, 0.07, 0]} r={0.26} c="#8ea0ae" sc={[3.4, 0.6, 1]} ro={0.28} m={0.5} /><Sph p={[-0.1, 0.17, 0]} r={0.14} c="#2f3f4e" sc={[5, 0.14, 0.4]} ro={0.35} />
      <Sph p={[-0.66, 0.12, 0.16]} r={0.06} c="#e9e4d3" /><Sph p={[-0.68, 0.12, 0.2]} r={0.032} c="#0f0f12" />
      <mesh position={[0.97, 0.08, 0]} rotation={[0, 0, 1.5708]} scale={[1, 1, 0.2]}><coneGeometry args={[0.28, 0.4, 3]} /><meshStandardMaterial color="#657786" roughness={0.4} /></mesh>
      <mesh position={[-0.38, 0.225 - 0.03 * press, 0]} rotation={[-1.5708, 0, 0]}><circleGeometry args={[0.1 + 0.05 * press, 28]} /><meshStandardMaterial color="#5c7280" roughness={0.3} transparent opacity={0.9 * press} /></mesh>
      {press > 0.5 && <Ring p={[-0.38, 0.23, 0]} r={0.14 + 0.5 * r} k={1 - r} col="#ffd98a" />}
      <group position={[-0.38, 0.27 + 0.4 * (1 - press), 0]} rotation={[0.2, 0, -0.5]}><Cyl p={[0, 0.32, 0]} r={0.085} h={0.66} c={SKIN} rough={0.6} /><Sph p={[0, 0, 0]} r={0.085} c={SKIN} ro={0.6} /><Box p={[0.075, 0.03, 0]} s={[0.012, 0.11, 0.1]} c="#efd9c6" r={0.25} rad={0.005} cast={false} /><Box p={[0.1, 0.74, 0]} s={[0.46, 0.34, 0.42]} c={SKIN} r={0.6} rad={0.08} /></group>
    </group>
  </>; }}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 3.5)} txt="FEEL THAT" />} />;

// 10:20 · ITAZURI: el pepino rueda bajo la palma, salta la sal y la cáscara pasa de opaca a verde encendido
const itazuri: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.1, 1.15, 1.95], [0, 0.2, 0]), C([0.35, 1.05, 1.8], [0, 0.2, 0]), 8)} set={{ warm: 0.3, spot: [0, 0.2, 0] as V, spotK: 0.6 }}
  scene={(tt) => { const k = eio(tt, 0.7, dur(h) - 2), z = 0.24 * Math.sin(tt * 3.6), a = z / 0.15; return <>
    <Board w={2.4} d={1.25} />
    <group position={[0, 0.25, z]} rotation={[a, 0, 0]}><Cyl p={[0, 0, 0]} r={0.15} h={1.75} c={col("#65745a", "#39a646", k)} rough={lerp(0.85, 0.25, k)} rot={[0, 0, 1.5708]} />{Array.from({ length: 34 }, (_, i) => <mesh key={i} rotation={[i * 1.1, 0, 0]} position={[-0.8 + i * 0.05, 0.15 * Math.cos(i * 1.1), 0.15 * Math.sin(i * 1.1)]}><sphereGeometry args={[0.011, 8, 6]} /><meshStandardMaterial color={col("#49543f", "#2f8a3a", k)} /></mesh>)}</group>
    <group position={[0.15, 0.53, z]} rotation={[0, 0.2, 0.04]}><Hand p={[0.2, 0, 0]} s={1.55} /></group>
    {Array.from({ length: 34 }, (_, i) => { const u = (tt * 0.8 + rnd(i)) % 1, x = -0.9 + rnd(i + 3) * 1.8, s0 = rnd(i + 8) > 0.5 ? 1 : -1; return <Sph key={"s" + i} p={[x, 0.09 + 0.28 * Math.sin(Math.PI * u), z + s0 * (0.14 + 0.45 * u)]} r={0.014} c="#efeee7" op={1 - u} />; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={2} txt="TEN SECONDS" />} />;

// 10:55 · EL CUCHILLO ESCONDIDO: la rodaja se da vuelta: una cruz abajo; se vuelve de vidrio y la salsa camina por la cruz hasta el centro
const hiddencross: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 1.5, 1.9], [0, 0.34, 0]), C([-0.25, 1.4, 1.8], [0, 0.34, 0]), 8)} set={{ warm: 0.45, spot: [0, 0.3, 0] as V, spotK: 0.8 }}
  scene={(tt) => { const f = eio(tt, 0.5, 1.5) * (1 - eio(tt, 3.1, 4)), x = eio(tt, 1.5, 2.3), g = eio(tt, 4, 6.4); return <>
    <Cyl p={[0, 0.07, 0]} r={1.05} r2={0.9} h={0.06} c="#7a4a22" rough={0.2} />
    <group position={[0, 0.34 + 0.45 * Math.sin(Math.PI * f), 0]} rotation={[Math.PI * f, 0, 0]}>
      <Cyl p={[0, 0, 0]} r={0.62} h={0.42} c={WHITE} rough={0.55} op={lerp(1, 0.45, eio(tt, 3.8, 4.5))} />
      {[0, 1].map((i) => <Box key={i} p={[0, -0.215, 0]} s={[1.05 * x, 0.012, 0.03]} rot={[0, 0.785 + i * 1.57, 0]} c="#3a241a" r={0.5} rad={0.002} cast={false} />)}
      {g > 0 && [0, 1, 2, 3].map((i) => <group key={"v" + i} rotation={[0, 0.785 + i * 1.57, 0]}><Box p={[0.52 * (1 - g / 2), -0.02, 0]} s={[0.52 * g, 0.34, 0.035]} c="#b4661e" e="#ff9a3a" ei={0.5} r={0.4} rad={0.003} cast={false} op={0.9} /></group>)}
    </group>
    {g > 0 && <Sph p={[0, 0.34, 0]} r={0.14 * g} c="#b4661e" e="#ff9a3a" ei={0.6} />}
  </>; }}
  over={(tt) => <><Ink tt={tt} at={rel(h, 0, 2)} txt="THE HIDDEN KNIFE" /></>} />;

// 11:30 · LA PILETITA: las rodajas de loto en la tabla se agrisan; las que caen al bol siguen blancas
const vinegarbath: F = ({ t, h }) => { const T = useMemo(() => mk(256, 256, (g) => { g.clearRect(0, 0, 256, 256); g.fillStyle = "#fff"; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); g.globalCompositeOperation = "destination-out"; g.beginPath(); g.arc(128, 128, 22, 0, 7); g.fill(); for (let i = 0; i < 7; i++) { const a = i / 7 * 6.283; g.beginPath(); g.arc(128 + 76 * Math.cos(a), 128 + 76 * Math.sin(a), 24, 0, 7); g.fill(); } }), []);
  const Sl: React.FC<{ c: string }> = ({ c }) => <mesh rotation={[-1.5708, 0, 0]} castShadow><circleGeometry args={[0.2, 40]} /><meshStandardMaterial map={T} alphaTest={0.5} color={c} roughness={0.55} side={THREE.DoubleSide} /></mesh>;
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 2.1, 2.15], [0, 0.12, 0]), C([0.35, 2.0, 2.0], [0, 0.12, 0]), 8)} set={{ warm: 0.4, spot: [0, 0.2, 0] as V, spotK: 0.6 }}
    scene={(tt) => { const g = eio(tt, 0.4, 3.2); return <>
      <Board p={[-1, 0.04, 0]} w={1.45} d={1.1} />
      {Array.from({ length: 6 }, (_, i) => <group key={i} position={[-1.42 + (i % 3) * 0.42, 0.102, -0.26 + Math.floor(i / 3) * 0.52]}><Sl c={col("#ded8c5", "#6b6252", g)} /></group>)}
      <group position={[1, 0.05, 0]}><mesh position={[0, 0.24, 0]} rotation={[Math.PI, 0, 0]}><sphereGeometry args={[0.72, 44, 22, 0, 6.283, 0, 1.57]} /><meshStandardMaterial color="#3d5a78" roughness={0.3} side={THREE.DoubleSide} /></mesh><mesh position={[0, 0.17, 0]} rotation={[-1.5708, 0, 0]}><circleGeometry args={[0.68, 44]} /><meshStandardMaterial color="#b9dcea" roughness={0.1} transparent opacity={0.65} /></mesh>
        {Array.from({ length: 7 }, (_, i) => { const at = 0.8 + i * 0.55, u = cl((tt - at) / 0.55); if (u <= 0) return null; const a = i * 2.4, r = 0.42 * Math.sqrt((i + 0.5) / 7); return <group key={i} position={[lerp(-1.2, r * Math.cos(a), u), 0.18 + 0.9 * Math.sin(Math.PI * u), lerp(0, r * Math.sin(a), u)]} rotation={[0.4 * (1 - u), i, 0]}><Sl c="#eae5d4" /></group>; })}</group>
    </>; }}
    over={(tt) => <Ink tt={tt} at={3.4} txt="ONE SPOON OF VINEGAR" />} />; };

// 12:15 · LA PELOTA Y LA GELATINA: el tofu hervido de más pica como pelota; el del agua apenas viva tiembla
const trembling: F = ({ t, h }) => { const T = useMemo(() => mk(256, 256, (g) => { g.fillStyle = "#bdb195"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#7f7355"; for (let i = 0; i < 90; i++) { g.beginPath(); g.arc(rnd(i) * 256, rnd(i + 30) * 256, 2 + rnd(i + 60) * 6, 0, 7); g.fill(); } }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 1.15, 2.7], [0, 0.42, 0]), C([0.35, 1.1, 2.5], [0, 0.42, 0]), 7)} set={{ warm: 0.4, spot: [0, 0.4, 0] as V, spotK: 0.7 }}
    scene={(tt) => { const b = Math.abs(Math.sin(tt * 3.4)), q = pop(tt, 1), w = Math.sin(tt * 11), ww = Math.max(0, 0.12 * Math.exp(-((tt % 2.2)) * 1.1) + 0.03); return <>
      <Board p={[-0.8, 0.04, 0]} w={1.15} d={1.05} /><Board p={[0.8, 0.04, 0]} w={1.15} d={1.05} />
      <group position={[-0.8, 0.28 + 0.65 * b, 0]} scale={[1 + (1 - b) * 0.08, 1 - (1 - b) * 0.14, 1 + (1 - b) * 0.08]}><Box p={[0, 0, 0]} s={[0.56, 0.42, 0.56]} c="#ffffff" map={T} r={0.82} rad={0.05} /></group>
      <Pop k={q} p={[0.8, 0.31, 0]}><group scale={[1 + ww * w, 1 - ww * w, 1 + ww * w]} rotation={[ww * Math.sin(tt * 8), 0, ww * Math.cos(tt * 9)]}><Box p={[0, 0, 0]} s={[0.7, 0.42, 0.7]} c="#e4decb" r={0.32} rad={0.06} /></group></Pop>
    </>; }}
    over={(tt) => <><Ink tt={tt} x={560} y={920} at={0.8} txt="BOILED HARD" size={66} col="#ff9a8a" /><Ink tt={tt} x={1360} y={920} at={1.5} txt="TREMBLING" size={66} col="#ffd98a" /></>} />; };

// 12:55 · EL BROTE: en el hielo los brotes flacos se llenan, se enderezan y hacen clic
const sproutsnap: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.15, 1.6, 1.8], [0, 0.26, 0]), C([-0.25, 1.5, 1.7], [0, 0.26, 0]), 7)} set={{ warm: 0.15, spot: [0, 0.3, 0] as V, spotK: 0.7 }}
  scene={(tt) => { const k = eio(tt, 0.7, Math.min(3.2, dur(h) - 1)); return <>
    <mesh position={[0, 0.34, 0]} rotation={[Math.PI, 0, 0]}><sphereGeometry args={[0.82, 46, 22, 0, 6.283, 0, 1.57]} /><meshPhysicalMaterial color={GLASS} transparent opacity={0.28} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0, 0.26, 0]} rotation={[-1.5708, 0, 0]}><circleGeometry args={[0.76, 44]} /><meshStandardMaterial color="#b9dcea" roughness={0.08} transparent opacity={0.55} /></mesh>
    {Array.from({ length: 7 }, (_, i) => <Box key={i} p={[0.55 * Math.cos(i * 2.1), 0.28 + 0.02 * Math.sin(tt * 2 + i), 0.52 * Math.sin(i * 2.1)]} s={[0.18, 0.15, 0.18]} c="#e9f4fa" r={0.08} rad={0.02} rot={[i, i * 2, 0]} cast={false} />)}
    {Array.from({ length: 40 }, (_, i) => { const a = i * 2.4, r = 0.46 * Math.sqrt(rnd(i)), L = 0.42, lean = lerp(0.9 * (rnd(i + 2) - 0.5), 0.12 * (rnd(i + 2) - 0.5), k); return <group key={i} position={[r * Math.cos(a), 0.34 + 0.02 * rnd(i), r * Math.sin(a)]} rotation={[lean, i, 1.45]}><Cyl p={[0, 0, 0]} r={lerp(0.008, 0.019, k)} h={L} c={col("#b5a57c", "#efeddb", k)} rough={0.5} /><Sph p={[0, L / 2 + 0.018, 0]} r={0.031} c={col("#8a7a4a", "#e8d77a", k)} sc={[1, 1.3, 1]} /></group>; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={Math.min(3.2, dur(h) - 1)} txt="THEY SNAP" />} />;

// 13:50 · A DORMIR: heladera de noche; por la ventana cruza la luna, el hongo se llena y el agua oscurece; sale el sol
const moonjar: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 0.95, 2.8], [0, 0.7, 0]), C([-0.25, 0.9, 2.55], [0, 0.72, 0]), 8)} set={(tt: number) => ({ warm: 0.3 + 0.2 * cl((tt - 4.5) / 2), back: false, bg: col("#0f1a33", "#d9b071", cl((tt - rel(h, 0, 4.8)) / 1.2)), spot: [0, 0.5, 0] as V, spotK: 0.75 })}
  scene={(tt) => { const k = eio(tt, 0.6, dur(h) - 1.2), m = cl(tt / (dur(h) - 0.5)); return <>
    <Sph p={[lerp(-2.2, 2.2, m), 1.05 + 0.5 * Math.sin(Math.PI * m), -2.4]} r={0.26} c={col("#f2ead5", "#ffcc76", eio(m, 0.72, 0.88))} e={col("#f2ead5", "#ffb347", eio(m, 0.72, 0.88))} ei={1.1} />
    <Box p={[0, 0.1, 0]} s={[2.6, 0.08, 1.05]} c="#bfc9cf" r={0.25} rad={0.015} />
    <GlassPot p={[0, 0.14, 0]} r={0.42} h={0.98} /><Cyl p={[0, 0.55, 0]} r={0.4} h={0.78} c={col("#d5c9ab", "#4a2a12", k)} rough={0.06} op={0.68} /><Cyl p={[0, 1.15, 0]} r={0.44} h={0.1} c="#c8ccd2" m={0.75} rough={0.3} />
    {Array.from({ length: 5 }, (_, i) => { const s0 = lerp(0.7, 1.22, k), u = 0.28 + i * 0.13; return <group key={i} position={[0.17 * Math.cos(i * 2.2), u + 0.03 * Math.sin(tt + i), 0.13 * Math.sin(i * 2.2)]} scale={s0}><mesh rotation={[0.4 * i, 0, 0.3]}><sphereGeometry args={[0.13, 24, 14, 0, 6.283, 0, 1.57]} /><meshStandardMaterial color="#5a3a22" roughness={0.75} side={THREE.DoubleSide} /></mesh></group>; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 4.8)} txt="A FOREST AFTER RAIN" />} />;

// 14:30 · DOS NABOS EN UNO: la cabeza del daikon gotea miel; la punta echa fuego; se parte en dos
const twodaikon: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.05, 1.35, 3], [0, 0.42, 0]), C([0.35, 1.25, 2.8], [0, 0.42, 0]), 8)} set={{ warm: 0.5, spot: [0, 0.3, 0] as V, spotK: 0.7 }}
  scene={(tt) => { const a1 = rel(h, 0, 4), sw = eio(tt, 0.5, 1.5), ho = eio(tt, a1, a1 + 0.8), sp = eio(tt, dur(h) - 2.2, dur(h) - 1.2); return <>
    <Board w={3.5} d={0.9} />
    <group position={[-0.9 - 0.28 * sp, 0.34, 0]}><Cyl p={[0, 0, 0]} r={0.21} r2={0.24} h={1.45} c="#d9d3c1" rough={0.45} rot={[0, 0, -1.5708]} />{Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.86, 0.04 * i - 0.08, 0.05 * Math.sin(i)]} rotation={[0, 0, 1.3 + 0.2 * i]}><coneGeometry args={[0.09, 0.5, 8]} /><meshStandardMaterial color="#6fa24e" roughness={0.75} /></mesh>)}<Sph p={[-0.2, 0.24, 0]} r={0.32} c="#f2c14e" op={0.14 * sw} e="#ffb347" ei={0.5} />{Array.from({ length: 6 }, (_, i) => { const u = (tt * 0.55 + i / 6) % 1; return sw < 0.1 ? null : <Sph key={i} p={[-0.4 + i * 0.15, -0.22 - 0.15 * u, 0.05]} r={0.04} c="#d9992a" sc={[1, 1.5, 1]} ro={0.1} op={sw} />; })}</group>
    <group position={[0.9 + 0.28 * sp, 0.34, 0]}><Cyl p={[0, 0, 0]} r={0.21} r2={0.06} h={1.45} c="#d4cab2" rough={0.5} rot={[0, 0, -1.5708]} />{Array.from({ length: 22 }, (_, i) => { const h0 = (0.12 + 0.3 * ho * (0.4 + 0.6 * rnd(i))) * (0.8 + 0.2 * Math.sin(tt * 5 + i)), x = -0.32 + i * 0.05; return <mesh key={i} position={[x, 0.2 + h0 / 2, 0]}><coneGeometry args={[0.03, h0 * ho, 10]} /><meshBasicMaterial color="#ff5a2a" toneMapped={false} transparent opacity={0.9 * ho} /></mesh>; })}</group>
    {sp > 0.01 && sp < 0.95 && <Knife p={[0, lerp(1.1, 0.4, sp), 0.22]} rot={[0, 0, 1.5708]} />}
  </>; }}
  over={(tt) => <><Ink tt={tt} x={520} y={900} at={1.1} txt="SWEET" col="#ffd98a" /><Ink tt={tt} x={1400} y={900} at={rel(h, 0, 4) + 0.3} txt="HOT" col="#ff8a7a" /></>} />;

// 15:05 · LAS LÍNEAS: media cebolla mirada de frente; el cuchillo sigue las líneas (entera); cruzándolas, las células estallan
const onionlines: F = ({ t, h }) => { const T = useMemo(() => mk(512, 512, (g) => { g.clearRect(0, 0, 512, 512); g.fillStyle = "#e9e2c8"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.strokeStyle = "#a2986f"; g.lineWidth = 6; for (let r = 40; r < 250; r += 42) { g.beginPath(); g.ellipse(256, 256, r * 0.82, r, 0, 0, 7); g.stroke(); } }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.05, 2.1, 1.3], [0, 0.18, 0.05]), C([0.25, 1.95, 1.2], [0, 0.18, 0.05]), 8)} set={{ warm: 0.3, spot: [0, 0.2, 0] as V, spotK: 0.55 }}
    scene={(tt) => { const a1 = rel(h, 0, 4), N = 7; const al = cl((tt - 0.6) / (a1 - 0.8)), cr = cl((tt - a1 - 0.2) / 1.6); return <>
      <Board w={2.3} d={1.5} />
      <mesh position={[0, 0.112, 0]} rotation={[-1.5708, 0, 0]}><circleGeometry args={[0.6, 56]} /><meshStandardMaterial map={T} transparent color="#c9c3b4" roughness={0.5} /></mesh>
      {Array.from({ length: N }, (_, i) => { const on = (i + 1) / N <= al; return !on ? null : <Box key={i} p={[-0.42 + i * 0.14, 0.124, 0]} s={[0.012, 0.012, 1.14 - 0.3 * Math.abs(i - 3) ** 1.5 * 0.2]} c="#7be38a" e="#7be38a" ei={0.9} r={0.5} rad={0.002} cast={false} />; })}
      {Array.from({ length: N }, (_, i) => { const on = (i + 1) / N <= cr; return !on ? null : <Box key={"c" + i} p={[0, 0.128, -0.42 + i * 0.14]} s={[1.0 - 0.24 * Math.abs(i - 3) ** 1.5 * 0.2, 0.012, 0.012]} c="#ff8a4a" e="#ff8a4a" ei={0.9} r={0.5} rad={0.002} cast={false} />; })}
      {cr > 0.1 && Array.from({ length: 28 }, (_, i) => { const u = (tt * 0.9 + i / 28) % 1, a = i * 2.4, r = 0.5 * Math.sqrt(rnd(i)); return <Sph key={"p" + i} p={[r * Math.cos(a), 0.13 + 0.45 * u, r * Math.sin(a)]} r={0.016} c="#ffe9a8" e="#ffd36b" ei={0.5} op={1 - u} />; })}
      <Knife p={[-0.42 + 0.84 * al * (1 - cr), 0.42, 0.25]} rot={[1.25, 0, -0.35]} s={1} />
    </>; }}
    over={(tt) => <><Ink tt={tt} at={1.2} y={930} x={640} txt="ALONG: CRISP" size={64} col="#a9f0b0" /><Ink tt={tt} at={rel(h, 0, 4) + 0.3} y={930} x={1320} txt="ACROSS: SOFT" size={64} col="#ffb38a" /></>} />; };

// 15:40 · LAS GOTITAS: sal desde lo alto; brotan perlas de agua sobre el filete, y la toalla de papel se las lleva
const fishbeads: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 1.45, 1.55], [0, 0.2, 0]), C([-0.25, 1.35, 1.45], [0, 0.2, 0]), 8)} set={{ warm: 0.3, spot: [0, 0.2, 0] as V, spotK: 0.7 }}
  scene={(tt) => { const w = eio(tt, rel(h, 0, 4.5), rel(h, 0, 4.5) + 1.5); return <>
    <Box p={[0, 0.07, 0]} s={[2.1, 0.03, 1.15]} c="#8f969c" r={0.28} m={0.7} rad={0.012} />
    <Box p={[0, 0.14, 0]} s={[1.65, 0.11, 0.72]} c={col("#d9a48d", "#efb9a1", w)} r={0.42} rad={0.05} />
    {Array.from({ length: 11 }, (_, i) => <Box key={i} p={[-0.7 + i * 0.14, 0.2, 0]} s={[0.012, 0.004, 0.62]} c="#f1dccb" r={0.5} rad={0.002} cast={false} rot={[0, 0.25, 0]} />)}
    {Array.from({ length: 70 }, (_, i) => { const x = -0.75 + rnd(i) * 1.5, z = -0.3 + rnd(i + 5) * 0.6, k = pop(tt, 0.5 + rnd(i + 8) * 2.6, 6, 0.55), off = x < lerp(-1.1, 1.05, w); return k < 0.02 || off ? null : <Sph key={i} p={[x, 0.205, z]} r={0.016 + rnd(i + 2) * 0.02 * cl(k)} c="#dcecf2" ro={0.04} m={0.1} />; })}
    {w > 0.01 && w < 1 && <Box p={[lerp(-1.1, 1.05, w), 0.26, 0]} s={[0.55, 0.018, 0.9]} c="#d9d3c1" r={0.9} rad={0.008} />}
  </>; }}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 4.5)} txt="WIPE IT ALL OFF" />} />;

// 16:50 · FUEGO LEJOS: mismo carbón, dos pescados: el cercano se quema; el que sube lejos se dora
const farfire: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.15, 1.25, 3], [0, 0.75, 0]), C([-0.3, 1.2, 2.8], [0, 0.75, 0]), 8)} set={{ warm: 0.65, back: false, bg: "#150d08", spot: [0, 0.6, 0] as V, spotK: 0.6 }}
  scene={(tt) => { const k = eio(tt, 0.5, 3.4), raise = eio(tt, 0.4, 1.4); const FF = (x: number, y: number, c: string, b: number) => <group position={[x, y, 0]}><Cyl p={[0, 0, 0]} r={0.008} h={1.5} c="#d9bb88" rough={0.8} rot={[0, 0, 1.5708]} /><Sph p={[0, 0, 0]} r={0.15} c={c} sc={[2.6, 0.72, 0.6]} ro={lerp(0.3, 0.8, b)} /><mesh position={[0.5, 0, 0]} rotation={[0, 0, 1.5708]} scale={[1, 1, 0.2]}><coneGeometry args={[0.16, 0.28, 3]} /><meshStandardMaterial color={c} roughness={0.5} /></mesh>{b > 0.45 && <Steam p={[0, 0.12, 0]} t={tt} k={b} n={6} s={1.1} col="#2a2a2a" />}</group>;
    return <>
      <Box p={[0, 0.14, 0]} s={[3.1, 0.22, 1.1]} c="#2a2320" r={0.7} rad={0.02} />
      {Array.from({ length: 34 }, (_, i) => <Sph key={i} p={[-1.3 + (i % 12) * 0.235, 0.28, -0.35 + Math.floor(i / 12) * 0.36]} r={0.11} c="#3a2a22" e="#ff5a22" ei={0.5 + 0.5 * Math.sin(tt * 2 + i)} ro={0.9} />)}
      {[-0.75, 0.75].map((x) => <group key={x}>{[-1, 1].map((s) => <Cyl key={s} p={[x + s * 0.68, 0.9, 0]} r={0.016} h={1.2} c="#7a7f86" m={0.75} rough={0.3} />)}</group>)}
      {FF(-0.75, 0.62, col("#b4bcc2", "#1e1a18", k), k)}
      {FF(0.75, lerp(0.62, 1.45, raise), col("#b4bcc2", "#d69a44", k), 0)}
    </>; }}
  over={(tt) => <><Ink tt={tt} x={520} y={920} at={2} txt="CLOSE" col="#ff8a7a" /><Ink tt={tt} x={1400} y={920} at={2.8} txt="FAR AWAY" col="#ffd98a" /></>} />;

// 17:15 · LA CÁSCARA INVISIBLE: el agua se escapa del pollo; llega una cáscara de almidón y las gotas rebotan adentro
const starchcoat: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.2, 1.1, 1.85], [0, 0.42, 0]), C([-0.25, 1.05, 1.7], [0, 0.42, 0]), 7)} set={{ warm: 0.4, spot: [0, 0.35, 0] as V, spotK: 0.7 }}
  scene={(tt) => { const k = eio(tt, 2.1, 3.4); return <>
    <Board w={1.8} d={1.2} />
    <Box p={[0, 0.36, 0]} s={[1.05, 0.26, 0.62]} c="#e1b8a3" r={0.5} rad={0.08} />
    <mesh position={[0, 0.36, 0]} scale={[lerp(3.2, 1.34, k), lerp(2.2, 0.56, k), lerp(2.6, 0.92, k)]}><sphereGeometry args={[0.5, 36, 22]} /><meshPhysicalMaterial color="#f0efe6" transparent opacity={0.32 * k} roughness={0.25} depthWrite={false} /></mesh>
    {Array.from({ length: 16 }, (_, i) => { const u = (tt * 0.9 + i / 16) % 1, bx = -0.42 + (i % 8) * 0.12, bz = -0.15 + (i % 3) * 0.13; const free = 1 - k; const y = free > 0.5 ? 0.45 + u * 1.1 : 0.42 + 0.1 * Math.abs(Math.sin(tt * 3 + i)); return <Sph key={i} p={[bx, y, bz]} r={0.04} c="#7bc0e6" ro={0.05} op={free > 0.5 ? 1 - u : 0.9} />; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="THE WATER STAYS IN" />} />;

// 17:45 · EL CALOR CAMINA: corte de la presa en la rejilla, el anillo caliente avanza por dentro; segundo baño y la costra cruje
const twofry: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.05, 1.1, 3.2], [0, 0.72, 0]), C([0.3, 1.05, 3], [0, 0.72, 0]), 7)} set={{ warm: 0.5, spot: [0, 0.5, 0] as V, spotK: 0.65 }}
  scene={(tt) => { const w = eio(tt, 0.5, dur(h) - 2.6), c = eio(tt, dur(h) - 2.4, dur(h) - 1.2); return <>
    {Array.from({ length: 8 }, (_, i) => <Cyl key={i} p={[-1.05 + i * 0.3, 0.14, 0]} r={0.012} h={1.3} c="#7f8690" m={0.8} rough={0.3} rot={[1.5708, 0, 0]} />)}
    <group position={[0, 0.74, 0]} rotation={[0.08, 0, 0]}>
      {Array.from({ length: 12 }, (_, i) => { const r = 0.6 * (1 - i / 12), f = cl((w * 13 - i) * 0.9); return <mesh key={i} position={[0, 0, i * 0.002]}><circleGeometry args={[r, 56]} /><meshStandardMaterial color={col("#e9b7a2", "#d9b98e", f)} emissive="#ff6a22" emissiveIntensity={f * (1 - f) * 2.4} roughness={0.5} /></mesh>; })}
      <mesh position={[0, 0, -0.005]}><circleGeometry args={[0.66, 56]} /><meshStandardMaterial color={col("#b87a3a", "#8a4f1c", c)} roughness={0.75} /></mesh>
      {Array.from({ length: 44 }, (_, i) => { const a = i / 44 * 6.283, k = pop(tt, dur(h) - 2.4 + i * 0.02, 8, 0.5); return k < 0.02 ? null : <Pop key={i} k={k} p={[0.66 * Math.cos(a), 0.66 * Math.sin(a), 0.03]}><Sph p={[0, 0, 0]} r={0.05 + 0.03 * rnd(i)} c="#c98a3a" e="#ff9a3a" ei={0.15} ro={0.75} /></Pop>; })}
    </group>
  </>; }}
  over={(tt) => tt > dur(h) - 2.3 ? <Ink tt={tt} at={dur(h) - 2} txt="SECOND BATH: CRUST" col="#ffd98a" /> : <Ink tt={tt} at={1.2} txt="THE HEAT WALKS IN" />} />;

// 18:20 · ENCAJE: el grumo se abre en el aceite y teje un encaje alrededor del langostino
const lace: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.05, 2.0, 1.3], [0, 0.1, 0.05]), C([0.25, 1.85, 1.25], [0, 0.1, 0.05]), 7)} set={{ warm: 0.6, back: false, bg: "#1b120c", spot: [0, 0.1, 0] as V, spotK: 0.9 }}
  scene={(tt) => { const g = eio(tt, 0.6, dur(h) - 1); return <>
    <Cyl p={[0, 0.06, 0]} r={1.15} h={0.06} c="#2b2219" rough={0.3} m={0.5} />
    <mesh position={[0, 0.095, 0]} rotation={[-1.5708, 0, 0]}><circleGeometry args={[1.05, 56]} /><meshStandardMaterial color="#a8701f" roughness={0.1} metalness={0.3} /></mesh>
    {Array.from({ length: 11 }, (_, i) => { const u = i / 10, a = lerp(-1.1, 1.1, u); return <Sph key={i} p={[0.55 * Math.sin(a) - 0.05, 0.16, 0.5 * Math.cos(a) - 0.42]} r={0.115 - 0.05 * Math.abs(u - 0.5)} c="#e6a875" e="#b3531a" ei={0.15} ro={0.55} />; })}
    {Array.from({ length: 90 }, (_, i) => { const a = i * 2.4, n = 0.28 + rnd(i) * 0.5, k = cl((g - rnd(i + 3) * 0.55) * 2.4); return k <= 0.01 ? null : <group key={i} position={[0, 0.14, 0]} rotation={[0, a, 0]}><Box p={[n * 0.5 * k + 0.06, 0, 0]} s={[n * k, 0.012, 0.016]} c="#ecd9a8" r={0.6} rad={0.003} cast={false} />{[0.5, 0.8, 1].map((q, j) => <Sph key={j} p={[n * q * k + 0.06, 0.012, 0.012 * j]} r={0.026} c="#f1deb1" ro={0.75} />)}</group>; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={1.5} txt="LUMPS ARE LACE" />} />;

// 19:00 · SÓLO TRES: veinticinco tarjetas en la mesa; veintidós se hunden y tres vienen a tu mano
const threepick: F = ({ t, h }) => { const T = useMemo(() => Array.from({ length: 25 }, (_, i) => cardTex([String(25 - i)], { bg: "#efe6d0", fg: "#2a1d12", w: 192, h: 240, font: "Georgia, serif" })), []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 2.5, 2.2], [0, 0.1, 0.1]), C([0.3, 2.35, 2.1], [0, 0.15, 0.1]), 7)} set={{ warm: 0.5, spot: [0, 0.15, 0] as V, spotK: 0.7 }}
    scene={(tt) => { const k = eio(tt, 1, 2.3); return <>{T.map((m, i) => { const ch = [3, 7, 18].indexOf(i), P0: V = [-1.3 + (i % 5) * 0.65, 0.07, -1.1 + Math.floor(i / 5) * 0.56], tx = (ch - 1) * 0.78, kk = pop(tt, 0.1 + i * 0.03, 8, 0.5), sink = ch < 0 ? k : 0; return kk < 0.02 ? null : <group key={i} position={ch >= 0 ? [lerp(P0[0], tx, k), lerp(0.07, 0.75, k), lerp(P0[2], 0.75, k)] : [P0[0], 0.07 - 0.1 * sink, P0[2]]} rotation={[lerp(0, -0.9, ch >= 0 ? 0 : 0) + (ch >= 0 ? 0.75 * k : 0), 0, ch >= 0 ? (ch - 1) * -0.1 * k : 0]} scale={ch >= 0 ? lerp(1, 1.35, k) : Math.max(0.01, (1 - sink * 0.55) * Math.min(1, kk))}><mesh rotation={[-1.5708, 0, 0]}><planeGeometry args={[0.46, 0.56]} /><meshStandardMaterial map={m} color={ch >= 0 ? col("#c9c3b4", "#c9a75e", k) : col("#c9c3b4", "#5a4632", sink)} roughness={0.8} side={THREE.DoubleSide} /></mesh></group>; })}</>; }}
    over={(tt) => <Ink tt={tt} at={2.4} txt="ONLY THREE THIS WEEK" />} />; };

// 19:55 · EL PALITO: en la vaporera de vidrio el palito levanta la tapa y deja salir el exceso; el flan queda liso
const chopgap: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.15, 1.15, 2.75], [0, 0.62, 0]), C([-0.3, 1.05, 2.5], [0, 0.62, 0]), 8)} set={{ warm: 0.4, spot: [0, 0.5, 0] as V, spotK: 0.7 }}
  scene={(tt) => { const ins = eio(tt, 0.5, 1.5), tilt = eio(tt, 1.2, 1.8), bub = 1 - eio(tt, 1.6, 3); return <>
    <GlassPot r={0.72} h={0.75} /><Cyl p={[0, 0.13, 0]} r={0.7} h={0.14} c="#c4dfe9" rough={0.05} op={0.55} /><Flame p={[0, 0.02, 0]} k={0.2} t={tt} R={0.4} />
    <group position={[0, 0.22, 0]}><Cyl p={[0, 0.2, 0]} r={0.27} r2={0.21} h={0.42} c="#eee8d9" rough={0.2} /><Cyl p={[0, 0.42, 0]} r={0.24} h={0.01} c="#f2d98a" rough={0.5} />{Array.from({ length: 14 }, (_, i) => { const k = bub, a = i * 2.4, r = 0.2 * Math.sqrt(rnd(i)); return k < 0.05 ? null : <Sph key={i} p={[r * Math.cos(a), 0.425, r * Math.sin(a)]} r={0.03 * k} c="#c4a44e" sc={[1, 0.5, 1]} />; })}</group>
    <group position={[0, 0.84 + 0.03 * tilt, 0]} rotation={[0, 0, 0.1 * tilt]}><Cyl p={[0, 0, 0]} r={0.74} r2={0.7} h={0.05} c="#6d4a2c" rough={0.55} /><Box p={[0, -0.03, 0]} s={[1.5, 0.03, 1.5]} c="#8d8778" r={0.95} rad={0.008} /><Sph p={[0, 0.08, 0]} r={0.055} c="#2a1d12" /></group>
    <Cyl p={[lerp(1.6, 0.72, ins), 0.82, 0]} r={0.018} h={0.8} c="#c9955a" rough={0.5} rot={[0, 0, 1.5708]} />
    <Steam p={[-0.78, 0.74, 0]} t={tt} k={tilt} n={7} s={1.3} />
  </>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="IT SHOULD BE SILK" />} />;

// 20:40 · SE LO COMÍA TODO: el tazón baja bocado a bocado, los palillos suben y bajan, nadie dice nada; queda el fondo limpio
const atesilent: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 1.3, 1.95], [0, 0.3, 0]), C([-0.2, 1.2, 1.8], [0, 0.3, 0]), 7)} set={{ warm: 0.55, back: false, bg: "#20160f", spot: [0, 0.3, 0] as V, spotK: 0.95 }}
  scene={(tt) => { const K = eio(tt, 0.3, dur(h) - 1.3), bite = Math.abs(Math.sin(tt * 2.4)); return <>
    <group position={[0, 0.05, 0]}><mesh position={[0, 0.3, 0]} rotation={[Math.PI, 0, 0]} castShadow><sphereGeometry args={[0.62, 46, 22, 0, 6.283, 0, 1.57]} /><meshStandardMaterial color="#6d2f28" roughness={0.3} side={THREE.DoubleSide} /></mesh>
      {K < 0.97 && Array.from({ length: 22 }, (_, i) => { const on = i / 22 >= K; const a = i * 2.4, r = 0.46 * Math.sqrt(rnd(i)); return !on ? null : <Sph key={i} p={[r * Math.cos(a), 0.17 + 0.1 * rnd(i + 3), r * Math.sin(a)]} r={0.11} c={["#8a7b5c", "#6f6a4c", "#a99a74"][i % 3]} sc={[1, 0.6, 1]} ro={0.9} />; })}</group>
    <group position={[0.1, 0.98 - 0.48 * bite, 0.05]} rotation={[0, 0, -0.4]}>{[-0.03, 0.03].map((z) => <Cyl key={z} p={[0, 0, z]} r={0.012} h={0.95} c="#2a1b13" rough={0.3} />)}</group>
  </>; }}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 3)} txt="AND SHE SAID NOTHING" />} />;

// 21:10 · SAL POR FUERA: las manos aprietan tres veces; el corte muestra la sal sólo en la piel del triángulo
const salthands: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 0.95, 2.15], [0, 0.55, 0]), C([-0.25, 0.9, 1.95], [0, 0.55, 0]), 7)} set={{ warm: 0.5, spot: [0, 0.5, 0] as V, spotK: 0.75 }}
  scene={(tt) => { const pr = Math.abs(Math.sin(tt * 3.1)) * (1 - eio(tt, 3.2, 3.9)), cut = eio(tt, 3.6, 4.5); return <>
    <Cyl p={[0, 0.07, 0]} r={0.74} h={0.05} c="#29497a" rough={0.2} />
    <group position={[0, 0.5, 0]} scale={[1 - 0.05 * pr, 1, 1 - 0.05 * pr]}>
      <mesh rotation={[-1.5708, 0, 0]} castShadow><cylinderGeometry args={[0.46, 0.46, 0.34, 3]} /><meshStandardMaterial color={cut > 0.5 ? "#d9d6ca" : "#d9d6ca"} roughness={0.9} /></mesh>
      {Array.from({ length: 150 }, (_, i) => { const e0 = i % 3, u = rnd(i), V3: [number, number][] = [[0, 0.46], [-0.4, -0.23], [0.4, -0.23]], A = V3[e0], B = V3[(e0 + 1) % 3], k = pop(tt, 0.1 + u, 6, 0.5); return k < 0.02 ? null : <Sph key={i} p={[lerp(A[0], B[0], u), lerp(A[1], B[1], u), 0.175 + 0.002 * (i % 3) + (i % 7 === 0 ? 0 : 0)]} r={0.014} c="#fbfbf4" e="#ffffff" ei={0.25} />; })}
      <Sph p={[0, -0.02, 0.17]} r={0.1} c="#6b1f1a" op={0.2 + 0.6 * cut} />
    </group>
    {[-1, 1].map((s) => <group key={s} position={[s * lerp(0.86, 0.52, pr), 0.54, 0]} rotation={[0, s > 0 ? 0 : 3.14, 0.75]}><Hand p={[0.32, 0, 0]} s={1.25} curl={0.3} /></group>)}
  </>; }}
  over={(tt) => <Ink tt={tt} at={3.6} txt="SALT ON THE OUTSIDE" />} />;

// 21:55 · LA CALLE EN LLAMAS: tres casas más allá arde; la tina sale por la puerta en la nieve antes que las mantas
const firestreet: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 1.45, 4.5], [0, 0.85, 0]), C([-0.3, 1.4, 4.2], [0, 0.85, 0]), 9)} set={{ warm: 0.8, back: false, bg: "#0c1020", spot: [0.8, 0.5, 0] as V, spotK: 0.3 }}
  scene={(tt) => { const fi = eio(tt, 0.3, 3), walk = eio(tt, rel(h, 0, 4.8), rel(h, 0, 4.8) + 2.6); return <>
    <Box p={[0, 0.02, 0]} s={[12, 0.04, 6]} c="#d0d8e6" r={0.9} rad={0.01} />
    {[-3, -1.5, 0, 1.5, 3].map((x, i) => <group key={i} position={[x, 0, -1.2]}><Box p={[0, 0.55, 0]} s={[1.3, 1, 0.9]} c="#3a2a1c" r={0.85} rad={0.012} /><mesh position={[0, 1.34, 0]} rotation={[0, 0.785, 0]} castShadow><coneGeometry args={[1.02, 0.7, 4]} /><meshStandardMaterial color="#20252c" roughness={0.75} /></mesh><Box p={[0, 0.65, 0.452]} s={[0.26, 0.3, 0.006]} c="#ffd98a" e="#ffb347" ei={i === 3 ? 0 : 0.9} r={0.5} rad={0.001} cast={false} /></group>)}
    {Array.from({ length: 34 }, (_, i) => { const h0 = (0.6 + 1.2 * rnd(i)) * fi, x = 1.5 + (i - 17) * 0.05, w = Math.sin(tt * 7 + i); return h0 < 0.05 ? null : <mesh key={i} position={[x + 0.1 * w, 1.1 + h0 / 2, -1.25 + 0.3 * rnd(i + 4)]}><coneGeometry args={[0.12, h0, 10]} /><meshBasicMaterial color={i % 3 ? "#ff7a2a" : "#ffc14a"} toneMapped={false} transparent opacity={0.92} /></mesh>; })}
    {Array.from({ length: 30 }, (_, i) => { const u = (tt * 0.35 + rnd(i)) % 1; return <Sph key={"e" + i} p={[1.5 + 2.4 * (rnd(i + 4) - 0.55) * u, 1.3 + 2.4 * u, -1 + 0.6 * rnd(i + 3)]} r={0.016} c="#ffb347" e="#ff7a2a" ei={1.2} op={1 - u} />; })}
    <group position={[lerp(-1.2, 0.15, walk), 0.05, lerp(-0.55, 1.4, walk)]}><Sachi p={secuencia([[0, PZ.reach]], tt)} t={tt} x={0} z={0} rotY={0} s={S * 1.4} expr="neutral" /><group position={[0, 0.45, 0.32]}><Cyl p={[0, 0, 0]} r={0.27} r2={0.24} h={0.42} c="#6b4726" rough={0.85} />{[-0.13, 0.13].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[1.5708, 0, 0]}><torusGeometry args={[0.262, 0.015, 10, 40]} /><meshStandardMaterial color="#20252c" roughness={0.4} metalness={0.6} /></mesh>)}<Cyl p={[0, 0.23, 0]} r={0.26} h={0.04} c="#8a6239" rough={0.8} /></group></group>
  </>; }}
  over={(tt) => <Ink tt={tt} at={rel(h, 0, 4.8)} txt="SHE CARRIED THE TUB" />} />;

// 23:00 · LA CAMA VIVA: el corte del pote: lo enterrado despierta y burbujea, la mano da vuelta de abajo hacia arriba
const nukabed: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.15, 1.2, 2.95], [0, 0.72, 0]), C([-0.3, 1.15, 2.7], [0, 0.72, 0]), 9)} set={{ warm: 0.5, spot: [0, 0.6, 0] as V, spotK: 0.75 }}
  scene={(tt) => { const dn = eio(tt, 0.5, 2), w = eio(tt, 2, 5), hd = eio(tt, 5, 5.8) * (1 - eio(tt, dur(h) - 1, dur(h) - 0.4)), lift = (tt > 5.4 ? cl((tt - 5.4) / 1) : 0); return <>
    <GlassPot r={0.78} h={1.1} />
    <Cyl p={[0, 0.48, 0]} r={0.76} h={0.82} c="#6d4a2a" rough={0.98} op={0.92} />
    <group position={[-0.28, lerp(1.45, 0.5, dn), 0.72]} rotation={[0.2, 0, 1.2]} scale={1.5}><Cyl p={[0, 0, 0]} r={0.07} h={0.75} c={col("#65a24a", "#a8b24a", w)} rough={0.5} /></group>
    <group position={[0.34, lerp(1.45, 0.48, eio(tt, 0.9, 2.3)), 0.72]} rotation={[0.1, 0, 1.45]} scale={1.5}><mesh castShadow><coneGeometry args={[0.07, 0.55, 18]} /><meshStandardMaterial color={col("#e8802f", "#c97432", w)} roughness={0.55} /></mesh></group>
    {Array.from({ length: 36 }, (_, i) => { const k = eio(tt, 2 + rnd(i) * 3, 3 + rnd(i) * 3), u = (tt * 0.32 + rnd(i + 6)) % 1, a = i * 2.4; return k < 0.03 ? null : <Sph key={i} p={[0.5 * Math.sqrt(rnd(i + 2)) * Math.cos(a), 0.14 + 0.72 * u, 0.74 + 0.02 * rnd(i)]} r={0.018 + 0.016 * rnd(i + 3)} c="#ffe89f" e="#ffd36b" ei={0.8} op={k * (1 - u * 0.5)} />; })}
    {hd > 0.02 && <group position={[0.05, lerp(1.7, 0.98, hd) + 0.05 * Math.sin(tt * 5), 0.3 * Math.sin(tt * 2.1)]} rotation={[0, 0.4, 1]}><Hand p={[0.3, 0, 0]} s={1.55} curl={0.5} /></group>}
    {hd > 0.3 && Array.from({ length: 12 }, (_, i) => { const u = (tt * 0.9 + i / 12) % 1, a = i * 2.2; return <Sph key={"b" + i} p={[0.42 * Math.cos(a) * (1 - u), 0.89 + 0.35 * Math.sin(Math.PI * u), 0.42 * Math.sin(a) * (1 - u)]} r={0.05} c="#7a5533" ro={0.98} op={lift * (1 - u)} />; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={2.6} txt="IT WAKES UP" />} />;

// 24:40 · LA LATA QUE CRUZÓ: sobre el mapa del Pacífico la lata de tabaco va sembrando una línea de salvado desde Japón a Seattle
const tincross: F = ({ t, h }) => { const T = useMemo(() => mk(1400, 640, (g) => { g.fillStyle = "#23425f"; g.fillRect(0, 0, 1400, 640); g.fillStyle = "#c7a874"; [[150, 240, 70, 140, -0.5], [110, 380, 44, 66, 0.2], [1230, 180, 180, 130, 0.25], [1300, 420, 130, 190, 0]].forEach(([x, y, a, b, r]) => { g.beginPath(); g.ellipse(x, y, a, b, r, 0, 7); g.fill(); }); g.fillStyle = "#f2e7cf"; g.font = "700 48px Georgia, serif"; g.textAlign = "center"; g.fillText("JAPAN", 190, 460); g.fillText("SEATTLE", 1195, 60); g.strokeStyle = "rgba(255,255,255,.16)"; g.lineWidth = 3; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(0, 80 * i + 20); g.lineTo(1400, 80 * i + 20); g.stroke(); g.beginPath(); g.moveTo(175 * i + 40, 0); g.lineTo(175 * i + 40, 640); g.stroke(); } }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 3.1, 2.1], [0, 0.1, 0.0]), C([0.25, 2.95, 1.95], [0, 0.1, 0.0]), 8)} set={{ warm: 0.5, back: false, spot: [0, 0.2, 0] as V, spotK: 0.7 }}
    scene={(tt) => { const k = eio(tt, 0.5, dur(h) - 1.2), PT = (u: number): V => [lerp(-1.41, 1.33, u), 0.08 + 0.015, lerp(-0.16, -0.45, u) - 0.37 * Math.sin(Math.PI * u)];
      const [x, , z] = PT(k); return <>
      <mesh position={[0, 0.06, 0]} rotation={[-1.5708, 0, 0]}><planeGeometry args={[3.6, 1.64]} /><meshStandardMaterial map={T} color="#c9c3b4" roughness={0.85} /></mesh>
      {Array.from({ length: 120 }, (_, i) => { const u = i / 120; return u > k ? null : <Sph key={i} p={[PT(u)[0] + 0.02 * Math.sin(i * 7), 0.085, PT(u)[2] + 0.02 * Math.cos(i * 5)]} r={0.016} c="#b98c54" />; })}
      <group position={[x, 0.08 + 0.05 * Math.abs(Math.sin(tt * 6)), z]} rotation={[0, -0.2 + 0.2 * Math.sin(tt * 3), 0]}><Box p={[0, 0.05, 0]} s={[0.46, 0.1, 0.3]} c="#6e7377" m={0.75} r={0.35} rad={0.04} /><Box p={[0, 0.11, -0.16]} s={[0.46, 0.02, 0.3]} c="#7c2b23" m={0.5} r={0.35} rad={0.01} rot={[0.8, 0, 0]} /></group>
    </>; }}
    over={(tt) => <Ink tt={tt} at={dur(h) - 2} txt="A HANDFUL OF BRAN" />} />; };

// CUADRO 0: la miniatura sin texto ni flecha: hunde la mano en el cuenco de arroz y pide silencio con el dedo
export const Cover0: React.FC = () => <KSet0 cam={C([0.05, 2.25, 3.0], [0.0, 1.98, 0.0])} warm={0.6} spot={[0, 0.8, 0] as V} spotK={0.8}>
  <Sachi p={PZ.stand} t={0.4} x={0} z={-0.7} rotY={0} s={S * 3.6} expr="neutral" />
  <group position={[0, 1.0, 0]}>
  <group position={[0.1, 1.42, 0.25]} rotation={[0, -1.5708, -1.5708]} scale={0.8}><Box p={[0, 0, 0]} s={[0.42, 0.09, 0.32]} c={SKIN} r={0.6} rad={0.04} /><Cyl p={[-0.36, 0, 0]} r={0.045} h={0.42} c={SKIN} rough={0.6} rot={[0, 0, 1.5708]} /></group>
  <Bowl p={[-0.1, 0.3, 1.15]} s={3.4} c="#2c4a8a" fill="#f4f0e4" />
  <Hand p={[0.55, 0.62, 1.2]} rot={[0, 0, 0.55]} s={1.1} curl={0.4} />
  {[[-1.1, "#e0792f"], [1.15, "#7da04a"]].map(([x, c], i) => <Sph key={i} p={[x as number, 0.2, 1.4]} r={0.2} sc={[1.6, 0.8, 1]} c={c as string} ro={0.5} />)}
  {[-1.6, -1.1, 1.2, 1.7].map((x, i) => <Cyl key={i} p={[x, 1.28, -1.2]} r={0.19} h={0.58} c={["#b5472c", "#c9a24a", "#7d5a36", "#a0312b"][i]} rough={0.3} />)}
</group>
</KSet0>;

export const ALL: Record<string, F> = { handscale, saucer, towelgrip, bowlsharp, standup, soldiers, groundline, dipstems, sashi, mushsponge, crowdpan, thumbfish, itazuri, hiddencross, vinegarbath, trembling, sproutsnap, moonjar, twodaikon, onionlines, fishbeads, farfire, starchcoat, twofry, lace, threepick, chopgap, atesilent, salthands, firestreet, nukabed, tincross };
