// sk8pe · la cuchara de miso: 25 componentes únicos, uno por idea (registro en D:/rtmp/premium8n_sachiko_COMPONENTES.md).
import React, { useMemo } from "react";
import * as THREE from "three";
import { F, Hero, C, lerp, pop, Pop, Ink, cardTex, Ring, cl, eio, orbita, Box, Cyl, AMB, V } from "./hk";
import { Board, Pot, Glass, Dish, Kombu, Waft, Burner, col, rnd, STEEL, WOOD } from "./hpk";

const RED = "#ff8a7a", GRN = "#bfe08a";
const DK = { back: false, bg: "#2a2018" };
const MISO = "#b57428", MISOD = "#6a3a18", MISOL = "#dcb868", SOUP = "#b98232", CREAM = "#f3e7c8";
type A = [number, number, number];
const Cm = (d: number, a: A, b: A, at: V) => (tt: number) => orbita(tt, C(a, at), C(b, at), d);
const Card: React.FC<{ p: V; rot?: V; w: number; h: number; map: THREE.Texture }> = ({ p, rot = [0, 0, 0], w, h, map }) =>
  <mesh position={p} rotation={rot}><planeGeometry args={[w, h]} /><meshBasicMaterial map={map} toneMapped={false} side={THREE.DoubleSide} /></mesh>;
const Soft: React.FC<{ p: V; r: number; c: string; op: number }> = ({ p, r, c, op }) =>
  <mesh position={p}><sphereGeometry args={[r, 12, 10]} /><meshStandardMaterial color={c} transparent opacity={op} depthWrite={false} roughness={0.9} /></mesh>;
const Lump: React.FC<{ p: V; r?: number; c?: string; sy?: number }> = ({ p, r = 0.09, c = MISO, sy = 0.82 }) =>
  <mesh position={p} scale={[1, sy, 1]} castShadow><icosahedronGeometry args={[r, 2]} /><meshStandardMaterial color={c} roughness={0.72} flatShading /></mesh>;

// 0:24 · LA NUEZ: se abre en dos y adentro está la bola de miso
const WHalf: React.FC<{ d: number; a: number }> = ({ d, a }) =>
  <group position={[0, 0.07, 0]} rotation={[0, 0, -d * a]}><group position={[0, 0.15, 0]} rotation={[0, d > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
    <mesh castShadow><sphereGeometry args={[0.15, 28, 20, 0, Math.PI]} /><meshStandardMaterial color="#9a6a38" roughness={0.75} side={THREE.DoubleSide} /></mesh>
    {[0.35, 0.8, 1.3, 1.85, 2.35, 2.8].map((al) => <mesh key={al} rotation={[al, 0, 0]}><torusGeometry args={[0.151, 0.008, 6, 26, Math.PI]} /><meshStandardMaterial color="#6d4620" roughness={0.85} /></mesh>)}
  </group></group>;
export const E_walnut: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={Cm(8, [0.12, 0.56, 1.2], [-0.22, 0.5, 1.06], [0, 0.2, 0])}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.55, warm: 0.5, ...DK }}
  scene={(tt) => { const op = pop(tt, 2.2, 6, 0.48) * 1.05, ball = eio(tt, 2.4, 3.4);
    return <>
      <Board w={1.2} d={0.8} c="#8a6a4a" />
      <WHalf d={-1} a={op} /><WHalf d={1} a={op} />
      <Lump p={[0, 0.1 + 0.13 * ball, 0]} r={0.1} />
      <Ring p={[0, 0.056, 0]} r={0.28} k={eio(tt, 3.2, 4.2)} col="#ffd27a" />
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.8} txt="THE SIZE OF A WALNUT" col={AMB} />} />;

