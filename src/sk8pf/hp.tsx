// sk8pf · el arroz lavado: 25 componentes únicos, uno por idea (registro en D:/rtmp/premium8n_sachiko_COMPONENTES.md).
import React, { useMemo } from "react";
import * as THREE from "three";
import { F, Hero, C, lerp, pop, Pop, Ink, cardTex, Ring, cl, eio, orbita, Box, Cyl, AMB, V } from "./hk";
import { Board, Pot, Glass, Dish, Burner, col, rnd, STEEL } from "./hpk";

const RED = "#ff8a7a", GRN = "#bfe08a";
const DK = { back: false, bg: "#2a2018" };
const RICE = "#fbf7ea", SKIN = "#dcae88", WTR = "#4a94c4";
type A = [number, number, number];
const Cm = (d: number, a: A, b: A, at: V) => (tt: number) => orbita(tt, C(a, at), C(b, at), d);
const Card: React.FC<{ p: V; rot?: V; w: number; h: number; map: THREE.Texture }> = ({ p, rot = [0, 0, 0], w, h, map }) =>
  <mesh position={p} rotation={rot}><planeGeometry args={[w, h]} /><meshBasicMaterial map={map} toneMapped={false} side={THREE.DoubleSide} /></mesh>;
const Soft: React.FC<{ p: V; r: number; c: string; op: number }> = ({ p, r, c, op }) =>
  <mesh position={p}><sphereGeometry args={[r, 12, 10]} /><meshStandardMaterial color={c} transparent opacity={op} depthWrite={false} roughness={0.9} /></mesh>;
const Grain: React.FC<{ p: V; rot?: V; s?: number; c?: string }> = ({ p, rot = [0, 0, 0], s = 1, c = RICE }) =>
  <mesh position={p} rotation={rot} scale={s}><capsuleGeometry args={[0.018, 0.05, 4, 8]} /><meshStandardMaterial color={c} roughness={0.5} /></mesh>;
// colchón de arroz: disco blanco cubierto de granos
const RiceBed: React.FC<{ p: V; r?: number; n?: number; c?: string; base?: string }> = ({ p, r = 0.3, n = 90, c = RICE, base = "#e9e3d2" }) =>
  <group position={p}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[r, 40]} /><meshStandardMaterial color={base} roughness={0.8} /></mesh>
    {Array.from({ length: n }, (_, i) => { const a = i * 2.39996, R = r * 0.97 * Math.sqrt((i + 0.5) / n); return <Grain key={i} p={[R * Math.cos(a), 0.012, R * Math.sin(a)]} rot={[Math.PI / 2 + 0.25 * rnd(i), 0, i * 1.7]} c={c} />; })}
  </group>;
const Paddle: React.FC<{ p: V; rot?: V; s?: number }> = ({ p, rot = [0, 0, 0], s = 1 }) =>
  <group position={p} rotation={rot} scale={s}>
    <mesh scale={[1, 1.25, 0.14]} castShadow><sphereGeometry args={[0.13, 22, 14]} /><meshStandardMaterial color="#e2c498" roughness={0.55} /></mesh>
    <Box p={[0, 0.34, 0]} s={[0.07, 0.42, 0.024]} c="#d8b888" r={0.6} rad={0.01} />
  </group>;

// 0:17 · EL PEGOTE: la pala sube y el arroz se estira en hilos
export const F_glue: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={Cm(8, [0.2, 1.22, 1.72], [-0.22, 1.14, 1.56], [0, 0.56, 0])}
  set={{ spot: [0, 0.4, 0] as V, spotK: 0.5, warm: 0.5, ...DK }}
  scene={(tt) => { const up = eio(tt, 0.8, 4.4), y0 = 0.42, y1 = lerp(0.44, 0.78, up);
    return <>
      <Pot p={[0, 0.06, 0]} s={1.3} water="#e9e3d2" lvl={0.85} />
      <RiceBed p={[0, 0.405, 0]} r={0.36} n={100} base="#d9d2bf" />
      {Array.from({ length: 11 }, (_, i) => { const x = -0.14 + i * 0.028, z = 0.06 * Math.sin(i * 2.3), u = i / 10, H = y1 - y0, sag = 0.5 + 0.5 * rnd(i); return H < 0.02 ? null : <mesh key={i} position={[x + 0.01 * Math.sin(tt * 2 + i), y0 + H / 2, z]}><cylinderGeometry args={[0.016 * (1 - 0.65 * up) * sag + 0.003, 0.024 * (1 - 0.55 * up) + 0.004, H, 8]} /><meshStandardMaterial color="#f2eddc" roughness={0.3} /></mesh>; })}
      <Paddle p={[0, y1 + 0.02, 0]} rot={[-1.45, 0, 0.1]} s={1.2} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.0} txt="A LAYER OF GLUE" col={RED} />} />;

