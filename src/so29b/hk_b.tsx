// so29b · los componentes ÚNICOS del video del freezer (uno por minuto; ninguno se repite en la tanda so29, ver D:/rtmp/so29_COMPONENTES.md).
// Maqueta sobre la mesada (hk.tsx) con Blanquito-Sachiko haciendo lo que ella cuenta. Cada uno = UNA idea con un objeto.
import React, { useMemo } from "react";
import * as THREE from "three";
import { F, Hero, C, S, it, lerp, pop, Pop, Ink, cardTex, Pan, Steam, Ring, Bowl, Sticks, Freezer,
  cl, eio, orbita, Sachi, secuencia, Box, Cyl, POSES, AMB, V } from "./hk";
import { mk } from "./casa3d";

const RED = "#d62828", ICE = "#cfe9ff", RICE = "#f7f5ee", MEAT = "#c8564a", WRAP = "#eaf6ff", TAPE = "#efe0b0";
const P0 = POSES.parado;

// bolsa plana de freezer: plástico translúcido con el contenido adentro y una cinta de papel con el rótulo
const Pack: React.FC<{ p: V; w?: number; d?: number; c?: string; rot?: V; label?: THREE.Texture; frost?: number }> = ({ p, w = 0.5, d = 0.36, c = MEAT, rot = [0, 0, 0], label, frost = 0 }) =>
  <group position={p} rotation={rot}>
    <Box p={[0, 0.022, 0]} s={[w * 0.92, 0.03, d * 0.88]} c={c} r={0.55} rad={0.012} />
    <Box p={[0, 0.024, 0]} s={[w, 0.044, d]} c={WRAP} r={0.08} rad={0.016} op={0.3 + 0.35 * frost} />
    {label && <mesh position={[0, 0.048, -d * 0.22]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w * 0.82, 0.13]} /><meshStandardMaterial map={label} roughness={0.9} /></mesh>}
  </group>;
// cuadrado de arroz envuelto en film
const RiceSq: React.FC<{ p: V; s?: number; frost?: number; rot?: V }> = ({ p, s = 1, frost = 0, rot = [0, 0, 0] }) =>
  <group position={p} scale={s} rotation={rot}>
    <Box p={[0, 0.06, 0]} s={[0.3, 0.1, 0.3]} c={RICE} r={0.6} rad={0.03} />
    <Box p={[0, 0.06, 0]} s={[0.32, 0.115, 0.32]} c={frost > 0.5 ? "#f4fbff" : WRAP} r={0.05} rad={0.035} op={0.25 + 0.3 * frost} />
  </group>;
// rebanada de pan de molde (shokupan)
const Slice: React.FC<{ p: V; rot?: V; s?: number; c?: string; crust?: string }> = ({ p, rot = [0, 0, 0], s = 1, c = "#f6ead0", crust = "#c88a45" }) =>
  <group position={p} rotation={rot} scale={s}>
    <Box p={[0, 0, 0]} s={[0.34, 0.36, 0.04]} c={crust} r={0.8} rad={0.06} />
    <Box p={[0, 0, 0.004]} s={[0.3, 0.32, 0.042]} c={c} r={0.95} rad={0.05} />
  </group>;
// cubo de tofu
const Tofu: React.FC<{ p: V; s?: number; c?: string; holes?: number }> = ({ p, s = 1, c = "#f3efe2", holes = 0 }) =>
  <group position={p} scale={s}>
    <Box p={[0, 0.12, 0]} s={[0.42, 0.24, 0.3]} c={c} r={0.85} rad={0.03} />
    {holes > 0.02 && Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[-0.17 + 0.34 * ((i * 0.37) % 1), 0.04 + 0.16 * ((i * 0.61) % 1), 0.151]}><circleGeometry args={[0.012 + 0.014 * holes * ((i * 0.53) % 1), 12]} /><meshStandardMaterial color="#a89f86" roughness={1} /></mesh>)}
  </group>;
// cinta de papel con texto (rótulo)
const useLabel = (txt: string) => useMemo(() => cardTex([txt], { bg: TAPE, fg: "#3a2a18", w: 320, h: 64 }), [txt]);

// 0:05 · EL LADRILLO MISTERIOSO: se abre el freezer, cae un ladrillo escarchado, rebota y gira; aparece un «?» de papel
export const B_brick: F = ({ t, h }) => {
  const a = it(h, 0, 4.0);
  const q = useMemo(() => cardTex(["?"], { bg: "#fbf3df", fg: RED, w: 200, h: 240 }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 1.2, 2.6], [0, 0.45, 0]), C([0.5, 1.0, 2.3], [0, 0.4, 0]), 10)}
    set={{ spot: [0.1, 0, 0.3] as V, spotK: 0.35 }}
    scene={(tt) => { const f = eio(tt, 1.3, 2.4), b = Math.abs(Math.sin(Math.max(0, tt - 2.4) * 7)) * Math.exp(-(tt - 2.4) * 2.5) * 0.25, spin = eio(tt, Math.max(a, 3.2) - 0.6, Math.max(a, 3.2) + 0.6);
      return <>
        <Freezer p={[-0.55, 0, -0.3]} s={0.8} frost={1} />
        <group position={[lerp(-0.55, 0.15, f), tt < 2.4 ? lerp(0.6, 0.1, f * f) : 0.1 + b, lerp(-0.2, 0.25, f)]} rotation={[0.3 * (1 - spin), tt * 0.4 + spin * Math.PI, 0.2]}>
          <Box p={[0, 0, 0]} s={[0.36, 0.16, 0.24]} c="#9aa3ab" r={0.35} m={0.4} rad={0.03} />
          <Box p={[0, 0, 0]} s={[0.38, 0.175, 0.26]} c="#f4fbff" r={0.6} rad={0.035} op={0.55} />
        </group>
        {Array.from({ length: 10 }, (_, i) => { const u = ((tt * 0.5 + i / 10) % 1); return <mesh key={"m" + i} position={[-0.5 + 0.25 * u * Math.sin(i), 0.55 - 0.3 * u, 0.05 + 0.3 * u]}><sphereGeometry args={[0.05 + 0.08 * u, 12, 8]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.35 * Math.sin(Math.PI * u) * (1 - eio(tt, 3.5, 5))} depthWrite={false} /></mesh>; })}
        <Pop k={pop(tt, Math.max(a, 3.2))} p={[0.55, 0.62, 0.1]}><mesh><planeGeometry args={[0.46, 0.56]} /><meshStandardMaterial map={q} side={THREE.DoubleSide} /></mesh></Pop>
        <Sachi p={secuencia([[0, P0], [a - 0.3, POSES.rascarse]], tt)} t={tt} x={0.75} z={0.45} rotY={-25} s={S * 0.9} expr={tt > a ? "pensativo" : "sorprendido"} />
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 0.5} txt="CHICKEN? SOUP?" col={AMB} />} />;
};

// 0:22 · EL BULTO DE ARROZ: una bolsa de granos sueltos se congela en un solo bloque, se raja; llega la caja de pizza
export const B_lump: F = ({ t, h }) => {
  const a = it(h, 0, 4.0);
  const piz = useMemo(() => cardTex(["PIZZA"], { bg: "#c94a2a", fg: "#fff3d6", w: 320, h: 200 }), []);
  const G = useMemo(() => Array.from({ length: 60 }, (_, i) => [((i * 0.37) % 1) - 0.5, ((i * 0.71) % 1), ((i * 0.53) % 1) - 0.5]), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.2, 0.9, 1.9], [0.25, 0.1, 0]), C([0.5, 0.8, 1.75], [0.25, 0.1, 0]), 9)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.1 }}
    scene={(tt) => { const fr = eio(tt, 2.4, 4.2), cr = eio(tt, 4.4, 4.8), pz = eio(tt, Math.min(a, 5.5) - 0.5, Math.min(a, 5.5) + 0.4);
      return <>
        {fr < 0.98 && G.map(([x, y, z], i) => <mesh key={i} position={[x * 0.5, 0.03 + y * 0.12, z * 0.32]} rotation={[i, i * 2, 0]}><capsuleGeometry args={[0.016, 0.03, 4, 6]} /><meshStandardMaterial color={RICE} roughness={0.5} /></mesh>)}
        {fr > 0.02 && <group><Box p={[-0.13 - 0.03 * cr, 0.08, 0]} s={[0.26, 0.14 * fr, 0.36]} c="#dbe9f2" r={0.4} rad={0.02} op={fr} rot={[0, 0, -0.05 * cr]} />
          <Box p={[0.13 + 0.03 * cr, 0.08, 0]} s={[0.26, 0.14 * fr, 0.36]} c="#dbe9f2" r={0.4} rad={0.02} op={fr} rot={[0, 0, 0.05 * cr]} /></group>}
        <Box p={[0, 0.09, 0]} s={[0.6, 0.19, 0.42]} c={WRAP} r={0.08} rad={0.03} op={0.25 + 0.25 * fr} />
        {pz > 0.02 && <group position={[lerp(1.6, 0.7, pz), 0.04, 0.1]} rotation={[0, -0.25, 0]}><Box p={[0, 0, 0]} s={[0.5, 0.07, 0.5]} c="#d8c39a" r={0.9} rad={0.01} />
          <mesh position={[0, 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.34, 0.21]} /><meshStandardMaterial map={piz} /></mesh></group>}
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.6} txt="3 WEEKS · ONE LUMP" col={ICE} />} />;
};