// 0:51 · EL CAJÓN DE MADERA: la nena no llega a la mesada hasta que el cajón entra debajo
export const E_box: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={Cm(8, [0.42, 1.06, 2.3], [-0.42, 1.0, 2.1], [0, 0.72, 0])}
  set={{ spot: [0, 0.8, 0] as V, spotK: 0.4, warm: 0.5 }}
  scene={(tt) => { const sl = eio(tt, 1.0, 2.4), up = pop(tt, 2.8, 6, 0.5), hb = 0.3 * up;
    return <>
      <Box p={[0, 0.42, -0.42]} s={[1.5, 0.84, 0.62]} c="#a97d52" r={0.7} rad={0.02} />
      <Box p={[0, 0.86, -0.42]} s={[1.56, 0.04, 0.68]} c="#efe5d2" r={0.4} rad={0.012} />
      <Pot p={[0, 0.88, -0.42]} s={0.9} water={SOUP} />
      {Array.from({ length: 7 }, (_, i) => { const u = (tt * 0.4 + i / 7) % 1; return <Soft key={i} p={[0.03 * Math.sin(i + tt), 1.3 + u * 0.55, -0.42]} r={0.05 + 0.05 * u} c="#fff7e6" op={0.32 * (1 - u)} />; })}
      <Box p={[lerp(-1.3, 0, sl), 0.15, 0.32]} s={[0.46, 0.3, 0.42]} c="#c2935c" r={0.7} rad={0.016} />
      <group position={[0, hb, 0.32]}>
        <mesh position={[0, 0.3, 0]} castShadow><capsuleGeometry args={[0.13, 0.2, 8, 18]} /><meshStandardMaterial color="#b4453a" roughness={0.8} /></mesh>
        <mesh position={[0, 0.62, 0]} castShadow><sphereGeometry args={[0.135, 24, 18]} /><meshStandardMaterial color="#201b18" roughness={0.55} /></mesh>
        {[-1, 1].map((d) => <mesh key={d} position={[d * 0.11, 0.6, -0.15]} rotation={[0.9, 0, 0]}><capsuleGeometry args={[0.04, 0.3, 6, 12]} /><meshStandardMaterial color="#dcae88" roughness={0.6} /></mesh>)}
      </group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="SO I COULD SEE" col={AMB} />} />;

// 1:54 · EL BARRIL: hasta el pecho, y de ahí sale una sola cucharada
export const E_barrel: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={Cm(9, [0.62, 1.5, 2.0], [-0.5, 1.42, 1.86], [0, 0.72, 0])}
  set={{ spot: [0, 1.0, 0] as V, spotK: 0.55, warm: 0.45, ...DK }}
  scene={(tt) => { const dn = eio(tt, 1.2, 2.4), upk = eio(tt, 3.0, 4.6), y = lerp(lerp(1.36, 1.0, dn), 1.18, upk), got = tt > 2.6;
    return <>
      <mesh position={[0, 0.48, 0]} castShadow><cylinderGeometry args={[0.46, 0.4, 0.96, 26, 1, true]} /><meshStandardMaterial color="#8d6236" roughness={0.75} side={THREE.DoubleSide} flatShading /></mesh>
      {[0.14, 0.8].map((yy) => <mesh key={yy} position={[0, yy, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.415 + 0.05 * (yy / 0.96), 0.02, 8, 48]} /><meshStandardMaterial color="#34302b" metalness={0.6} roughness={0.45} /></mesh>)}
      <mesh position={[0, 0.925, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.44, 48]} /><meshStandardMaterial color={MISO} roughness={0.8} /></mesh>
      <group position={[0.1, y, 0.04]} rotation={[0, 0, -0.35]}>
        <Cyl p={[0.22, 0.26, 0]} r={0.016} h={0.62} c="#cfa36a" rough={0.7} rot={[0, 0, -0.62]} />
        <mesh position={[0, 0.02, 0]} rotation={[Math.PI, 0, 0]} scale={[1, 0.6, 1]}><sphereGeometry args={[0.095, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#cfa36a" roughness={0.65} side={THREE.DoubleSide} /></mesh>
        {got && <Lump p={[0, 0.045, 0]} r={0.075} />}
      </group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.1} txt="JUST ONE SPOONFUL" col={AMB} />} />;

// 2:26 · LA FLOR: el primer hervor se abre en pétalos y la llama se apaga
export const E_flower: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={Cm(9, [0.1, 1.5, 1.34], [-0.26, 1.34, 1.14], [0, 0.42, 0])}
  set={{ spot: [0, 0.4, 0] as V, spotK: 0.5, warm: 0.5, ...DK }}
  scene={(tt) => { const op = eio(tt, 1.0, 4.4), fl = 1 - eio(tt, 5.0, 5.6), S = 0.46;
    return <>
      <Burner p={[0, 0, 0]} s={1.5} flame={fl} t={tt} />
      <Pot p={[0, 0.06, 0]} s={1.5} water={SOUP} lvl={0.82} />
      {Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4, R = 0.03 + 0.17 * op; return <mesh key={i} position={[R * Math.cos(a), S, R * Math.sin(a)]} rotation={[0, -a, 0]} scale={[1, 0.34, 0.62]}><sphereGeometry args={[0.04 + 0.075 * op, 18, 12]} /><meshPhysicalMaterial color={CREAM} roughness={0.2} clearcoat={1} /></mesh>; })}
      <mesh position={[0, S + 0.015, 0]} scale={[1, 0.6, 1]}><sphereGeometry args={[0.06, 18, 12]} /><meshPhysicalMaterial color="#e7b64a" roughness={0.15} clearcoat={1} /></mesh>
    </>; }}
  over={(tt) => <Ink tt={tt} at={1.8} txt="THE FIRST BUBBLE" col={AMB} />} />;

// 2:46 · EL PERFUME: la botella se vacía mientras el aroma se va por la ventana
export const E_perfume: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={Cm(8, [0.24, 0.88, 2.2], [-0.2, 0.84, 2.0], [0.2, 0.56, 0])}
  set={{ spot: [0, 0.4, 0] as V, spotK: 0.4, warm: 0.4, ...DK }}
  scene={(tt) => { const lv = 0.8 - 0.7 * eio(tt, 1.0, 6.5);
    return <>
      <Board w={2.5} d={0.9} c="#8a6a4a" />
      <Pot p={[-0.5, 0.05, 0]} s={1} water={SOUP} />
      <Glass p={[0.1, 0.05, 0.14]} r={0.09} h={0.26} water="#e0932a" lvl={Math.max(0.05, lv)} op={0.92} />
      <Cyl p={[0.1, 0.36, 0.14]} r={0.035} h={0.05} c="#d6b05a" m={0.85} rough={0.25} />
      <group position={[1.0, 0.82, -0.2]}>
        <Box p={[0, 0, -0.03]} s={[0.56, 0.62, 0.02]} c="#a8d0ee" r={0.6} rad={0.004} />
        {[[0, 0.32, 0.62, 0.05], [0, -0.32, 0.62, 0.05], [-0.3, 0, 0.05, 0.66], [0.3, 0, 0.05, 0.66], [0, 0, 0.03, 0.62]].map(([x, y, w, hh], i) => <Box key={i} p={[x, y, 0]} s={[w, hh, 0.05]} c="#ece1cb" r={0.6} rad={0.008} />)}
      </group>
      {Array.from({ length: 90 }, (_, i) => { const u = (tt * 0.24 + i / 90) % 1, x = lerp(-0.5, 1.0, u), y = 0.42 + 0.42 * Math.sin(u * Math.PI * 0.62) + 0.07 * Math.sin(i * 2 + tt * 1.6), z = lerp(0, -0.2, u) + 0.06 * Math.sin(i * 3.7); return <Soft key={i} p={[x, y, z]} r={0.05 + 0.08 * u} c="#f0a23e" op={0.14 * Math.sin(Math.PI * u) * eio(tt, 0.3, 1.2)} />; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="IT DOES NOT COME BACK" col={RED} />} />;

// 3:37 · LA ISLA: pelota de miso con palmerita en un tazón; el otro, casi agua
export const E_island: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={Cm(8, [0.1, 1.2, 1.32], [-0.24, 1.08, 1.2], [0, 0.14, 0])}
  set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.55 }}
  scene={(tt) => { const k = pop(tt, 0.8, 6, 0.5), pal = pop(tt, 1.8);
    return <>
      <Board w={1.9} d={1.0} c="#a68260" />
      <Dish p={[-0.42, 0.05, 0]} s={1.5} fill="#c9b27a" />
      <Dish p={[0.42, 0.05, 0]} s={1.5} fill="#d9c9a0" />
      <Pop k={k} p={[-0.42, 0.29, 0]}><Lump p={[0, 0, 0]} r={0.15} c={MISOD} sy={0.62} /></Pop>
      <Pop k={pal} p={[-0.42, 0.37, 0]}>
        <Cyl p={[0, 0.08, 0]} r={0.008} h={0.16} c="#6b4a26" rough={0.8} />
        {[0, 1.57, 3.14, 4.71].map((a) => <group key={a} position={[0, 0.16, 0]} rotation={[0, a, 0.5]}><Box p={[0.06, 0, 0]} s={[0.13, 0.006, 0.035]} c="#5c8a3e" r={0.7} rad={0.002} /></group>)}
      </Pop>
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.4} txt="A LITTLE BROWN ISLAND" col={AMB} />} />;

// 4:15 · EL COLADOR: el grumo se deshace contra la malla
export const E_strainer: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={Cm(8, [0.3, 1.0, 1.1], [-0.2, 0.9, 1.0], [0, 0.28, 0])}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.5, warm: 0.5 }}
  scene={(tt) => { const g = 1 - 0.82 * eio(tt, 1.2, 6.0), a = tt * 3.6;
    return <>
      <Board w={1.2} d={0.9} c="#a68260" />
      <Dish p={[0, 0.05, 0]} s={1.7} fill={col("#d8c79a", SOUP, eio(tt, 1.2, 6))} />
      <group position={[0, 0.38, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}><sphereGeometry args={[0.18, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.3} wireframe /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.18, 0.009, 8, 40]} /><meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.2} /></mesh>
        <Box p={[0.38, 0, 0]} s={[0.4, 0.016, 0.03]} c={STEEL} m={0.9} r={0.25} rad={0.006} />
        <Lump p={[0, -0.09, 0]} r={0.085 * g + 0.012} />
        <group position={[0.03 * Math.cos(a), 0.06, 0.03 * Math.sin(a)]} rotation={[0.2, 0, -0.3]}><Cyl p={[0.08, 0.14, 0]} r={0.012} h={0.36} c="#cfa36a" rough={0.7} rot={[0, 0, -0.5]} /><Lump p={[0, -0.02, 0]} r={0.05} c="#cfa36a" sy={0.5} /></group>
      </group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.4} txt="NO LUMPS" col={GRN} size={110} />} />;

