// sk8pi · los componentes ÚNICOS de «Japanese Grandmothers Never Pour Rice Water Down the Drain» (registro: D:/rtmp/premium8n_sachiko_COMPONENTES.md).
import React, { useMemo } from "react";
import * as THREE from "three";
import { F, Hero, C, lerp, pop, Pop, Ink, cardTex, Steam, Bowl, Ring, Sachi, PZ, S, cl, eio, orbita, Box, Cyl, V } from "./hk";
import { KSet as KSet0 } from "./hk";

const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const dur = (h: any) => h.out - h.at;
const rel = (h: any, i: number, d: number) => Math.min((h.items?.[i]?.at ?? h.at + d) - h.at, dur(h) - 2.2);
const MILK = "#efe9d8", GREY = "#8f8672", GLASS = "#dfeef2", SKIN = "#caa17c", WOOD = "#9a6a3c", DARKW = "#4b2e1a", IRON = "#2a2b2f", STEEL = "#aab1b8", CLAY = "#8b5a3a";
const Sph: React.FC<{ p: V; r: number; c: string; sc?: V; ro?: number; m?: number; e?: string; ei?: number; op?: number }> = ({ p, r, c, sc, ro = 0.6, m = 0, e, ei = 0, op }) =>
  <mesh position={p} scale={sc} castShadow={op === undefined}><sphereGeometry args={[r, 26, 16]} /><meshStandardMaterial color={c} roughness={ro} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} depthWrite={op === undefined} /></mesh>;
const Open: React.FC<{ p: V; r: number; h: number; c: string; m?: number; ro?: number; r2?: number }> = ({ p, r, h, c, m = 0, ro = 0.5, r2 }) => <group position={p}>
  <mesh position={[0, h / 2, 0]} castShadow><cylinderGeometry args={[r, r2 ?? r, h, 56, 1, true]} /><meshStandardMaterial color={c} metalness={m} roughness={ro} side={THREE.DoubleSide} /></mesh>
  <Cyl p={[0, 0.012, 0]} r={r2 ?? r} h={0.024} c={c} rough={ro} m={m} /></group>;
const Jar: React.FC<{ p: V; r?: number; h?: number; lvl?: number; c?: string }> = ({ p, r = 0.22, h = 0.62, lvl = 0, c = MILK }) => <group position={p}>
  {lvl > 0.02 && <Cyl p={[0, 0.02 + h * 0.92 * lvl / 2, 0]} r={r * 0.93} h={h * 0.92 * lvl} c={c} rough={0.28} />}
  <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[r, r, h, 48, 1, true]} /><meshPhysicalMaterial color={GLASS} transparent opacity={0.24} roughness={0.04} side={THREE.DoubleSide} depthWrite={false} /></mesh>
  <mesh position={[0, h, 0]} rotation={[-1.5708, 0, 0]}><ringGeometry args={[r * 0.94, r * 1.04, 48]} /><meshStandardMaterial color="#e6eef0" roughness={0.2} side={THREE.DoubleSide} /></mesh>
  <Cyl p={[0, 0.012, 0]} r={r} h={0.024} c="#cdd6da" rough={0.25} m={0.4} /></group>;
const Stream: React.FC<{ a: V; b: V; t: number; n?: number; c?: string; r?: number; sp?: number }> = ({ a, b, t, n = 12, c = MILK, r = 0.024, sp = 1.9 }) => <>{Array.from({ length: n }, (_, i) => { const u = (t * sp + i / n) % 1; return <Sph key={i} p={[lerp(a[0], b[0], u), lerp(a[1], b[1], u * u), lerp(a[2], b[2], u)]} r={r} c={c} ro={0.2} />; })}</>;
const Hand: React.FC<{ p: V; rot?: V; s?: number; curl?: number }> = ({ p, rot = [0, 0, 0], s = 1, curl = 0 }) => <group position={p} rotation={rot} scale={s}>
  <Box p={[0, 0, 0]} s={[0.42, 0.09, 0.36]} c={SKIN} r={0.6} rad={0.04} />
  {[-0.13, -0.045, 0.045, 0.13].map((z, i) => <group key={i} position={[-0.21, 0, z]} rotation={[0, 0, curl]}><Cyl p={[-0.13, 0, 0]} r={0.038} h={0.28 - 0.012 * Math.abs(i - 1.5)} c={SKIN} rough={0.6} rot={[0, 0, 1.5708]} /></group>)}
  <group position={[0.02, 0, 0.2]} rotation={[0, 0.8, 0]}><Cyl p={[-0.1, 0, 0]} r={0.043} h={0.2} c={SKIN} rough={0.6} rot={[0, 0, 1.5708]} /></group>
  <Cyl p={[0.42, 0, 0]} r={0.12} h={0.45} c="#c9a227" rough={0.8} rot={[0, 0, 1.5708]} /></group>;
const Cloth: React.FC<{ p: V; rot?: V; c?: string }> = ({ p, rot, c = "#efe8da" }) => <group position={p} rotation={rot}><Box p={[0, 0, 0]} s={[0.5, 0.07, 0.34]} c={c} r={0.95} rad={0.03} /><Box p={[0.02, 0.05, 0.02]} s={[0.42, 0.04, 0.26]} c={c} r={0.95} rad={0.018} /></group>;
const Flame: React.FC<{ p: V; k: number; t: number; R?: number }> = ({ p, k, t, R = 0.32 }) => k < 0.03 ? null : <group position={p}>{Array.from({ length: 9 }, (_, i) => { const a = i / 9 * 6.283, H = (0.1 + 0.3 * k) * (0.85 + 0.15 * Math.sin(t * 7 + i)); return <mesh key={i} position={[R * Math.cos(a), H / 2, R * Math.sin(a)]}><coneGeometry args={[0.05, H, 12]} /><meshBasicMaterial color="#6fb7ff" toneMapped={false} /></mesh>; })}</group>;

// 1:34 · LAS DOS AGUAS: el agua gris con polvo se va por el borde; la que entra después se pone blanca y esa se guarda
const whitewater: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.2, 1.5, 2.8], [-0.15, 0.36, 0]), C([-0.35, 1.4, 2.5], [-0.15, 0.36, 0]), 8)} set={{ warm: 0.45, spot: [0, 0.4, 0] as V, spotK: 0.6 }}
  scene={(tt) => { const tip = eio(tt, 1.5, 2.2) * (1 - eio(tt, 2.9, 3.5)), fk = tt < 3.2 ? 1 - eio(tt, 1.9, 2.8) : eio(tt, 3.6, 4.5), wh = eio(tt, 4.4, 5.6), pour = eio(tt, 5.8, 6.3); return <>
    <group position={[0, 0.34, 0]} rotation={[0, 0, tip * 1.05 + pour * -0.72]}><Bowl p={[0, 0, 0]} s={3.2} c="#c6ccd2" fill={tt < 3.2 ? GREY : col("#dfe9ee", MILK, wh)} fillK={Math.max(0.03, fk)} />
      {tt < 2.3 && Array.from({ length: 34 }, (_, i) => { const a = i * 2.4, r = 0.56 * Math.sqrt(rnd(i)); return <Sph key={i} p={[r * Math.cos(a), 0.52 + 0.01 * Math.sin(tt * 3 + i), r * Math.sin(a)]} r={0.012 + 0.012 * rnd(i + 4)} c="#463b2c" ro={0.9} />; })}</group>
    <mesh position={[-1.35, 0.03, 0.05]} rotation={[-1.5708, 0, 0]}><circleGeometry args={[0.28, 40]} /><meshStandardMaterial color="#17181b" roughness={0.5} /></mesh>
    {tip > 0.5 && <Stream a={[-0.72, 0.68, 0]} b={[-1.32, 0.05, 0.03]} t={tt} c={GREY} n={16} r={0.03} />}
    {tt > 3.5 && tt < 4.6 && <Stream a={[0.05, 1.9, 0]} b={[0.05, 0.6, 0]} t={tt} c="#cfe6f2" n={14} r={0.028} sp={2.8} />}
    {tt > 4.5 && tt < 5.9 && <Hand p={[0.5 + 0.2 * Math.cos(tt * 4.4), 0.78, 0.2 * Math.sin(tt * 4.4)]} rot={[0, 0, 0.35]} s={0.8} curl={0.3} />}
    <Jar p={[1.25, 0.05, 0.05]} lvl={eio(tt, 6.2, 7.6)} />
    {pour > 0.5 && <Stream a={[0.76, 0.66, 0.03]} b={[1.24, 0.1 + 0.5 * eio(tt, 6.2, 7.6), 0.05]} t={tt} n={14} r={0.03} />}
  </>; }}
  over={(tt) => <Ink tt={tt} at={5.1} txt="THE SECOND WATER STAYS" />} />;