// 1:13 · LAS TRES PROMESAS: tres campanas de vidrio se levantan de a una: arroz humeante, tostada dorada, carne directo a la sartén
export const B_promises: F = ({ t, h }) => {
  const a = 0.6, b = it(h, 0, 3.0), c = it(h, 1, 5.5);
  const Dome: React.FC<{ x: number; k: number; children: React.ReactNode }> = ({ x, k, children }) => <group position={[x, 0, 0]}>
    <Cyl p={[0, 0.015, 0]} r={0.26} h={0.03} c="#6b4a2e" rough={0.6} />{children}
    <group position={[0, 0.03 + 0.6 * k, 0]}><mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f4fbff" transparent opacity={0.22} roughness={0.02} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh position={[0, 0.0, 0]} scale={[1, 0.8, 1]}><cylinderGeometry args={[0.25, 0.25, 0.4, 32, 1, true]} /><meshStandardMaterial color="#f4fbff" transparent opacity={0.18} roughness={0.02} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh position={[0, 0.46, 0]}><sphereGeometry args={[0.03, 12, 8]} /><meshStandardMaterial color="#c9a24a" metalness={0.8} roughness={0.3} /></mesh></group>
  </group>;
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 1.25, 2.6], [0, 0.25, 0]), C([0.3, 1.1, 2.4], [0, 0.25, 0]), 10)}
    set={(tt: number) => ({ spot: [tt < b ? -0.7 : tt < c ? 0 : 0.7, 0, 0] as V, spotK: 0.35 })}
    scene={(tt) => { const k1 = eio(tt, a, a + 0.6), k2 = eio(tt, b, b + 0.6), k3 = eio(tt, c, c + 0.6);
      return <>
        <Dome x={-0.7} k={k1}><Bowl p={[0, 0.03, 0]} s={0.9} c="#2c4a8a" /><Steam p={[0, 0.14, 0]} t={tt} k={k1} s={0.6} /></Dome>
        <Dome x={0} k={k2}><Slice p={[0, 0.09, 0]} rot={[-Math.PI / 2 + 0.05, 0, 0.3]} s={0.75} c="#e9b46a" crust="#9a5a22" /><Box p={[0.03, 0.11, 0.02]} s={[0.06, 0.02, 0.05]} c="#ffe08a" r={0.3} rad={0.008} /></Dome>
        <Dome x={0.7} k={k3}><Pan p={[0, 0.03, 0]} s={0.55} heat={k3} /><Steam p={[0, 0.1, 0]} t={tt} k={k3 * 0.7} s={0.5} /></Dome>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={a + 0.4} txt="RICE" col={AMB} x={560} y={300} size={64} /><Ink tt={tt} at={b + 0.4} txt="BREAD" col={AMB} x={960} y={300} size={64} /><Ink tt={tt} at={c + 0.4} txt="MEAT" col={AMB} x={1360} y={300} size={64} /></>} />;
};

// 2:18 · EL PRIMER FREEZER DE MAMÁ: una heladerita crema de los 60 con su caja de freezer arriba; cae el mantel de encaje y un florero
export const B_sanyo: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 4.0), 3.0);
  const lace = useMemo(() => mk(256, 256, (g) => { g.fillStyle = "rgba(0,0,0,0)"; g.clearRect(0, 0, 256, 256); g.strokeStyle = "#ffffff"; g.lineWidth = 3;
    for (let r = 20; r < 128; r += 14) { g.beginPath(); for (let k = 0; k <= 48; k++) { const an = (k / 48) * Math.PI * 2, rr = r + 4 * Math.sin(k * 3); g.lineTo(128 + rr * Math.cos(an), 128 + rr * Math.sin(an)); } g.stroke(); } }), []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.3, 1.35, 2.5], [0.15, 0.78, 0]), C([-0.1, 1.4, 2.4], [0.15, 0.8, 0]), 10)}
    set={{ spot: [0, 0.6, 0] as V, spotK: 0.35, warm: 0.6 }}
    scene={(tt) => { const door = eio(tt, 0.8, 1.8) * (1 - eio(tt, a - 0.4, a)), cl1 = eio(tt, a, a + 0.9), fl = pop(tt, a + 1.0);
      return <>
        <Box p={[0, 0.55, 0]} s={[0.62, 1.1, 0.5]} c="#efe6cf" r={0.35} rad={0.09} />
        <group position={[-0.3, 0.95, 0.25]} rotation={[0, -1.6 * door, 0]}><Box p={[0.3, 0, 0]} s={[0.6, 0.26, 0.03]} c="#e8dec4" r={0.35} rad={0.03} /><Box p={[0.52, 0, 0.03]} s={[0.04, 0.14, 0.03]} c="#d5d9dd" m={0.9} r={0.2} rad={0.01} /></group>
        <Box p={[0, 0.95, 0.12]} s={[0.5, 0.2, 0.2]} c="#9fd0ee" r={0.5} rad={0.01} e={ICE} ei={0.25 + 0.4 * door} />
        {[0, 1, 2].map((i) => <Box key={"ice" + i} p={[-0.15 + 0.15 * i, 0.9, 0.2]} s={[0.1, 0.06, 0.06]} c="#f4fbff" r={0.3} rad={0.01} />)}
        <Box p={[0.26, 0.45, 0.26]} s={[0.04, 0.18, 0.03]} c="#d5d9dd" m={0.9} r={0.2} rad={0.01} />
        {cl1 > 0.02 && <mesh position={[0, 1.11 + 0.5 * (1 - cl1), 0]} rotation={[-Math.PI / 2, 0, cl1 * 0.6]}><circleGeometry args={[0.36, 48]} /><meshStandardMaterial map={lace} transparent alphaTest={0.3} color="#ffffff" side={THREE.DoubleSide} /></mesh>}
        {cl1 > 0.5 && [-1, 1].map((k) => <mesh key={"pu" + k} position={[k * 0.315, 0.98, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.36, 0.26 * cl1]} /><meshStandardMaterial map={lace} transparent alphaTest={0.3} color="#ffffff" side={THREE.DoubleSide} /></mesh>)}
        <Pop k={fl} p={[0.1, 1.11, 0]} s={1.6}><Cyl p={[0, 0.08, 0]} r={0.045} h={0.16} c="#5d8fb3" rough={0.2} />{[0, 1, 2].map((i) => <mesh key={i} position={[0.03 * (i - 1), 0.22 + 0.02 * i, 0]}><sphereGeometry args={[0.035, 12, 8]} /><meshStandardMaterial color={["#ff8fa3", "#ffd166", "#f27059"][i]} roughness={0.7} /></mesh>)}</Pop>
        <Sachi p={secuencia([[0, P0], [a + 1.2, POSES.pensar]], tt)} t={tt} x={0.7} z={0.4} rotY={-30} s={S * 0.9} expr="enamorado" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 1.2} txt="LIKE A PIECE OF FURNITURE" col={AMB} />} />;
};

// 2:52 · EL VAPOR ES AGUA: corte del cuadrado de arroz bajo el film; el vapor sube, choca con el film, se vuelve gotitas y vuelve al arroz
export const B_steamtrap: F = ({ t, h }) => {
  const a = it(h, 0, 4.5);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.75, 1.6], [0, 0.15, 0]), C([0.3, 0.7, 1.45], [0, 0.15, 0]), 9)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const drops = eio(tt, 1.0, a), back = eio(tt, a, a + 1.2);
      return <>
        <Box p={[0, 0.006, 0]} s={[1.0, 0.012, 0.66]} c="#2a3644" r={0.4} m={0.3} rad={0.006} />
        <Box p={[0, 0.05, 0]} s={[0.8, 0.09, 0.5]} c="#e9e1cc" r={0.6} rad={0.03} />
        {Array.from({ length: 70 }, (_, i) => <mesh key={"gr" + i} position={[-0.37 + 0.74 * ((i * 0.37) % 1), 0.098, -0.22 + 0.44 * ((i * 0.61) % 1)]} rotation={[Math.PI / 2, 0, i * 1.3]}><capsuleGeometry args={[0.012, 0.024, 4, 6]} /><meshStandardMaterial color="#ffffff" roughness={0.4} /></mesh>)}
        <mesh position={[0, 0.2, 0]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.5, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#bfe3ff" transparent opacity={0.28} roughness={0.02} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        {Array.from({ length: 10 }, (_, i) => { const u = ((tt * 0.6 + i / 10) % 1) * (1 - back); return <mesh key={i} position={[-0.32 + 0.07 * i, 0.12 + 0.13 * u, 0.05 * Math.sin(i)]}><sphereGeometry args={[0.02 + 0.03 * u, 12, 8]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.4 * Math.sin(Math.PI * u)} depthWrite={false} /></mesh>; })}
        {Array.from({ length: 16 }, (_, i) => { const an = (i / 16) * Math.PI, x = 0.42 * Math.cos(an), y = 0.2 + 0.16 * Math.sin(an); return drops > (i % 8) / 8 ? <mesh key={"d" + i} position={[x, lerp(y, 0.11, back * ((i % 3) / 3 + 0.3)), 0.12 * Math.sin(i * 1.3)]}><sphereGeometry args={[0.022, 10, 8]} /><meshStandardMaterial color="#5ab8f0" roughness={0.02} metalness={0.1} transparent opacity={0.9} /></mesh> : null; })}
        <Ring p={[0, 0.105, 0]} r={0.45} k={back} col="#7fd0ff" />
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.8} txt="STEAM = WATER" col={ICE} y={250} /><Ink tt={tt} at={a + 0.6} txt="IT GOES BACK INTO THE RICE" col={AMB} /></>} />;
};

// 3:08 · 150 GRAMOS: balanza de cocina cuenta hasta 150, el montículo se aplasta en un cuadrado de 1" y el film se dobla encima
export const B_scale150: F = ({ t, h }) => {
  const a = it(h, 0, 6.0);
  const nums = useMemo(() => Array.from({ length: 16 }, (_, i) => cardTex([String(i * 10)], { bg: "#1d2b22", fg: "#8dff9a", w: 256, h: 128 })), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.7, 1.3], [0, 0.08, 0]), C([0.25, 0.65, 1.2], [0, 0.08, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.15 }}
    scene={(tt) => { const n = eio(tt, 0.4, 1.8), fl = eio(tt, 2.2, 3.4), fo = eio(tt, a, a + 1.0);
      return <>
        <Box p={[0, 0.03, 0]} s={[0.7, 0.06, 0.6]} c="#3a3f45" r={0.3} m={0.3} rad={0.03} />
        <Box p={[0, 0.045, 0.31]} s={[0.4, 0.09, 0.01]} c="#1d2b22" r={0.3} rad={0.005} />
        <mesh position={[0, 0.045, 0.317]}><planeGeometry args={[0.38, 0.085]} /><meshStandardMaterial map={nums[Math.round(n * 15)]} emissive="#8dff9a" emissiveIntensity={0.6} emissiveMap={nums[Math.round(n * 15)]} /></mesh>
        <mesh position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.5]} /><meshStandardMaterial color={WRAP} transparent opacity={0.35} roughness={0.05} /></mesh>
        <mesh position={[0, 0.065, 0]} scale={[lerp(0.6, 1.0, fl), lerp(0.9 * n, 0.25, fl), lerp(0.6, 1.0, fl)]}><sphereGeometry args={[0.16, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={RICE} roughness={0.6} /></mesh>
        {fl > 0.5 && <Box p={[0, 0.065 + 0.025 * fl, 0]} s={[0.27 * fl, 0.05, 0.27 * fl]} c={RICE} r={0.6} rad={0.02} />}
        {fo > 0.02 && [-1, 1].map((k) => <group key={k} position={[k * 0.25, 0.065, 0]} rotation={[0, 0, k * -Math.PI * 0.95 * fo]}><mesh position={[-k * 0.12, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.24, 0.3]} /><meshStandardMaterial color={WRAP} transparent opacity={0.4} roughness={0.05} side={THREE.DoubleSide} /></mesh></group>)}
        <group position={[0.42, 0.06, 0.05]}><Box p={[0, 0.06, 0]} s={[0.03, 0.12, 0.06]} c="#e3c48a" r={0.7} rad={0.004} />{[0, 1, 2, 3].map((i) => <Box key={i} p={[-0.016, 0.02 + 0.03 * i, 0]} s={[0.006, 0.003, 0.05]} c="#3a2a18" r={0.9} rad={0.001} />)}</group>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.9} txt="150 G" col={AMB} y={250} /><Ink tt={tt} at={3.2} txt="1 INCH" col={ICE} /></>} />;
};