// 5:05 · LAS NUBES: nubes pálidas suben, se abren y bajan por los costados
export const E_clouds: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={Cm(12, [0.14, 0.62, 1.66], [-0.28, 0.58, 1.5], [0, 0.32, 0])}
  set={{ spot: [0, 0.2, 0] as V, spotK: 0.6, warm: 0.3, ...DK }}
  scene={(tt) => <>
    <Board w={1.4} d={0.9} c="#7a5a3e" />
    <Glass p={[0, 0.05, 0]} r={0.46} h={0.52} water="#a8741e" lvl={0.86} op={0.58}>
      {Array.from({ length: 170 }, (_, i) => { const u = (tt * 0.12 + i / 170) % 1, a = i * 2.4 + tt * 0.1, H = 0.42; let R: number, y: number;
        if (u < 0.45) { R = 0.04 + 0.06 * rnd(i); y = 0.06 + H * (u / 0.45); } else if (u < 0.65) { const k = (u - 0.45) / 0.2; R = 0.1 + 0.28 * k; y = H + 0.04 * Math.sin(k * Math.PI); } else { const k = (u - 0.65) / 0.35; R = 0.38 - 0.1 * k * k; y = H - (H - 0.06) * k; }
        return <Soft key={i} p={[R * Math.cos(a), y, R * Math.sin(a)]} r={0.06 + 0.05 * rnd(i + 3)} c="#fbf0d6" op={0.13 * eio(tt, 0, 1.2)} />; })}
    </Glass>
  </>}
  over={(tt) => <Ink tt={tt} at={2.6} txt="PALE CLOUDS RISE" col={AMB} />} />;

// 5:39 · EL CORTE: la olla por la mitad y los granos dibujando el calor
export const E_convect: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={Cm(10, [0.2, 0.62, 2.0], [-0.2, 0.6, 1.86], [0, 0.48, 0])}
  set={{ spot: [0, 0.3, 0] as V, spotK: 0.4, warm: 0.2, ...DK }}
  scene={(tt) => <>
    <Box p={[0, 0.5, -0.05]} s={[1.5, 0.7, 0.02]} c={SOUP} r={0.6} rad={0.002} />
    <Box p={[0, 0.13, 0]} s={[1.6, 0.05, 0.1]} c="#8f959c" m={0.7} r={0.35} rad={0.01} />
    {[-1, 1].map((d) => <Box key={d} p={[d * 0.78, 0.5, 0]} s={[0.05, 0.78, 0.1]} c="#8f959c" m={0.7} r={0.35} rad={0.01} />)}
    {Array.from({ length: 9 }, (_, i) => { const fl = 0.5 + 0.5 * Math.sin(tt * 7 + i * 1.7); return <mesh key={i} position={[-0.56 + i * 0.14, 0.03 + 0.03 * fl, 0]} scale={[1, 1 + 0.45 * fl, 1]}><coneGeometry args={[0.05, 0.1, 12]} /><meshBasicMaterial color={col("#ffb347", "#ff6a2a", fl)} toneMapped={false} /></mesh>; })}
    {Array.from({ length: 64 }, (_, i) => { const d = i % 2 ? 1 : -1, a = -d * (tt * 0.8) + Math.floor(i / 2) * Math.PI / 16, cx = d * 0.36, cy = 0.5, Q = 0.86 + 0.14 * rnd(i), x = cx + 0.31 * Q * Math.cos(a), y = cy + 0.25 * Q * Math.sin(a), hot = (0.25 - (y - cy)) / 0.5; return <mesh key={i} position={[x, y, 0.02]}><sphereGeometry args={[0.019, 10, 8]} /><meshBasicMaterial color={col("#fff0c4", "#e4421e", hot)} toneMapped={false} /></mesh>; })}
  </>}
  over={(tt) => <Ink tt={tt} at={2.6} txt="YOU CAN SEE THE HEAT" col={AMB} y={120} />} />;