// 2:05 · EL DÍA EN LA VENTANA: el sol cruza el vidrio y el frasco se agria a la vista
const spoilsun: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.15, 1.05, 2.9], [0, 0.85, -0.3]), C([-0.3, 1.0, 2.6], [0, 0.85, -0.3]), 8)} set={{ warm: 0.5, spot: [0, 0.6, 0] as V, spotK: 0.7 }}
  scene={(tt) => { const k = cl(tt / (dur(h) - 1.3)), sour = eio(k, 0.35, 0.9), sy = 1.25 + 1.0 * Math.sin(Math.PI * k), sx = lerp(-1.6, 1.6, k); return <>
    <mesh position={[0, 1.25, -1.2]}><planeGeometry args={[3.8, 2.3]} /><meshBasicMaterial color={col("#bfe0f2", "#f0ae68", k)} toneMapped={false} /></mesh>
    <Sph p={[sx, sy, -1.15]} r={0.24} c="#fff0b8" e="#ffd27a" ei={1.1} />
    {[-1.92, 0, 1.92].map((x) => <Box key={x} p={[x, 1.25, -1.1]} s={[0.09, 2.4, 0.08]} c={DARKW} r={0.7} rad={0.02} />)}
    {[0.1, 2.42].map((y) => <Box key={y} p={[0, y, -1.1]} s={[3.95, 0.09, 0.08]} c={DARKW} r={0.7} rad={0.02} />)}
    <Box p={[0, 0.17, -0.2]} s={[3.2, 0.1, 1.3]} c={WOOD} r={0.7} rad={0.03} />
    <Jar p={[0, 0.22, -0.2]} r={0.34} h={0.95} lvl={0.84} c={col(MILK, "#cdbb7c", sour)} />
    {Array.from({ length: 26 }, (_, i) => { const a = i * 2.4, r = 0.28 * Math.sqrt(rnd(i)), k2 = pop(tt, 1.6 + i * 0.17, 7, 0.5) * (sour > 0.02 ? 1 : 0); return k2 < 0.03 ? null : <Sph key={i} p={[r * Math.cos(a), 0.99 + 0.02 * Math.sin(tt * 4 + i), -0.2 + r * Math.sin(a)]} r={0.012 + 0.025 * rnd(i + 3) * cl(k2)} c="#f6f2e0" ro={0.1} />; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={3} txt="USE IT THE SAME DAY" />} />;

// 2:40 · DOS ENTRAN, TRES SALEN: dos tazas de arroz al cuenco y salen tres de agua, cada una más pálida
const twotothree: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 1.45, 3.2], [0, 0.4, 0]), C([-0.3, 1.35, 3], [0, 0.4, 0]), 7)} set={{ warm: 0.45, spot: [0, 0.3, 0] as V, spotK: 0.5 }}
  scene={(tt) => <>
    {[0, 1].map((i) => { const a = 0.4 + i * 0.9, ti = eio(tt, a, a + 0.4) * (1 - eio(tt, a + 0.75, a + 1.1)), P: V = [-1.5 + ti * 0.72, 0.1 + ti * 0.7, -0.3 + i * 0.6]; return <group key={i}><group position={P} rotation={[0, 0, -1.8 * ti]}><Open p={[0, 0, 0]} r={0.2} h={0.32} c="#c9cfd5" m={0.6} ro={0.3} />{tt < a + 0.5 && <Sph p={[0, 0.3, 0]} r={0.19} sc={[1, 0.55, 1]} c="#f3efe2" ro={0.9} />}</group>
      {ti > 0.6 && <Stream a={[P[0] + 0.28, P[1] + 0.1, P[2]]} b={[-0.1, 0.5, 0]} t={tt} c="#f6f2e4" n={16} r={0.02} sp={2.6} />}</group>; })}
    <Bowl p={[-0.1, 0.33, 0]} s={2.6} c="#2e4c86" fill={col("#dfe9ee", MILK, eio(tt, 2, 3))} fillK={eio(tt, 1.2, 2.4)} />
    {[0, 1, 2].map((i) => { const a = 2.9 + i * 0.72, l = eio(tt, a, a + 0.65); return <Pop key={i} k={pop(tt, a - 0.35)} p={[0.92 + i * 0.5, 0.05, 0.2 - i * 0.2]}><Jar p={[0, 0, 0]} r={0.2} h={0.6} lvl={0.86 * l} c={col(MILK, "#dfe9ee", i * 0.36)} /></Pop>; })}
  </>}
  over={(tt) => <Ink tt={tt} at={4.4} txt="2 CUPS IN · 3 CUPS OUT" />} />;

// 3:10 · EL BALDE DE LA NIÑA: el baldecito cruza la cocina paso a paso, sin volcar, adonde apunta la mano grande
const littlecarry: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => { const X = lerp(-1.4, 1.05, eio(cl(tt / (dur(h) - 1.1)), 0, 0.92)); return orbita(tt, C([X + 0.3, 0.92, 2.25], [X, 0.42, 0]), C([X - 0.25, 0.85, 2.0], [X, 0.42, 0]), 9); }} set={{ warm: 0.65, spot: [0, 0.1, 0] as V, spotK: 0.5 }}
  scene={(tt) => { const u = cl(tt / (dur(h) - 1.1)), st = Math.abs(Math.sin(tt * 3.4)), x = lerp(-1.85, 1.3, eio(u, 0, 0.92)), sl = Math.sin(tt * 3.4) * 0.14; return <>
    <Box p={[-2.25, 0.5, -0.1]} s={[0.9, 1, 1]} c="#6c7178" r={0.3} m={0.4} rad={0.04} />
    <Box p={[1.85, 0.075, 0.1]} s={[0.9, 0.11, 1]} c="#8d8a82" r={0.9} rad={0.03} />
    {Array.from({ length: 11 }, (_, i) => { const px = -1.75 + i * 0.3; return x < px ? null : <Sph key={i} p={[px, 0.045, 0.1 + (i % 2 ? 0.14 : -0.14)]} r={0.075} sc={[1.3, 0.1, 0.72]} c="#5a3a20" ro={0.95} />; })}
    <group position={[x, 0.05 + 0.05 * st, 0.1]} rotation={[sl * 0.45, 0, sl * 0.5]}><Open p={[0, 0, 0]} r={0.27} r2={0.22} h={0.42} c={WOOD} ro={0.85} />
      {[0.08, 0.32].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[1.5708, 0, 0]}><torusGeometry args={[0.24 + y * 0.1, 0.014, 10, 48]} /><meshStandardMaterial color="#3b3f45" metalness={0.5} roughness={0.5} /></mesh>)}
      <mesh position={[0, 0.42, 0]}><torusGeometry args={[0.27, 0.014, 10, 48, 3.1416]} /><meshStandardMaterial color="#3b3f45" metalness={0.5} roughness={0.5} /></mesh>
      <mesh position={[0, 0.34, 0]} rotation={[-1.5708 + sl * 0.7, 0, 0]}><circleGeometry args={[0.25, 36]} /><meshStandardMaterial color={MILK} roughness={0.22} /></mesh></group>
    <Hand p={[1.75 + 0.05 * Math.sin(tt * 0.8), 1.08, 0.1]} rot={[0, 0, 0.7]} s={1.1} />
  </>; }}
  over={(tt) => <Ink tt={tt} at={3.4} txt="EVERY EVENING. EVERY DROP." />} />;

// 3:50 · LO AMARGO SE VA: los puntos oscuros salen del nabo, la nube blanca se los lleva y las rodajas quedan claras
const bitterlift: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.35, 0.95, 2.6], [0, 0.55, 0]), C([-0.3, 0.9, 2.3], [0, 0.55, 0]), 8)} set={{ warm: 0.45, spot: [0, 0.4, 0] as V, spotK: 0.8 }}
  scene={(tt) => { const c = eio(tt, 1, dur(h) - 1.6); return <>
    <Cyl p={[0, 0.5, 0]} r={0.76} h={0.84} c="#f0ecdf" rough={0.1} op={0.42} />
    <mesh position={[0, 0.56, 0]}><cylinderGeometry args={[0.8, 0.8, 1.1, 56, 1, true]} /><meshPhysicalMaterial color={GLASS} transparent opacity={0.22} roughness={0.04} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <Cyl p={[0, 0.03, 0]} r={0.8} h={0.05} c="#b7bfc4" m={0.5} rough={0.3} />
    {[[-0.33, 0.25, 0.1], [0.33, 0.25, -0.05], [0, 0.25, 0.32], [-0.14, 0.45, -0.1], [0.2, 0.47, 0.2]].map((P, i) => <Cyl key={i} p={P as V} r={0.27} h={0.16} c={col("#c7b783", "#fbf8ef", c)} rough={0.5} rot={[0.12 * (i - 2), 0, 0.14 * (i - 2)]} />)}
    {Array.from({ length: 46 }, (_, i) => { const b = 1 + rnd(i) * (dur(h) - 3.2), u = cl((tt - b) / 2.2), a = i * 2.4 + u * 2, r = 0.2 + 0.46 * rnd(i + 2); return u <= 0 || u >= 1 ? null : <Sph key={i} p={[r * Math.cos(a), lerp(0.3, 0.92, u), r * Math.sin(a)]} r={0.024 + 0.012 * rnd(i + 7)} c="#3b3a22" ro={0.8} />; })}
    <Flame p={[0, -0.01, 0]} k={0.5} t={tt} R={0.5} />
    <Steam p={[0, 1, 0]} t={tt} k={c} n={5} s={1.1} />
  </>; }}
  over={(tt) => <Ink tt={tt} at={3.8} txt="THE BITTER LEAVES WITH IT" />} />;