// 4:36 · HONDO VS PLANO: dos recipientes en corte; el calor (rojo) entra de afuera: en el plano llega al centro, en el hondo el centro sigue azul
export const B_deepflat: F = ({ t, h }) => {
  const a = it(h, 0, 5.0);
  const Layers: React.FC<{ x: number; w: number; hgt: number; k: number }> = ({ x, w, hgt, k }) => <group position={[x, 0, 0]}>
    {Array.from({ length: 6 }, (_, i) => { const f = i / 5, reach = 1 - f; const hot = cl((k * 1.25 - reach) * 3); const sx = w * (1 - 0.16 * i), sy = hgt * (1 - 0.16 * i);
      return <Box key={i} p={[0, 0.02 + hgt / 2, 0.15 + 0.012 * i]} s={[sx, sy, 0.012]} c={new THREE.Color("#4aa3df").lerp(new THREE.Color("#ff5a3a"), hot).getStyle()} r={0.5} rad={0.004} />; })}
    <Box p={[0, 0.02 + hgt / 2, 0]} s={[w + 0.02, hgt + 0.02, 0.3]} c="#f3f6f8" r={0.1} rad={0.01} op={0.18} />
    <Box p={[0, 0.035 + hgt, 0]} s={[w + 0.06, 0.03, 0.34]} c="#2f6fb5" r={0.4} rad={0.012} />
  </group>;
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.6, 2.3], [0, 0.4, 0]), C([0.2, 0.6, 2.2], [0, 0.4, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.2 }}
    scene={(tt) => { const k = eio(tt, 0.6, a);
      return <>
        <Layers x={-0.45} w={0.5} hgt={0.72} k={k * 0.5} />
        <Layers x={0.45} w={0.6} hgt={0.12} k={k} />
        {[[-0.45, 0.5, 0.72], [0.45, 0.6, 0.12]].map(([x, w, hg], j) => [-1, 1].map((sd) => <mesh key={j + "h" + sd} position={[x + sd * (w / 2 + 0.09 - 0.03 * Math.sin(tt * 4)), 0.02 + hg / 2, 0.16]} rotation={[0, 0, sd * Math.PI / 2]}><coneGeometry args={[0.035, 0.1, 10]} /><meshStandardMaterial color="#ff5a3a" emissive="#ff5a3a" emissiveIntensity={0.6} /></mesh>))}
        <Ring p={[0.45, 0.01, 0]} r={0.38} k={eio(tt, a - 0.4, a + 0.4)} col="#7fe0a0" />
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.8} txt="DEEP" col="#ff8a7a" x={640} y={790} size={60} /><Ink tt={tt} at={0.8} txt="FLAT" col="#7fe0a0" x={1280} y={790} size={60} /><Ink tt={tt} at={a + 0.4} txt="1 INCH · HEAT REACHES THE MIDDLE" col={AMB} /></>} />;
};

// 5:05 · COMO LIBROS EN UN ESTANTE: seis tapers planos iguales entran parados, de a uno, en el estante del freezer
export const B_shelf: F = ({ t, h }) => {
  const a = 0.5;
  const L = useLabel("RICE · OCT");
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.1, 0.9, 2.0], [0, 0.35, 0]), C([0.4, 0.85, 1.85], [0, 0.35, 0]), 10)}
    set={{ spot: [0, 0.3, 0] as V, spotK: 0.3 }}
    scene={(tt) => <>
      <Box p={[0, 0.02, 0]} s={[1.4, 0.04, 0.5]} c="#dfe6ea" r={0.4} rad={0.01} />
      <Box p={[0, 0.4, -0.24]} s={[1.4, 0.8, 0.02]} c="#dceaf3" r={0.5} rad={0.01} e={ICE} ei={0.1} />
      {[0, 1, 2, 3, 4, 5].map((i) => { const k = pop(tt, a + 0.45 * i), x = -0.5 + 0.2 * i;
        return k < 0.02 ? null : <group key={i} position={[x, 0.2, lerp(0.9, 0, Math.min(1, k))]} rotation={[0, 0, Math.PI / 2 * Math.min(1, k)]}>
          <Box p={[0, 0, 0]} s={[0.34, 0.07, 0.36]} c="#f3f6f8" r={0.2} rad={0.02} op={0.75} /><Box p={[0, 0.04, 0]} s={[0.35, 0.02, 0.37]} c="#2f6fb5" r={0.4} rad={0.01} />
          <Box p={[0, -0.01, 0]} s={[0.3, 0.04, 0.32]} c={RICE} r={0.6} rad={0.015} />
          <mesh position={[0, -0.037, 0.06]} rotation={[Math.PI / 2, 0, Math.PI / 2]}><planeGeometry args={[0.2, 0.04]} /><meshStandardMaterial map={L} /></mesh></group>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={a + 2.6} txt="SAME SIZE · THEY STACK" col={AMB} />} />;
};

// 5:39 · CUCHILLITOS DE HIELO: corte de células: congelado lento = agujas grandes que rompen las paredes; sobre la bandeja de metal = cristales chicos
export const B_crystals: F = ({ t, h }) => {
  const a = it(h, 0, 5.0);
  const Cells: React.FC<{ x: number; big: boolean; k: number }> = ({ x, big, k }) => <group position={[x, 0, 0]}>
    {Array.from({ length: 9 }, (_, i) => { const cx = (i % 3) * 0.17 - 0.17, cz = Math.floor(i / 3) * 0.17 - 0.17; const torn = big ? k : 0;
      return <group key={i} position={[cx * (1 + 0.25 * torn), 0.05, cz * (1 + 0.25 * torn)]} rotation={[0, 0.15 * torn * Math.sin(i * 2), 0.1 * torn * Math.cos(i)]}><Box p={[0, 0, 0]} s={[0.165, 0.08, 0.165]} c="#fbe3d8" r={0.6} rad={0.008} /><Box p={[0, 0.003, 0]} s={[0.14, 0.08, 0.14]} c={new THREE.Color("#e98c7a").lerp(new THREE.Color("#a14d43"), torn).getStyle()} r={0.6} rad={0.006} />
        {big ? k > 0.05 && <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2 - 0.2, 0, i * 0.7]}><coneGeometry args={[0.009, 0.5 * k, 5]} /><meshStandardMaterial color="#f4fbff" emissive="#bfe3ff" emissiveIntensity={0.4} roughness={0.05} /></mesh>
          : [0, 1, 2].map((j) => <mesh key={j} position={[-0.04 + 0.04 * j, 0.05, 0.02 * j - 0.02]}><octahedronGeometry args={[0.014 * k, 0]} /><meshStandardMaterial color="#f4fbff" roughness={0.1} /></mesh>)}
      </group>; })}
    {!big && <Box p={[0, 0.0, 0]} s={[0.78, 0.02, 0.78]} c="#eef1f3" m={1} r={0.04} rad={0.006} />}
  </group>;
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 1.1, 1.8], [0, 0.05, 0]), C([0.3, 1.0, 1.7], [0, 0.05, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.2 }}
    scene={(tt) => <><Cells x={-0.45} big k={eio(tt, 0.6, 3.0)} /><Cells x={0.45} big={false} k={eio(tt, a - 0.6, a + 0.6)} /></>}
    over={(tt) => <><Ink tt={tt} at={1.0} txt="SLOW = LITTLE KNIVES" col="#ff8a7a" x={620} y={250} size={60} /><Ink tt={tt} at={a + 0.3} txt="FAST = TINY CRYSTALS" col="#7fe0a0" x={1300} y={250} size={60} /></>} />;
};

// 6:40 · EL PAN DE AMÉRICA: la hogaza gigante al lado del medio shokupan; la balanza de platos se va al lado grande
export const B_loaf: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 4.0), 4.5);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 1.0, 2.5], [0, 0.3, 0]), C([0.35, 0.95, 2.3], [0, 0.3, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.5 }}
    scene={(tt) => { const g = pop(tt, 0.4), s2 = pop(tt, a);
      return <>
        <Pop k={g} p={[-0.5, 0, 0]}><Box p={[0, 0.22, 0]} s={[1.15, 0.42, 0.44]} c="#c88a45" r={0.75} rad={0.15} /><Box p={[0, 0.22, 0]} s={[1.19, 0.45, 0.46]} c={WRAP} r={0.08} rad={0.16} op={0.25} /></Pop>
        <Pop k={s2} p={[0.6, 0, 0]}><Box p={[0, 0.14, 0]} s={[0.26, 0.26, 0.26]} c="#e8b878" r={0.8} rad={0.06} /><mesh position={[0.131, 0.14, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.22, 0.22]} /><meshStandardMaterial color="#f8eedb" roughness={0.95} /></mesh>
          <Box p={[0.06, 0.04, 0.24]} s={[0.24, 0.08, 0.02]} c="#efe6cf" r={0.9} rad={0.005} /></Pop>
        <Sachi p={secuencia([[0, P0], [0.6, POSES.pensar]], tt)} t={tt} x={1.05} z={0.2} rotY={-30} s={S * 0.9} expr={tt < a ? "sorprendido" : "feliz"} />
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.0} txt="A WHOLE LOAF" col="#ff8a7a" x={560} y={250} size={54} /><Ink tt={tt} at={a + 0.4} txt="HALF A SHOKUPAN" col="#7fe0a0" x={1400} y={250} size={54} /></>} />;
};