// 6:12 · EL PARTE: un papelito sube con el vapor y se despliega
export const E_report: F = ({ t, h }) => { const a = useMemo(() => cardTex(["TODAY'S", "REPORT"], { bg: "#fff6e0", fg: "#3a2a18", w: 360, h: 180 }), []), b = useMemo(() => cardTex(["ALL GOOD"], { bg: "#fff6e0", fg: "#2e5a2e", w: 360, h: 180 }), []);
  return <Hero t={t} h={h} mode="drop" cam={Cm(8, [0.16, 0.88, 1.72], [-0.22, 0.84, 1.56], [0, 0.5, 0])}
    set={{ spot: [0, 0.3, 0] as V, spotK: 0.55, warm: 0.5, ...DK }}
    scene={(tt) => { const up = eio(tt, 0.5, 3.0), un = eio(tt, 3.2, 4.4), y = lerp(0.2, 0.68, up) + 0.012 * Math.sin(tt * 2);
      return <>
        <Board w={1.2} d={0.8} />
        <Dish p={[0, 0.05, 0]} s={1.5} fill={SOUP} />
        {Array.from({ length: 8 }, (_, i) => { const u = (tt * 0.45 + i / 8) % 1; return <Soft key={i} p={[0.09 * Math.sin(i * 2.7 + tt), 0.27 + u * 0.5, 0.05]} r={0.06 + 0.06 * u} c="#fff7e6" op={0.13 * (1 - u)} />; })}
        <group position={[0, y, 0.06]} rotation={[-0.12, 0, 0.05 * Math.sin(tt)]}>
          <Card p={[0, -0.09, 0]} w={0.4} h={0.18} map={b} />
          <group position={[0, 0, 0.002]} rotation={[Math.PI * (1 - un), 0, 0]}><Card p={[0, 0.09, 0]} w={0.4} h={0.18} map={a} /><Box p={[0, 0.09, -0.003]} s={[0.4, 0.18, 0.003]} c="#fff6e0" r={0.8} rad={0.001} /></group>
        </group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={4.4} txt="A SMALL REPORT" col={AMB} />} />;
};

// 7:01 · LOS CUARTOS: tres porciones saltan a la olla, la cuarta espera
export const E_threeq: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={Cm(8, [0.16, 1.1, 1.72], [-0.2, 1.0, 1.56], [0, 0.2, 0])}
  set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.5 }}
  scene={(tt) => <>
    <Board w={2.0} d={0.9} c="#a68260" />
    <Cyl p={[-0.55, 0.062, 0]} r={0.27} h={0.024} c="#f1ebdd" rough={0.35} />
    <Pot p={[0.45, 0.05, 0]} s={1.05} water={SOUP} />
    {[0, 1, 2, 3].map((i) => { const j = eio(tt, 1.0 + i, 1.8 + i), hop = i < 3 ? j : 0, x = lerp(-0.55, 0.45, hop), y = 0.1 + 0.55 * Math.sin(Math.PI * hop) + (i < 3 ? 0.1 * hop : 0), sv = i === 3 ? 0.035 * pop(tt, 4.6) : 0; if (i < 3 && j > 0.97) return null;
      return <mesh key={i} position={[x + (i === 3 ? sv : 0), y, i === 3 ? sv : 0]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.08, 24, 1, false, i * Math.PI / 2, Math.PI / 2 - 0.05]} /><meshStandardMaterial color={MISO} roughness={0.7} /></mesh>; })}
    <Ring p={[-0.55, 0.078, 0]} r={0.25} k={eio(tt, 4.6, 5.4)} col="#ffd27a" />
  </>}
  over={(tt) => <Ink tt={tt} at={4.3} txt="HOLD BACK THE LAST" col={AMB} />} />;

// 7:35 · LOS BICHITOS: cultivos con ojitos que se apagan al subir el calor
export const E_cultures: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={Cm(8, [0.08, 1.5, 0.76], [-0.1, 1.42, 0.66], [0, 0.04, 0])}
  set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.2, ...DK }}
  scene={(tt) => { const hot = eio(tt, 1.5, 6.0);
    return <>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[2.2, 64]} /><meshStandardMaterial color={col("#b9a24a", "#c8481e", hot)} roughness={0.6} /></mesh>
      {Array.from({ length: 22 }, (_, i) => { const a = i * 2.39, R = 0.1 + 0.68 * Math.sqrt(i / 22), dies = i % 5 !== 0, k = dies ? 1 - eio(tt, 2.0 + rnd(i + 8) * 3.4, 2.7 + rnd(i + 8) * 3.4) : 1, w = Math.sin(tt * 2.6 + i), x = R * Math.cos(a + 0.05 * w), z = R * Math.sin(a + 0.05 * w); if (k < 0.04) return null;
        return <group key={i} position={[x, 0.09, z]} scale={0.6 + 0.4 * k}>
          <mesh scale={[1, 0.8, 1]}><sphereGeometry args={[0.06, 18, 12]} /><meshStandardMaterial color={col("#8a8378", "#a9dc76", k)} roughness={0.4} /></mesh>
          {[-1, 1].map((d) => <mesh key={d} position={[d * 0.023, 0.048, 0.02]}><sphereGeometry args={[0.012, 10, 8]} /><meshBasicMaterial color="#1c1a18" /></mesh>)}
        </group>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.4} txt="MANY DO NOT SURVIVE" col={RED} />} />;

// 8:40 · LOS TRES POTES: entran y destapan: blanco, amarillo, rojo
export const E_tubs: F = ({ t, h }) => { const tx = useMemo(() => [["WHITE", "#efe0ba", "#3a2a18"], ["YELLOW", "#d8a23a", "#3a2a18"], ["RED", "#7a2f1c", "#fff3d6"]].map(([l, b, f]) => cardTex([l], { bg: b, fg: f, w: 260, h: 110 })), []);
  return <Hero t={t} h={h} mode="wipe" cam={Cm(10, [0.16, 0.92, 1.76], [-0.2, 0.86, 1.6], [0, 0.2, 0])}
    set={{ spot: [0, 0, 0] as V, spotK: 0.5, warm: 0.5, ...DK }}
    scene={(tt) => <>
      <Board w={2.0} d={1.0} c="#a68260" />
      {["#efe0ba", "#d8a23a", "#7a2f1c"].map((c, i) => { const st = 0.5 + i * 1.5, x = -0.6 + i * 0.6, sl = eio(tt, st, st + 0.8), op = pop(tt, st + 0.9, 6, 0.5);
        return <group key={i} position={[x, 0.05, lerp(-1.6, 0, sl)]}>
          <Cyl p={[0, 0.13, 0]} r={0.22} r2={0.19} h={0.26} c="#f7f4ec" rough={0.4} />
          <mesh position={[0, 0.262, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.205, 36]} /><meshStandardMaterial color={c} roughness={0.75} /></mesh>
          <group position={[0, 0.27, -0.22]} rotation={[-1.9 * op, 0, 0]}><Cyl p={[0, 0.01, 0.22]} r={0.235} h={0.03} c="#b48a52" rough={0.35} /></group>
          <Card p={[0, 0.12, 0.21]} w={0.3} h={0.127} map={tx[i]} />
        </group>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={5.2} txt="LOVELY IN THE MORNING" col={AMB} />} />;
};

// 9:13 · LAS DOS TINAJAS: de cada una un poco, y remolino en el bol
export const E_crocks: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={Cm(10, [0.1, 1.24, 1.5], [-0.26, 1.12, 1.36], [0, 0.18, 0])}
  set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.5 }}
  scene={(tt) => { const a1 = eio(tt, 0.8, 2.0), a2 = eio(tt, 2.2, 3.4), mix = eio(tt, 3.8, 7), rot = tt * 2.6 * eio(tt, 3.4, 4.2);
    const hop = (x0: number, k: number, c: string) => k > 0.01 && k < 0.98 && <Lump p={[lerp(x0, 0, k), 0.34 + 0.32 * Math.sin(Math.PI * k), 0]} r={0.07} c={c} />;
    const crock = (x: number, c: string, f: string) => <group position={[x, 0.05, -0.04]}><mesh position={[0, 0.18, 0]} castShadow><cylinderGeometry args={[0.19, 0.16, 0.36, 28, 1, true]} /><meshStandardMaterial color={c} roughness={0.4} side={THREE.DoubleSide} /></mesh><mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.18, 32]} /><meshStandardMaterial color={f} roughness={0.75} /></mesh><mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.19, 0.016, 8, 36]} /><meshStandardMaterial color={c} roughness={0.35} /></mesh></group>;
    return <>
      <Board w={2.0} d={1.0} c="#a68260" />
      {crock(-0.68, "#cfc4a8", MISOL)}{crock(0.68, "#4a3a30", MISOD)}
      <Dish p={[0, 0.05, 0.1]} s={1.5} fill={col(MISOL, MISO, mix)} fillK={a1} />
      {a2 > 0.9 && <group position={[0, 0.285, 0.1]} rotation={[0, rot, 0]}>{[0, 1].map((i) => <mesh key={i} rotation={[-Math.PI / 2, 0, i * Math.PI]}><ringGeometry args={[0.03, 0.28, 40, 1, 0, Math.PI]} /><meshStandardMaterial color={col(i ? MISOD : MISOL, MISO, mix)} roughness={0.55} side={THREE.DoubleSide} /></mesh>)}</group>}
      {hop(-0.68, a1, MISOL)}{hop(0.68, a2, MISOD)}
    </>; }}
  over={(tt) => <Ink tt={tt} at={5.0} txt="HER OWN BLEND" col={AMB} />} />;