// 4:12 · LA CHAQUETA DEL BAMBÚ: el brote pierde hojas de a una y pasa la noche entero dentro de la olla con la luna arriba
const bambooshed: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.3, 1.2, 3.1], [0, 0.72, 0]), C([-0.35, 1.1, 2.8], [0, 0.72, 0]), 8)} set={(tt: number) => ({ warm: lerp(0.5, 0.05, eio(tt, 3.8, 5)), spot: [0, 0.4, 0] as V, spotK: 0.6 })}
  scene={(tt) => { const n = 8, nt = eio(tt, 3.9, 5.4), pot = eio(tt, 3.1, 3.9); return <>
    <mesh position={[0, 1.55, -1.25]}><planeGeometry args={[6, 2.8]} /><meshBasicMaterial color={col("#ccdce2", "#10182e", nt)} toneMapped={false} /></mesh>
    <Sph p={[lerp(-1.9, 1.9, cl((tt - 3.9) / 3.6)), 1.6 + 0.65 * Math.sin(Math.PI * cl((tt - 3.9) / 3.6)), -1.2]} r={0.2 * nt} c="#f2efe0" e="#f6edc9" ei={0.7 * nt} />
    <mesh position={[0, 0.72, 0]} castShadow><coneGeometry args={[0.34, 1.45, 36]} /><meshStandardMaterial color="#efe3b2" roughness={0.6} /></mesh>
    {Array.from({ length: n }, (_, i) => { const a = 0.4 + i * 0.3, k = eio(tt, a, a + 0.8), ang = i * 2.4; return k > 0.98 ? null : <group key={i} position={[(0.2 + 0.2 * (n - i) / n) * Math.cos(ang) * (1 + 3 * k), 0.15 + i * 0.16 - 0.15 * k * k, (0.2 + 0.2 * (n - i) / n) * Math.sin(ang) * (1 + 3 * k)]} rotation={[0, -ang, 0.32 + 2.2 * k]}><mesh><coneGeometry args={[0.2, 0.65 - i * 0.03, 12]} /><meshStandardMaterial color={i % 2 ? "#6c5230" : "#83663a"} roughness={0.8} /></mesh></group>; })}
    {pot > 0.01 && <group position={[0, lerp(-1.6, 0.03, pot), 0]}><Open p={[0, 0, 0]} r={0.75} h={1.22} c="#51555d" m={0.7} ro={0.35} /><Cyl p={[0, 1.05, 0]} r={0.72} h={0.02} c={MILK} rough={0.25} /></group>}
    {pot > 0.9 && <group position={[0.24, 1.3, 0.18]} rotation={[0.3, 0.4, 1.2]}><mesh><coneGeometry args={[0.05, 0.42, 14]} /><meshStandardMaterial color="#b3201c" roughness={0.45} /></mesh></group>}
    <Flame p={[0, 0, 0]} k={1 - eio(tt, 4.4, 5)} t={tt} R={0.62} />
  </>; }}
  over={(tt) => <Ink tt={tt} at={4.9} txt="ALL NIGHT, UNTIL COLD" col="#ffe6b0" />} />;

// 4:50 · DOS COLIFLORES: la de agua sola se apaga amarilla; la de agua de arroz se enciende blanca
const Cauli: React.FC<{ p: V; c: string; ei?: number }> = ({ p, c, ei = 0 }) => <group position={p}>{Array.from({ length: 22 }, (_, i) => { const y = 1 - (i / 21) * 0.9, r = Math.sqrt(1 - y * y), a = i * 2.4; return <Sph key={i} p={[0.42 * r * Math.cos(a), 0.42 * y, 0.42 * r * Math.sin(a)]} r={0.19} c={c} ro={0.72} e={c} ei={ei} />; })}</group>;
const twocauli: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 1.25, 3.1], [0, 0.55, 0]), C([-0.3, 1.15, 2.8], [0, 0.55, 0]), 6)} set={{ warm: 0.45, spot: [0.9, 0.5, 0] as V, spotK: 0.7 }}
  scene={(tt) => { const k = eio(tt, 0.9, 3.2); return <>{[-1, 1].map((s) => <group key={s}><Open p={[s * 0.95, 0.04, 0]} r={0.68} h={0.42} c="#59606a" m={0.75} ro={0.3} /><Cyl p={[s * 0.95, 0.38, 0]} r={0.65} h={0.02} c={s < 0 ? "#d6d9db" : MILK} rough={0.25} /><Steam p={[s * 0.95, 0.5, 0]} t={tt} k={0.6} n={3} s={0.7} /></group>)}
    <Cauli p={[-0.95, 0.62, 0]} c={col("#f2eddc", "#b99b4d", k)} /><Cauli p={[0.95, 0.62, 0]} c="#fdfbf4" ei={0.06 * k} /></>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="IT STAYS WHITE" />} />;

// 5:18 · EL ARENQUE QUE GOLPEA: duro como palo, golpea tres veces la puerta; un día en agua blanca y se dobla
const knockfish: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.4, 1.2, 3.25], [0, 1.0, -0.3]), C([-0.25, 1.12, 2.95], [0, 0.95, -0.3]), 7)} set={{ warm: 0.55, spot: [0, 0.9, -0.5] as V, spotK: 0.7 }}
  scene={(tt) => { const kn = (x: number) => Math.exp(-5 * Math.max(0, x)) * (x > 0 ? 1 : 0), sw = tt < 2.7 ? Math.max(0, Math.sin(tt * 7.1 - 0.9)) : 0, fly = eio(tt, 2.8, 3.5), soft = eio(tt, 3.6, dur(h) - 1), hit = [0.35, 1.23, 2.11], fc = col("#3f4a55", "#c2bcab", soft); return <>
    <Box p={[0, 1.4, -1.0]} s={[1.9, 2.8, 0.1]} c="#c39a63" r={0.75} rad={0.03} />
    {[0.8, 2.05].map((y) => <Box key={y} p={[0, y, -0.94]} s={[1.5, 1.0, 0.04]} c="#d6b27d" r={0.8} rad={0.018} />)}
    {hit.map((b, i) => <mesh key={i} position={[0.05, 1.3, -0.88]}><ringGeometry args={[0.12 + 0.9 * cl((tt - b) * 2), 0.17 + 0.9 * cl((tt - b) * 2), 40]} /><meshBasicMaterial color="#fff2cf" transparent opacity={tt < b ? 0 : 0.9 * kn(tt - b)} toneMapped={false} depthWrite={false} /></mesh>)}
    <Box p={[0, 0.21, 0.15]} s={[2.5, 0.4, 0.85]} c="#6b4426" r={0.8} rad={0.04} />
    <group position={[lerp(0.05, 0, fly), lerp(1.75, 0.66, fly), lerp(-0.72 + 0.62 * (1 - sw), 0.15, fly)]} rotation={[lerp(-0.1 - 0.4 * (1 - sw), 0, fly), 0, lerp(0.06, 1.5708, fly)]}>
      {Array.from({ length: 7 }, (_, i) => <Box key={i} p={[0.3 * soft * ((i - 3) / 3) ** 2, (i - 3) * 0.21, 0]} s={[0.34 - Math.abs(i - 3) * 0.05, 0.23, 0.11]} c={fc} r={0.4} m={0.3} rad={0.04} />)}
      <Sph p={[0.3 * soft + 0.03, -0.6, 0.06]} r={0.04} c="#f4efe2" ro={0.3} /><Sph p={[0.3 * soft + 0.03, -0.6, 0.095]} r={0.02} c="#14100c" ro={0.2} />
      <mesh position={[0.3 * soft, 0.82, 0]} rotation={[0, 0, 3.1416]} scale={[1, 1, 0.25]}><coneGeometry args={[0.22, 0.26, 3]} /><meshStandardMaterial color={fc} roughness={0.5} /></mesh></group>
    {fly > 0.02 && <Pop k={pop(tt, 2.75)} p={[0, 0.41, 0.15]}><Box p={[0, 0.06, 0]} s={[2.3, 0.12, 0.7]} c="#d5dde2" r={0.3} rad={0.03} /><Box p={[0, 0.125, 0]} s={[2.16, 0.02, 0.58]} c={MILK} r={0.25} rad={0.008} /></Pop>}
  </>; }}
  over={(tt) => <Ink tt={tt} at={3.9} txt="ONE DAY IN RICE WATER" />} />;