// 7:29 · DE FREEZER A TOSTADORA: rebanada escarchada, tres gotas de agua con el dedo, la tostadora la tira dorada y humeante
export const B_toaster: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 4.0), 4.0);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.2, 0.95, 2.0], [0, 0.35, 0]), C([0.45, 0.9, 1.85], [0, 0.35, 0]), 9)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.5 }}
    scene={(tt) => { const dn = eio(tt, 1.5, 2.1), up = eio(tt, a + 0.4, a + 0.8), gold = eio(tt, 2.1, a + 0.4);
      return <>
        <Box p={[0, 0.17, 0]} s={[0.46, 0.32, 0.3]} c="#d5d9dd" m={0.9} r={0.18} rad={0.08} />
        {[-1, 1].map((k) => <Box key={k} p={[k * 0.07, 0.33, 0]} s={[0.05, 0.01, 0.24]} c="#1a1a1a" r={0.9} rad={0.003} />)}
        <Box p={[0.24, 0.2 - 0.1 * dn * (1 - up), 0]} s={[0.04, 0.03, 0.06]} c="#1a1a1a" r={0.6} rad={0.008} />
        <Box p={[0, 0.17, 0.152]} s={[0.28, 0.06, 0.005]} c="#ff6a3a" r={0.4} rad={0.003} e="#ff6a3a" ei={0.8 * (dn - up)} />
        <Slice p={[-0.07, lerp(0.62, 0.3, dn) + 0.42 * up - 0.12 * eio(tt, a + 0.8, a + 1.3), 0]} rot={[0, Math.PI / 2, 0]} s={0.6} c={new THREE.Color("#eef3f5").lerp(new THREE.Color("#e2a560"), gold).getStyle()} crust={new THREE.Color("#c8ccd0").lerp(new THREE.Color("#8a4a1a"), gold).getStyle()} />
        {tt < 1.6 && [0, 1, 2].map((i) => <mesh key={i} position={[-0.03, lerp(0.95, 0.6 + 0.06 * i, eio(tt, 0.3 + 0.3 * i, 0.6 + 0.3 * i)), 0.04 * (i - 1)]}><sphereGeometry args={[0.022, 12, 8]} /><meshStandardMaterial color="#5ab8f0" roughness={0.02} transparent opacity={0.9} /></mesh>)}
        <Steam p={[-0.07, 0.45, 0]} t={tt} k={up} s={0.5} />
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.4} txt="DON'T THAW IT" col={ICE} y={250} /><Ink tt={tt} at={a + 0.8} txt="A DROP OF WATER · CRISPY" col={AMB} size={68} /></>} />;
};

// 8:17 · TRES REPISAS: mesada / heladera / freezer, una rebanada en cada una; la de la heladera se seca, se agrieta y suelta migas
export const B_stale: F = ({ t, h }) => {
  const a = it(h, 0, 2.5) + 3.5;
  const labs = useMemo(() => ["COUNTER", "FRIDGE", "FREEZER"].map((x) => cardTex([x], { bg: "#fbf3df", fg: "#3a2a18", w: 320, h: 96 })), []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.65, 1.75], [0, 0.25, 0]), C([0.25, 0.62, 1.65], [0, 0.25, 0]), 10)}
    set={(tt: number) => ({ spot: [tt < a ? 0 : 0.7, 0, 0] as V, spotK: 0.35 })}
    scene={(tt) => { const dry = eio(tt, 0.8, 3.5);
      return <>
        {[-0.7, 0, 0.7].map((x, i) => <group key={i} position={[x, 0, 0]}>
          <Box p={[0, 0.06, 0]} s={[0.42, 0.12, 0.34]} c={["#a8743a", "#f4f4f0", "#6fb0dc"][i]} r={0.5} rad={0.02} />
          <mesh position={[0, 0.06, 0.172]}><planeGeometry args={[0.4, 0.115]} /><meshStandardMaterial map={labs[i]} /></mesh>
          <Slice p={[0, 0.32, 0]} rot={[0, 0, i === 1 ? 0.12 * dry : 0]} s={0.75} c={i === 1 ? new THREE.Color("#f6ead0").lerp(new THREE.Color("#d9c39a"), dry).getStyle() : "#f6ead0"} crust={i === 1 ? new THREE.Color("#c88a45").lerp(new THREE.Color("#7a4a20"), dry).getStyle() : "#c88a45"} />
          {i === 1 && dry > 0.35 && Array.from({ length: 14 }, (_, j) => { const u = ((tt * 0.8 + j / 14) % 1); return <mesh key={j} position={[-0.12 + 0.018 * j, 0.3 - 0.18 * u, 0.06]}><boxGeometry args={[0.03, 0.024, 0.024]} /><meshStandardMaterial color="#c9a46a" /></mesh>; })}
          {i === 2 && <Ring p={[0, 0.125, 0]} r={0.26} k={eio(tt, a, a + 0.6)} col="#7fe0a0" />}
        </group>)}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={2.2} txt="FRIDGE: 3X FASTER STALE" col="#ff8a7a" y={250} /><Ink tt={tt} at={a + 0.4} txt="FREEZER STAYS SOFT" col="#7fe0a0" /></>} />;
};

// 8:50 · 30 AÑOS DE TOSTADAS MALAS: una hoja de almanaque 1985 se da vuelta y cae una torre de tostadas pálidas que se tambalea
export const B_toasttower: F = ({ t, h }) => {
  const a = it(h, 0, 4.0);
  const cal = useMemo(() => cardTex(["1985"], { bg: "#fbf3df", fg: RED, w: 256, h: 300, band: RED }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 1.0, 2.3], [0, 0.45, 0]), C([0.4, 1.05, 2.15], [0, 0.5, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.4 }}
    scene={(tt) => { const n = Math.floor(eio(tt, a - 1.0, a + 1.5) * 14), wob = 0.04 * Math.sin(tt * 3) * eio(tt, a, a + 1.5);
      return <>
        <group position={[-0.65, 0, -0.1]} rotation={[0, 0.25, 0]}><Pop k={pop(tt, 0.4)} p={[0, 0, 0]}><Box p={[0, 0.02, -0.06]} s={[0.4, 0.04, 0.16]} c="#6b4a2e" r={0.6} rad={0.01} /><mesh position={[0, 0.25, 0]} rotation={[-0.18, 0, 0]}><planeGeometry args={[0.38, 0.44]} /><meshStandardMaterial map={cal} side={THREE.DoubleSide} /></mesh></Pop></group>
        <group position={[0.2, 0, 0]} rotation={[0, 0, wob]}>{Array.from({ length: n }, (_, i) => <Slice key={i} p={[0.015 * Math.sin(i * 2), 0.04 + 0.055 * i, 0]} rot={[-Math.PI / 2, 0, 0.2 * Math.sin(i * 1.7)]} s={1.25} c="#e7d4a8" crust="#a9763e" />)}</group>
        <Sachi p={secuencia([[0, P0], [a, POSES.rascarse]], tt)} t={tt} x={0.85} z={0.4} rotY={-30} s={S * 0.9} expr={tt > a ? "carcajada" : "guino"} />
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 1.0} txt="30 YEARS OF BAD TOAST" col={AMB} />} />;
};

// 9:42 · LA TABLETA DE CARNE: la bolsa se aplana hasta las esquinas, el palito marca la grilla y se quiebra un cuadradito como chocolate
export const B_chocolate: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 3.0), 4.0), b = Math.min(it(h, 1, 9.5), 7.5);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 1.2, 1.6], [0, 0.05, 0]), C([0.3, 1.1, 1.5], [0, 0.05, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const fl = eio(tt, 0.3, 1.6), gx = eio(tt, a, a + 1.6), gz = eio(tt, a + 1.6, a + 2.8), br = eio(tt, b, b + 0.6), fr = eio(tt, a + 2.8, b);
      const sx = Math.round(gx * 3), sz = Math.round(gz * 2), stick = gx < 1 ? [lerp(-0.3, 0.3, gx * 3 % 1), lerp(-0.25, 0.25, Math.floor(gx * 3) / 2)] : [lerp(-0.3, 0.3, Math.floor(gz * 2) / 1), lerp(-0.25, 0.25, gz * 2 % 1)];
      return <>
        <Box p={[0, 0.05 - 0.02 * fl, 0]} s={[lerp(0.42, 0.8, fl), lerp(0.12, 0.04, fl), lerp(0.36, 0.6, fl)]} c={new THREE.Color(MEAT).lerp(new THREE.Color("#e6b7b0"), fr * 0.5).getStyle()} r={0.6} rad={0.015} />
        <Box p={[0, 0.03, 0]} s={[0.84, 0.05, 0.64]} c={fr > 0.5 ? "#f4fbff" : WRAP} r={0.08} rad={0.02} op={0.25 + 0.25 * fr} />
        {Array.from({ length: sx }, (_, i) => <Box key={"x" + i} p={[-0.2 + 0.2 * i, 0.052, 0]} s={[0.012, 0.006, 0.58]} c="#7a2a22" r={0.8} rad={0.003} />)}
        {Array.from({ length: sz }, (_, i) => <Box key={"z" + i} p={[0, 0.052, -0.1 + 0.2 * i]} s={[0.78, 0.006, 0.012]} c="#7a2a22" r={0.8} rad={0.003} />)}
        {gz < 1 && tt > a - 0.3 && <Sticks p={[stick[0], 0.2, stick[1]]} rot={[0.3, 0, 0.9]} s={1.4} />}
        {br > 0.02 && <group position={[0.3 + 0.3 * br, 0.06 + 0.45 * Math.sin(Math.PI * br * 0.8), 0.2 + 0.15 * br]} rotation={[0.6 * br, 0.4 * br, 0.7 * br]}><Box p={[0, 0, 0]} s={[0.19, 0.045, 0.19]} c="#e6b7b0" r={0.6} rad={0.01} />{[0, 1, 2, 3, 4].map((j) => <mesh key={j} position={[0.12 * Math.cos(j * 1.3) * br, -0.03 * j * br, 0.12 * Math.sin(j * 1.3) * br]}><boxGeometry args={[0.02, 0.012, 0.02]} /><meshStandardMaterial color="#f4fbff" /></mesh>)}</group>}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={a + 0.8} txt="CHOPSTICK LINES" col={AMB} y={250} /><Ink tt={tt} at={b + 0.4} txt="BREAK OFF ONE SQUARE" col={ICE} /></>} />;
};

// 11:03 · SÁNDWICH DE PAPEL: la pila de fetas y hojas de papel manteca se abre en el aire como un acordeón; salen 4 fetas sueltas
export const B_paper: F = ({ t, h }) => {
  const a = it(h, 0, 4.5);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.3, 1.0, 2.7], [0, 0.48, 0]), C([0.55, 0.95, 2.55], [0, 0.48, 0]), 10)}
    set={{ spot: [0, 0.3, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const op = eio(tt, 0.5, 2.0), take = eio(tt, Math.min(a, 6), Math.min(a, 6) + 1.0);
      return <>
        {Array.from({ length: 4 }, (_, L) => { const y = 0.04 + L * (0.04 + 0.15 * op);
          return <group key={L}>
            <group position={[0.04 * Math.sin(tt * 2 + L) * op, y, 0]} rotation={[(L % 2 ? 0.1 : -0.1) * op, 0.08 * Math.sin(tt * 1.5 + L * 0.8) * op, 0]}>
              <Box p={[0, 0, 0]} s={[0.7, 0.004, 0.5]} c="#f6efdc" r={0.95} rad={0.002} />
              {[-0.2, 0, 0.2].map((x, j) => { const out = L === 3 ? take : 0; return <Box key={j} p={[x + 0.45 * out * (j - 1 + 1.6), 0.01 + 0.22 * out, 0.35 * out]} s={[0.16, 0.008, 0.36]} c={j % 2 ? "#c8564a" : "#d26c5e"} r={0.6} rad={0.004} />; })}
            </group>
            {L < 3 && op > 0.05 && <mesh position={[L % 2 ? 0.36 : -0.36, y + (0.02 + 0.075 * op), 0]} rotation={[0, Math.PI / 2, (L % 2 ? -1 : 1) * 0.35 * op]}><planeGeometry args={[0.5, 0.04 + 0.15 * op]} /><meshStandardMaterial color="#efe4c8" roughness={0.95} side={THREE.DoubleSide} /></mesh>}
          </group>; })}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.2} txt="ONE LAYER · PAPER BETWEEN" col={AMB} y={250} /><Ink tt={tt} at={a + 0.6} txt="TAKE JUST 4" col={ICE} /></>} />;
};