// 9:36 · LAS CASITAS: cada familia levanta su bandera más alto que la vecina
export const E_brag: F = ({ t, h }) => { const flag = useMemo(() => cardTex(["MINE!"], { bg: "#c8322a", fg: "#fff3d6", w: 220, h: 120 }), []);
  return <Hero t={t} h={h} mode="blinds" cam={Cm(9, [0.3, 1.1, 2.86], [-0.3, 1.04, 2.66], [0, 0.66, 0])}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.3, warm: 0.5 }}
    scene={(tt) => <>
      <Board w={3.1} d={1.1} c="#94a06a" />
      {[0, 1, 2, 3, 4].map((i) => { const x = -1.08 + i * 0.54, z = -0.1 + 0.12 * Math.sin(i * 2.1), up = eio(tt, 0.7 + i * 0.9, 1.5 + i * 0.9), H = (0.3 + i * 0.13) * up + 0.1;
        return <group key={i} position={[x, 0.05, z]}>
          <Box p={[0, 0.13, 0]} s={[0.36, 0.26, 0.3]} c="#efe3ca" r={0.75} rad={0.012} />
          <mesh position={[0, 0.355, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[0.31, 0.2, 4]} /><meshStandardMaterial color="#5a463a" roughness={0.7} flatShading /></mesh>
          <Box p={[0, 0.09, 0.152]} s={[0.1, 0.18, 0.006]} c="#6b4a2a" r={0.7} rad={0.002} />
          <Cyl p={[0.14, 0.26 + H / 2, 0]} r={0.008} h={H} c="#3a3026" rough={0.6} />
          <group position={[0.14, 0.26 + H - 0.05, 0]} rotation={[0, 0.25 * Math.sin(tt * 2.2 + i), 0]}><Card p={[0.14, 0, 0]} w={0.28} h={0.15} map={flag} /></group>
        </group>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={3.2} txt="MY OWN MISO" col={AMB} />} />;
};

// 10:35 · LA LATA: se abre, se vuelca y yo no dije nada
export const E_can: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={Cm(8, [0.26, 0.88, 1.62], [-0.2, 0.8, 1.46], [0.08, 0.34, 0])}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.45, warm: 0.4, ...DK }}
  scene={(tt) => { const cut = eio(tt, 0.5, 2.2), lid = pop(tt, 2.2), tilt = eio(tt, 3.0, 4.2) * 1.5, pour = eio(tt, 4.1, 4.6) * (1 - eio(tt, 6.6, 7.2)), fill = eio(tt, 4.3, 6.8);
    return <>
      <Board w={1.5} d={0.9} c="#8a6a4a" />
      <Dish p={[0.2, 0.05, 0]} s={1.4} fill="#c63a22" fillK={Math.max(0.03, fill)} />
      <group position={[lerp(-0.34, -0.14, tilt / 1.5), lerp(0.31, 0.62, tilt / 1.5), 0]} rotation={[0, 0, -tilt]}>
        <group position={[0, 0, 0]}>
          <Cyl p={[0, 0, 0]} r={0.15} h={0.46} c="#c4272a" rough={0.4} m={0.2} />
          <Cyl p={[0, 0, 0]} r={0.152} h={0.16} c="#f4efe2" rough={0.5} />
          <Cyl p={[0, 0.23, 0]} r={0.156} h={0.012} c={STEEL} m={0.9} rough={0.25} />
          <group position={[0.15 * Math.cos(cut * 6.28), 0.25, 0.15 * Math.sin(cut * 6.28)]} visible={cut < 0.98}><Box p={[0, 0.04, 0]} s={[0.05, 0.08, 0.05]} c="#3b3b40" m={0.7} r={0.35} rad={0.01} /></group>
          <group position={[-0.15, 0.24, 0]} rotation={[0, 0, 1.9 * lid]}><Cyl p={[0.15, 0.004, 0]} r={0.146} h={0.008} c={STEEL} m={0.95} rough={0.2} /></group>
        </group>
      </group>
      {pour > 0.02 && <mesh position={[0.12, 0.42, 0]}><cylinderGeometry args={[0.03, 0.038, 0.34, 14]} /><meshStandardMaterial color="#c63a22" roughness={0.2} transparent opacity={pour} /></mesh>}
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.4} txt="I SAID NOTHING" col={RED} />} />;

// 11:27 · LA DONA: salado, ácido y dulce alrededor; el miso llena el agujero
export const E_middle: F = ({ t, h }) => { const tx = useMemo(() => [["SALTY", "#e0e4ea"], ["SOUR", "#c7dc72"], ["SWEET", "#f2a0a8"]].map(([l, b]) => cardTex([l], { bg: b, fg: "#2a2018", w: 220, h: 90 })), []);
  return <Hero t={t} h={h} mode="drop" cam={Cm(8, [0.1, 1.5, 1.12], [-0.24, 1.42, 1.0], [0, 0.1, 0])}
    set={{ spot: [0, 0, 0] as V, spotK: 0.45, warm: 0.4, ...DK }}
    scene={(tt) => { const dn = pop(tt, 2.3, 6.5, 0.5), gl = eio(tt, 3.4, 4.4);
      return <>
        {["#c6ccd4", "#a9c452", "#e88892"].map((c, i) => { const a = i * Math.PI * 2 / 3 + 0.03; return <group key={i} rotation={[0, a, 0]} position={[0, 0.12, 0]}><mesh rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.5, 0.15, 18, 44, Math.PI * 2 / 3 - 0.06]} /><meshStandardMaterial color={col(c, "#efc25a", gl * 0.45)} roughness={0.5} /></mesh></group>; })}
        {[0, 1, 2].map((i) => { const a = -(i + 0.5) * Math.PI * 2 / 3, R = 0.52; return <Card key={i} p={[R * Math.cos(a), 0.3, R * Math.sin(a)]} rot={[-1.0, 0, 0]} w={0.3} h={0.122} map={tx[i]} />; })}
        <mesh position={[0, lerp(1.0, 0.13, dn), 0]} castShadow><cylinderGeometry args={[0.34, 0.34, 0.2, 40]} /><meshStandardMaterial color={MISO} roughness={0.65} /></mesh>
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.2} txt="THE MIDDLE OF THE TASTE" col={AMB} />} />;
};