// 2:09 · LA PAJITA: el grano seco se toma el vaso entero
export const F_drinks: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={Cm(9, [0.14, 0.76, 1.72], [-0.22, 0.7, 1.56], [0, 0.4, 0])}
  set={{ spot: [0, 0.2, 0] as V, spotK: 0.5, warm: 0.45, ...DK }}
  scene={(tt) => { const dr = eio(tt, 1.0, 6.5), S = 1 + 0.42 * dr, lv = 0.8 - 0.68 * dr;
    return <>
      <Board w={1.8} d={0.8} c="#8a6a4a" />
      <group position={[-0.38, 0.26, 0]} rotation={[0, 0, 0.12]} scale={[S, S, S]}><mesh castShadow rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.13, 0.3, 12, 24]} /><meshStandardMaterial color={col("#d9c690", "#fbf7ea", dr)} roughness={0.5} /></mesh></group>
      <Glass p={[0.46, 0.05, 0]} r={0.15} h={0.52} water={WTR} lvl={Math.max(0.04, lv)} op={0.85} />
      <mesh position={[0.04, 0.68, 0]} rotation={[0, 0, Math.PI / 2 - 0.1]}><cylinderGeometry args={[0.012, 0.012, 0.92, 10]} /><meshStandardMaterial color="#d94f42" roughness={0.45} /></mesh>
      <Cyl p={[0.48, 0.42, 0]} r={0.012} h={0.56} c="#d94f42" rough={0.45} />
      <Cyl p={[-0.4, 0.55, 0]} r={0.012} h={0.2} c="#d94f42" rough={0.45} />
      {Array.from({ length: 7 }, (_, i) => { const u = (tt * 0.8 + i / 7) % 1; return <mesh key={i} position={[lerp(0.46, -0.38, u), 0.68 + 0.04 * (u - 0.5), 0]}><sphereGeometry args={[0.01, 8, 6]} /><meshBasicMaterial color="#9fdcff" toneMapped={false} /></mesh>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.5} txt="DRY RICE IS THIRSTY" col={AMB} />} />;

// 2:24 · EL PRIMER CHORRO: entra el agua y sale el polvo blanco
export const F_grain: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={Cm(9, [0.14, 0.66, 1.62], [-0.24, 0.62, 1.46], [0, 0.36, 0])}
  set={{ spot: [0, 0.2, 0] as V, spotK: 0.55, warm: 0.35, ...DK }}
  scene={(tt) => { const f = eio(tt, 0.8, 2.4), m = eio(tt, 1.4, 5.2), stream = 1 - eio(tt, 3.4, 3.9);
    return <>
      <Board w={1.2} d={0.8} c="#7a5a3e" />
      <Glass p={[0, 0.05, 0]} r={0.36} h={0.52} water={col("#3c7ea8", "#f1ecde", m)} lvl={Math.max(0.05, 0.72 * f)} op={lerp(0.5, 0.92, m)}>
        <RiceBed p={[0, 0.11, 0]} r={0.33} n={70} />
      </Glass>
      {stream > 0.02 && <mesh position={[0, 0.82, 0]}><cylinderGeometry args={[0.022, 0.03, 0.82, 12]} /><meshStandardMaterial color="#8fcfff" roughness={0.15} transparent opacity={0.8 * stream} /></mesh>}
      {Array.from({ length: 24 }, (_, i) => { const u = (tt * 0.3 + i / 24) % 1, a = i * 1.9; return <mesh key={i} position={[0.28 * rnd(i) * Math.cos(a), 0.16 + u * 0.28, 0.28 * rnd(i) * Math.sin(a)]}><sphereGeometry args={[0.011, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={m * (1 - u)} /></mesh>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.6} txt="WHITE AND CLOUDY" col={AMB} />} />;

// 3:32 · LA GARRA: dedos sueltos giran en el arroz y dejan su rastro
export const F_claw: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={Cm(8, [0.1, 1.34, 1.06], [-0.2, 1.26, 0.96], [0, 0.22, 0])}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.45, warm: 0.5, ...DK }}
  scene={(tt) => { const a = tt * 2.3, R = 0.15, cx = R * Math.cos(a), cz = R * Math.sin(a);
    return <>
      <Board w={1.4} d={1.0} c="#8a6a4a" />
      <Dish p={[0, 0.05, 0]} s={1.9} fill="#7fb3cf" />
      <RiceBed p={[0, 0.33, 0]} r={0.36} n={110} />
      {Array.from({ length: 34 }, (_, i) => { const b = a - i * 0.14; return <mesh key={i} position={[R * Math.cos(b), 0.352, R * Math.sin(b)]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.03 - i * 0.0006, 12]} /><meshBasicMaterial color="#7fb3cf" transparent opacity={0.75 * (1 - i / 34)} depthWrite={false} /></mesh>; })}
      <group position={[cx, 0.62, cz]}>
        <mesh scale={[1, 0.6, 1]} castShadow><sphereGeometry args={[0.13, 22, 16]} /><meshStandardMaterial color={SKIN} roughness={0.6} /></mesh>
        {[0, 1, 2, 3, 4].map((i) => { const b = i * 1.257 + 0.2, x = 0.095 * Math.cos(b), z = 0.095 * Math.sin(b); return <mesh key={i} position={[x, -0.15, z]} rotation={[z * 2.4, 0, -x * 2.4]} castShadow><capsuleGeometry args={[0.03, 0.2, 6, 12]} /><meshStandardMaterial color={SKIN} roughness={0.6} /></mesh>; })}
        <mesh position={[0, 0.24, 0]}><capsuleGeometry args={[0.075, 0.3, 8, 16]} /><meshStandardMaterial color={SKIN} roughness={0.6} /></mesh>
      </group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="ABOUT 20 TIMES" col={AMB} />} />;

// 3:49 · LA PIEDRA: el molino gira, se frena y lo tachan
export const F_rain: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={Cm(9, [0.2, 0.76, 1.6], [-0.2, 0.72, 1.46], [0, 0.26, 0])}
  set={{ spot: [0, 0.2, 0] as V, spotK: 0.45, warm: 0.45, ...DK }}
  scene={(tt) => { const stop = eio(tt, 3.2, 4.6), an = tt < 4.6 ? tt * 2.2 * (1 - 0.5 * stop) : 4.6 * 2.2 * 0.5, x1 = pop(tt, 4.4, 7, 0.45), x2 = pop(tt, 4.7, 7, 0.45);
    return <>
      <Board w={1.3} d={0.9} c="#8a6a4a" />
      <Cyl p={[0, 0.12, 0]} r={0.36} h={0.14} c="#8f8c84" rough={0.85} />
      <group position={[0, 0.27, 0]} rotation={[0, an, 0]}>
        <Cyl p={[0, 0, 0]} r={0.34} h={0.15} c="#a5a198" rough={0.82} />
        <Cyl p={[0.26, 0.15, 0]} r={0.022} h={0.22} c="#6e4a2a" rough={0.7} />
        <mesh position={[0, 0.0755, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.08, 24]} /><meshStandardMaterial color="#4c4a44" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      </group>
      {Array.from({ length: 34 }, (_, i) => <Grain key={i} p={[0.4 * Math.cos(i * 0.9) * (0.92 + 0.14 * rnd(i)), 0.066, 0.4 * Math.sin(i * 0.9) * (0.92 + 0.14 * rnd(i))]} rot={[Math.PI / 2, 0, i * 2.1]} />)}
      {[1, -1].map((d, i) => <Pop key={d} k={i ? x2 : x1} p={[0, 0.42, 0.42]} rot={[-0.28, 0, d * 0.78]}><Box p={[0, 0, 0]} s={[0.82, 0.075, 0.02]} c="#d8321f" r={0.4} rad={0.008} /></Pop>)}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.5} txt="YOU ARE NOT GRINDING" col={RED} />} />;

// 4:09 · LA GRIETA: la prensa baja, el grano gigante se raja y pierde almidón
export const F_crack: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={Cm(9, [0.16, 0.66, 1.44], [-0.22, 0.62, 1.3], [0, 0.32, 0])}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.5, warm: 0.4, ...DK }}
  scene={(tt) => { const dn = eio(tt, 0.8, 2.3), cr = eio(tt, 2.3, 3.0), ooze = eio(tt, 3.0, 6.5), z = [[-0.02, 0.4], [0.03, 0.34], [-0.03, 0.28], [0.04, 0.23], [0.0, 0.17]];
    return <>
      <Board w={1.3} d={0.8} c="#8a6a4a" />
      <mesh position={[0, 0.27, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><capsuleGeometry args={[0.18, 0.52, 14, 28]} /><meshStandardMaterial color="#f3ecd8" roughness={0.42} /></mesh>
      <Box p={[0, lerp(1.0, 0.525, dn), 0]} s={[0.7, 0.1, 0.42]} c="#4a4c52" m={0.7} r={0.35} rad={0.016} />
      <Cyl p={[0, lerp(1.4, 0.93, dn), 0]} r={0.04} h={0.72} c={STEEL} m={0.9} rough={0.25} />
      {cr > 0.02 && z.slice(1).map((b, i) => { const a = z[i], k = cl(cr * 4 - i), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) * k; return <mesh key={i} position={[a[0] + dx * k / 2, a[1] + dy * k / 2, 0.178]} rotation={[0, 0, Math.atan2(dy, dx) - Math.PI / 2]}><cylinderGeometry args={[0.007, 0.007, L, 6]} /><meshBasicMaterial color="#3a2f26" /></mesh>; })}
      {Array.from({ length: 16 }, (_, i) => { const u = cl(ooze * 1.7 - i * 0.05); return u <= 0 ? null : <mesh key={i} position={[0.1 * Math.sin(i * 2.3) * u, lerp(0.17, 0.075, u), 0.2 + 0.1 * u]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.03 + 0.04 * rnd(i), 12, 10]} /><meshPhysicalMaterial color="#fffdf2" roughness={0.12} clearcoat={1} /></mesh>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="A CRACKED GRAIN LEAKS" col={RED} />} />;

// 5:29 · LOS DEDOS A TRAVÉS: la leche se aclara hasta ver la mano
export const F_tea: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={Cm(9, [0.1, 0.62, 1.56], [-0.2, 0.58, 1.42], [0, 0.38, 0])}
  set={{ spot: [0, 0.2, 0] as V, spotK: 0.55, warm: 0.3, ...DK }}
  scene={(tt) => { const c = eio(tt, 0.8, 6.2);
    return <>
      <Board w={1.2} d={0.8} c="#7a5a3e" />
      <Glass p={[0, 0.05, 0]} r={0.36} h={0.58} water={col("#f4f0e6", "#b89a4a", c)} lvl={0.8} op={lerp(0.99, 0.42, c)}>
        <RiceBed p={[0, 0.11, 0]} r={0.33} n={70} />
        {[-0.15, -0.05, 0.05, 0.15].map((x, i) => <mesh key={x} position={[x, 0.3 + 0.012 * i, 0]} rotation={[0, 0, 0.05 * (x * 10)]}><capsuleGeometry args={[0.036, 0.16 - 0.02 * Math.abs(i - 1.5), 8, 14]} /><meshStandardMaterial color={SKIN} roughness={0.6} /></mesh>)}
        <mesh position={[0, 0.5, 0]} scale={[1.25, 0.8, 0.5]}><sphereGeometry args={[0.2, 22, 16]} /><meshStandardMaterial color={SKIN} roughness={0.6} /></mesh>
      </Glass>
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.4} txt="SEE YOUR FINGERS" col={GRN} />} />;

// 6:39 · EL GRANO FORTIFICADO: las pintitas de color se van por el desagüe
export const F_enrich: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={Cm(9, [0.12, 1.0, 1.44], [-0.2, 0.92, 1.3], [0, 0.26, 0])}
  set={{ spot: [0, 0, 0] as V, spotK: 0.45, warm: 0.35, ...DK }}
  scene={(tt) => { const cols = ["#e2483a", "#f0b92e", "#4aa8e0", "#62c05a"];
    return <>
      <Cyl p={[0, 0.03, 0]} r={0.86} h={0.04} c="#b4bac0" m={0.8} rough={0.3} />
      <mesh position={[0.46, 0.052, 0.2]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.1, 28]} /><meshStandardMaterial color="#1a1a1c" roughness={0.5} /></mesh>
      <mesh position={[-0.12, 0.32, 0]} rotation={[0, 0, Math.PI / 2 + 0.1]} castShadow><capsuleGeometry args={[0.15, 0.42, 12, 26]} /><meshStandardMaterial color="#f5eeda" roughness={0.45} /></mesh>
      <mesh position={[-0.12, 0.98, 0]}><cylinderGeometry args={[0.03, 0.038, 0.98, 12]} /><meshStandardMaterial color="#8fcfff" roughness={0.15} transparent opacity={0.65 * eio(tt, 0.3, 0.9)} /></mesh>
      {Array.from({ length: 34 }, (_, i) => { const ang = i * 2.4, lx = -0.38 + 0.52 * ((i * 0.618) % 1), st = 1.0 + rnd(i + 2) * 4.0, u = eio(tt, st, st + 1.5); const y0 = 0.32 + 0.155 * Math.sin(ang), z0 = 0.155 * Math.cos(ang), sp = u * 7, R = 0.08 + 0.3 * (1 - u); const x = lerp(lx, 0.46 + R * Math.cos(sp), u), z = lerp(z0, 0.2 + R * Math.sin(sp), u), y = lerp(y0, 0.066, cl(u * 2.4)); return u > 0.96 ? null : <mesh key={i} position={[x, y, z]}><sphereGeometry args={[0.019, 10, 8]} /><meshBasicMaterial color={cols[i % 4]} toneMapped={false} /></mesh>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="DOWN THE SINK" col={RED} />} />;

// 7:14 · EL ARROZAL EN CORTE: puntos violetas suben del barro a la espiga
export const F_arsenic: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={Cm(9, [0.2, 0.84, 2.62], [-0.2, 0.8, 2.42], [0, 0.66, 0])}
  set={{ spot: [0, 0.4, 0] as V, spotK: 0.45, warm: 0.3, ...DK }}
  scene={(tt) => <>
    <Box p={[0, 0.17, 0]} s={[1.9, 0.34, 0.5]} c="#4a3220" r={0.95} rad={0.012} />
    <Box p={[0, 0.44, 0]} s={[1.9, 0.2, 0.5]} c="#3e86ac" r={0.2} rad={0.012} op={0.82} />
    {[-0.55, 0, 0.55].map((x, n) => <group key={x} position={[x, 0, 0]}>
      <Cyl p={[0, 0.72, 0.26]} r={0.016} h={0.9} c="#79a84a" rough={0.7} />
      {[-1, 1].map((d) => <group key={d} position={[0, 0.72, 0.26]} rotation={[0, 0, d * 0.5]}><Box p={[0, 0.22, 0]} s={[0.03, 0.44, 0.006]} c="#6d9a42" r={0.7} rad={0.002} /></group>)}
      {Array.from({ length: 9 }, (_, i) => <Grain key={i} p={[0.05 * ((i % 2) * 2 - 1), 1.06 + i * 0.022, 0.26]} rot={[0, 0, (i % 2) * 2 * 0.5 - 0.5]} c="#d9b95a" />)}
      {Array.from({ length: 11 }, (_, i) => { const u = (tt * 0.2 + i / 11 + n * 0.3) % 1, y = lerp(0.08, 1.1, u), s = eio(tt, 0.8, 1.8); return <mesh key={i} position={[0.05 * Math.sin(i + n) * (1 - u), y, 0.27]} scale={0.3 + 0.7 * s}><sphereGeometry args={[0.024, 10, 8]} /><meshBasicMaterial color="#b65cff" toneMapped={false} transparent opacity={s} /></mesh>; })}
    </group>)}
  </>}
  over={(tt) => <Ink tt={tt} at={2.5} txt="FROM SOIL AND WATER" col={AMB} y={120} />} />;

// 8:32 · EL CUARTO DE MÁS: una taza de arroz, una y un cuarto de agua
export const F_ratio: F = ({ t, h }) => { const a = useMemo(() => cardTex(["1 CUP"], { bg: "#fff4dc", fg: "#2a2018", w: 260, h: 100 }), []), b = useMemo(() => cardTex(["1¼ CUPS"], { bg: "#2c78a8", fg: "#fff4dc", w: 260, h: 100 }), []);
  return <Hero t={t} h={h} mode="split" cam={Cm(10, [0.14, 0.78, 1.84], [-0.2, 0.72, 1.68], [0, 0.42, 0])}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.55, warm: 0.3, ...DK }}
    scene={(tt) => { const r = eio(tt, 0.4, 1.8), w1 = eio(tt, 2.0, 3.6), w2 = eio(tt, 4.2, 5.2), TOP = 0.4;
      return <>
        <Board w={1.5} d={0.8} c="#7a5a3e" />
        <Glass p={[-0.4, 0.05, 0]} r={0.24} h={0.68} water="#f4efe0" lvl={Math.max(0.03, r * TOP / 0.68)} op={0.98} />
        <Glass p={[0.4, 0.05, 0]} r={0.24} h={0.68} water={WTR} lvl={Math.max(0.03, (w1 + 0.25 * w2) * TOP / 0.68)} op={0.85} />
        {[0, 1, 2, 3, 4].map((i) => { const y = 0.08 + (i + 1) * TOP / 4; return <Box key={i} p={[0.4 + 0.2, y, 0.17]} s={[0.1, 0.008, 0.008]} c={i === 4 ? "#ffd27a" : "#ffffff"} r={0.4} cast={false} rad={0.001} />; })}
        <Ring p={[0.4, 0.08 + 1.25 * TOP, 0]} r={0.27} k={eio(tt, 5.0, 5.7)} col="#ffd27a" />
        <Pop k={pop(tt, 1.6)} p={[-0.4, 0.16, 0.36]}><Card p={[0, 0, 0]} rot={[-0.3, 0, 0]} w={0.36} h={0.14} map={a} /></Pop>
        <Pop k={pop(tt, 5.2)} p={[0.4, 0.16, 0.36]}><Card p={[0, 0, 0]} rot={[-0.3, 0, 0]} w={0.36} h={0.14} map={b} /></Pop>
      </>; }}
    over={(tt) => <Ink tt={tt} at={4.4} txt="ONE AND A QUARTER" col={AMB} y={120} />} />;
};

// 9:09 · EL NUDILLO: un dedo apoyado y el agua llega justo a la coyuntura
export const F_knuckle: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={Cm(9, [0.14, 0.68, 1.5], [-0.2, 0.64, 1.36], [0, 0.42, 0])}
  set={{ spot: [0, 0.3, 0] as V, spotK: 0.55, warm: 0.3, ...DK }}
  scene={(tt) => { const w = eio(tt, 1.6, 5.0), dn = eio(tt, 0.4, 1.4), Yt = 0.25, H = 0.62, ytop = lerp(0.03 + 0.28, 0.03 + 0.66 * H, 0);
    return <>
      <Board w={1.2} d={0.8} c="#7a5a3e" />
      <Glass p={[0, 0.05, 0]} r={0.34} h={H} water={WTR} lvl={lerp(0.32, 0.665, w)} op={0.62}>
        <RiceBed p={[0, Yt, 0]} r={0.32} n={70} />
        <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.32, 0.32, 0.22, 36]} /><meshStandardMaterial color="#efe9d8" roughness={0.75} /></mesh>
        <group position={[0, lerp(0.34, 0, dn), 0]}>
          <mesh position={[0, Yt + 0.075, 0]}><capsuleGeometry args={[0.05, 0.1, 8, 16]} /><meshStandardMaterial color={SKIN} roughness={0.55} /></mesh>
          <mesh position={[0, Yt + 0.17, 0]} scale={[1.08, 0.5, 1.08]}><sphereGeometry args={[0.05, 16, 12]} /><meshStandardMaterial color="#c8966c" roughness={0.6} /></mesh>
          <mesh position={[0, Yt + 0.42, 0]}><capsuleGeometry args={[0.052, 0.4, 8, 16]} /><meshStandardMaterial color={SKIN} roughness={0.55} /></mesh>
        </group>
      </Glass>
      <Ring p={[0, 0.05 + Yt + 0.17, 0]} r={0.11} k={eio(tt, 4.6, 5.6)} col="#ffd27a" />
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.0} txt="THE FIRST KNUCKLE" col={AMB} />} />;

// 10:29 · EL GRANO ABIERTO: blando afuera, tiza adentro, y el agua que llega al centro
export const F_center: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={Cm(10, [0.06, 0.46, 1.5], [-0.14, 0.44, 1.38], [0, 0.42, 0])}
  set={{ spot: [0, 0.4, 0] as V, spotK: 0.4, warm: 0.25, ...DK }}
  scene={(tt) => { const so = eio(tt, 5.0, 8.2), rc = lerp(0.24, 0.015, so);
    const disc = (r: number, c: string, z: number) => <mesh position={[0, 0.42, z]} scale={[1.7, 1, 1]}><circleGeometry args={[r, 56]} /><meshStandardMaterial color={c} roughness={0.6} /></mesh>;
    return <>
      <Box p={[0, 0.42, -0.04]} s={[1.4, 0.72, 0.06]} c="#3a2c1e" r={0.8} rad={0.02} />
      {disc(0.32, "#efe0a8", 0)}{disc(0.24, col("#ffffff", "#f3e8bc", so), 0.002)}{disc(rc, "#ffffff", 0.004)}
      {Array.from({ length: 12 }, (_, i) => { const a = i * 0.5236, R = lerp(0.31, rc + 0.015, so); return so < 0.97 ? <mesh key={i} position={[1.7 * R * Math.cos(a), 0.42 + R * Math.sin(a), 0.01]}><sphereGeometry args={[0.017, 10, 8]} /><meshBasicMaterial color="#6cc0f0" toneMapped={false} transparent opacity={eio(tt, 4.8, 5.4)} /></mesh> : null; })}
      <Pop k={pop(tt, 1.0)} p={[0, 0.42, 0.03]}><mesh scale={[1.7, 1, 1]}><torusGeometry args={[0.26, 0.009, 8, 56]} /><meshBasicMaterial color="#e4421e" toneMapped={false} /></mesh></Pop>
    </>; }}
  over={(tt) => <Ink tt={tt} at={1.6} txt="A CHALKY BITE" col={RED} />} />;

// 10:42 · LA OLA BLANCA: los granos se vuelven blancos del borde al centro
export const F_white: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={Cm(8, [0.1, 1.62, 0.94], [-0.14, 1.54, 0.84], [0, 0.2, 0])}
  set={{ spot: [0, 0, 0] as V, spotK: 0.45, warm: 0.3, ...DK }}
  scene={(tt) => { const N = 170;
    return <>
      <Dish p={[0, 0.03, 0]} s={2.6} c="#2d3a44" fill="#39465a" />
      {Array.from({ length: N }, (_, i) => { const a = i * 2.39996, R = 0.5 * Math.sqrt((i + 0.5) / N), wv = eio(tt, 0.8 + (1 - R / 0.5) * 3.6, 1.8 + (1 - R / 0.5) * 3.6); return <Grain key={i} p={[R * Math.cos(a), 0.44, R * Math.sin(a)]} rot={[Math.PI / 2, 0, i * 1.7]} s={1.35} c={col("#a39c7c", "#ffffff", wv)} />; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="CLEAR TO WHITE" col={AMB} />} />;

// 11:50 · LA NANA: la cuna se hamaca, las notas suben, y la tapa no se mueve
export const F_song: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={Cm(9, [0.14, 0.84, 2.2], [-0.2, 0.8, 2.02], [0, 0.42, 0])}
  set={{ spot: [0, 0.2, 0] as V, spotK: 0.45, warm: 0.5, ...DK }}
  scene={(tt) => { const rock = 0.17 * Math.sin(tt * 2.1);
    return <>
      <Board w={2.3} d={1.0} c="#8a6a4a" />
      <Burner p={[0.52, 0.05, 0]} s={1} flame={0.8} t={tt} />
      <Pot p={[0.52, 0.11, 0]} s={1} water="#e9e3d2" />
      <Cyl p={[0.52, 0.44, 0]} r={0.31} h={0.03} c="#8b8f94" m={0.8} rough={0.3} />
      <Cyl p={[0.52, 0.49, 0]} r={0.035} h={0.06} c="#2c2a28" rough={0.5} />
      <group position={[-0.56, 0.25, 0]} rotation={[0, 0, rock]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.62, 32, 1, true, Math.PI, Math.PI]} /><meshStandardMaterial color="#c49a64" roughness={0.65} side={THREE.DoubleSide} /></mesh>{[-1, 1].map((d) => <mesh key={d} position={[d * 0.31, 0, 0]} rotation={[0, Math.PI / 2, 0]}><circleGeometry args={[0.2, 28, Math.PI, Math.PI]} /><meshStandardMaterial color="#a97f4e" roughness={0.65} side={THREE.DoubleSide} /></mesh>)}
        <mesh position={[-0.14, 0.0, 0]} rotation={[0, 0, 0]}><sphereGeometry args={[0.095, 20, 14]} /><meshStandardMaterial color={SKIN} roughness={0.55} /></mesh>
        <mesh position={[0.1, -0.015, 0]} scale={[1.5, 0.75, 0.82]}><sphereGeometry args={[0.13, 20, 14]} /><meshStandardMaterial color="#d9607a" roughness={0.8} /></mesh>
      </group>
      {Array.from({ length: 8 }, (_, i) => { const u = (tt * 0.2 + i / 8) % 1, x = lerp(-0.5, 0.42, u), y = 0.62 + 0.46 * Math.sin(u * 3.14) + 0.05 * Math.sin(i * 4 + tt * 1.6); return <group key={i} position={[x, y, 0.05]} rotation={[0, 0, 0.14]} scale={0.95}><mesh scale={[1.25, 0.9, 0.5]}><sphereGeometry args={[0.03, 12, 10]} /><meshStandardMaterial color="#fff2c8" roughness={0.4} /></mesh><Box p={[0.032, 0.085, 0]} s={[0.009, 0.17, 0.009]} c="#fff2c8" r={0.4} rad={0.002} />{i % 2 ? <Box p={[0.058, 0.158, 0]} s={[0.06, 0.016, 0.009]} c="#fff2c8" r={0.4} rad={0.002} /> : null}</group>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.4} txt="DO NOT LIFT THE LID" col={AMB} y={120} />} />;

// 12:44 · LAS CAPAS: mojado arriba, quemado abajo, y el vapor que se escapa
export const F_steam: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={Cm(9, [0.16, 0.72, 2.02], [-0.2, 0.68, 1.86], [0, 0.56, 0])}
  set={{ spot: [0, 0.3, 0] as V, spotK: 0.45, warm: 0.3, ...DK }}
  scene={(tt) => { const lid = eio(tt, 0.6, 1.5), bu = eio(tt, 1.6, 6.5), we = eio(tt, 2.0, 6.5), H = 0.5, y0 = 0.16, B = 0.03 + 0.19 * bu, W = 0.03 + 0.14 * we;
    return <>
      <Box p={[0, 0.12, 0]} s={[1.4, 0.04, 0.3]} c="#8f959c" m={0.7} r={0.35} rad={0.008} />
      {[-1, 1].map((d) => <Box key={d} p={[d * 0.68, 0.42, 0]} s={[0.04, 0.62, 0.3]} c="#8f959c" m={0.7} r={0.35} rad={0.008} />)}
      <Box p={[0, y0 + H / 2, 0]} s={[1.3, H, 0.28]} c="#f4efe0" r={0.75} rad={0.003} />
      <Box p={[0, y0 + B / 2, 0.003]} s={[1.3, B, 0.28]} c={col("#c8a060", "#1d1612", bu)} r={0.9} rad={0.003} />
      <Box p={[0, y0 + H - W / 2, 0.003]} s={[1.3, W, 0.28]} c="#9cc6dc" r={0.25} rad={0.003} />
      <group position={[-0.7, 0.75, 0]} rotation={[0, 0, 0.3 * lid]}><Box p={[0.7, 0, 0]} s={[1.48, 0.04, 0.34]} c="#6c7178" m={0.7} r={0.35} rad={0.012} /></group>
      {Array.from({ length: 34 }, (_, i) => { const u = (tt * 0.42 + i / 34) % 1; return <Soft key={i} p={[0.72 + 0.26 * u, 0.86 + u * 0.78 + 0.05 * Math.sin(i + tt), 0.06 * Math.sin(i * 2)]} r={0.05 + 0.07 * u} c="#ffffff" op={0.14 * (1 - u) * lid} />; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.3} txt="WET ON TOP, BURNED BELOW" col={RED} y={120} />} />;

// 13:01 · LOS ANILLOS DE SONIDO: de ondas grandes a puntitos que apenas laten
export const F_tick: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={Cm(8, [0.08, 1.56, 1.46], [-0.2, 1.46, 1.32], [0, 0.26, 0])}
  set={{ spot: [0, 0.2, 0] as V, spotK: 0.45, warm: 0.4, ...DK }}
  scene={(tt) => { const q = eio(tt, 3.2, 4.6);
    return <>
      <Burner p={[0, 0, 0]} s={1.05} flame={0.5} t={tt} />
      <Pot p={[0, 0.06, 0]} s={1.05} water="#e9e3d2" />
      <Cyl p={[0, 0.41, 0]} r={0.32} h={0.03} c="#8b8f94" m={0.8} rough={0.3} />
      {Array.from({ length: 6 }, (_, i) => { const u = (tt * 0.75 + i / 6) % 1, R = 0.36 + 0.8 * u; return <Ring key={i} p={[0, 0.03, 0]} r={R} k={(1 - q) * (1 - u) * 0.9} col="#ffd27a" />; })}
      {Array.from({ length: 12 }, (_, i) => { const a = i * 0.5236, b = Math.sin(tt * 5 + i * 1.9), k = q * (b > 0.5 ? 1 : 0.28); return <mesh key={i} position={[0.48 * Math.cos(a), 0.05, 0.48 * Math.sin(a)]} scale={Math.max(0.1, q)}><sphereGeometry args={[0.022, 12, 8]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} transparent opacity={k} /></mesh>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={1.6} txt="A VERY QUIET TICKING" col={AMB} />} />;

// 13:34 · LA CRUZ: la pala corta en cruz y da vuelta una porción
export const F_cross: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={Cm(10, [0.1, 1.46, 1.0], [-0.2, 1.36, 0.9], [0, 0.14, 0])}
  set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.45, ...DK }}
  scene={(tt) => { const c1 = eio(tt, 0.8, 1.9), c2 = eio(tt, 2.2, 3.3), fl = eio(tt, 4.2, 6.2), R = 0.56, pz = c1 < 1 ? lerp(-R, R, c1) : c2 > 0 ? 0 : R, px = c1 >= 1 ? lerp(-R, R, c2) : 0;
    return <>
      <Board w={1.5} d={1.3} c="#8a6a4a" />
      {[0, 1, 2, 3].map((i) => { const lift = i === 0 ? fl : 0, dx = [1, -1, -1, 1][i] * 0.012 * eio(tt, 3.3, 3.9), dz = [1, 1, -1, -1][i] * 0.012 * eio(tt, 3.3, 3.9); return <group key={i} position={[dx + 0.22 * Math.sin(lift * Math.PI), 0.14 + 0.32 * Math.sin(lift * Math.PI), dz + 0.22 * Math.sin(lift * Math.PI)]} rotation={[lift * Math.PI, 0, 0]}>
        <mesh castShadow><cylinderGeometry args={[R, R, 0.15, 44, 1, false, i * Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#f7f2e3" roughness={0.78} /></mesh>
      </group>; })}
      <mesh position={[0, 0.218, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2 * R * cl(c2 * 1.02 + 0.0), 0.012]} /><meshBasicMaterial color="#7a6a52" /></mesh>
      <mesh position={[0, 0.218, lerp(-R, 0, c1)]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.012, 2 * R * c1 + 0.001]} /><meshBasicMaterial color="#7a6a52" /></mesh>
      <Paddle p={[px, 0.36, pz]} rot={[0.0, 1.3, 0]} s={1.1} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={1.6} txt="CUT IN A CROSS" col={AMB} />} />;

// 15:19 · LA TOALLA: vueltas de toalla que suben por la olla hasta el moño
export const F_towel: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={Cm(9, [0.2, 0.92, 1.68], [-0.22, 0.86, 1.52], [0, 0.32, 0])}
  set={{ spot: [0, 0.2, 0] as V, spotK: 0.4, warm: 0.6 }}
  scene={(tt) => <>
    <Board w={1.4} d={1.0} c="#a68260" />
    <Pot p={[0, 0.05, 0]} s={1.15} water="#e9e3d2" />
    <Cyl p={[0, 0.43, 0]} r={0.355} h={0.03} c="#8b8f94" m={0.8} rough={0.3} />
    {Array.from({ length: 7 }, (_, i) => { const k = pop(tt, 0.7 + i * 0.55, 7, 0.55); return k < 0.03 ? null : <mesh key={i} position={[0, 0.095 + i * 0.058, 0]} rotation={[Math.PI / 2, 0, i * 0.4]} scale={[0.72 + 0.28 * k, 0.72 + 0.28 * k, 1]}><torusGeometry args={[0.36 + 0.012 * Math.sin(i * 2), 0.042, 12, 52]} /><meshStandardMaterial color={i % 2 ? "#2f5b8a" : "#f0e7d4"} roughness={0.92} /></mesh>; })}
    <Pop k={pop(tt, 4.8)} p={[0, 0.5, 0]}><mesh scale={[1, 0.34, 1]}><sphereGeometry args={[0.37, 28, 18]} /><meshStandardMaterial color="#f0e7d4" roughness={0.92} /></mesh><mesh position={[0, 0.17, 0]} scale={[1.4, 0.7, 1]}><sphereGeometry args={[0.07, 18, 14]} /><meshStandardMaterial color="#2f5b8a" roughness={0.9} /></mesh>{[-1, 1].map((d) => <mesh key={d} position={[d * 0.14, 0.18, 0]} rotation={[0, 0, d * -0.5]} scale={[1.5, 0.7, 0.45]}><sphereGeometry args={[0.08, 16, 12]} /><meshStandardMaterial color="#2f5b8a" roughness={0.9} /></mesh>)}</Pop>
  </>}
  over={(tt) => <Ink tt={tt} at={3.6} txt="WRAPPED IN A TOWEL" col={AMB} />} />;

// 15:49 · LAS TRES PAUSAS: tres botones de pausa gigantes y en el medio el fuego
export const F_pauses: F = ({ t, h }) => { const tx = useMemo(() => [["30 MIN", "BEFORE"], ["12 MIN", "ON FIRE"], ["10 MIN", "AFTER"]].map((l) => cardTex(l, { bg: "#fff4dc", fg: "#2a2018", w: 280, h: 150 })), []);
  return <Hero t={t} h={h} mode="split" cam={Cm(10, [0.14, 0.9, 2.62], [-0.18, 0.86, 2.44], [0, 0.42, 0])}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.45, warm: 0.45, ...DK }}
    scene={(tt) => <>
      <Board w={2.5} d={0.9} c="#8a6a4a" />
      {[0, 1, 2].map((i) => { const x = -0.76 + i * 0.76, k = pop(tt, 0.6 + i * 1.8, 6.5, 0.5), mid = i === 1, c = mid ? "#e0642a" : "#f2e7cf"; return <group key={i} position={[x, 0.05, 0]}>
        <Pop k={k} p={[0, 0, 0]}>
          {[-1, 1].map((d) => <Box key={d} p={[d * 0.1, 0.27, 0]} s={[0.13, 0.54, 0.14]} c={c} r={0.45} rad={0.03} />)}
          <Card p={[0, 0.0 + 0.09, 0.3]} rot={[-0.5, 0, 0]} w={0.42} h={0.225} map={tx[i]} />
        </Pop>
        {mid && Array.from({ length: 5 }, (_, j) => { const fl = 0.5 + 0.5 * Math.sin(tt * 7 + j * 1.7), s = eio(tt, 2.6, 3.2); return s < 0.05 ? null : <mesh key={j} position={[-0.2 + j * 0.1, 0.04 + 0.05 * fl, 0.13]} scale={[s, s * (1 + 0.4 * fl), s]}><coneGeometry args={[0.05, 0.12, 12]} /><meshBasicMaterial color={col("#ffb347", "#ff6a2a", fl)} toneMapped={false} /></mesh>; })}
      </group>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={5.2} txt="REALLY THREE PAUSES" col={AMB} y={120} />} />;
};

// 16:52 · LA DIVISIÓN: una vaina se parte en dos, y dos en cuatro, sobre el arroz
export const F_spores: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={Cm(10, [0.08, 1.46, 0.92], [-0.18, 1.38, 0.82], [0, 0.1, 0])}
  set={{ spot: [0, 0, 0] as V, spotK: 0.45, warm: 0.25, ...DK }}
  scene={(tt) => { const pos = (j: number): [number, number] => { const a = j * 2.39996, R = j === 0 ? 0 : 0.11 * Math.sqrt(j) + 0.02; return [R * Math.cos(a), R * Math.sin(a)]; };
    return <>
      <Cyl p={[0, 0.03, 0]} r={0.86} h={0.04} c="#efe9da" rough={0.6} />
      <RiceBed p={[0, 0.055, 0]} r={0.8} n={120} c="#fdfaf0" base="#ebe5d4" />
      {Array.from({ length: 32 }, (_, j) => { const g = j === 0 ? -1 : Math.floor(Math.log2(j)), par = j === 0 ? 0 : j - Math.pow(2, g), k = j === 0 ? 1 : eio(tt, 1.2 + g * 1.25, 2.1 + g * 1.25); if (k < 0.02) return null; const [px, pz] = pos(par), [x, z] = pos(j), wob = 1 + 0.08 * Math.sin(tt * 3 + j); return <group key={j} position={[lerp(px, x, k), 0.1, lerp(pz, z, k)]} rotation={[0, j * 1.3, 0]} scale={wob}><mesh rotation={[0, 0, Math.PI / 2]} castShadow><capsuleGeometry args={[0.042, 0.06, 6, 12]} /><meshStandardMaterial color={col("#8a9a52", "#c2a22e", cl(g / 4))} roughness={0.45} /></mesh></group>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.5} txt="THEY MULTIPLY" col={RED} size={110} />} />;

// 17:14 · EL MONTÓN SE ACHATA: de bochón a capa finita, y al frío
export const F_shallow: F = ({ t, h }) => { const c = useMemo(() => cardTex(["WITHIN", "1 HOUR"], { bg: "#2c6a9a", fg: "#ffffff", w: 280, h: 160 }), []);
  return <Hero t={t} h={h} mode="wipe" cam={Cm(9, [0.14, 1.06, 1.46], [-0.2, 0.98, 1.32], [0, 0.16, 0])}
    set={{ spot: [0, 0, 0] as V, spotK: 0.45, warm: 0.3, ...DK }}
    scene={(tt) => { const f = eio(tt, 0.9, 3.2), cold = eio(tt, 3.6, 5.8), R = lerp(0.2, 0.56, f), H = lerp(0.42, 0.06, f), cc = col(RICE, "#bfe2f6", cold);
      return <>
        <Board w={1.7} d={1.1} c="#8a6a4a" />
        <Box p={[0, 0.07, 0]} s={[1.3, 0.04, 0.96]} c="#c4cad0" m={0.75} r={0.3} rad={0.01} />
        {[[0, 0.47, 1.3, 0.03], [0, -0.47, 1.3, 0.03]].map(([x, z, w, d], i) => <Box key={i} p={[x, 0.115, z]} s={[w, 0.07, d]} c="#c4cad0" m={0.75} r={0.3} rad={0.008} />)}
        {[-1, 1].map((d) => <Box key={d} p={[d * 0.635, 0.115, 0]} s={[0.03, 0.07, 0.96]} c="#c4cad0" m={0.75} r={0.3} rad={0.008} />)}
        <mesh position={[0, 0.09 + H / 2, 0]} castShadow><cylinderGeometry args={[R * 0.82, R, H, 40]} /><meshStandardMaterial color={cc} roughness={0.8} /></mesh>
        <RiceBed p={[0, 0.095 + H, 0]} r={R * 0.8} n={70} c={cc} base={cc} />
        <Pop k={pop(tt, 5.0)} p={[0, 0.34, 0.26]}><Card p={[0, 0, 0]} rot={[-0.55, 0, 0]} w={0.42} h={0.24} map={c} /></Pop>
      </>; }}
    over={(tt) => <Ink tt={tt} at={1.8} txt="SPREAD IT THIN" col={AMB} y={120} />} />;
};

// 18:15 · EL TACHO: se abre con el pedal y el tazón se vuelca adentro
export const F_trash: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={Cm(8, [0.16, 1.12, 2.3], [-0.22, 1.08, 2.14], [0, 0.66, 0])}
  set={{ spot: [0, 0.3, 0] as V, spotK: 0.5, warm: 0.3, ...DK }}
  scene={(tt) => { const op = eio(tt, 0.8, 1.7) * (1 - eio(tt, 5.6, 6.3)), tilt = eio(tt, 2.0, 3.0) * 2.2;
    return <>
      <mesh position={[0, 0.34, 0]} castShadow><cylinderGeometry args={[0.3, 0.26, 0.66, 36, 1, true]} /><meshStandardMaterial color="#70777f" metalness={0.7} roughness={0.36} side={THREE.DoubleSide} /></mesh>
      <Cyl p={[0, 0.03, 0]} r={0.26} h={0.02} c="#3b3f44" rough={0.5} />
      <group position={[0, 0.69, -0.3]} rotation={[-1.7 * op, 0, 0]}><Cyl p={[0, 0, 0.3]} r={0.32} h={0.03} c="#8a9199" m={0.8} rough={0.3} /></group>
      <Box p={[0, 0.03, 0.3]} s={[0.14, 0.02 + 0.03 * (1 - op), 0.14]} c="#2c2a28" r={0.5} rad={0.008} />
      <group position={[-0.1, 1.02, 0.04]} rotation={[0, 0, -tilt * 0.62]}><Dish p={[0, 0, 0]} s={0.9} fill={RICE} fillK={1 - eio(tt, 3.0, 4.2)} /></group>
      {Array.from({ length: 26 }, (_, i) => { const st = 2.7 + rnd(i) * 1.5, u = eio(tt, st, st + 0.7); return u <= 0.02 || u >= 0.98 ? null : <Grain key={i} p={[0.18 - 0.2 * rnd(i + 2), lerp(0.98, 0.34, u * u), 0.1 * Math.sin(i * 2.6)]} rot={[u * 3 + i, i, u * 2]} s={1.6} />; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="A BOWL THROWN AWAY" col={RED} />} />;

// 19:55 · LA PALA MOJADA: entra en el agua y sale con gotas
export const F_glasses: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={Cm(7, [0.14, 0.82, 1.72], [-0.2, 0.78, 1.58], [0, 0.46, 0])}
  set={{ spot: [0, 0.2, 0] as V, spotK: 0.5, warm: 0.4, ...DK }}
  scene={(tt) => { const dn = eio(tt, 0.3, 1.2), up = eio(tt, 1.9, 2.9), y = lerp(lerp(0.74, 0.32, dn), 0.56, up);
    return <>
      <Board w={1.2} d={0.8} c="#8a6a4a" />
      <Glass p={[0, 0.05, 0]} r={0.3} h={0.34} water={WTR} lvl={0.82} op={0.7} />
      <Paddle p={[0, y, 0]} rot={[0, 0.4, 0.06]} s={1.1} />
      {up > 0.5 && Array.from({ length: 16 }, (_, i) => { const a = i * 2.4, r = 0.1 * rnd(i + 1); return <mesh key={i} position={[r * Math.cos(a), y + 0.14 * Math.sin(a) * rnd(i + 2), 0.02]} scale={[1, 0.8, 0.6]}><sphereGeometry args={[0.012 + 0.008 * rnd(i), 10, 8]} /><meshPhysicalMaterial color="#d8f1ff" roughness={0.04} clearcoat={1} /></mesh>; })}
      {up > 0.8 && Array.from({ length: 5 }, (_, i) => { const u = ((tt - 2.7) * 1.1 + i * 0.2) % 1; return <mesh key={i} position={[0.03 * Math.sin(i * 3), lerp(y - 0.16, 0.34, u * u), 0.02]}><sphereGeometry args={[0.012, 10, 8]} /><meshBasicMaterial color="#9fdcff" toneMapped={false} /></mesh>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.7} txt="I WET MY PADDLE" col={AMB} />} />;

// 20:45 · EL CUBITO: encima del arroz, derritiéndose despacio
export const F_ice: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={Cm(7, [0.1, 1.08, 1.0], [-0.2, 1.0, 0.92], [0, 0.32, 0])}
  set={{ spot: [0, 0.2, 0] as V, spotK: 0.5, warm: 0.4, ...DK }}
  scene={(tt) => { const dr = pop(tt, 0.3, 6.5, 0.5), m = eio(tt, 1.6, 6.6), S = lerp(1, 0.62, m);
    return <>
      <Pot p={[0, 0.06, 0]} s={1.25} water="#e9e3d2" lvl={0.85} />
      <RiceBed p={[0, 0.392, 0]} r={0.34} n={100} base="#ddd6c4" />
      <mesh position={[0, 0.408, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.09 + 0.14 * m, 32]} /><meshPhysicalMaterial color="#c6e6f8" roughness={0.06} clearcoat={1} transparent opacity={0.55 * Math.min(1, m * 4)} depthWrite={false} /></mesh>
      <group position={[0, lerp(1.0, 0.44 + 0.07 * S, dr), 0]} rotation={[0, 0.5, 0]} scale={S}><Box p={[0, 0, 0]} s={[0.17, 0.15, 0.17]} c="#d8f1fc" r={0.08} m={0.1} op={0.82} rad={0.025} /></group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={1.6} txt="A PIECE OF ICE" col={AMB} />} />;

// 21:02 · LA TAZA MOJADA: al volcarla, los granos se quedan pegados
export const F_wetcup: F = ({ t, h }) => { const c = useMemo(() => cardTex(["NOT 1 CUP"], { bg: "#c8322a", fg: "#fff4dc", w: 280, h: 100 }), []);
  return <Hero t={t} h={h} mode="wipe" cam={Cm(8, [0.16, 0.8, 1.56], [-0.2, 0.76, 1.42], [0.04, 0.42, 0])}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.5, warm: 0.4, ...DK }}
    scene={(tt) => { const tl = eio(tt, 0.7, 1.8) * 2.0;
      return <>
        <Board w={1.4} d={0.8} c="#8a6a4a" />
        <Dish p={[0.3, 0.05, 0]} s={1.4} fill={RICE} fillK={Math.max(0.05, eio(tt, 1.8, 3.4) * 0.8)} />
        <group position={[-0.08, 0.66, 0]} rotation={[0, 0, -tl]}>
          <mesh castShadow><cylinderGeometry args={[0.15, 0.14, 0.3, 32, 1, true]} /><meshStandardMaterial color="#c9ced3" metalness={0.75} roughness={0.28} side={THREE.DoubleSide} /></mesh>
          <Cyl p={[0, -0.15, 0]} r={0.14} h={0.012} c="#c9ced3" m={0.75} rough={0.3} />
          {Array.from({ length: 30 }, (_, i) => { const a = i * 2.39996 + 1.57, y = -0.12 + 0.24 * rnd(i); return <Grain key={i} p={[0.132 * Math.cos(a), y, 0.132 * Math.sin(a)]} rot={[Math.PI / 2, 0, a]} s={1.15} />; })}
        </group>
        {Array.from({ length: 22 }, (_, i) => { const st = 1.5 + rnd(i) * 1.6, u = eio(tt, st, st + 0.55); return u <= 0.02 || u >= 0.98 ? null : <Grain key={i} p={[0.26 + 0.1 * (rnd(i + 3) - 0.5), lerp(0.62, 0.26, u * u), 0.1 * Math.sin(i * 3)]} rot={[u * 3 + i, i, u]} s={1.3} />; })}
        <Pop k={pop(tt, 4.0)} p={[-0.56, 0.44, 0.1]}><Card p={[0, 0, 0]} rot={[-0.2, 0.25, 0]} w={0.36} h={0.13} map={c} /></Pop>
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.2} txt="YOUR COUNT IS WRONG" col={RED} />} />;
};

export const HP: Record<string, F> = { f_glue: F_glue, f_drinks: F_drinks, f_grain: F_grain, f_claw: F_claw, f_rain: F_rain, f_crack: F_crack, f_tea: F_tea, f_enrich: F_enrich, f_arsenic: F_arsenic, f_ratio: F_ratio, f_knuckle: F_knuckle, f_center: F_center, f_white: F_white, f_song: F_song, f_steam: F_steam, f_tick: F_tick, f_cross: F_cross, f_towel: F_towel, f_pauses: F_pauses, f_spores: F_spores, f_shallow: F_shallow, f_trash: F_trash, f_glasses: F_glasses, f_ice: F_ice, f_wetcup: F_wetcup };