// 11:52 · EL HONGO POR DENTRO: corte gigante de un shiitake; los cristales rompen las celditas y sale una nube dorada de sabor
export const B_mushroom: F = ({ t, h }) => {
  const a = it(h, 0, 2.5);
  const stem = useMemo(() => mk(64, 128, (g) => { g.fillStyle = "#e9dcc2"; g.fillRect(0, 0, 64, 128); g.strokeStyle = "rgba(150,110,70,.55)"; g.lineWidth = 2; for (let x = 4; x < 64; x += 7) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 3 * Math.sin(x), 128); g.stroke(); } }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 1.0, 1.7], [0, 0.38, 0]), C([0.25, 0.95, 1.6], [0, 0.38, 0]), 10)}
    set={{ spot: [0, 0.4, 0] as V, spotK: 0.35, warm: 0.4 }}
    scene={(tt) => { const ice = eio(tt, a - 0.4, a + 0.8), gold = eio(tt, a + 0.8, a + 3.0);
      return <group rotation={[0, -0.55, 0]}>
        <mesh position={[0, 0.21, 0.002]}><shapeGeometry args={[(() => { const sh = new THREE.Shape(); sh.moveTo(-0.07, -0.21); sh.lineTo(0.07, -0.21); sh.quadraticCurveTo(0.05, 0, 0.1, 0.21); sh.lineTo(-0.1, 0.21); sh.quadraticCurveTo(-0.05, 0, -0.07, -0.21); return sh; })()]} /><meshStandardMaterial map={stem} roughness={0.9} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.42, 0]} scale={[1, 0.55, 1]}><torusGeometry args={[0.39, 0.035, 10, 40, Math.PI]} /><meshStandardMaterial color="#5a3418" roughness={0.85} /></mesh>
        <mesh position={[0, 0.42, 0]} scale={[1, 0.55, 1]}><sphereGeometry args={[0.4, 40, 20, Math.PI, Math.PI, 0, Math.PI / 2]} /><meshStandardMaterial color="#7a4a2a" roughness={0.85} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.42, 0.001]} scale={[1, 0.55, 1]}><circleGeometry args={[0.4, 40, 0, Math.PI]} /><meshStandardMaterial color="#efe0c4" roughness={0.9} side={THREE.DoubleSide} /></mesh>
        {Array.from({ length: 9 }, (_, i) => { const an = 0.25 + (i / 8) * (Math.PI - 0.5), r = 0.13 + 0.12 * (i % 2); return <group key={i} position={[r * Math.cos(an), 0.43 + 0.55 * r * Math.sin(an), 0.02]}>
          <mesh scale={[1, 0.8, 0.3]}><torusGeometry args={[0.055, 0.011, 6, 18, Math.PI * 2 * (1 - 0.4 * ice)]} /><meshStandardMaterial color="#8a6238" /></mesh>
          {ice > 0.05 && <mesh rotation={[0, 0, i]}><octahedronGeometry args={[0.035 * ice, 0]} /><meshStandardMaterial color="#f4fbff" emissive="#bfe3ff" emissiveIntensity={0.5} roughness={0.05} /></mesh>}</group>; })}
        {gold > 0.02 && Array.from({ length: 22 }, (_, i) => { const u = ((tt * 0.35 + i / 22) % 1); return <mesh key={"g" + i} position={[0.3 * Math.sin(i * 2.3) * (0.4 + u), 0.5 + 0.55 * u, 0.1 + 0.1 * Math.cos(i)]}><sphereGeometry args={[0.022, 10, 8]} /><meshStandardMaterial color="#ffc04a" emissive="#ff9a2a" emissiveIntensity={1.2} transparent opacity={gold * Math.sin(Math.PI * u)} /></mesh>; })}
      </group>; }}
    over={(tt) => <><Ink tt={tt} at={a} txt="THE ICE BREAKS THE WALLS" col={ICE} y={250} /><Ink tt={tt} at={a + 1.4} txt="MORE TASTE" col={AMB} /></>} />;
};

// 12:56 · LA ESPONJA: una prensa de madera aprieta el tofu descongelado, chorrea el agua y aparecen los agujeritos
export const B_squeeze: F = ({ t, h }) => {
  const a = it(h, 0, 4.0);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 0.8, 1.9], [0, 0.2, 0]), C([0.4, 0.75, 1.75], [0, 0.2, 0]), 9)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const pr = eio(tt, 0.5, 2.5), hol = eio(tt, a - 0.5, a + 0.8);
      return <>
        <group scale={1.45}>
        <Box p={[0, 0.02, 0]} s={[0.8, 0.04, 0.6]} c="#b98a5a" r={0.6} rad={0.01} />
        <mesh position={[0, 0.042, 0.1]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.3 + 0.9 * pr, 0.3 + 0.6 * pr, 1]}><circleGeometry args={[0.3, 32]} /><meshStandardMaterial color="#5ab8f0" transparent opacity={0.6 * Math.min(1, pr * 3)} roughness={0.02} /></mesh>
        <group scale={[1 + 0.06 * pr, 1 - 0.25 * pr, 1 + 0.06 * pr]} position={[0, 0.04, 0]}><Tofu p={[0, 0, 0]} s={1} c={new THREE.Color("#e9e2c6").lerp(new THREE.Color("#efe7cf"), pr).getStyle()} holes={hol} /></group>
        <Box p={[0, 0.3 - 0.06 * pr, 0]} s={[0.5, 0.04, 0.38]} c="#a07040" r={0.6} rad={0.01} />
        {[-1, 1].map((k) => <Cyl key={k} p={[k * 0.3, 0.2, 0]} r={0.02} h={0.4} c="#7a5634" rough={0.6} />)}
        {pr > 0.05 && pr < 0.99 && Array.from({ length: 26 }, (_, i) => { const u = ((tt * 1.3 + i / 26) % 1), s = i % 2 ? 1 : -1; return <mesh key={i} position={[s * (0.22 + 0.22 * u), 0.16 - 0.13 * u * u, -0.12 + 0.01 * i]}><sphereGeometry args={[0.022, 8, 6]} /><meshStandardMaterial color="#3d9ee0" transparent opacity={0.9} roughness={0.02} /></mesh>; })}
        </group>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.0} txt="THE WATER POURS OUT" col={ICE} y={250} /><Ink tt={tt} at={a + 0.5} txt="GRANDMA'S SPONGE" col={AMB} /></>} />;
};

// 13:13 · SE TOMA LA SALSA: corte de un cubo de tofu-esponja que se tiñe de marrón desde afuera hacia el centro, la jarrita vierte soja
export const B_soak: F = ({ t, h }) => {
  const a = it(h, 0, 4.5);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.85, 1.8], [0, 0.2, 0]), C([0.3, 0.8, 1.7], [0, 0.2, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.5 }}
    scene={(tt) => { const k = eio(tt, 0.8, a + 1.0);
      return <>
        <group position={[0.48, 0.52, 0.05]} rotation={[0, 0, 1.0 * eio(tt, 0.3, 0.8)]}><Cyl p={[0, 0, 0]} r={0.09} h={0.3} c="#3a1a0a" rough={0.1} op={0.92} /><Cyl p={[0, 0.19, 0]} r={0.035} h={0.08} c="#c62828" rough={0.4} /></group>
        {tt > 0.8 && tt < a && <Cyl p={[0.3, 0.4, 0.05]} r={0.018} h={0.2} c="#3a1a0a" rough={0.1} />}
        <Box p={[0, 0.23, 0]} s={[0.6, 0.42, 0.3]} c="#fbf8ee" r={0.85} rad={0.02} />
        {Array.from({ length: 6 }, (_, i) => { const f = i / 5, hot = cl((k - f * 0.85) * 2.2), sz = 0.6 - 0.1 * i;
          return <Box key={i} p={[0, 0.23, 0.152 + 0.003 * i]} s={[sz, sz * 0.7, 0.003]} c={new THREE.Color("#fbf8ee").lerp(new THREE.Color("#7a4418"), hot).getStyle()} r={0.85} rad={0.004} />; })}
        {Array.from({ length: 22 }, (_, i) => <mesh key={"ho" + i} position={[-0.26 + 0.52 * ((i * 0.37) % 1), 0.05 + 0.36 * ((i * 0.61) % 1), 0.172]}><circleGeometry args={[0.006 + 0.007 * ((i * 0.53) % 1), 10]} /><meshStandardMaterial color="#d8c8a6" roughness={1} transparent opacity={0.8} /></mesh>)}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.0} txt="WHITE TOFU · SOY GOES IN" col={AMB} y={250} /><Ink tt={tt} at={a - 0.2} txt="FLAVOR ALL THE WAY IN" col={AMB} /></>} />;
};

// 13:47 · CINTA Y LÁPIZ: el rollo de cinta de papel rueda, deja una tira sobre la bolsa y el lápiz escribe RICE · OCT
export const B_tape: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 6.0), 5.0);
  const words = useMemo(() => Array.from({ length: 10 }, (_, i) => cardTex(["RICE · OCT".slice(0, i + 1)], { bg: TAPE, fg: "#2a2a2a", w: 384, h: 120 })), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.9, 1.1], [0, 0.05, -0.05]), C([0.2, 0.85, 1.05], [0, 0.05, -0.05]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.1 }}
    scene={(tt) => { const roll = eio(tt, 0.4, 1.8), w = eio(tt, 2.0, a - 0.4);
      return <>
        <Pack p={[0, 0, 0]} w={0.8} d={0.55} c={MEAT} />
        <group position={[lerp(-0.45, 0.3, roll), 0.12, -0.1]} rotation={[Math.PI / 2, 0, 0]}><mesh rotation={[0, roll * 8, 0]}><torusGeometry args={[0.1, 0.045, 12, 32]} /><meshStandardMaterial color={TAPE} roughness={0.9} /></mesh></group>
        <mesh position={[lerp(-0.45, 0.3, roll) / 2 - 0.15, 0.05, -0.1]} rotation={[-Math.PI / 2, 0, 0]} scale={[Math.max(0.01, roll), 1, 1]}><planeGeometry args={[0.72, 0.225]} /><meshStandardMaterial map={words[Math.min(9, Math.floor(w * 10))]} roughness={0.9} /></mesh>
        {tt > 1.9 && <group position={[lerp(-0.35, 0.25, w), 0.12 + 0.01 * Math.sin(tt * 30), -0.06]} rotation={[0.2, 0, -0.7]}><Cyl p={[0, 0, 0]} r={0.012} h={0.26} c="#f2c230" rough={0.6} /><Cyl p={[0, -0.14, 0]} r={0.012} h={0.03} c="#e6c3a0" r2={0.002} rough={0.7} /></group>}
      </>; }}
    over={(tt) => <Ink tt={tt} at={a} txt="WHAT IT IS · THE MONTH" col={AMB} />} />;
};