// 11:58 · EL SALERO SE VA: entra la cuchara de miso y el salero retrocede hasta caerse
export const E_saltaway: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={Cm(8, [0.16, 0.76, 1.64], [-0.2, 0.7, 1.5], [0.1, 0.26, 0])}
  set={{ spot: [0, 0, 0] as V, spotK: 0.5, warm: 0.5, ...DK }}
  scene={(tt) => { const s1 = eio(tt, 1.2, 2.0), s2 = eio(tt, 2.6, 3.4), s3 = eio(tt, 4.0, 5.2), x = 0.4 + 0.2 * s1 + 0.2 * s2 + 0.4 * s3, tilt = eio(tt, 4.5, 5.4) * 1.4, fall = eio(tt, 4.8, 5.6);
    return <>
      <Board w={1.7} d={0.8} c="#a68260" />
      <Dish p={[-0.26, 0.05, 0]} s={1.5} fill={SOUP} />
      {tt < 1.4 && <Lump p={[lerp(-0.9, -0.26, eio(tt, 0.2, 1.1)), 0.5, 0]} r={0.075} />}
      <group position={[x, 0.05 - 0.38 * fall, 0]} rotation={[0, 0, -tilt]}>
        <Cyl p={[0, 0.15, 0]} r={0.075} r2={0.09} h={0.3} c="#eef1f2" rough={0.3} />
        <mesh position={[0, 0.3, 0]} scale={[1, 0.7, 1]}><sphereGeometry args={[0.078, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.25} /></mesh>
      </group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.5} txt="TAKE AWAY THE SALT" col={GRN} />} />;

// 14:04 · LOS CINCO: mismos ingredientes que cambian de lugar y la cebolla revive
export const E_mush: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={Cm(9, [0.12, 0.74, 1.26], [-0.16, 0.7, 1.14], [0, 0.12, 0])}
  set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.45 }}
  scene={(tt) => { const X = (i: number) => -0.72 + 0.36 * i;
    const seq = [[0, 1, 2, 3, 4], [1, 0, 2, 3, 4], [1, 0, 4, 3, 2], [3, 0, 4, 1, 2]], tm = [1.0, 2.6, 4.2];
    const posOf = (id: number): [number, number] => { let x = X(seq[0].indexOf(id)), y = 0; seq.slice(1).forEach((s, k) => { const pa = seq[k].indexOf(id), pb = s.indexOf(id), q = eio(tt, tm[k], tm[k] + 1.0); if (q > 0 && pa !== pb) { x = lerp(X(pa), X(pb), q); y = 0.26 * Math.sin(Math.PI * q) * (pb > pa ? 1 : -0.35) + 0.1 * Math.sin(Math.PI * q); } else if (q >= 1) x = X(pb); }); return [x, Math.max(0, y)]; };
    const live = eio(tt, 4.6, 6.0), its = [
      <Box key="t" p={[0, 0.08, 0]} s={[0.16, 0.14, 0.16]} c="#f6f1e0" r={0.75} rad={0.01} />,
      <Lump key="m" p={[0, 0.1, 0]} r={0.09} />,
      <Kombu key="w" p={[0, 0.03, 0]} w={0.24} d={0.18} wave={0.006} c="#2f5a3a" />,
      <mesh key="p" position={[0, 0.095, 0]} scale={[1.25, 0.85, 1]} castShadow><sphereGeometry args={[0.09, 18, 12]} /><meshStandardMaterial color="#c8a062" roughness={0.8} /></mesh>,
      <group key="o">{[-0.05, 0, 0.05].map((x, i) => <mesh key={i} position={[x, 0.07 + 0.02 * i, 0]} rotation={[1.3, 0, 0.2 * i]}><torusGeometry args={[0.042, 0.016, 10, 22]} /><meshStandardMaterial color={col("#8a8a78", "#55c13a", live)} roughness={0.45} /></mesh>)}</group>];
    return <>
      <Board w={2.1} d={0.7} c="#a68260" />
      {its.map((el, id) => { const [x, y] = posOf(id); return <group key={id} position={[x, 0.05 + y, 0]}>{el}</group>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.4} txt="ONLY THE ORDER" col={AMB} />} />;

// 14:23 · TIERRA Y AGUA: una papa desde el suelo y un alga desde arriba
export const E_earth: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={Cm(9, [0.16, 0.92, 2.02], [-0.2, 0.86, 1.86], [0, 0.42, 0])}
  set={{ spot: [0, 0.2, 0] as V, spotK: 0.4, warm: 0.3, ...DK }}
  scene={(tt) => { const a = eio(tt, 3.0, 4.4), b = eio(tt, 4.2, 5.6), xP = lerp(-0.62, 0, a), yP = lerp(0.3, 0.42, a) + 0.38 * Math.sin(Math.PI * a), xW = lerp(0.62, 0, b), yW = lerp(0.78, 0.42, b) + 0.1 * Math.sin(Math.PI * b);
    return <>
      <Board w={2.3} d={0.9} c="#8a6a4a" />
      <Box p={[-0.62, 0.31, -0.16]} s={[0.84, 0.52, 0.18]} c="#5b3c22" r={0.95} rad={0.012} />
      <Box p={[-0.62, 0.6, -0.16]} s={[0.84, 0.06, 0.18]} c="#6f9a42" r={0.9} rad={0.012} />
      <Box p={[0.62, 0.42, -0.16]} s={[0.84, 0.74, 0.18]} c="#2c78a8" r={0.25} rad={0.012} />
      <Dish p={[0, 0.05, 0.3]} s={1.25} fill={SOUP} />
      <mesh position={[xP, yP, -0.04 + 0.34 * a]} scale={[1.2, 0.86, 1]} castShadow><sphereGeometry args={[0.1, 20, 14]} /><meshStandardMaterial color="#c8a062" roughness={0.85} /></mesh>
      <Kombu p={[xW, yW, -0.04 + 0.34 * b]} w={0.34} d={0.16} wave={0.008} c="#3a7a44" />
    </>; }}
  over={(tt) => <Ink tt={tt} at={1.2} txt="TWO THINGS ONLY" col={AMB} y={120} />} />;

// 15:41 · EL FILM: se apoya sobre el miso y empuja las burbujas de aire
export const E_film: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={Cm(9, [0.12, 1.04, 1.26], [-0.2, 0.98, 1.14], [0, 0.22, 0])}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.5, warm: 0.45, ...DK }}
  scene={(tt) => { const dn = eio(tt, 0.8, 2.4), sw = eio(tt, 2.5, 5.6), Y = lerp(0.82, 0.325, dn);
    return <>
      <Board w={1.3} d={1.0} c="#a68260" />
      <mesh position={[0, 0.18, 0]} castShadow><cylinderGeometry args={[0.44, 0.38, 0.32, 44, 1, true]} /><meshStandardMaterial color="#f4f1e8" roughness={0.38} side={THREE.DoubleSide} /></mesh>
      <Cyl p={[0, 0.05, 0]} r={0.38} h={0.02} c="#f4f1e8" rough={0.4} />
      <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.425, 48]} /><meshStandardMaterial color={MISO} roughness={0.75} /></mesh>
      {Array.from({ length: 22 }, (_, i) => { const a = i * 2.39, R0 = 0.06 + 0.32 * rnd(i + 1), R = lerp(R0, 0.47, sw), gone = R > 0.42; return gone ? null : <mesh key={i} position={[R * Math.cos(a), 0.322, R * Math.sin(a)]} scale={[1, 0.55, 1]}><sphereGeometry args={[0.02 + 0.016 * rnd(i), 12, 8]} /><meshPhysicalMaterial color="#f8f2e0" roughness={0.1} clearcoat={1} transparent opacity={0.85} /></mesh>; })}
      <mesh position={[0, Y, 0]} rotation={[-Math.PI / 2, 0, 0.3]}><planeGeometry args={[1.1, 1.1]} /><meshPhysicalMaterial color="#cfe8f2" roughness={0.04} transparent opacity={0.13} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.8} txt="AIR CANNOT GET IN" col={GRN} />} />;