// 5:43 · LAS MIL MANITOS: los granos de almidón rodean las gotas de aceite y las levantan del plato
const oilgrab: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.4, 1.8, 1.8], [0, 0.12, 0]), C([-0.4, 1.7, 1.6], [0, 0.12, 0]), 8)} set={{ warm: 0.35, spot: [0, 0.1, 0] as V, spotK: 0.9 }}
  scene={(tt) => { const D: [number, number, number][] = [[-0.7, -0.15, 0.3], [0.1, -0.4, 0.24], [0.76, 0.1, 0.28], [-0.2, 0.42, 0.34], [0.55, 0.62, 0.18]]; return <>
    <Cyl p={[0, 0.05, 0]} r={1.5} h={0.05} c="#26364f" rough={0.2} />
    {D.map(([x, z, r], i) => { const a = 1.4 + i * 0.75, L = eio(tt, a + 0.9, a + 2.1); return <group key={i}><Sph p={[x, 0.1 + r * 0.2 + L * 1.1, z]} r={r} sc={[1, lerp(0.34, 0.8, L), 1]} c="#d9a02e" ro={0.1} e="#7a4d05" ei={0.2} />
      {Array.from({ length: 14 }, (_, j) => { const u = eio(tt, a - 0.9 + j * 0.03, a + 0.1 + j * 0.03), an = j * 2.4 + tt * 0.8, R = lerp(1.2 + rnd(j) * 0.6, r * 1.02, u); return <Sph key={j} p={[x + R * Math.cos(an), 0.13 + lerp(0.1 + rnd(j + 2) * 0.4, r * 0.25 * Math.sin(j), u) + L * 1.1, z + R * Math.sin(an)]} r={0.038} c="#fdfbf2" ro={0.7} />; })}</group>; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={2.8} txt="STARCH GRABS OIL" />} />;

// 6:08 · LA GRASA SUELTA: el plato baja a la palangana, las manchas se desprenden y sube limpio
const basinlet: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.2, 1.75, 2.4], [0, 0.3, 0]), C([-0.35, 1.6, 2.15], [0, 0.3, 0]), 7)} set={{ warm: 0.45, spot: [0, 0.3, 0] as V, spotK: 0.5 }}
  scene={(tt) => { const down = eio(tt, 0.4, 1.2) * (1 - eio(tt, 4.2, 5)), rel0 = eio(tt, 1.6, 3.8), sw = eio(tt, 4.7, 5.5); return <>
    <Open p={[0, 0.04, 0]} r={1.25} r2={1.02} h={0.48} c="#3e7ea1" ro={0.4} /><Cyl p={[0, 0.34, 0]} r={1.18} h={0.02} c={MILK} rough={0.3} op={0.72} />
    <group position={[0, lerp(1.0, 0.2, down), 0]} rotation={[0.55 * (1 - sw * 0.3), 0, 0]}><Cyl p={[0, 0, 0]} r={0.7} h={0.05} c="#f1ece0" rough={0.22} />
      {Array.from({ length: 10 }, (_, i) => { const a = i * 2.4, r = 0.55 * Math.sqrt(rnd(i)); return rel0 > 0.9 ? null : <Cyl key={i} p={[r * Math.cos(a), 0.03, r * Math.sin(a)]} r={(0.14 + 0.08 * rnd(i + 2)) * (1 - rel0)} h={0.012} c="#b98724" rough={0.2} />; })}
      {sw > 0.03 && sw < 1 && <mesh position={[lerp(-0.8, 0.8, sw), 0.05, 0]} rotation={[-1.5708, 0, 0.5]}><planeGeometry args={[0.14, 1.5]} /><meshBasicMaterial color="#fff" transparent opacity={0.65} toneMapped={false} depthWrite={false} /></mesh>}</group>
    {Array.from({ length: 12 }, (_, i) => { const b = 1.4 + i * 0.16, k = eio(tt, b, b + 1.6), a = i * 2.4 + k * 1.4, r = lerp(0.3 + 0.3 * rnd(i), 1.02, k); return tt < b ? null : <Sph key={i} p={[r * Math.cos(a), 0.36, r * Math.sin(a)]} r={0.05 + 0.05 * rnd(i + 4)} sc={[1, 0.25, 1]} c="#c79a33" ro={0.15} />; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={3} txt="THE GREASE LETS GO" />} />;

// 7:05 · MEDOME: la pared de barro está llena de ojos abiertos; el almidón entra y los va cerrando
const medome: F = ({ t, h }) => { const n = 26, at = (i: number) => 1.1 + (i / n) * (dur(h) - 3.4); const H = useMemo(() => Array.from({ length: n }, (_, i) => [-1.75 + (i % 7) * 0.58 + (Math.floor(i / 7) % 2) * 0.29 + (rnd(i) - 0.5) * 0.08, 0.62 + Math.floor(i / 7) * 0.5 + (rnd(i + 6) - 0.5) * 0.08] as [number, number]), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.35, 1.3, 2.8], [0, 1.28, -0.3]), C([-0.45, 1.25, 2.45], [0, 1.28, -0.3]), 9)} set={{ warm: 0.5, spot: [0, 1.2, 0] as V, spotK: 0.7 }}
    scene={(tt) => <>
      <Box p={[0, 1.3, -0.46]} s={[4.3, 2.6, 0.24]} c={CLAY} r={0.97} rad={0.06} />
      {H.map(([x, y], i) => { const k = eio(tt, at(i), at(i) + 0.62), Z = -0.335; return <group key={i}><mesh position={[x, y, Z]}><circleGeometry args={[0.15, 28]} /><meshStandardMaterial color="#7a4d2e" roughness={0.9} /></mesh>
        <mesh position={[x, y, Z + 0.003]}><circleGeometry args={[0.105, 22]} /><meshStandardMaterial color="#21140c" roughness={0.9} /></mesh>
        <mesh position={[x, y + 0.15 * (1 - k), Z + 0.006]} scale={[1, Math.max(0.03, k), 1]}><circleGeometry args={[0.16, 28]} /><meshStandardMaterial color={col(CLAY, "#a7764e", k)} roughness={0.95} /></mesh>
        {Array.from({ length: 5 }, (_, j) => { const u = cl((tt - at(i) + 0.7 - j * 0.09) / 0.7); return u <= 0 || u >= 1 ? null : <Sph key={j} p={[lerp(x + 0.6 * (rnd(j + i) - 0.5), x, u), lerp(y + 0.6, y, u), lerp(0.4, Z, u)]} r={0.028} c="#fff9ea" ro={0.5} />; })}</group>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={2.6} txt="STOPPING THE EYES" y={960} />} />; };

// 7:40 · LA PIEL DE LA TETERA: el óxido naranja adentro se apaga mancha por mancha bajo una piel oscura
const kettleskin: F = ({ t, h }) => { const R = 1.15; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.35, 1.25, 2.9], [0, 1.0, 0]), C([-0.4, 1.2, 2.6], [0, 1.0, 0]), 7)} set={{ warm: 0.45, spot: [0, 1, 0] as V, spotK: 0.7 }}
  scene={(tt) => <>
    <mesh position={[0, 1.08, -0.1]} rotation={[-1.5708, 0, 0]}><sphereGeometry args={[R, 56, 30, 0, 6.283, 0, 1.5708]} /><meshStandardMaterial color={IRON} roughness={0.72} metalness={0.5} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 1.08, -0.11]} rotation={[0, 0, 0]}><ringGeometry args={[R - 0.02, R + 0.05, 72]} /><meshStandardMaterial color="#17181b" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    {Array.from({ length: 42 }, (_, i) => { const a = i * 2.4, ra = (0.2 + 0.72 * Math.sqrt(rnd(i))) * R, y = ra * Math.sin(a), x = ra * Math.cos(a), z = -0.1 - Math.sqrt(Math.max(0.02, R * R - ra * ra)) * 0.985, b = 1 + ((y + R) / (2 * R)) * (dur(h) - 3.1), k = eio(tt, b, b + 0.7); return <mesh key={i} position={[x, 1.08 + y, z]} rotation={[0, 0, a]}><circleGeometry args={[0.1 + 0.16 * rnd(i + 2), 12]} /><meshStandardMaterial color={col("#c1531b", "#161719", k)} roughness={0.85} emissive="#6c260a" emissiveIntensity={0.22 * (1 - k)} side={THREE.DoubleSide} /></mesh>; })}
    <Box p={[0, 0.07, 0]} s={[2.4, 0.08, 0.9]} c="#5b4630" r={0.85} rad={0.03} />
  </>}
  over={(tt) => <Ink tt={tt} at={3.1} txt="A THIN DARK SKIN" />} />; };

// 8:05 · EL MARTES PEGADO: la olla sigue oliendo a martes; hierve el agua blanca, las volutas se apagan y la hoja cae hasta sábado
const tuesdaypot: F = ({ t, h }) => { const T1 = useMemo(() => cardTex(["LAST", "TUESDAY"], { bg: "#ece4d0", fg: "#26201a", w: 512, h: 512 }), []), T2 = useMemo(() => cardTex(["GONE", "TUESDAY"], { bg: "#ece4d0", fg: "#a0312b", w: 512, h: 512 }), []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.1, 1.25, 3.3], [0.25, 0.75, 0]), C([-0.3, 1.2, 3], [0.25, 0.75, 0]), 8)} set={{ warm: 0.45, spot: [0, 0.5, 0] as V, spotK: 0.5 }}
    scene={(tt) => { const b = eio(tt, 1.8, 3.1), fl = eio(tt, dur(h) - 2.9, dur(h) - 2.1); return <>
      <Open p={[-0.5, 0.05, 0]} r={0.68} h={0.82} c={STEEL} m={0.8} ro={0.28} />
      <Cyl p={[-0.5, 0.56, 0]} r={0.65} h={0.02} c={col("#7e6a44", MILK, b)} rough={0.3} />
      {Array.from({ length: 9 }, (_, i) => { const a = i / 9 * 6.283, y0 = 0.9; return <group key={i}>{Array.from({ length: 12 }, (_, j) => { const u = ((tt * 0.7 + i * 0.11) % 1) * 0.3 + j / 12, ri = 0.46 + 0.14 * Math.sin(u * 16 + i); return <Sph key={j} p={[-0.5 + ri * Math.cos(a + u * 2.4), y0 + u * 1.5, ri * Math.sin(a + u * 2.4)]} r={0.03 + 0.03 * u} c={col("#7f9b3d", "#ffffff", b)} ro={0.8} op={(0.85 - 0.75 * b) * Math.sin(Math.PI * cl(u))} />; })}</group>; })}
      <Flame p={[-0.5, 0, 0]} k={b} t={tt} R={0.5} />
      <Box p={[1.15, 0.8, -0.35]} s={[0.05, 1.6, 0.05]} c={DARKW} r={0.7} rad={0.012} />
      <mesh position={[1.15, 1.08, -0.29]}><planeGeometry args={[0.95, 0.95]} /><meshStandardMaterial map={T2} color="#cfcbbf" roughness={0.75} /></mesh>
      {fl < 1 && <group position={[1.15, 1.555, -0.25]} rotation={[-fl * 2.5, 0, 0]}><mesh position={[0, -0.475, 0]}><planeGeometry args={[0.95, 0.95]} /><meshStandardMaterial map={T1} color="#cfcbbf" roughness={0.75} side={THREE.DoubleSide} /></mesh></group>}
    </>; }}
    over={(tt) => <Ink tt={tt} at={3.3} txt="THE SMELL IS OIL" />} />; };