// 14:03 · PRIMERO ENTRA, PRIMERO SALE: una calesita de paquetes con meses gira; el más viejo (JUL) viene adelante y se ilumina
export const B_fifo: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 6.0), 8.0);
  const ms = useMemo(() => ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].map((m) => cardTex([m], { bg: TAPE, fg: "#3a2a18", w: 256, h: 96 })), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 1.0, 2.2], [0, 0.25, 0]), C([0.3, 0.95, 2.05], [0, 0.25, 0]), 10)}
    set={{ spot: [0, 0.2, 0.5] as V, spotK: 0.35 }}
    scene={(tt) => { const rot = eio(tt, 0.6, 3.0) * Math.PI * 1.0;
      return <>
        <Cyl p={[0, 0.02, 0]} r={0.75} h={0.04} c="#dfe6ea" rough={0.4} />
        {ms.map((m, i) => { const an = rot + (i / 6) * Math.PI * 2 + Math.PI / 2; const x = 0.55 * Math.cos(an), z = 0.55 * Math.sin(an);
          return <group key={i} position={[x, 0.2, z]} rotation={[0, -an + Math.PI / 2, 0]}><Box p={[0, 0, 0]} s={[0.3, 0.32, 0.06]} c={[MEAT, RICE, "#c9a46a", "#8a5a2a", RICE, "#e6b7b0"][i]} r={0.6} rad={0.02} />
            <mesh position={[0, 0.06, 0.035]}><planeGeometry args={[0.24, 0.09]} /><meshStandardMaterial map={m} emissive={i === 0 ? "#ffb347" : "#000"} emissiveIntensity={i === 0 ? 0.4 * eio(tt, 3.0, 3.6) : 0} /></mesh></group>; })}
        <Ring p={[0, 0.045, 0.55]} r={0.22} k={eio(tt, 3.0, 3.6)} />
        {tt > a - 0.5 && [0, 1, 2].map((i) => <Pop key={i} k={pop(tt, a - 0.5 + 0.2 * i)} p={[-0.95 + 0.12 * i, 0.08, -0.3]}><Box p={[0, 0, 0]} s={[0.18, 0.12, 0.14]} c="#9aa3ab" r={0.4} rad={0.03} /><Box p={[0, 0, 0]} s={[0.19, 0.13, 0.15]} c="#f4fbff" r={0.6} rad={0.035} op={0.5} /></Pop>)}
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.2} txt="OLD THINGS TO THE FRONT" col={AMB} />} />;
};

// 14:21 · RELOJES DE ARENA DE HIELO: cuatro relojes de arena de distinto tamaño (arroz 1, carne cruda 3-4, cocido 1-2, pan 3) caen de a uno
export const B_hourglass: F = ({ t, h }) => {
  const a = 8.0;
  const L = useMemo(() => [["RICE", "1 MO"], ["RAW MEAT", "3-4 MO"], ["COOKED", "1-2 MO"], ["BREAD", "3 MO"]].map((x) => cardTex(x, { bg: "#fbf3df", fg: "#2a3a4a", w: 256, h: 160 })), []);
  const sz = [0.55, 1.0, 0.7, 0.85];
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.75, 2.5], [0, 0.3, 0]), C([0.3, 0.72, 2.35], [0, 0.3, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => <>
      {sz.map((s, i) => { const k = pop(tt, 0.4 + 0.6 * i), run = eio(tt, 0.8 + 0.6 * i, a);
        return k < 0.02 ? null : <Pop key={i} k={k} p={[-0.75 + 0.5 * i, 0, 0]}><group scale={s}>
          <Cyl p={[0, 0.02, 0]} r={0.16} h={0.04} c="#7a5634" rough={0.6} /><Cyl p={[0, 0.62, 0]} r={0.16} h={0.04} c="#7a5634" rough={0.6} />
          <mesh position={[0, 0.46, 0]} scale={[1, 1.1, 1]}><sphereGeometry args={[0.13, 28, 18]} /><meshStandardMaterial color="#e9f6ff" transparent opacity={0.3} roughness={0.02} side={THREE.DoubleSide} depthWrite={false} /></mesh>
          <mesh position={[0, 0.18, 0]} scale={[1, 1.1, 1]}><sphereGeometry args={[0.13, 28, 18]} /><meshStandardMaterial color="#e9f6ff" transparent opacity={0.3} roughness={0.02} side={THREE.DoubleSide} depthWrite={false} /></mesh>
          {[-1, 1].map((k) => <Cyl key={k} p={[k * 0.14, 0.32, 0]} r={0.012} h={0.6} c="#7a5634" rough={0.6} />)}
          {Array.from({ length: 14 }, (_, j) => <mesh key={"u" + j} position={[0.07 * Math.cos(j * 2.1) * (j % 3) / 2, 0.4 + 0.012 * (j % 4) - 0.06 * run, 0.07 * Math.sin(j * 2.1) * (j % 3) / 2]} scale={j / 14 < 1 - run ? 1 : 0.001}><octahedronGeometry args={[0.03, 0]} /><meshStandardMaterial color="#f4fbff" emissive="#bfe3ff" emissiveIntensity={0.3} roughness={0.05} /></mesh>)}
          {Array.from({ length: 14 }, (_, j) => <mesh key={"d" + j} position={[0.07 * Math.cos(j * 2.1) * (j % 3) / 2, 0.09 + 0.012 * (j % 4), 0.07 * Math.sin(j * 2.1) * (j % 3) / 2]} scale={j / 14 < run ? 1 : 0.001}><octahedronGeometry args={[0.03, 0]} /><meshStandardMaterial color="#f4fbff" emissive="#bfe3ff" emissiveIntensity={0.3} roughness={0.05} /></mesh>)}
          {run > 0.02 && run < 0.98 && <Cyl p={[0, 0.25, 0]} r={0.006} h={0.2} c="#dff2ff" rough={0.1} />}
        </group><mesh position={[0, -0.0, 0.25]} rotation={[-0.5, 0, 0]}><planeGeometry args={[0.32, 0.2]} /><meshStandardMaterial map={L[i]} /></mesh></Pop>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={a - 1.0} txt="SAFE · BUT THE TASTE FADES" col={AMB} />} />;
};

// 15:28 · LA BOLSA EN EL BOL: la bolsa baja al agua hasta el cierre, las burbujas escapan y el plástico se pega a la comida
export const B_airbowl: F = ({ t, h }) => {
  const a = it(h, 0, 4.0);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 0.8, 1.9], [0, 0.25, 0]), C([0.4, 0.75, 1.75], [0, 0.25, 0]), 9)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const dn = eio(tt, a - 0.4, a + 1.0), air = 1 - eio(tt, a + 0.4, a + 2.2);
      return <>
        <Cyl p={[0, 0.17, 0]} r={0.48} h={0.34} c="#e9f4f8" rough={0.05} op={0.12} />
        <Cyl p={[0, 0.15, 0]} r={0.46} h={0.28} c="#8fcbed" rough={0.05} op={0.18} />
        <group position={[0, lerp(0.6, 0.18, dn), 0]}>
          <Box p={[0, 0, 0]} s={[0.3, 0.06, 0.22]} c={MEAT} r={0.6} rad={0.02} />
          <mesh scale={[0.2 + 0.05 * air, 0.08 + 0.12 * air, 0.15 + 0.04 * air]}><sphereGeometry args={[1, 32, 16]} /><meshStandardMaterial color="#f2a8a0" transparent opacity={0.7} roughness={0.1} depthWrite={false} /></mesh>
          <Box p={[0, 0.14 + 0.06 * air, 0]} s={[0.36, 0.02, 0.03]} c="#3a7bd5" r={0.4} rad={0.005} />
        </group>
        {dn > 0.3 && air > 0.05 && Array.from({ length: 12 }, (_, i) => { const u = ((tt * 0.9 + i / 12) % 1); return <mesh key={i} position={[0.15 * Math.sin(i * 2), 0.2 + 0.18 * u, 0.12 * Math.cos(i * 1.3)]}><sphereGeometry args={[0.03 + 0.02 * (i % 3), 12, 8]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} transparent opacity={0.85 * air * (1 - u)} roughness={0.02} /></mesh>; })}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.6} txt="AIR = FREEZER BURN" col="#ff8a7a" y={250} /><Ink tt={tt} at={a + 1.4} txt="THE WATER PUSHES IT OUT" col={ICE} /></>} />;
};

// 15:44 · EN LA MESADA, NUNCA: corte de un bife: el borde se calienta (naranja) y aparecen puntitos verdes mientras el centro sigue helado
export const B_counter: F = ({ t, h }) => {
  const a = it(h, 0, 5.0);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.9, 1.7], [0, 0.12, 0]), C([0.3, 0.85, 1.6], [0, 0.12, 0]), 10)}
    set={(tt: number) => ({ spot: [0, 0, 0] as V, spotK: 0.3, warm: tt < a ? 0.7 : 0.1 })}
    scene={(tt) => { const w = eio(tt, 0.5, a - 0.5), fr = eio(tt, a, a + 1.0);
      return <>
        {[0, 1, 2, 3].map((i) => { const f = i / 3; const hot = cl((w * 1.3 - f) * 2) * (1 - fr);
          return <Box key={i} p={[0, 0.14, 0.25 + 0.012 * i]} s={[0.8 - 0.17 * i, 0.26 - 0.05 * i, 0.012]} c={new THREE.Color(i === 0 ? "#b5544a" : "#9fc9e6").lerp(new THREE.Color("#d8453a"), hot).getStyle()} r={0.6} rad={0.06} op={1} />; })}
        <Box p={[0, 0.14, 0]} s={[0.84, 0.28, 0.5]} c="#8a3a30" r={0.6} rad={0.08} />
        <Box p={[0, 0.29, 0]} s={[0.8, 0.012, 0.46]} c="#f3e6dc" r={0.7} rad={0.004} />
        {w > 0.4 && fr < 0.95 && Array.from({ length: 20 }, (_, i) => { const an = (i / 20) * Math.PI * 2; return <Pop key={i} k={pop(tt, 1.8 + 0.12 * i) * (1 - fr)} p={[0.37 * Math.cos(an) + 0.01 * Math.sin(tt * 9 + i), 0.14 + 0.115 * Math.sin(an), 0.3]}><mesh><sphereGeometry args={[0.024, 10, 8]} /><meshStandardMaterial color="#7fdc5a" emissive="#4a9a2a" emissiveIntensity={0.4} /></mesh></Pop>; })}
        {fr > 0.02 && <group position={[0, 0, 0]}><Box p={[0, 0.35, -0.1]} s={[1.1, 0.7, 0.04]} c="#e6eef2" r={0.4} rad={0.02} op={0.6 * fr} /><Box p={[0, 0.02, 0]} s={[1.1, 0.02, 0.7]} c="#e6eef2" r={0.4} rad={0.01} op={0.8 * fr} /></group>}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.6} txt="WARM OUTSIDE · FROZEN INSIDE" col="#ff8a7a" y={250} /><Ink tt={tt} at={a + 0.6} txt="THAW IN THE FRIDGE" col={ICE} /></>} />;
};