// 16:46 · EL ROLLO DE TELA: se desenrolla como camino y llega el almuerzo de papá
export const E_belt: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={Cm(9, [0.18, 0.94, 1.76], [-0.2, 0.88, 1.6], [0, 0.14, 0])}
  set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.5 }}
  scene={(tt) => { const k = eio(tt, 0.5, 4.2), x = lerp(-0.92, 0.82, k), R = lerp(0.17, 0.06, k);
    return <>
      <Board w={2.2} d={1.0} c="#a68260" />
      <Box p={[(-0.95 + x) / 2, 0.056, 0]} s={[Math.max(0.02, x + 0.95), 0.008, 0.46]} c="#27406e" r={0.85} rad={0.002} />
      {[-0.13, 0, 0.13].map((z) => <Box key={z} p={[(-0.95 + x) / 2, 0.0615, z]} s={[Math.max(0.02, x + 0.95), 0.003, 0.03]} c="#dfe5ee" r={0.85} rad={0.001} />)}
      <group position={[x, 0.06 + R, 0]} rotation={[Math.PI / 2, 0, 0]}><Cyl p={[0, 0, 0]} r={R} h={0.5} c="#27406e" rough={0.85} /><group rotation={[0, k * 18, 0]}><Box p={[R * 0.6, 0.252, 0]} s={[R * 0.8, 0.006, 0.02]} c="#dfe5ee" r={0.7} rad={0.001} /></group></group>
      <Pop k={pop(tt, 4.3)} p={[-0.18, 0.066, 0]}><mesh position={[0, 0.095, 0]} castShadow><icosahedronGeometry args={[0.1, 2]} /><meshStandardMaterial color="#efe6cf" roughness={0.9} flatShading /></mesh><Box p={[0, 0.19, 0]} s={[0.02, 0.05, 0.02]} c="#efe6cf" r={0.9} rad={0.004} /></Pop>
      <Pop k={pop(tt, 4.9)} p={[0.2, 0.066, 0]}><Cyl p={[0, 0.07, 0]} r={0.065} r2={0.05} h={0.14} c="#6a7f8e" rough={0.35} /></Pop>
    </>; }}
  over={(tt) => <Ink tt={tt} at={4.4} txt="A BALL IN PAPER" col={AMB} />} />;

// 17:34 · LA HELADERA: se abre y se llena de bolitas retorcidas como caramelos
const Candy: React.FC<{ p: V; c?: string }> = ({ p, c = MISO }) => <group position={p}>
  <mesh castShadow><sphereGeometry args={[0.062, 16, 12]} /><meshStandardMaterial color={c} roughness={0.45} /></mesh>
  <mesh scale={[1.02, 1.02, 1.02]}><sphereGeometry args={[0.064, 14, 10]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} transparent opacity={0.08} depthWrite={false} /></mesh>
  {[-1, 1].map((d) => <mesh key={d} position={[d * 0.082, 0, 0]} rotation={[0, 0, d * Math.PI / 2]}><coneGeometry args={[0.03, 0.05, 10]} /><meshPhysicalMaterial color="#eef8fb" roughness={0.1} transparent opacity={0.7} /></mesh>)}
</group>;
export const E_balls: F = ({ t, h }) => { const c = useMemo(() => cardTex(["1 WEEK"], { bg: "#fff6e0", fg: "#2c4a6a", w: 260, h: 100 }), []);
  return <Hero t={t} h={h} mode="wipe" cam={Cm(9, [0.2, 0.86, 2.75], [-0.16, 0.82, 2.55], [-0.1, 0.68, 0])}
    set={{ spot: [0, 0.6, 0] as V, spotK: 0.5, warm: 0.3, ...DK }}
    scene={(tt) => { const op = eio(tt, 0.3, 1.4);
      return <>
        <Box p={[0, 0.68, -0.33]} s={[0.92, 1.36, 0.04]} c="#8fa6b6" r={0.4} rad={0.01} />
        {[-1, 1].map((d) => <Box key={d} p={[d * 0.46, 0.68, -0.02]} s={[0.04, 1.36, 0.64]} c="#b6c3cc" r={0.45} rad={0.01} />)}
        {[0.02, 1.34].map((y) => <Box key={y} p={[0, y, -0.02]} s={[0.96, 0.05, 0.66]} c="#b6c3cc" r={0.45} rad={0.01} />)}
        {[0.42, 0.82].map((y) => <Box key={y} p={[0, y, -0.02]} s={[0.84, 0.014, 0.56]} c="#dff2fb" r={0.15} rad={0.004} />)}
        {Array.from({ length: 10 }, (_, i) => { const y = i < 5 ? 0.42 : 0.82, x = -0.3 + (i % 5) * 0.15; return <Pop key={i} k={pop(tt, 1.4 + i * 0.32)} p={[x, y + 0.072, 0.06]} rot={[0, 0.5 * Math.sin(i * 3), 0.3 * Math.sin(i)]}><Candy p={[0, 0, 0]} c={i % 3 ? MISO : MISOD} /></Pop>; })}
        <group position={[-0.48, 0.68, 0.31]} rotation={[0, -2.1 * op, 0]}><Box p={[0.48, 0, 0]} s={[0.96, 1.36, 0.05]} c="#aebbc4" r={0.35} rad={0.012} /></group>
        <Pop k={pop(tt, 4.8)} p={[0, 1.13, 0.1]}><Card p={[0, 0, 0]} w={0.42} h={0.16} map={c} /></Pop>
        <pointLight position={[0, 1.15, 0.1]} intensity={0.35 * op} distance={1.6} color="#e6f4ff" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.0} txt="READY ALL WEEK" col={AMB} />} />;
};