// 8:45 · LA QUE SE PEGA: dos cucharas salen de dos ollas; el agua cae sola, la de arroz se queda y baja de a poco
const Spoon: React.FC<{ p: V; rot?: V; c?: string }> = ({ p, rot, c = STEEL }) => <group position={p} rotation={rot}><Sph p={[0, 0, 0]} r={0.3} sc={[1, 0.28, 0.72]} c={c} m={0.85} ro={0.2} /><Cyl p={[0.72, 0.1, 0]} r={0.035} h={1.2} c={c} m={0.85} rough={0.25} rot={[0, 0, 1.45]} /></group>;
const clingspoon: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.15, 1.15, 2.7], [0, 0.82, 0]), C([-0.3, 1.1, 2.45], [0, 0.82, 0]), 7)} set={{ warm: 0.5, spot: [0, 0.8, 0] as V, spotK: 0.6 }}
  scene={(tt) => { const up = eio(tt, 0.4, 1.3); return <>{[-1, 1].map((s) => <group key={s}><Open p={[s * 0.85, 0.04, 0]} r={0.58} h={0.42} c={s < 0 ? "#555a62" : "#7b4a2a"} m={s < 0 ? 0.6 : 0} ro={0.4} /><Cyl p={[s * 0.85, 0.42, 0]} r={0.56} h={0.02} c={s < 0 ? "#c8d4dc" : "#c79a58"} rough={0.15} /></group>)}
    <Spoon p={[-0.85, lerp(0.45, 1.2, up), 0]} rot={[0, 0.2, -0.05]} />
    {up > 0.9 && <Stream a={[-0.85, 1.12, 0]} b={[-0.85, 0.44, 0]} t={tt} c="#cfdde6" n={7} r={0.022} sp={3.2} />}
    <Spoon p={[0.85, lerp(0.45, 1.2, up), 0]} rot={[0, -0.2, -0.05]} />
    <Sph p={[0.85, lerp(0.45, 1.2, up) + 0.035, 0]} r={0.3} sc={[1.06, 0.27, 0.78]} c="#c79a58" ro={0.25} />
    {up > 0.9 && <><Sph p={[0.85, 1.1 - 0.5 * eio(tt, 1.6, dur(h) - 1), 0]} r={0.055} sc={[0.8, 1.5, 0.8]} c="#c79a58" ro={0.2} /><Cyl p={[0.85, 1.12 - 0.25 * eio(tt, 1.6, dur(h) - 1), 0]} r={0.016} h={Math.max(0.02, 0.5 * eio(tt, 1.6, dur(h) - 1))} c="#c79a58" rough={0.2} /></>}
  </>; }}
  over={(tt) => <Ink tt={tt} at={1.9} txt="IT CLINGS TO THE SPOON" />} />;

// 9:30 · LA TAZA DE NOCHE: cuarto azul, se abre una rendija cálida y una taza llega sola junto al futón
const nightcup: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.2, 1.45, 3.4], [0, 0.55, -0.1]), C([-0.35, 1.35, 3], [0, 0.55, -0.1]), 7)} set={{ warm: 0.0, spot: [0.65, 0.2, 0.3] as V, spotK: 1.0, back: false, bg: "#10162a" }}
  scene={(tt) => { const o = eio(tt, 0.5, 2), go = eio(tt, 1.6, 4); return <>
    <Box p={[0, 1.45, -1.2]} s={[6, 3, 0.1]} c="#20283f" r={0.9} rad={0.03} />
    <Box p={[-1.75, 1.45, -1.14]} s={[0.04, 0.04, 0.04]} c="#20283f" rad={0.01} />
    <mesh position={[1.55, 1.45, -1.13]}><planeGeometry args={[1.5 * o + 0.02, 2.7]} /><meshBasicMaterial color="#f6b866" toneMapped={false} /></mesh>
    <Box p={[lerp(1.55, 2.25, o), 1.45, -1.08]} s={[1.5, 2.76, 0.04]} c="#b9b19a" r={0.9} rad={0.015} />
    <mesh position={[1.1, 0.05, 0.1]} rotation={[-1.5708, 0, -0.5]}><planeGeometry args={[1.5 * o + 0.02, 3.8]} /><meshBasicMaterial color="#f6b866" transparent opacity={0.32 * o} toneMapped={false} depthWrite={false} /></mesh>
    <Box p={[-0.85, 0.13, 0.1]} s={[2.2, 0.17, 1.1]} c="#5c6a90" r={0.95} rad={0.07} />
    <Box p={[-1.55, 0.27, 0.1]} s={[0.55, 0.15, 0.82]} c="#cdd3e2" r={0.95} rad={0.06} />
    <group position={[lerp(1.9, 0.72, go), 0.05, lerp(-0.7, 0.3, go)]}><Box p={[0, 0.05, 0]} s={[0.72, 0.06, 0.52]} c="#3d2413" r={0.45} rad={0.02} /><Open p={[0, 0.08, 0]} r={0.15} r2={0.1} h={0.2} c="#efe9d8" ro={0.35} /><Cyl p={[0, 0.25, 0]} r={0.135} h={0.01} c="#f8f3e6" rough={0.2} />{go > 0.95 && <Steam p={[0, 0.32, 0]} t={tt} k={1} n={4} s={0.42} />}</group>
  </>; }}
  over={(tt) => <Ink tt={tt} at={dur(h) - 2.6} txt="SOMEONE GOT UP FOR ME" col="#ffe6b0" />} />;

// 12:07 · LA PILETA QUE GUARDA LA VENTANA: el paño pasa con la veta y aparece el reflejo
const sinkwindow: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.25, 1.75, 2.3], [0, 0.08, -0.05]), C([-0.3, 1.65, 2.1], [0, 0.08, -0.05]), 7)} set={{ warm: 0.4, spot: [0, 0.1, 0] as V, spotK: 0.4 }}
  scene={(tt) => { const k = eio(tt, 1, dur(h) - 1.8), n = Math.floor(k * 5.99), sw = (k * 6) % 1, W = 3.5 / 6; return <>
    <Box p={[0, 0.07, 0]} s={[3.6, 0.1, 1.9]} c="#bcc3ca" r={0.22} m={0.92} rad={0.03} />
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-1.75 + W * (i + 0.5), 0.125, 0]} rotation={[-1.5708, 0, 0]}><planeGeometry args={[W, 1.8]} /><meshStandardMaterial color="#8a8a80" roughness={0.9} transparent opacity={i < n ? 0 : i === n ? 0.82 * (1 - sw * 0.9) : 0.82} depthWrite={false} /></mesh>)}
    <group position={[0, 0.128, 0]}>{[[-0.48, 0.42], [0.48, 0.42], [-0.48, -0.42], [0.48, -0.42]].map(([x, z], i) => <mesh key={i} position={[x, 0, z]} rotation={[-1.5708, 0, 0]}><planeGeometry args={[0.86, 0.72]} /><meshBasicMaterial color="#e9f3fa" transparent opacity={0.85 * eio(k, 0.55, 1)} toneMapped={false} depthWrite={false} /></mesh>)}</group>
    {k < 1 && <Cloth p={[-1.75 + W * (n + 0.5), 0.18, lerp(0.78, -0.78, sw)]} />}
  </>; }}
  over={(tt) => <Ink tt={tt} at={dur(h) - 3.3} txt="YOU COULD SEE THE WINDOW" />} />;

// 12:07 · SESENTA AÑOS DE MAÑANAS: el paño va y viene; los años suben y el piso empieza a devolver el cielo
const shinelayers: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.7, 0.62, 2.2], [0, 0.16, -0.25]), C([-0.6, 0.56, 1.95], [0, 0.16, -0.25]), 8)} set={{ warm: 0.5, spot: [0, 0.1, 0] as V, spotK: 0.5 }}
  scene={(tt) => { const k = eio(tt, 0.7, dur(h) - 0.9), sw = Math.sin(tt * 4.3); return <>
    {Array.from({ length: 7 }, (_, i) => <Box key={i} p={[0, 0.085, -1 + i * 0.32]} s={[5.2, 0.09, 0.31]} c={col("#8d6a48", "#3f2312", k)} r={lerp(0.9, 0.08, k)} rad={0.012} />)}
    <mesh position={[0.2, 0.134, -0.2]} rotation={[-1.5708, 0, 0]}><planeGeometry args={[2.4, 1.5]} /><meshBasicMaterial color="#ffeccb" transparent opacity={0.55 * eio(k, 0.5, 1)} toneMapped={false} depthWrite={false} /></mesh>
    {[-0.2, 0.6].map((x) => <mesh key={x} position={[x, 0.136, -0.2]} rotation={[-1.5708, 0, 0]}><planeGeometry args={[0.05, 1.5]} /><meshBasicMaterial color="#2a180c" transparent opacity={0.85 * eio(k, 0.5, 1)} depthWrite={false} /></mesh>)}
    {k < 1 && <Cloth p={[1.5 * sw, 0.19, 0.5]} rot={[0, 0.2 * sw, 0]} />}
  </>; }}
  over={(tt) => { const n = Math.round(eio(tt, 0.7, dur(h) - 0.9) * 60); return <Ink tt={tt} at={0.8} txt={`${Math.max(1, n)} YEARS OF MORNINGS`} />; }} />;