// 16:16 · EL AIRE QUE CIRCULA: freezer en corte con partículas frías: lleno = se traban; 3/4 con botellas de agua = giran libres
export const B_airflow: F = ({ t, h }) => {
  const a = it(h, 0, 3.0), b = it(h, 1, 6.0);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.75, 1.85], [0, 0.45, 0]), C([0.25, 0.72, 1.75], [0, 0.45, 0]), 10)}
    set={{ spot: [0, 0.4, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const full = 1 - eio(tt, a - 0.4, a + 0.4), bot = eio(tt, b, b + 0.8);
      const boxes = Array.from({ length: full > 0.5 ? 12 : 7 }, (_, i) => [((i % 4) - 1.5) * 0.15, 0.15 + Math.floor(i / 4) * 0.2]);
      return <>
        <Freezer p={[0, 0, 0]} s={1.0} frost={0.3} />
        {boxes.map(([x, y], i) => <Box key={i} p={[x, y, 0.02]} s={[0.13, 0.16, 0.28]} c={[MEAT, RICE, "#c9a46a", "#8fb38a"][i % 4]} r={0.6} rad={0.02} />)}
        {bot > 0.02 && [0, 1].map((i) => <Pop key={i} k={pop(tt, b + 0.2 * i)} p={[-0.18 + 0.36 * i, 0.75, 0.05]}><Cyl p={[0, 0, 0]} r={0.05} h={0.2} c="#bfe3ff" rough={0.05} op={0.6} /><Cyl p={[0, 0.12, 0]} r={0.02} h={0.04} c="#3a7bd5" rough={0.4} /></Pop>)}
        {Array.from({ length: 16 }, (_, i) => { const sp = full > 0.5 ? 0.08 : 0.5; const u = ((tt * sp + i / 16) % 1), an = u * Math.PI * 2;
          return <mesh key={i} position={[0.3 * Math.cos(an), 0.5 + 0.35 * Math.sin(an), 0.25]} rotation={[0, 0, an]}><coneGeometry args={[0.025, 0.07, 8]} /><meshStandardMaterial color="#9fdcff" emissive="#5ab8f0" emissiveIntensity={0.8} transparent opacity={full > 0.5 ? 0.45 : 0.95} /></mesh>; })}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.6} txt="TOO FULL: THE COLD CAN'T MOVE" col="#ff8a7a" y={250} /><Ink tt={tt} at={b + 0.6} txt="3/4 FULL · BOTTLES OF WATER" col={ICE} /></>} />;
};

// 16:35 · LO QUE MAMÁ NUNCA CONGELABA: papa, lechuga, huevo y mayonesa en fila; a cada uno le cae un sello rojo de NO al nombrarlo
export const B_never: F = ({ t, h }) => {
  const ts = [0.5, it(h, 0, 3.0), it(h, 1, 5.5), it(h, 2, 8.0)];
  const no = useMemo(() => mk(256, 256, (g) => { g.clearRect(0, 0, 256, 256); g.strokeStyle = RED; g.lineWidth = 18; g.beginPath(); g.arc(128, 128, 112, 0, Math.PI * 2); g.stroke(); g.fillStyle = RED; g.font = "900 120px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("NO", 128, 136); }), []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.6, 1.9], [0, 0.25, 0]), C([0.12, 0.6, 1.85], [0, 0.25, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.25 }}
    scene={(tt) => <group scale={1.15}>
      <group position={[-0.54, 0, 0]}><mesh position={[0, 0.1, 0]} scale={[1.2, 0.85, 0.9]}><sphereGeometry args={[0.12, 24, 16]} /><meshStandardMaterial color="#b98a5a" roughness={0.9} /></mesh></group>
      <group position={[-0.18, 0, 0]}>{[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.03 * Math.sin(i), 0.1 + 0.02 * i, 0]} rotation={[0.4 * i, i, 0.3]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.12 - 0.015 * i, 20, 12]} /><meshStandardMaterial color={i % 2 ? "#8fc76a" : "#a9d885"} roughness={0.8} side={THREE.DoubleSide} /></mesh>)}</group>
      <group position={[0.18, 0, 0]}><mesh position={[0, 0.11, 0]} scale={[0.8, 1, 0.8]}><sphereGeometry args={[0.11, 24, 16]} /><meshStandardMaterial color="#f3e6d2" roughness={0.6} /></mesh>
        {tt > ts[2] && <Box p={[0.02, 0.15, 0.085]} s={[0.006, 0.08, 0.004]} c="#6a4a2a" r={0.9} rad={0.001} rot={[0, 0, 0.4]} />}</group>
      <group position={[0.54, 0, 0]}><Cyl p={[0, 0.1, 0]} r={0.08} h={0.2} c="#f8f3e0" rough={0.15} op={0.85} /><Cyl p={[0, 0.215, 0]} r={0.085} h={0.03} c="#3a7bd5" rough={0.4} /></group>
      {ts.map((s, i) => { const k = pop(tt, s + 0.6); return k < 0.02 ? null : <Pop key={i} k={k} p={[-0.54 + 0.36 * i, 0.42, 0.05]}><mesh rotation={[0, 0, -0.2]}><planeGeometry args={[0.2, 0.2]} /><meshStandardMaterial map={no} transparent emissive={RED} emissiveIntensity={0.3} emissiveMap={no} /></mesh></Pop>; })}
    </group>}
    over={(tt) => <Ink tt={tt} at={ts[3] + 1.0} txt="NEVER IN THE FREEZER" col="#ff8a7a" />} />;
};

// 17:55 · LA BOLSA QUE SE LLENA: tres chorritos (soja, mirin, jengibre rallado) caen en la bolsa de pollo y se tiñe de marrón
export const B_marinade: F = ({ t, h }) => {
  const a = it(h, 0, 4.0);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.8, 1.9], [0, 0.48, 0]), C([0.2, 0.8, 1.85], [0, 0.48, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.5 }}
    scene={(tt) => { const s1 = eio(tt, 0.5, 2.0), s2 = eio(tt, a, a + 1.5), g = eio(tt, a + 1.6, a + 3.0), tint = (s1 + s2) / 2;
      return <>
        <group position={[0, 0.25, 0]} rotation={[0.2, 0, 0]}><Box p={[0, 0, 0]} s={[0.56, 0.56, 0.08]} c="#e3f2fb" r={0.05} rad={0.05} op={0.4} /><Box p={[0, 0.27, 0]} s={[0.58, 0.035, 0.09]} c="#3a7bd5" r={0.4} rad={0.01} />
          {Array.from({ length: 10 }, (_, i) => <Box key={i} p={[-0.16 + 0.11 * (i % 4), -0.18 + 0.1 * Math.floor(i / 4), 0]} s={[0.1, 0.08, 0.06]} c={new THREE.Color("#f2c2a8").lerp(new THREE.Color("#8a4a22"), tint * 0.8).getStyle()} r={0.6} rad={0.03} />)}
          <mesh position={[0, -0.27 + 0.25 * tint, 0.045]}><planeGeometry args={[0.54, 0.5 * tint + 0.001]} /><meshStandardMaterial color="#4a1e08" transparent opacity={0.72} roughness={0.1} /></mesh><mesh position={[0, -0.27 + 0.25 * tint, -0.045]}><planeGeometry args={[0.54, 0.5 * tint + 0.001]} /><meshStandardMaterial color="#4a1e08" transparent opacity={0.6} /></mesh></group>
        {[[-0.14, "#3a1a0a", s1], [0, "#e2b34a", s2], [0.14, "#f2d37a", g]].map(([x, c, k], i) => (k as number) > 0.02 && (k as number) < 0.98 ? <group key={i}><Cyl p={[x as number, 0.62, 0.04]} r={i === 0 ? 0.034 : 0.026} h={0.4} c={i === 0 ? "#2a0e04" : (c as string)} rough={0.1} /><group position={[(x as number) + 0.08, 0.88, 0.04]} rotation={[0, 0, 2.2]}><Cyl p={[0, 0, 0]} r={0.06} h={0.2} c={i === 2 ? "#c9a46a" : (c as string)} rough={0.15} op={0.9} /></group></group> : null)}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.8} txt="2 TBSP SOY" col={AMB} y={200} size={72} /><Ink tt={tt} at={a + 0.5} txt="+ MIRIN · + GINGER" col={AMB} y={960} /></>} />;
};