// 20:42 · LA FLOR QUE SE MARCHITA: olla al mínimo y la flor se dobla sola
export const E_burner: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={Cm(8, [0.26, 0.92, 1.84], [-0.2, 0.88, 1.68], [0, 0.56, 0])}
  set={{ spot: [0, 0.3, 0] as V, spotK: 0.45, warm: 0.4, ...DK }}
  scene={(tt) => { const w = eio(tt, 0.8, 6.6), c = col("#ef5d78", "#7d6a56", w), N = 6;
    return <>
      <Burner p={[0, 0, 0]} s={1.1} flame={0.3} t={tt} />
      <Pot p={[0, 0.06, 0]} s={1.1} water={SOUP} />
      <group position={[0, 0.35, 0]}>{Array.from({ length: 7 }, (_, i) => null)}
        <group rotation={[0, 0, -0.2 * w]}><Cyl p={[0, 0.17, 0]} r={0.012} h={0.34} c="#5c8a3e" rough={0.7} />
          <group position={[0, 0.34, 0]} rotation={[0, 0, -0.75 * w]}><Cyl p={[0, 0.15, 0]} r={0.011} h={0.3} c="#5c8a3e" rough={0.7} />
            <group position={[0, 0.3, 0]} rotation={[0, 0, -1.1 * w]}>
              <mesh><sphereGeometry args={[0.042, 14, 10]} /><meshStandardMaterial color={col("#f1c23e", "#8a7a4a", w)} roughness={0.6} /></mesh>
              {Array.from({ length: N }, (_, i) => { const a = i * Math.PI * 2 / N, fall = eio(tt, 2.6 + i * 0.62, 3.6 + i * 0.62); return fall > 0.02 ? null : <mesh key={i} position={[0.085 * Math.cos(a), 0, 0.085 * Math.sin(a)]} rotation={[0, -a, 0]} scale={[1, 0.28, 0.6]}><sphereGeometry args={[0.07, 14, 10]} /><meshStandardMaterial color={c} roughness={0.6} /></mesh>; })}
            </group>
          </group>
        </group>
      </group>
      {Array.from({ length: N }, (_, i) => { const st = 2.6 + i * 0.62, u = eio(tt, st, st + 1.0); return u <= 0.02 || u >= 0.98 ? null : <mesh key={i} position={[0.3 + 0.05 * Math.sin(i * 4) + 0.1 * u, lerp(0.86, 0.42, u), 0.04 * i - 0.1]} rotation={[u * 3, i, u * 2]} scale={[1, 0.28, 0.6]}><sphereGeometry args={[0.07, 14, 10]} /><meshStandardMaterial color={c} roughness={0.6} /></mesh>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.0} txt="THE SAME AS BOILING" col={RED} />} />;

// 21:32 · EL TAZÓN PARTIDO: una mitad es olor, la otra sabor
const HalfB: React.FC<{ d: number; map: THREE.Texture; x: number }> = ({ d, map, x }) =>
  <group position={[x, 0.33, 0]} rotation={[0, d > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
    <mesh rotation={[Math.PI, 0, 0]} castShadow><sphereGeometry args={[0.36, 32, 16, 0, Math.PI, 0, Math.PI / 2]} /><meshStandardMaterial color="#f1ebdd" roughness={0.34} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.33, 36, 0, Math.PI]} /><meshStandardMaterial color={SOUP} roughness={0.25} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -0.17, 0.001]} rotation={[0, 0, Math.PI / 2]}><circleGeometry args={[0.001, 3]} /><meshBasicMaterial map={map} /></mesh>
  </group>;
export const E_smellhalf: F = ({ t, h }) => { const a = useMemo(() => cardTex(["SMELL"], { bg: "#f0a23e", fg: "#2a2018", w: 260, h: 100 }), []), b = useMemo(() => cardTex(["TASTE"], { bg: "#fff4dc", fg: "#2a2018", w: 260, h: 100 }), []);
  return <Hero t={t} h={h} mode="split" cam={Cm(9, [0.1, 0.9, 1.9], [-0.2, 0.86, 1.74], [0, 0.42, 0])}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.45, warm: 0.45, ...DK }}
    scene={(tt) => { const sp = eio(tt, 1.2, 2.6), dx = 0.34 * sp;
      return <>
        <Board w={2.0} d={0.9} c="#8a6a4a" />
        <HalfB d={-1} x={-0.02 - dx} map={a} /><HalfB d={1} x={0.02 + dx} map={b} />
        {Array.from({ length: 46 }, (_, i) => { const u = (tt * 0.3 + i / 46) % 1; return <Soft key={i} p={[-0.2 - dx + 0.1 * Math.sin(i * 2.3 + tt * 0.9) * (0.4 + u), 0.34 + u * 0.72, 0.07 * Math.sin(i * 1.7)]} r={0.05 + 0.07 * u} c="#f0a23e" op={0.16 * (1 - u) * eio(tt, 2.4, 3.4)} />; })}
        <Pop k={pop(tt, 3.0)} p={[-0.48, 0.1, 0.34]}><Card p={[0, 0, 0]} rot={[-0.6, 0, 0]} w={0.32} h={0.123} map={a} /></Pop>
        <Pop k={pop(tt, 3.4)} p={[0.48, 0.1, 0.34]}><Card p={[0, 0, 0]} rot={[-0.6, 0, 0]} w={0.32} h={0.123} map={b} /></Pop>
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.8} txt="THE SMELL IS HALF" col={AMB} />} />;
};

export const HP: Record<string, F> = { e_walnut: E_walnut, e_box: E_box, e_barrel: E_barrel, e_flower: E_flower, e_perfume: E_perfume, e_island: E_island, e_strainer: E_strainer, e_clouds: E_clouds, e_convect: E_convect, e_report: E_report, e_threeq: E_threeq, e_cultures: E_cultures, e_tubs: E_tubs, e_crocks: E_crocks, e_brag: E_brag, e_can: E_can, e_middle: E_middle, e_saltaway: E_saltaway, e_mush: E_mush, e_earth: E_earth, e_film: E_film, e_belt: E_belt, e_balls: E_balls, e_burner: E_burner, e_smellhalf: E_smellhalf };