// 12:38 · LAS BOTAS AFUERA: dos botas de soldado se quedan en el escalón y dos medias pisan el piso que brilla
const Boot: React.FC<{ p: V }> = ({ p }) => <group position={p}><Box p={[0.05, 0.06, 0]} s={[0.54, 0.12, 0.24]} c="#20150c" r={0.6} rad={0.04} /><Box p={[0.1, 0.16, 0]} s={[0.46, 0.14, 0.22]} c="#4f3921" r={0.5} rad={0.05} /><Cyl p={[-0.08, 0.38, 0]} r={0.125} h={0.46} c="#4f3921" rough={0.55} /></group>;
const bootsoff: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.45, 1.05, 3.1], [0, 0.32, 0]), C([-0.35, 0.95, 2.8], [0, 0.32, 0]), 7)} set={{ warm: 0.55, spot: [0.7, 0.2, 0] as V, spotK: 0.5 }}
  scene={(tt) => { const B = (a: number) => pop(tt, a, 5.5, 0.5); return <>
    <Box p={[-1.35, 0.11, 0.15]} s={[1.5, 0.15, 1.5]} c="#7f7b73" r={0.95} rad={0.04} />
    {Array.from({ length: 5 }, (_, i) => <Box key={i} p={[1, 0.145, -0.5 + i * 0.32]} s={[2.3, 0.21, 0.31]} c="#3e2412" r={0.08} rad={0.012} />)}
    <mesh position={[1, 0.255, 0.14]} rotation={[-1.5708, 0, 0]}><planeGeometry args={[1.2, 1.2]} /><meshBasicMaterial color="#ffeccb" transparent opacity={0.34} toneMapped={false} depthWrite={false} /></mesh>
    <Pop k={B(0.4)} p={[-1.5, 0.19, 0.42]}><Boot p={[0, 0, 0]} /></Pop><Pop k={B(1.15)} p={[-1.5, 0.19, -0.1]}><Boot p={[0, 0, 0]} /></Pop>
    {[0, 1].map((i) => { const a = 2.3 + i * 0.9, k = eio(tt, a, a + 0.75), z = i ? -0.14 : 0.3, x = lerp(-1.9, 0.72 + i * 0.3, k), y = 0.34 + 0.34 * Math.sin(Math.PI * k); return tt < a - 0.02 ? null : <group key={i} position={[x, y, z]}><Sph p={[0.05, 0, 0]} r={0.15} sc={[1.75, 0.65, 0.9]} c="#8d8f8b" ro={0.95} /><Cyl p={[-0.13, 0.25, 0]} r={0.105} h={0.45} c="#8d8f8b" rough={0.95} /></group>; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={3.6} txt="WITHOUT BEING ASKED" />} />;

// 13:30 · LA CIRUELA QUE ENCERA: la bolsita del tamaño de una ciruela pasa y deja un camino que brilla
const branbag: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.3, 1.4, 2.6], [0, 0.2, 0]), C([-0.3, 1.3, 2.3], [0, 0.2, 0]), 7)} set={{ warm: 0.5, spot: [0, 0.1, 0] as V, spotK: 0.6 }}
  scene={(tt) => { const k = eio(tt, 1.6, dur(h) - 1.3), w = Math.floor(k * 3.99), u = (k * 4) % 1, dir = w % 2 ? -1 : 1, x = dir * lerp(-1.85, 1.85, u), z = -0.54 + w * 0.36; return <>
    {[0, 1, 2, 3, 4].map((i) => <Box key={i} p={[0, 0.085, -0.72 + i * 0.36]} s={[4.2, 0.09, 0.35]} c="#a97a4b" r={0.9} rad={0.012} />)}
    {[0, 1, 2, 3].map((i) => { const on = i < w ? 1 : i === w ? 1 : 0, c0 = i % 2 ? 1 : -1, len = i < w ? 3.8 : u * 3.8; return !on || k <= 0 ? null : <mesh key={i} position={[c0 * (1.9 - len / 2), 0.133, -0.54 + i * 0.36]} rotation={[-1.5708, 0, 0]}><planeGeometry args={[Math.max(0.01, len), 0.3]} /><meshStandardMaterial color="#6d3f1d" roughness={0.1} metalness={0.15} emissive="#c8853a" emissiveIntensity={0.18} /></mesh>; })}
    <Pop k={pop(tt, 0.2)} p={[-1.25, 0.14, 0.72]}><Sph p={[0, 0.17, 0]} r={0.17} c="#6d2547" ro={0.35} /></Pop>
    <Pop k={pop(tt, 0.8)} p={k > 0 ? [x, 0.14, z] : [-0.75, 0.14, 0.72]}><Sph p={[0, 0.17, 0]} r={0.2} c="#ece2cb" ro={0.98} sc={[1, 0.85, 1]} /><Cyl p={[0, 0.34, 0]} r={0.05} h={0.08} c="#c7b48f" rough={0.9} /><Cyl p={[0, 0.3, 0]} r={0.068} h={0.03} c="#7a3b1c" rough={0.7} /></Pop>
  </>; }}
  over={(tt) => <Ink tt={tt} at={1.9} txt="FREE SHINE" />} />;

// 14:00 · TELA QUE SE PARA SOLA: la tela floja se aquieta sobre la tabla y al despegarse queda dura como papel
const crispcloth: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.2, 1.5, 3.1], [0, 0.55, 0]), C([-0.3, 1.35, 2.8], [0, 0.55, 0]), 7)} set={{ warm: 0.55, spot: [0, 0.3, 0] as V, spotK: 0.5 }}
  scene={(tt) => { const a = 1 - eio(tt, 0.8, 3.2), up = eio(tt, 3.6, 4.7), n = 24, W = 3 / n; return <>
    <Box p={[0, 0.1, 0]} s={[3.5, 0.1, 1.5]} c={WOOD} r={0.78} rad={0.03} />
    <group position={[0, lerp(0.17, 1.15, up), lerp(0, -0.1, up)]} rotation={[1.5708 * up * 0.92, 0, 0]}>{Array.from({ length: n }, (_, i) => { const x = -1.5 + (i + 0.5) * W, ph = i * 0.62 + tt * 3.4, y = a * 0.13 * Math.sin(ph), sl = a * 0.13 * 0.62 / W * Math.cos(ph); return <mesh key={i} position={[x, y + 0.02, 0]} rotation={[0, 0, Math.atan(sl)]} castShadow><boxGeometry args={[W * Math.sqrt(1 + sl * sl) + 0.01, 0.012, 1.2]} /><meshStandardMaterial color={i % 4 < 2 ? "#3c5f90" : "#e6ded0"} roughness={0.9} /></mesh>; })}</group>
  </>; }}
  over={(tt) => <Ink tt={tt} at={4.2} txt="AS CRISP AS PAPER" />} />;

// 14:32 · EL PELO QUE LLEGA AL PISO: el peine baja y cada mechón deja de ondear; la luz corre por la melena
const longhair: F = ({ t, h }) => { const S0 = 22, N = 22; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.25, 1.4, 3.1], [0, 1.2, 0]), C([-0.3, 1.3, 2.8], [0, 1.2, 0]), 7)} set={{ warm: 0.45, spot: [0, 1, 0] as V, spotK: 0.7 }}
  scene={(tt) => { const c = eio(tt, 0.9, dur(h) - 1.3), yc = lerp(3.0, 0.2, c); return <>
    {Array.from({ length: S0 }, (_, s) => { const x = -0.82 + s * 0.078; return <group key={s}>{Array.from({ length: N }, (_, j) => { const y = 3.0 - (j + 0.5) * 0.135, f = y > yc ? 0 : 1, dx = f * 0.1 * Math.sin(j * 0.75 + s * 1.3 + tt * 2.2), gl = Math.exp(-((y - (yc + 0.1)) ** 2) * 18); return <mesh key={j} position={[x + dx, y, 0.06 * Math.sin(s * 2.1)]} rotation={[0, 0, f * 0.26 * Math.cos(j * 0.75 + s * 1.3 + tt * 2.2)]}><cylinderGeometry args={[0.038, 0.038, 0.15, 6]} /><meshStandardMaterial color="#151311" roughness={0.3 - 0.1 * (1 - f)} emissive="#7b6a55" emissiveIntensity={gl * 0.9} /></mesh>; })}</group>; })}
    <Sph p={[0, 0.13, 0.2]} r={1.15} sc={[1.05, 0.12, 0.65]} c="#151311" ro={0.35} />
    <group position={[0, yc, 0.24]}><Box p={[0, 0.1, 0]} s={[2, 0.2, 0.08]} c="#7a2622" r={0.2} rad={0.03} />{Array.from({ length: 32 }, (_, i) => <Box key={i} p={[-0.96 + i * 0.062, -0.1, 0]} s={[0.025, 0.24, 0.05]} c="#7a2622" r={0.25} rad={0.008} />)}</group>
  </>; }}
  over={(tt) => <Ink tt={tt} at={1.8} txt="DOWN PAST THE FLOOR" y={150} />} />; };