// 18:27 · EL SABOR VIAJA HACIA ADENTRO: corte de un trozo de pollo congelado: la escarcha se retira y la salsa avanza en anillos
export const B_inside: F = ({ t, h }) => {
  const a = it(h, 0, 4.5);
  const shape = useMemo(() => { const sh = new THREE.Shape(); sh.moveTo(-0.42, 0.02); sh.bezierCurveTo(-0.42, 0.26, -0.1, 0.3, 0.12, 0.2); sh.bezierCurveTo(0.32, 0.12, 0.46, 0.02, 0.44, -0.06); sh.bezierCurveTo(0.4, -0.18, 0.1, -0.24, -0.16, -0.2); sh.bezierCurveTo(-0.34, -0.17, -0.42, -0.1, -0.42, 0.02); return sh; }, []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.45, 1.5], [0, 0.3, 0]), C([0.22, 0.45, 1.42], [0, 0.3, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.4 }}
    scene={(tt) => { const k = eio(tt, 0.6, a + 1.5);
      return <group position={[0, 0.3, 0]}>
        <mesh position={[0, 0, -0.05]}><extrudeGeometry args={[shape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 3 }]} /><meshStandardMaterial color="#d9a066" roughness={0.45} /></mesh>
        {Array.from({ length: 6 }, (_, i) => { const f = i / 5, sauce = cl((k - f * 0.8) * 2.4), frost = cl(1 - k * 1.4 - (1 - f) * 0.1);
          const c = new THREE.Color("#f7d3bf").lerp(new THREE.Color("#6a3412"), sauce * 0.9).lerp(new THREE.Color("#ffffff"), frost * 0.8);
          return <mesh key={i} position={[0.03 * f, 0, 0.022 + 0.003 * i]} scale={1 - 0.15 * i}><shapeGeometry args={[shape]} /><meshStandardMaterial color={c.getStyle()} roughness={0.6} /></mesh>; })}
        {cl(1 - k * 1.4) > 0.05 && Array.from({ length: 12 }, (_, i) => <mesh key={"fz" + i} position={[0.03 + 0.12 * Math.cos(i * 2.4) * ((i % 4) / 4), 0.07 * Math.sin(i * 2.4) * ((i % 4) / 4), 0.05]}><octahedronGeometry args={[0.018 * cl(1 - k * 1.4), 0]} /><meshStandardMaterial color="#ffffff" emissive="#cfe9ff" emissiveIntensity={0.6} /></mesh>)}
      </group>; }}
    over={(tt) => <><Ink tt={tt} at={0.8} txt="FROZEN CENTER SHRINKS" col={ICE} y={250} /><Ink tt={tt} at={a} txt="JUICY · TENDER" col={AMB} /></>} />;
};

// 18:44 · LA TAPA Y EL RELOJ: el bloque congelado entra a la sartén, cae la tapa, el reloj de cocina gira, la tapa se levanta y brilla el glaseado
export const B_lid: F = ({ t, h }) => {
  const a = Math.max(1.5, Math.min(it(h, 0, 3.0) - 4.5, 4.5));
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 1.15, 1.9], [0, 0.15, 0]), C([0.4, 1.05, 1.75], [0, 0.15, 0]), 9)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.5 }}
    scene={(tt) => { const lid = eio(tt, a - 0.3, a + 0.3) * (1 - eio(tt, a + 4.0, a + 4.6)), melt = eio(tt, 0.5, a + 4.0), tim = eio(tt, a + 0.3, a + 4.0);
      return <>
        <Pan p={[0, 0, 0]} heat={0.8} />
        <Box p={[0, 0.1, 0]} s={[0.36 * (1 + 0.2 * melt), 0.08 * (1 - 0.6 * melt), 0.26 * (1 + 0.2 * melt)]} c={new THREE.Color("#c9b6a8").lerp(new THREE.Color("#8a4a22"), melt).getStyle()} r={0.6 - 0.5 * melt} rad={0.02} />
        <group position={[0, 0.08 + 0.5 * (1 - lid), 0]}><mesh position={[0, 0.06, 0]} scale={[1, 0.3, 1]}><sphereGeometry args={[0.36, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#e9f4f8" transparent opacity={0.35 * (lid > 0.02 ? 1 : 0)} roughness={0.02} depthWrite={false} /></mesh><Cyl p={[0, 0.17, 0]} r={0.03} h={0.04} c="#1a1a1a" rough={0.5} /></group>
        <group position={[0.65, 0, 0.2]}><mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color="#f2f2f2" roughness={0.3} /></mesh><group position={[0, 0.17, 0]} rotation={[0, tim * Math.PI * 2, 0]}><Box p={[0, 0, 0.05]} s={[0.01, 0.02, 0.06]} c={RED} r={0.4} rad={0.003} /></group></group>
        <Steam p={[0, 0.1, 0]} t={tt} k={(1 - lid) * 0.5} s={0.4} />
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 4.2} txt="THICK · SHINY · 10 MINUTES" col={AMB} />} />;
};

// 19:31 · TRES SABORES: tres bolsas se abren en abanico, cada una con su ingrediente que flota arriba (jengibre, miso, ajo y sésamo)
export const B_three: F = ({ t, h }) => {
  const a = 0.5;
  const Ls = [useLabel("SOY · GINGER"), useLabel("MISO · HONEY"), useLabel("GARLIC · SESAME")];
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.55, 1.9], [0, 0.2, 0]), C([0.2, 0.55, 1.85], [0, 0.2, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.5 }}
    scene={(tt) => <>
      {["#5a2a12", "#c9a46a", "#a8743a"].map((c, i) => { const k = pop(tt, a + 0.8 * i), an = (i - 1) * 0.5 * Math.min(1, k);
        return k < 0.02 ? null : <group key={i} position={[(i - 1) * 0.56 * Math.min(1, k), 0, 0]} rotation={[0, -an * 0.5, 0]}><Pack p={[0, 0.2, -0.1]} w={0.5} d={0.4} c={c} label={Ls[i]} rot={[1.25, 0, 0]} />
          <Pop k={pop(tt, a + 0.8 * i + 0.4)} p={[0, 0.08, 0.22]}><group scale={1.6}>{i === 0 ? <mesh rotation={[0.5, 0, 0.6]}><capsuleGeometry args={[0.03, 0.08, 6, 12]} /><meshStandardMaterial color="#e8c47a" roughness={0.7} /></mesh>
            : i === 1 ? <mesh><sphereGeometry args={[0.06, 20, 12]} /><meshStandardMaterial color="#c9a46a" roughness={0.9} /></mesh>
            : <group><mesh scale={[1, 1.15, 1]}><sphereGeometry args={[0.05, 20, 12]} /><meshStandardMaterial color="#f4efe2" roughness={0.6} /></mesh>{[0, 1, 2, 3, 4].map((j) => <mesh key={j} position={[0.08 * Math.cos(j), 0.05 * Math.sin(j * 2), 0.04]}><sphereGeometry args={[0.008, 6, 4]} /><meshStandardMaterial color="#f0e2b8" /></mesh>)}</group>}</group></Pop>
        </group>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={a + 2.6} txt="EVERY DINNER IS DIFFERENT" col={AMB} />} />;
};

// 20:02 · LA BANDEJA DEL DOMINGO: un reloj de 1 hora avanza y a la bandeja de metal van llegando arroz, carne con líneas, hongos, tofu y pollo
export const B_sunday: F = ({ t, h }) => {
  const a = 0.4;
  const hr = useMemo(() => cardTex(["1 HOUR"], { bg: "#fbf3df", fg: "#3a2a18", w: 256, h: 96 }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 1.15, 1.85], [0.1, 0.12, 0]), C([0.25, 1.1, 1.75], [0.1, 0.12, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const hand = eio(tt, a, a + 7.0);
      return <>
        <Box p={[0, 0.015, 0]} s={[1.5, 0.03, 1.0]} c="#cfd3d8" m={0.95} r={0.15} rad={0.008} />
        {[[RiceSq, [-0.4, 0.02, -0.2]], [null, [0.05, 0.02, -0.2]], [null, [0.42, 0.02, -0.2]], [null, [-0.3, 0.02, 0.2]], [null, [0.25, 0.02, 0.2]]].map(([, p], i) => { const k = pop(tt, a + 0.9 + 1.1 * i);
          if (k < 0.02) return null; const P = p as V;
          return <Pop key={i} k={k} p={[P[0], P[1] + 0.3 * (1 - Math.min(1, k)), P[2]]}>{i === 0 ? <RiceSq p={[0, 0, 0]} s={0.9} />
            : i === 1 ? <group><Box p={[0, 0.02, 0]} s={[0.32, 0.03, 0.26]} c={MEAT} r={0.6} rad={0.01} />{[-1, 0, 1].map((j) => <Box key={j} p={[j * 0.1, 0.037, 0]} s={[0.008, 0.004, 0.24]} c="#7a2a22" r={0.8} rad={0.002} />)}</group>
            : i === 2 ? <Pack p={[0, 0, 0]} w={0.3} d={0.24} c="#c9a46a" />
            : i === 3 ? <Tofu p={[0, 0, 0]} s={0.6} />
            : <Pack p={[0, 0, 0]} w={0.36} d={0.26} c="#5a2a12" />}</Pop>; })}
        <group position={[0.95, 0.32, -0.45]}><Cyl p={[0, 0, 0]} r={0.24} h={0.03} c="#cfc3a6" rough={0.95} rot={[Math.PI / 2, 0, 0]} />
          <group rotation={[0, 0, -hand * Math.PI * 2]}><Box p={[0, 0.07, 0.02]} s={[0.012, 0.14, 0.01]} c="#2a2a2a" r={0.5} rad={0.003} /></group>
          <mesh position={[0, -0.27, 0]}><planeGeometry args={[0.26, 0.1]} /><meshStandardMaterial map={hr} /></mesh></group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 6.2} txt="DINNER IS HALFWAY DONE" col={AMB} />} />;
};

// 21:14 · LAS CIRUELAS DE MAMÁ: una bolsita escarchada con umeboshi rojos y un rótulo gastado OSAKA 2009; luz tibia, Sachiko la mira
export const B_umeboshi: F = ({ t, h }) => {
  const a = it(h, 0, 4.0);
  const lab = useMemo(() => cardTex(["OSAKA", "2009"], { bg: "#efe3c4", fg: "#6a4a2a", w: 256, h: 160 }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 0.75, 1.9], [-0.2, 0.25, 0]), C([0.3, 0.7, 1.8], [-0.2, 0.27, 0]), 12)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.45, warm: 0.9 }}
    scene={(tt) => { const glow = eio(tt, a - 0.5, a + 1.5);
      return <>
        <group position={[0.15, 0, 0.1]} scale={1.8}>
        <Box p={[0, 0.06, 0]} s={[0.46, 0.12, 0.34]} c="#f4fbff" r={0.1} rad={0.04} op={0.18} />
        {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.14 + 0.07 * (i % 4), 0.06 + 0.02 * (i % 2), -0.06 + 0.1 * Math.floor(i / 4)]} scale={[1, 0.9, 1]}><sphereGeometry args={[0.045, 20, 14]} /><meshStandardMaterial color="#d0222a" roughness={0.45} emissive="#ff3a2a" emissiveIntensity={0.15 + 0.2 * glow} /></mesh>)}
        <mesh position={[0.06, 0.15, 0.17]} rotation={[-0.7, 0, -0.08]}><planeGeometry args={[0.22, 0.14]} /><meshStandardMaterial map={lab} roughness={0.95} /></mesh>
        </group>
        <pointLight position={[0, 0.5, 0.3]} intensity={0.3 + 0.8 * glow} distance={2} color="#ffc070" />
        <Sachi p={secuencia([[0, P0], [a, POSES.cabizbajo]], tt)} t={tt} x={-0.55} z={-0.25} rotY={35} s={S * 0.75} expr="enamorado" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 1.0} txt="MY MOTHER'S UMEBOSHI" col={AMB} />} />;
};