// 15:50 · DOS VENTANAS: mis frascos en el alféizar; a la semana siguiente, la ventana de al lado también
const twowindows: F = ({ t, h }) => { const a = rel(h, 0, 5); return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 1.5, 3.9], [0, 1.08, -0.3]), C([-0.25, 1.45, 3.6], [0, 1.08, -0.3]), 8)} set={{ warm: 0.4, spot: [0, 1, 0] as V, spotK: 0.5, back: false }}
  scene={(tt) => { const L = eio(tt, a - 0.3, a + 0.8); return <>
    <Box p={[0, 1.5, -0.86]} s={[6, 3.2, 0.1]} c="#90513c" r={0.92} rad={0.02} />
    {[-1, 1].map((s, i) => <group key={s} position={[s * 1.15, 0, 0]}><mesh position={[0, 1.65, -0.8]}><planeGeometry args={[1.5, 1.7]} /><meshBasicMaterial color={i === 0 ? "#f3dfae" : col("#55606e", "#f3dfae", L)} toneMapped={false} /></mesh>
      <Box p={[0, 1.65, -0.76]} s={[0.05, 1.75, 0.05]} c="#efe9db" r={0.6} rad={0.012} /><Box p={[0, 1.65, -0.76]} s={[1.6, 0.05, 0.05]} c="#efe9db" r={0.6} rad={0.012} />
      {[-0.8, 0.8].map((x) => <Box key={x} p={[x, 1.65, -0.76]} s={[0.07, 1.82, 0.07]} c="#efe9db" r={0.6} rad={0.02} />)}<Box p={[0, 2.54, -0.76]} s={[1.68, 0.07, 0.07]} c="#efe9db" r={0.6} rad={0.02} /><Box p={[0, 0.74, -0.6]} s={[1.86, 0.08, 0.5]} c="#d8d1c2" r={0.75} rad={0.02} /></group>)}
    <Box p={[0, 0.6, 0.45]} s={[6, 0.1, 1]} c="#a06d3e" r={0.8} rad={0.03} />
    {(() => { const cl1 = eio(tt, 1.5, 3.9), mv = eio(tt, 4.3, 5.9), px = lerp(-0.75, 1.15, mv), py = 0.66 + 0.16 * Math.sin(Math.PI * mv), ja = eio(tt, 0.6, 1.2) * (1 - eio(tt, 3.6, 4.2)); return <>
      <group position={[px, py, 0.45]}><Cyl p={[0, 0.03, 0]} r={0.5} h={0.07} c="#2c2e32" rough={0.35} m={0.7} /><Cyl p={[0, 0.07, 0]} r={0.45} h={0.012} c={col("#b08a35", "#3b3f46", cl1)} rough={lerp(0.75, 0.14, cl1)} m={lerp(0, 0.8, cl1)} /><Box p={[0.82, 0.05, 0]} s={[0.66, 0.05, 0.09]} c="#1d1610" r={0.6} rad={0.02} />
        {[[-0.18, 0.1], [0.14, -0.16], [0.08, 0.2], [-0.05, -0.08]].map(([x, z], i) => <Sph key={i} p={[x, 0.08, z]} r={0.09 - i * 0.012} sc={[1, 0.08, 1]} c="#e2bd52" ro={0.25} op={1 - cl1} />)}</group>
      {ja > 0.01 && <group position={[-0.75, lerp(2.05, 1.48, ja), 0.45]} rotation={[0, 0, -1.25 * ja]}><Jar p={[0.05, 0, 0]} r={0.15} h={0.48} lvl={0.75} /></group>}
      {tt > 1.2 && tt < 3.6 && <Stream a={[-0.68, 1.4, 0.45]} b={[-0.75, 0.76, 0.45]} t={tt} n={10} />}
    </>; })()}
    {[0, 1, 2].map((i) => <Pop key={i} k={pop(tt, 0.5 + i * 0.45)} p={[-1.62 + i * 0.47, 0.78, -0.55]}><Jar p={[0, 0, 0]} r={0.15} h={0.48} lvl={0.8} /></Pop>)}
    <Pop k={pop(tt, a + 0.35)} p={[1.15, 0.78, -0.55]}><Jar p={[0, 0, 0]} r={0.15} h={0.48} lvl={0.8} /></Pop>
  </>; }}
  over={(tt) => <Ink tt={tt} at={a + 0.2} txt="THE NEXT WEEK" />} />; };

// 16:25 · EL DÍA DEL FRASCO: la rueda gira y el frasco se va vaciando en la olla, la palangana, el banco y las plantas
const dayjar: F = ({ t, h }) => { const seq = (i: number) => 0.8 + i * ((dur(h) - 2.6) / 4); return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 2.1, 3.3], [0, 0.3, 0]), C([-0.35, 2.0, 3.0], [0, 0.3, 0]), 9)} set={{ warm: 0.45, spot: [0, 0.3, 0] as V, spotK: 0.6 }}
  scene={(tt) => { let lv = 0.92; for (let i = 0; i < 4; i++) lv -= 0.23 * eio(tt, seq(i) + 0.45, seq(i) + 1.15); const flip = eio(tt, seq(4), seq(4) + 0.7), step = [0, 1, 2, 3].reduce((a, i) => a + eio(tt, seq(i) - 0.45, seq(i) + 0.1), 0), rot = -1.5708 * step; return <>
    <group rotation={[0, rot, 0]} position={[0, 0.06, 0]}><Cyl p={[0, 0.02, 0]} r={1.75} h={0.05} c="#8a6239" rough={0.65} />
      <group position={[0, 0.04, 1.28]}><Open p={[0, 0, 0]} r={0.38} h={0.34} c="#51555d" m={0.7} ro={0.3} /><Sph p={[0.05, 0.3, 0]} r={0.12} c="#e0792f" sc={[1.7, 0.7, 0.7]} ro={0.5} /></group>
      <group position={[1.28, 0.04, 0]}><Open p={[0, 0, 0]} r={0.4} r2={0.32} h={0.2} c="#3e7ea1" ro={0.4} /><Cyl p={[0, 0.2, 0]} r={0.28} h={0.03} c="#e9e2d0" rough={0.25} /></group>
      <group position={[0, 0.04, -1.28]}><Box p={[0, 0.25, 0]} s={[0.9, 0.08, 0.34]} c="#b4895a" r={0.8} rad={0.02} />{[-0.36, 0.36].map((x) => <Box key={x} p={[x, 0.11, 0]} s={[0.08, 0.22, 0.3]} c="#8b6239" r={0.8} rad={0.02} />)}</group>
      <group position={[-1.28, 0.04, 0]}><Open p={[0, 0, 0]} r={0.2} r2={0.15} h={0.26} c="#8e4d2c" ro={0.8} />{Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0.1 * Math.cos(i * 0.9), 0.5, 0.1 * Math.sin(i * 0.9)]} rotation={[0.4 * Math.sin(i * 2), i, 0.4 * Math.cos(i * 2)]}><coneGeometry args={[0.09, 0.56, 8]} /><meshStandardMaterial color="#4f8a3e" roughness={0.65} /></mesh>)}</group>
    </group>
    <group position={[0, 0.1 + 0.34 * flip, 0]} rotation={[3.1416 * flip, 0, 0]}><Jar p={[0, flip ? -0.32 * flip : 0, 0]} r={0.28} h={0.72} lvl={Math.max(0, lv * (1 - flip))} /></group>
    {[0, 1, 2, 3].map((i) => tt > seq(i) + 0.45 && tt < seq(i) + 1.15 ? <Stream key={i} a={[0, 0.84, 0.28]} b={[0, 0.4, 1.2]} t={tt} n={12} r={0.028} /> : null)}
  </>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="BY BEDTIME, EMPTY AND CLEAN" />} />; };

// 17:48 · LA CUBETERA: se llena de a una, se congela y los cubos saltan a la bolsa
const icetray: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 1.8, 2.7], [0.1, 0.2, 0]), C([-0.3, 1.7, 2.4], [0.1, 0.2, 0]), 7)} set={{ warm: 0.3, spot: [0, 0.2, 0] as V, spotK: 0.5 }}
  scene={(tt) => { const fr = eio(tt, 2.6, 3.5), cells = Array.from({ length: 12 }, (_, i) => [-1.25 + (i % 6) * 0.42, -0.25 + Math.floor(i / 6) * 0.5] as [number, number]); return <>
    <Box p={[-0.2, 0.07, 0]} s={[2.75, 0.1, 1.15]} c="#d9e3ea" r={0.35} rad={0.03} />
    {cells.map(([x, z], i) => { const a = 0.4 + i * 0.17, f = eio(tt, a, a + 0.35), j = 3.7 + i * 0.13, u = eio(tt, j, j + 0.5); return <group key={i}>
      {f > 0.02 && u < 0.02 && <Box p={[x, 0.09 + 0.05 * f, z]} s={[0.36, 0.08 * f + 0.02, 0.42]} c={col(MILK, "#f7fbff", fr)} r={lerp(0.25, 0.5, fr)} rad={0.008} />}
      {u >= 0.02 && <group position={[lerp(x, 1.55, u), 0.2 + 0.85 * Math.sin(Math.PI * u) + 0.05 * (1 - u), lerp(z, 0.08, u)]} rotation={[u * 2, u * 3, 0]}><Box p={[0, 0, 0]} s={[0.26, 0.2, 0.3]} c="#f7fbff" r={0.45} rad={0.03} /></group>}</group>; })}
    <mesh position={[1.55, 0.42, 0.08]}><boxGeometry args={[0.85, 0.74, 0.75]} /><meshPhysicalMaterial color="#e8f2f7" transparent opacity={0.22} roughness={0.15} depthWrite={false} /></mesh>
  </>; }}
  over={(tt) => <Ink tt={tt} at={3.8} txt="GOOD FOR ONE MONTH" />} />;

// 19:05 · EL LAGO QUE GIRA: casitas alrededor; las cañerías se encienden y las manchas rojas se abren desde la orilla
const redlake: F = ({ t, h }) => { const n = 46; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.25, 3.2, 3.0], [0, 0.1, 0]), C([-0.45, 2.75, 2.7], [0, 0.1, 0]), 9)} set={{ warm: 0.4, spot: [0, 0.1, 0] as V, spotK: 0.3, back: false }}
  scene={(tt) => { const f = eio(tt, 1.6, dur(h) - 1.1); return <>
    <Box p={[0, 0.09, 0]} s={[6.8, 0.1, 4.6]} c="#6d7f4e" r={0.96} rad={0.03} />
    <Cyl p={[0, 0.145, 0]} r={1.75} h={0.02} c={col("#2d6d94", "#35566a", f)} rough={0.12} />
    {Array.from({ length: n }, (_, i) => { const a = i / n * 6.283 + rnd(i) * 0.08, R = 2.1 + rnd(i + 3) * 0.2, X = R * Math.cos(a), Z = R * Math.sin(a), on = eio(tt, 0.6 + i * 0.03, 1.2 + i * 0.03); return <group key={i}><Box p={[X, 0.21, Z]} s={[0.14, 0.14, 0.12]} c="#ddd1b8" r={0.8} rad={0.012} /><mesh position={[1.9 * Math.cos(a), 0.145, 1.9 * Math.sin(a)]} rotation={[-1.5708, 0, -a]}><planeGeometry args={[0.42, 0.02]} /><meshBasicMaterial color="#f6c35f" transparent opacity={on * (0.5 + 0.4 * Math.sin(tt * 4 + i))} toneMapped={false} depthWrite={false} /></mesh></group>; })}
    {Array.from({ length: 36 }, (_, i) => { const a = i * 2.4, r = 0.45 + 1.15 * Math.sqrt(rnd(i)), k = eio(f, 0.05 + 0.55 * (1 - r / 1.7), 0.5 + 0.5 * (1 - r / 1.7)); return k < 0.02 ? null : <mesh key={i} position={[r * Math.cos(a), 0.158 + i * 0.0004, r * Math.sin(a)]} rotation={[-1.5708, 0, i]} scale={[k, k * (0.6 + 0.4 * rnd(i + 5)), 1]}><circleGeometry args={[0.3 + 0.22 * rnd(i + 2), 24]} /><meshStandardMaterial color="#9c2d24" roughness={0.45} transparent opacity={0.82} depthWrite={false} /></mesh>; })}
  </>; }}
  over={(tt) => <Ink tt={tt} at={3.1} txt="THE LAKE STARTED TO TURN" />} />; };

// 19:52 · CIEN MILLONES DE CUENCOS: la cámara sube sobre una ciudad sin fin; cada ventana manda su hilo blanco al mismo río
const milliondrains: F = ({ t, h }) => { const n = 72; const G = useMemo(() => { const g = new THREE.InstancedMesh(new THREE.BoxGeometry(0.13, 0.17, 0.13), new THREE.MeshStandardMaterial({ color: "#d8d0bf", roughness: 0.85 }), n * n), M = new THREE.Matrix4(); for (let i = 0; i < n * n; i++) { const x = (i % n) - n / 2, z = Math.floor(i / n) - n / 2; M.makeScale(1, 0.7 + 1.4 * rnd(i + 2), 1); M.setPosition(x * 0.25 + (Math.abs(x * 0.25) < 0.42 ? (x > 0 ? 0.42 : -0.42) : 0), 0.18, z * 0.25); g.setMatrixAt(i, M); } g.instanceMatrix.needsUpdate = true; return g; }, []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 0.72, 1.85], [0, 0.18, -0.2]), C([0.05, 5.8, 5.6], [0, 0.05, -0.7]), dur(h))} set={{ warm: 0.05, spot: [0, 0.1, 0] as V, spotK: 0.5, back: false, bg: "#1a2133" }}
    scene={(tt) => <>
      <Box p={[0, 0.07, -0.5]} s={[22, 0.06, 22]} c="#3b3f46" r={0.95} rad={0.02} />
      <Box p={[0, 0.105, -0.5]} s={[0.55, 0.02, 22]} c="#e5e1d0" r={0.25} rad={0.008} />
      <primitive object={G} />
      {Array.from({ length: 70 }, (_, i) => { const s = i % 2 ? 1 : -1, z = (rnd(i) - 0.5) * 16 - 0.5, X0 = s * (0.5 + rnd(i + 3) * 4.2), u = (tt * 0.45 + rnd(i + 9)) % 1; return <Sph key={i} p={[lerp(X0, s * 0.12, u), 0.4 - 0.25 * u, z]} r={0.045} c="#fff" e="#ffffff" ei={0.9} />; })}
    </>}
    over={(tt) => <Ink tt={tt} at={3} txt="100,000,000 BOWLS A DAY" col="#ffe6b0" />} />; };

// 20:29 · RÍO ABAJO: el agua clara pasa de pueblo en pueblo y cada uno se enciende
const downstream: F = ({ t, h }) => { const path = useMemo(() => new THREE.CatmullRomCurve3([[-5, 0, -3], [-2.9, 0, -2.2], [-1.4, 0, -0.2], [-0.3, 0, -1.2], [1.3, 0, 0.3], [2.6, 0, -0.6], [5, 0, 1.1]].map((a) => new THREE.Vector3(a[0], a[1], a[2]))), []), geo = useMemo(() => new THREE.TubeGeometry(path, 240, 0.25, 14, false), [path]), v = [0.18, 0.34, 0.5, 0.66, 0.82];
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([-1.4, 1.9, 2.0], [-1, 0.1, -0.7]), C([1.6, 2.15, 2.5], [1.1, 0.1, -0.2]), dur(h))} set={{ warm: 0.5, spot: [0, 0.1, 0] as V, spotK: 0.3, back: false }}
    scene={(tt) => { const adv = eio(tt, 0.6, dur(h) - 1.1); return <>
      <Box p={[0, 0.09, 0]} s={[12, 0.1, 7]} c="#6f8250" r={0.96} rad={0.03} />
      <mesh geometry={geo} position={[0, 0.145, 0]} scale={[1, 0.08, 1]}><meshStandardMaterial color="#5fb0c9" roughness={0.1} /></mesh>
      {v.map((u, i) => { const P = path.getPoint(u), on = eio(adv, u - 0.1, u + 0.02); return <group key={i} position={[P.x, 0.14, P.z - 0.72]}>{Array.from({ length: 5 }, (_, j) => <group key={j} position={[-0.42 + j * 0.2, 0, 0.14 * Math.sin(j * 2.4)]}><Box p={[0, 0.08, 0]} s={[0.15, 0.16, 0.14]} c={col("#a39985", "#f2e6c8", on)} r={0.85} e="#ffc672" ei={0.25 * on} rad={0.012} /><mesh position={[0, 0.21, 0]} rotation={[0, 0.785, 0]}><coneGeometry args={[0.15, 0.13, 4]} /><meshStandardMaterial color="#553528" roughness={0.8} /></mesh></group>)}</group>; })}
      {(() => { const P = path.getPoint(cl(adv)); return <Sph p={[P.x, 0.23, P.z]} r={0.12} c="#ffffff" e="#fff4d8" ei={1.1} />; })()}
    </>; }}
    over={(tt) => <Ink tt={tt} at={2.6} txt="IT BELONGS TO EVERYONE DOWNSTREAM" size={70} />} />; };

// CUADRO 0: la miniatura sin texto ni flecha: el cuenco vuelca el agua blanca a la pileta y ella frena con la mano abierta
export const Cover0: React.FC = () => <KSet0 cam={C([0.0, 2.22, 3.0], [0.05, 1.92, 0.0])} warm={0.6} spot={[0, 0.7, 0] as V} spotK={0.8}>
  <Sachi p={PZ.stand} t={0.4} x={0.1} z={-0.75} rotY={0} s={S * 3.6} expr="feliz" />
  <group position={[0, 1.0, 0]}>
  <Box p={[0, 0.17, 1.15]} s={[4.6, 0.26, 1.0]} c={STEEL} r={0.25} m={0.85} rad={0.04} />
  <group position={[-1.0, 1.28, 0.75]} rotation={[0, 0, -1.0]}><Bowl p={[0, 0, 0]} s={4.2} c="#c6ccd2" fill="#f3efe2" /></group>
  <Cyl p={[-0.5, 0.78, 0.82]} r={0.12} r2={0.2} h={1.16} c="#f3efe6" rough={0.25} />
  <Hand p={[0.95, 1.05, 1.0]} rot={[0, -1.5708, -1.5708]} s={1.6} />
</group>
</KSet0>;

export const ALL: Record<string, F> = { whitewater, spoilsun, twotothree, littlecarry, bitterlift, bambooshed, twocauli, knockfish, oilgrab, basinlet, medome, kettleskin, tuesdaypot, clingspoon, nightcup, sinkwindow, shinelayers, bootsoff, branbag, crispcloth, longhair, twowindows, dayjar, icetray, redlake, milliondrains, downstream };
