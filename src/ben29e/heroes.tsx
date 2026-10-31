// ben29e · «baguettes sin amasar»: los componentes únicos del minuto (ninguno repite mecanismo de ben29a, b, c ni d).
// Regla: el OBJETO cuenta la idea sin leer; llegan de a uno con resorte; cámara curva (Estudio orbita); ≤5 palabras por rótulo y DENTRO de la escena.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, img, lerp, phys, Stage } from "./ckit";
import { ctex, Estudio, fall, lathe, M, papel, RBox, rn, V3, Vapor } from "./estudio3d";
import { Chorro, Foto3D, Mano } from "./kit3d";
import { Bol, corteza, Hogaza, Masa, Moneda, P, P2 } from "./kitpan";

type C = React.FC<{ t: number; h: H }>;
const ent = (tt: number, a: number) => cl(phys(tt, a, 6, 0.5));
const IT = (h: H) => (h.items ?? []) as { a: number; tx: string }[];
const curI = (h: H, t: number) => Math.max(0, IT(h).reduce((c, e, i) => (t >= e.a ? i : c), 0));
const cartel = (key: string, tx: string, o: { w?: number; h?: number; bg?: string; ink?: string; size?: number } = {}) =>
  papel("e_" + key, [tx], { w: o.w ?? 512, h: o.h ?? 192, size: o.size ?? 120, bg: o.bg, ink: o.ink, font: `900 ${o.size ?? 120}px Georgia, serif` });
const Placa: React.FC<{ p: V3; rot?: V3; w: number; h: number; tex: THREE.Texture; k?: number }> = ({ p, rot, w, h, tex, k = 1 }) => (
  <group position={p} rotation={rot} scale={0.001 + k}>
    <RBox s={[w + 0.06, h + 0.06, 0.04]} r={0.015}>{M.madera("#5a3a22")}</RBox>
    <mesh position={[0, 0, 0.022]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={tex} roughness={0.85} /></mesh>
  </group>);
const hex = (b: number) => "#" + corteza(b).getHexString();
const MASA = "#efdcb4";
const masaMat = (c = MASA, r = 0.6) => <meshPhysicalMaterial color={c} roughness={r} sheen={0.8} sheenColor="#fff1d6" clearcoat={0.15} />;
const Mesa: React.FC<{ w?: number; d?: number; c?: string }> = ({ w = 1.8, d = 1.0, c = "#9a6a3a" }) => <RBox p={[0, 0.03, 0]} s={[w, 0.06, d]} r={0.03}>{M.madera(c)}</RBox>;
const Harina: React.FC<{ w?: number; d?: number; o?: number }> = ({ w = 1.4, d = 0.7, o = 0.5 }) => <mesh position={[0, 0.061, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[w, d]} /><meshStandardMaterial map={harinaTex()} transparent opacity={o} depthWrite={false} /></mesh>;
const harinaTex = () => ctex("e_harina", 256, 256, (g) => { g.clearRect(0, 0, 256, 256); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,255,255,${0.2 + 0.5 * rn(i, 1)})`; const r = 1 + 3 * rn(i, 2) ** 3; g.beginPath(); g.arc(128 + (rn(i, 3) - 0.5) * 256 * rn(i, 4), 128 + (rn(i, 5) - 0.5) * 256 * rn(i, 6), r, 0, 7); g.fill(); } });
const lino = () => ctex("e_lino", 256, 256, (g) => { g.fillStyle = "#cfc6b4"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 3) { g.fillStyle = `rgba(120,110,95,${0.08 + 0.06 * rn(i, 1)})`; g.fillRect(i, 0, 1, 256); g.fillRect(0, i, 256, 1); }
  for (let i = 0; i < 300; i++) { g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(rn(i, 2) * 256, rn(i, 3) * 256, 3, 2); } });
// la BARRA: huso largo de corteza, con cortes en escama que se abren en «orejas»
const barraGeo = lathe(Array.from({ length: 25 }, (_, i) => { const y = i / 24; return [0.055 * Math.pow(Math.max(0, Math.sin(y * P)), 0.35) + 0.001, y] as [number, number]; }), 32);
const Barra: React.FC<{ p?: V3; rot?: V3; L?: number; r?: number; bake?: number; open?: number; cuts?: number; flat?: number; masa?: boolean; gloss?: number }> = ({ p, rot, L = 0.8, r = 1, bake = 0.85, open = 1, cuts = 4, flat = 0, masa = false, gloss = 0.4 }) => (
  <group position={p} rotation={rot}>
    <group rotation={[0, 0, P2]} position={[L / 2, 0.05 * r * (1 - 0.5 * flat), 0]} scale={[r * (1 + 0.6 * flat), L, r * (1 - 0.5 * flat)]}>
      <mesh geometry={barraGeo} castShadow>{masa ? masaMat(MASA, 0.5) : <meshPhysicalMaterial color={hex(bake)} roughness={0.5 - 0.3 * gloss} clearcoat={gloss} />}</mesh>
    </group>
    {Array.from({ length: cuts }, (_, i) => { const x = -L * 0.3 + (i * L * 0.6) / Math.max(1, cuts - 1), top = (0.05 + 0.055 * Math.pow(Math.sin((0.5 + x / L) * P), 0.35)) * r * (1 - 0.5 * flat) - 0.002;
      return <group key={i} position={[x, top, 0]} rotation={[0, 0.22, 0]}>
        <mesh rotation={[-P2, 0, 0]} scale={[L * 0.13, 0.003 + 0.011 * open * r, 1]}><circleGeometry args={[1, 20]} /><meshStandardMaterial color={masa ? "#d8c49a" : "#f3e2b8"} roughness={0.9} /></mesh>
        <mesh position={[0, 0.001, -0.004 - 0.008 * open * r]} rotation={[-P2 + 0.35 * open, 0, 0]} scale={[L * 0.12, 0.007 * r * open + 0.001, 1]} visible={open > 0.15 && !masa}><circleGeometry args={[1, 16, 0, P]} /><meshPhysicalMaterial color={hex(Math.min(1, bake + 0.08))} roughness={0.4} clearcoat={gloss} side={THREE.DoubleSide} /></mesh>
      </group>; })}
  </group>);

// ── 1 · NUBE: la barra pálida en una caja de vidrio; entra la nube de vapor y la barra crece, sus cortes se abren y la corteza se vuelve brillante
const H1Nube: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#1c120c">{(tt) => {
  const st = eio(tt, 1.0, 2.2), g = eio(tt, 1.8, 5.2);
  return <Estudio t={tt} cam={[0.25, 0.6, 1.5]} look={[0, 0.25, 0]} orbit={0.08}>
    <Mesa w={1.6} d={0.8} c="#5a3a22" />
    <mesh position={[0, 0.3, 0]}><boxGeometry args={[1.1, 0.48, 0.5]} />{M.vidrio()}</mesh>
    <Barra p={[0, 0.08, 0]} L={0.85} r={0.8 + 0.4 * g} bake={0.35 + 0.55 * g} open={g} gloss={g} />
    <Vapor t={tt} p={[-0.5, 0.1, 0]} o={0.75 * st * (1 - eio(tt, 4.8, 5.6))} h={0.4} s={0.35} spread={0.5} n={14} />
    <mesh position={[-0.7, 0.3, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.05, 0.32, 16]} />{M.cromo("#b0b0b0")}</mesh>
  </Estudio>;
}}</Stage>;

// ── 2 · TIMBRE (CTA1): la placa de bronce de la puerta de la panadería; el dedo aprieta el botón y, bajo la campana de vidrio, el martillito golpea la campanilla
const domoGeo = lathe([[0.001, 0.28], [0.06, 0.27], [0.11, 0.22], [0.13, 0.12], [0.13, 0], [0.125, 0]], 32);
const H2Timbre: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#1c120c">{(tt) => {
  const press = Math.sin(cl((tt - 1.1) / 0.5) * P), hit = (a: number) => Math.exp(-6 * Math.max(0, tt - a)) * Math.sin(Math.max(0, tt - a) * 30), ham = tt > 1.3 ? 0.5 * Math.abs(Math.sin((tt - 1.3) * 12)) * (tt < 2.6 ? 1 : 0) : 0;
  return <Estudio t={tt} cam={[0.15, 0.6, 1.0]} look={[0.02, 0.5, 0]} orbit={0.07}>
    <RBox p={[0, 0.55, -0.06]} s={[1.6, 1.1, 0.06]} r={0.02}>{M.madera("#4a2e1a")}</RBox>
    <RBox p={[-0.25, 0.5, 0]} s={[0.24, 0.36, 0.03]} r={0.02} rot={[0, 0, 0]}>{M.cromo("#b8902e")}</RBox>
    <group position={[-0.25, 0.5, 0.02 - 0.012 * press]} scale={0.001 + ent(tt, 0.3)}><mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.05, 0.055, 0.03, 24]} /><meshPhysicalMaterial color="#c0281c" roughness={0.3} clearcoat={1} /></mesh></group>
    <group position={[-0.25, 0.5, 0.075 - 0.025 * press + 0.3 * (1 - ent(tt, 0.6))]} rotation={[P2, 0, 0]}><mesh><capsuleGeometry args={[0.028, 0.12, 8, 16]} /><meshPhysicalMaterial color="#e0a888" roughness={0.55} sheen={0.5} sheenColor="#ffd0c0" /></mesh><mesh position={[0, -0.06, 0.012]} rotation={[-0.2, 0, 0]} scale={[0.02, 0.008, 0.022]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#f0c8b8" roughness={0.3} /></mesh></group>
    <group position={[0.3, 0.38, 0.04]} scale={0.001 + ent(tt, 0.5)}>
      <RBox p={[0, -0.01, 0]} s={[0.32, 0.03, 0.2]} r={0.01}>{M.madera("#6a4a2a")}</RBox>
      <mesh position={[0, 0.09, 0]} rotation={[0, 0, 0.12 * hit(1.4) + 0.12 * hit(2.0)]} geometry={campGeo}>{M.cromo("#d4b050")}</mesh>
      <group position={[0.1, 0.03, 0]} rotation={[0, 0, 0.6 - ham]}><mesh position={[-0.05, 0.03, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.004, 0.004, 0.1, 6]} />{M.hierro()}</mesh><mesh position={[-0.1, 0.03, 0]}><sphereGeometry args={[0.012, 10, 8]} />{M.hierro()}</mesh></group>
      <mesh geometry={domoGeo} position={[0, 0.005, 0]}>{M.vidrio()}</mesh>
    </group>
    {[1.4, 2.0].map((a, i) => { const q = cl((tt - a) / 0.9); return <mesh key={i} position={[0.3, 0.5, 0.04]} scale={0.1 + 0.6 * q} visible={q > 0 && q < 1}><torusGeometry args={[0.5, 0.008, 6, 40]} /><meshBasicMaterial color="#ffe0a0" transparent opacity={0.6 * (1 - q)} depthWrite={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;
const campGeo = lathe([[0.001, 0.08], [0.02, 0.08], [0.035, 0.05], [0.05, 0.0], [0.056, -0.012], [0.001, -0.012]], 24);

// ── 3 · ENGRANAJES (bloque): adentro de la heladera, tres engranajes de madera giran despacito: el frío trabaja solo
const gearGeo = (n: number) => { const s = new THREE.Shape(); for (let i = 0; i <= n * 2; i++) { const a = (i / (n * 2)) * 2 * P, r = i % 2 ? 1 : 0.82; const fn = i ? s.lineTo.bind(s) : s.moveTo.bind(s); fn(Math.cos(a) * r, Math.sin(a) * r); }
  const ho = new THREE.Path(); ho.absarc(0, 0, 0.25, 0, 2 * P, true); s.holes.push(ho); return new THREE.ExtrudeGeometry(s, { depth: 0.18, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2 }); };
const G12 = gearGeo(12), G9 = gearGeo(9);
const H3Engranajes: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#0e1418">{(tt) => {
  const E = IT(h), cur = curI(h, t), on = (i: number) => (E[i] ? ent(t, E[i].a) : 0), sp = 0.25;
  const G = [{ p: [-0.38, 0.55, 0] as V3, s: 0.2, g: G12, c: "#c8a46a", d: 1 }, { p: [0.0, 0.42, 0] as V3, s: 0.15, g: G9, c: "#a8784a", d: -1.33 }, { p: [0.33, 0.58, 0] as V3, s: 0.2, g: G12, c: "#8a5a32", d: 1 }];
  return <Estudio t={tt} cam={[0.1, 0.6, 1.6]} look={[0, 0.5, 0]} orbit={0.05}>
    <RBox p={[0, 0.5, -0.2]} s={[1.5, 1.0, 0.05]} r={0.03}><meshStandardMaterial color="#e8eef0" roughness={0.4} /></RBox>
    {[0.12, 0.92].map((y) => <mesh key={y} position={[0, y, 0]}><boxGeometry args={[1.4, 0.012, 0.4]} />{M.vidrio()}</mesh>)}
    {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.4, 0.15 + rn(i, 2) * 0.75, -0.17]} scale={0.006 + 0.01 * rn(i, 3)}><octahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.7} /></mesh>)}
    {G.map((g, i) => <group key={i} position={g.p} scale={(0.001 + on(i)) * g.s}><group rotation={[0, 0, g.d * tt * sp * (i === cur ? 1.6 : 1)]}><mesh geometry={g.g} position={[0, 0, -0.09]}>{M.madera(g.c)}</mesh></group></group>)}
    <pointLight position={[0, 1.0, 0.6]} intensity={1.8} distance={3} color="#d8ecff" />
    {E.map((e, i) => <Placa key={i} p={[G[i].p[0], 0.2, 0.08]} rot={[-0.15, 0, 0]} w={0.36} h={0.08} tex={cartel("eg" + i, e.tx, { size: 66, w: 720, bg: i === cur ? "#fbf3e2" : "#d8cfbf" })} k={t >= e.a ? ent(t, e.a + 0.2) : 0} />)}
  </Estudio>;
}}</Stage>;

// ── 4 · PINZA: la pinza toma de a uno unos pocos granos de levadura y los deja caer sobre la montaña blanca de harina
const H4Pinza: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const cyc = (tt - 1.0) / 1.2, k = Math.floor(Math.max(0, cyc)), q = cyc - k, lift = Math.sin(cl(q) * P);
  return <Estudio t={tt} cam={[0.15, 0.8, 1.15]} look={[0.2, 0.28, 0]} orbit={0.08}>
    <Mesa w={1.4} d={0.8} />
    <mesh position={[0, 0.06, 0]}><coneGeometry args={[0.35, 0.3, 48]} /><meshStandardMaterial color="#f8f4ea" roughness={1} /></mesh>
    <mesh position={[0, 0.215, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.03, 16]} /><meshStandardMaterial color="#f8f4ea" /></mesh>
    {Array.from({ length: Math.min(4, k) }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.04, 0.215, (rn(i, 2) - 0.5) * 0.04]} scale={0.006}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#b88a4a" /></mesh>)}
    <group position={[0.42, 0.06, 0.1]}><mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.06, 0.06, 0.06, 24]} />{M.vidrio()}</mesh><mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.055, 0.055, 0.035, 20]} /><meshStandardMaterial color="#b88a4a" roughness={1} /></mesh></group>
    <group position={[lerp(0.42, 0.0, cl(q * 2 - 0.4)), 0.25 + 0.15 * lift, lerp(0.1, 0, cl(q * 2 - 0.4))]} rotation={[0, 0.3, 0.3]} scale={0.001 + ent(tt, 0.4)}>
      {[-1, 1].map((sd) => <mesh key={sd} position={[0, 0.08, sd * (0.006 + 0.004 * (q > 0.7 ? 1 : 0))]} rotation={[sd * 0.06, 0, 0]}><boxGeometry args={[0.02, 0.3, 0.008]} />{M.cromo("#e8e8e8")}</mesh>)}
      <mesh position={[0, -0.012, 0]} scale={0.006} visible={q < 0.75 && tt > 1}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#b88a4a" /></mesh>
    </group>
    <Placa p={[-0.02, 0.07, 0.3]} rot={[-0.8, 0.1, 0]} w={0.36} h={0.1} tex={cartel("pz", "1 GRAM", { size: 120 })} k={ent(tt, 2.4)} />
  </Estudio>;
}}</Stage>;

// ── 5 · ALAMBRE: el alambre tenso con dos mangos baja y corta el bollo en tres; los tres pedazos se deslizan a tres platillos que quedan parejos
const H5Alambre: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const c1 = eio(tt, 0.8, 1.5), c2 = eio(tt, 1.7, 2.4), sl = eio(tt, 2.8, 3.8), wob = Math.exp(-2.5 * Math.max(0, tt - 3.8)) * Math.sin(Math.max(0, tt - 3.8) * 8);
  const wx = tt < 1.6 ? -0.1 : 0.1, wy = tt < 1.6 ? 0.4 - 0.36 * c1 : 0.4 - 0.36 * c2;
  return <Estudio t={tt} cam={[0.0, 0.8, 1.6]} look={[0, 0.2, 0]} orbit={0.06}>
    <Mesa w={1.8} d={0.9} /><Harina />
    {[-1, 0, 1].map((i) => <group key={i} position={[i * 0.2 + i * 0.42 * sl, 0.06 + 0.27 * sl + 0.03 * Math.sin(sl * P), 0.32 * sl]}><RBox p={[0, 0.06, 0]} s={[0.19, 0.12, 0.2]} r={0.05}>{masaMat("#eedcb4", 0.4)}</RBox></group>)}
    <group position={[wx, wy + 0.06, 0]} visible={tt > 0.5 && tt < 2.6}>
      <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.002, 0.002, 0.5, 4]} />{M.cromo("#d0d0d0")}</mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[0, 0, sd * 0.27]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.08, 10]} />{M.madera("#6a4a2a")}</mesh>)}
    </group>
    {[-1, 0, 1].map((i) => <group key={i} position={[i * 0.62, 0.06, 0.32]} scale={0.001 + sl}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.012, 0.012, 0.24, 8]} />{M.cromo("#b8902e")}</mesh>
      <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0.05 * wob * (i ? 1 : -1)]}><cylinderGeometry args={[0.13, 0.1, 0.02, 28]} />{M.cromo("#b8902e")}</mesh>
    </group>)}
    <Placa p={[0, 0.42, 0.25]} rot={[-0.2, 0, 0]} w={0.3} h={0.09} tex={cartel("al", "3 × 290 g", { size: 100 })} k={ent(tt, 4.2)} />
  </Estudio>;
}}</Stage>;

// ── 6 · ACORDEÓN: la masa es el fuelle de un acordeón: con cada vuelta de pliegues el fuelle se cierra, y queda más liso y firme
const H6Acordeon: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false} tone="#1c120c">{(tt) => {
  const sets = [1.0, 2.4, 3.8].map((a) => Math.sin(cl((tt - a) / 1.1) * P)), sq = sets.reduce((a, b) => a + b, 0), done = eio(tt, 0.8, 5.0), N = 9;
  return <Estudio t={tt} cam={[0.2, 0.65, 1.5]} look={[0, 0.3, 0]} orbit={0.07}>
    <Mesa w={1.6} d={0.8} />
    {[-1, 1].map((sd) => <RBox key={sd} p={[sd * (0.38 - 0.12 * sq), 0.3, 0]} s={[0.04, 0.38, 0.3]} r={0.015}>{M.madera("#3a2414")}</RBox>)}
    {Array.from({ length: N }, (_, i) => { const x = lerp(-0.34, 0.34, i / (N - 1)) * (1 - 0.35 * sq), rough = 1 - done;
      return <mesh key={i} position={[x, 0.3, 0]} rotation={[0, (i % 2 ? 1 : -1) * (0.35 + 0.3 * sq) * rough + (i % 2 ? 1 : -1) * 0.12, 0]} scale={[0.02, 0.34 + 0.02 * rough * Math.sin(i * 2), 0.28]}><boxGeometry args={[1, 1, 1]} />{masaMat(done > 0.6 ? "#f4e4c0" : MASA, 0.6 - 0.35 * done)}</mesh>; })}
    {[1.0, 2.4, 3.8].map((a, i) => <Placa key={i} p={[-0.45 + i * 0.45, 0.07, 0.36]} rot={[-0.8, 0, 0]} w={0.12} h={0.12} tex={cartel("ac" + i, String(i + 1), { w: 192, h: 192, size: 150, bg: tt > a ? "#fbf3e2" : "#d8cfbf" })} k={ent(tt, a)} />)}
  </Estudio>;
}}</Stage>;

// ── 7 · TREN: el trencito de madera lleva el bol tapado por la vía: JUE → VIE → SÁB; en cada estación el bol crece
const H7Tren: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const u = eio(tt, 0.6, 2.2) * 0.5 + eio(tt, 2.8, 4.4) * 0.5, x = lerp(-0.9, 0.9, u), rise = u;
  const ST = [["THU", -0.9], ["FRI", 0], ["SAT", 0.9]] as [string, number][];
  return <Estudio t={tt} cam={[0, 0.7, 2.1]} look={[0, 0.2, 0]} orbit={0.06}>
    <Mesa w={2.6} d={0.9} c="#7a5232" />
    {[-0.05, 0.05].map((z) => <mesh key={z} position={[0, 0.07, z]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.006, 0.006, 2.4, 6]} />{M.hierro()}</mesh>)}
    {Array.from({ length: 16 }, (_, i) => <RBox key={i} p={[-1.15 + i * 0.153, 0.064, 0]} s={[0.03, 0.01, 0.16]} r={0.003}>{M.madera("#5a3a22")}</RBox>)}
    <group position={[x, 0.07, 0]}>
      <RBox p={[0, 0.06, 0]} s={[0.36, 0.06, 0.16]} r={0.015}><meshPhysicalMaterial color="#c0281c" roughness={0.4} clearcoat={0.6} /></RBox>
      {[-0.12, 0.12].map((wx) => [-0.085, 0.085].map((wz) => <mesh key={wx + "_" + wz} position={[wx, 0.03, wz]} rotation={[P2, tt * 6, 0]}><cylinderGeometry args={[0.03, 0.03, 0.015, 16]} />{M.madera("#2a1a10")}</mesh>))}
      <Bol p={[0, 0.09, 0]} s={0.2}><Masa p={[0, 0.06, 0]} r={0.6} rise={0.2 + 0.8 * rise} t={tt} bub={rise} /></Bol>
      <mesh position={[0, 0.22 + 0.04 * rise, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.15, 28]} /><meshStandardMaterial color="#f2ead8" roughness={0.6} /></mesh>
    </group>
    {ST.map(([n, sx], i) => <Placa key={i} p={[sx, 0.42, -0.25]} w={0.3} h={0.12} tex={cartel("tr" + i, n, { size: 120, bg: Math.abs(x - sx) < 0.15 ? "#fbf3e2" : "#d8cfbf" })} k={ent(tt, 0.3 + i * 0.2)} />)}
    {ST.map(([, sx], i) => <mesh key={i} position={[sx, 0.22, -0.25]}><cylinderGeometry args={[0.01, 0.01, 0.3, 6]} />{M.hierro()}</mesh>)}
  </Estudio>;
}}</Stage>;

// ── 8 · GUANTE: el guante de boxeo viene a pegarle a la masa y lo frena la palma abierta; las burbujas siguen intactas
const H8Guante: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const come = eio(tt, 0.8, 1.6), stop = tt > 1.6 ? 1 : 0, back = eio(tt, 2.4, 3.4), shake = stop * (1 - back) * Math.sin(tt * 40) * 0.01;
  return <Estudio t={tt} cam={[0.15, 0.5, 1.15]} look={[0, 0.2, 0]} orbit={0.07}>
    <Mesa w={1.6} d={0.8} /><Harina />
    <group position={[-0.25, 0.06, 0]}><mesh scale={[0.28, 0.1, 0.22]}><sphereGeometry args={[1, 32, 16, 0, 2 * P, 0, P2]} />{masaMat("#f0e0bc", 0.35)}</mesh>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[Math.cos(i * 2.4) * 0.16 * rn(i, 1), 0.07 + 0.02 * rn(i, 2), Math.sin(i * 2.4) * 0.12 * rn(i, 1)]} scale={0.008 + 0.012 * rn(i, 3)}><sphereGeometry args={[1, 10, 8, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color="#fff6e0" roughness={0.05} clearcoat={1} /></mesh>)}</group>
    <group position={[lerp(0.9, 0.22, come) + 0.05 * back + shake, 0.2, 0]} rotation={[0, 0, P2]}>
      <mesh scale={[0.11, 0.13, 0.1]}><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color="#b01c14" roughness={0.3} clearcoat={0.9} /></mesh>
      <mesh position={[0.06, 0.02, 0.07]} scale={[0.04, 0.07, 0.04]}><sphereGeometry args={[1, 16, 12]} /><meshPhysicalMaterial color="#b01c14" roughness={0.3} clearcoat={0.9} /></mesh>
      <mesh position={[0, -0.13, 0]}><cylinderGeometry args={[0.085, 0.08, 0.05, 20]} /><meshPhysicalMaterial color="#b01c14" roughness={0.35} clearcoat={0.6} /></mesh>
      <mesh position={[0, -0.19, 0]}><cylinderGeometry args={[0.07, 0.08, 0.1, 20]} /><meshStandardMaterial color="#f2ead8" roughness={0.6} /></mesh>
    </group>
    <Placa p={[-0.25, 0.42, -0.1]} w={0.42} h={0.1} tex={cartel("gu", "NEVER PUNCH", { size: 96, w: 640, bg: "#c0281c", ink: "#fbf3e2" })} k={ent(tt, 1.8)} />
  </Estudio>;
}}</Stage>;

// ── 9 · HAMACA: el leño de masa se acuesta en una hamaquita de tela entre dos palitos, se hamaca y se afloja; después se deja estirar sin pelear
const H9Hamaca: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const sw = Math.sin(tt * 1.6) * 0.18 * (1 - eio(tt, 3.6, 4.4)), relax = eio(tt, 0.8, 3.6), out = eio(tt, 4.0, 5.2);
  return <Estudio t={tt} cam={[0.2, 0.7, 1.5]} look={[0, 0.3, 0]} orbit={0.07}>
    <Mesa w={1.8} d={0.8} />
    {[-0.5, 0.5].map((x) => <mesh key={x} position={[x, 0.3, 0]}><cylinderGeometry args={[0.012, 0.015, 0.5, 8]} />{M.madera("#6a4a2a")}</mesh>)}
    <group position={[0, 0.5, 0]} rotation={[sw, 0, 0]} visible={out < 0.98}>
      <mesh position={[0, -0.18, 0]} scale={[0.5, 0.12, 0.13]}><sphereGeometry args={[1, 32, 12, 0, 2 * P, P2, P2]} /><meshStandardMaterial map={lino()} color="#8a8274" side={THREE.DoubleSide} roughness={1} /></mesh>
      <group position={[0, -0.22 + 0.03 * relax, 0]} scale={[1 + 0.2 * relax, 1 - 0.25 * relax, 1]}><RBox s={[0.32, 0.08, 0.09]} r={0.04}>{masaMat("#f0e0bc", 0.4)}</RBox></group>
    </group>
    <group position={[0, 0.06, 0.2]} visible={out > 0.02}><Barra L={0.3 + 0.55 * out} r={0.8} masa cuts={0} /></group>
    <Placa p={[0.62, 0.07, 0.3]} rot={[-0.8, -0.3, 0]} w={0.28} h={0.1} tex={cartel("hm", "20 MIN", { size: 120 })} k={ent(tt, 1.2)} />
  </Estudio>;
}}</Stage>;

// ── 10 · CIERRE: el talón de la mano corre por la costura y la masa se cierra como un cierre relámpago: los dientes se juntan uno a uno
const H10Cierre: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const u = eio(tt, 1.0, 4.0), N = 18;
  return <Estudio t={tt} cam={[0.0, 0.85, 1.0]} look={[0, 0.08, 0]} orbit={0.05}>
    <Mesa w={1.4} d={0.8} />
    <RBox p={[0, 0.1, 0]} s={[0.95, 0.08, 0.2]} r={0.04}>{masaMat("#f0e0bc", 0.4)}</RBox>
    {Array.from({ length: N }, (_, i) => { const x = -0.44 + (i * 0.88) / (N - 1), c = cl((u * 0.95 + 0.02 - (x + 0.44) / 0.88) * 12), gap = 0.03 * (1 - c);
      return [-1, 1].map((sd) => <RBox key={i + "_" + sd} p={[x + (sd > 0 ? 0.012 : 0), 0.145, sd * (0.008 + gap)]} s={[0.022, 0.012, 0.02]} r={0.004}><meshPhysicalMaterial color={c > 0.9 ? "#e8d4a8" : "#d8c49a"} roughness={0.5} /></RBox>); })}
    <Mano p={[-0.44 + 0.88 * u, 0.24, 0.02]} rot={[-1.45, 0, 0.2]} pinza={0.1} s={0.55} />
    <Placa p={[0, 0.07, 0.36]} rot={[-0.9, 0, 0]} w={0.6} h={0.1} tex={cartel("ci", "SEAL WITH THE HEEL", { size: 80, w: 900 })} k={ent(tt, 3.6)} />
  </Estudio>;
}}</Stage>;

// ── 11 · TELESCOPIO: el catalejo de bronce se estira de a tramos y a su lado el cilindro de masa crece a la par, de 20 a 38 cm
const H11Telescopio: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#1c120c">{(tt) => {
  const ex = [0, 1, 2].map((i) => eio(tt, 0.8 + i * 1.0, 1.6 + i * 1.0)), L = 0.3 + 0.18 * (ex[0] + ex[1] + ex[2]);
  return <Estudio t={tt} cam={[0.0, 0.75, 1.5]} look={[0.1, 0.15, 0]} orbit={0.06}>
    <Mesa w={1.8} d={0.8} /><Harina />
    <group position={[-0.4, 0.14, -0.15]}>
      {[0, 1, 2, 3].map((i) => { const off = i === 0 ? 0 : 0.18 * ex.slice(0, i).reduce((a, b) => a + b, 0) + 0.02 * i; return <mesh key={i} position={[0.12 + off, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.05 - 0.008 * i, 0.05 - 0.008 * i, 0.24, 24]} />{M.cromo(i % 2 ? "#c8a040" : "#b8902e")}</mesh>; })}
    </group>
    <Barra p={[0.05, 0.06, 0.15]} L={L} r={0.75 + 0.2 * (1 - L / 0.84)} masa cuts={0} />
    <Placa p={[0.6, 0.07, 0.35]} rot={[-0.8, -0.3, 0]} w={0.3} h={0.1} tex={cartel("tl", Math.round(20 + 18 * cl((L - 0.3) / 0.54)) + " cm", { size: 120 })} k={ent(tt, 0.6)} />
  </Estudio>;
}}</Stage>;

// ── 12 · DIAGONAL: la barra larga no entra en el horno: choca contra las paredes y saltan chispas; gira en diagonal y entra justo
const H12Diagonal: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#1c0e08">{(tt) => {
  const push = eio(tt, 0.6, 1.4), bump = tt > 1.4 && tt < 2.2 ? Math.exp(-4 * (tt - 1.4)) * Math.sin((tt - 1.4) * 30) * 0.02 : 0, rot = eio(tt, 2.4, 3.6), inn = eio(tt, 3.6, 4.6);
  return <Estudio t={tt} cam={[0, 1.6, 0.9]} look={[0, 0, -0.05]} orbit={0.04} fov={40}>
    <mesh rotation={[-P2, 0, 0]} position={[0, 0, -0.1]}><planeGeometry args={[0.9, 0.7]} /><meshStandardMaterial color="#2c2a28" roughness={0.6} metalness={0.5} /></mesh>
    {[[-0.46, 0, 0.7, P2], [0.46, 0, 0.7, P2], [0, -0.45, 0.94, 0]].map(([x, z, L, r], i) => <mesh key={i} position={[x as number, 0.08, (z as number) - 0.1]} rotation={[0, r as number, 0]}><boxGeometry args={[L as number, 0.16, 0.03]} /><meshStandardMaterial color="#3a3836" roughness={0.5} metalness={0.6} /></mesh>)}
    <mesh position={[0, 0.005, -0.1]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.86, 0.66]} /><meshBasicMaterial color="#ff6a20" transparent opacity={0.15} /></mesh>
    <group position={[bump, 0.04, lerp(0.75, 0.32, push) - 0.42 * inn]} rotation={[0, -0.64 * rot, 0]}><Barra L={1.0} r={0.8} masa cuts={0} /></group>
    {tt > 1.4 && tt < 2.0 && [-1, 1].map((sd) => Array.from({ length: 6 }, (_, i) => { const q = cl((tt - 1.4) / 0.6); return <mesh key={sd + "_" + i} position={[sd * (0.46 - 0.1 * q * rn(i, 1)), 0.08 + 0.15 * q * rn(i, 2), 0.15 + (rn(i, 3) - 0.5) * 0.1]} scale={0.008 * (1 - q)}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#ffc060" toneMapped={false} /></mesh>; }))}
    <Placa p={[0, 0.25, 0.42]} rot={[-1.0, 0, 0]} w={0.4} h={0.1} tex={cartel("dg", "DIAGONAL", { size: 110 })} k={ent(tt, 3.8)} />
  </Estudio>;
}}</Stage>;

const telaGeo = new THREE.PlaneGeometry(1.2, 0.9, 120, 2);
// ── 13 · TELA: la tela enharinada se levanta en pliegues como muros y las tres barras bajan cada una a su canal
const H13Tela: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const pl = eio(tt, 0.6, 1.8);
  const geo = telaGeo;
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), u = (x + 0.6) / 1.2, w = Math.max(0, Math.cos((u * 4 + 0.5) * 2 * P)); pos.setZ(i, 0.08 * pl * Math.pow(w, 6)); }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return <Estudio t={tt} cam={[0.0, 0.9, 1.3]} look={[0, 0.1, 0]} orbit={0.06}>
    <Mesa w={1.6} d={1.0} />
    <mesh geometry={geo} rotation={[-P2, 0, 0]} position={[0, 0.065, 0]}><meshStandardMaterial map={lino()} roughness={1} side={THREE.DoubleSide} /></mesh>
    {[0, 1, 2].map((i) => <group key={i} position={[-0.45 + 0.3 * i + 0.15, 0.07 + fall(tt, 2.0 + i * 0.6, 0.5), 0]} rotation={[0, P2, 0]}><Barra L={0.8} r={0.9} masa cuts={0} /></group>)}
    <Placa p={[0.72, 0.07, 0.3]} rot={[-0.8, -0.4, 0]} w={0.3} h={0.1} tex={cartel("tela", "COUCHE", { size: 110 })} k={ent(tt, 1.4)} />
  </Estudio>;
}}</Stage>;

// ── 14 · BAÚL: el baúl viejo de la madre se abre y sube, doblado, el lienzo gris remendado; se despliega solo sobre la mesa
const H14Baul: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#1c120c">{(tt) => {
  const lid = eio(tt, 0.8, 1.8), up = eio(tt, 1.8, 3.0), unf = eio(tt, 3.2, 4.6);
  return <Estudio t={tt} cam={[0.4, 0.75, 1.5]} look={[0, 0.3, 0]} orbit={0.07}>
    <RBox p={[0, 0.02, 0]} s={[2, 0.04, 1.2]} r={0.01}><meshStandardMaterial color="#5a4a3a" roughness={1} /></RBox>
    <group position={[-0.25, 0.04, -0.1]}>
      <RBox p={[0, 0.16, 0]} s={[0.6, 0.32, 0.36]} r={0.02}>{M.madera("#4a2e1a")}</RBox>
      {[-0.2, 0.2].map((x) => <RBox key={x} p={[x, 0.16, 0.181]} s={[0.04, 0.33, 0.01]} r={0.003}>{M.hierro()}</RBox>)}
      <group position={[0, 0.32, -0.18]} rotation={[-1.9 * lid, 0, 0]}><RBox p={[0, 0.03, 0.18]} s={[0.62, 0.06, 0.37]} r={0.02}>{M.madera("#4a2e1a")}</RBox></group>
      <group position={[lerp(0, 0.6, unf), 0.3 + 0.2 * up - 0.24 * unf, lerp(0, 0.35, unf)]}>
        <RBox s={[lerp(0.4, 0.9, unf), lerp(0.08, 0.008, unf), lerp(0.26, 0.5, unf)]} r={0.004}><meshStandardMaterial map={lino()} roughness={1} color="#b8b0a2" /></RBox>
        <mesh position={[0.1, lerp(0.041, 0.005, unf), 0.05]} rotation={[-P2, 0, 0.3]} visible={unf > 0.5}><planeGeometry args={[0.12, 0.08]} /><meshStandardMaterial color="#9a8e7a" roughness={1} /></mesh>
      </group>
    </group>
    <pointLight position={[-0.25, 0.8, 0.5]} intensity={0.01 + 1.6 * lid} distance={2} color="#ffd9a0" />
  </Estudio>;
}}</Stage>;

// ── 15 · COLCHÓN: el dedo enharinado hunde la barra cruda y, al lado, un colchoncito: los dos hoyos vuelven igual de lento
const H15Colchon: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const pr = Math.sin(cl((tt - 1.0) / 0.6) * P2), rel = tt > 1.6 ? 1 - Math.exp(-0.35 * (tt - 1.6)) : 0, d = tt < 1.6 ? pr : 1 - rel;
  return <Estudio t={tt} cam={[0.0, 0.7, 1.3]} look={[0, 0.12, 0]} orbit={0.06}>
    <Mesa w={1.6} d={0.8} />
    <group position={[-0.3, 0.06, 0]}><Barra L={0.6} r={1.1} masa cuts={0} />
      <mesh position={[0, 0.119, 0.0]} rotation={[-P2, 0, 0]} scale={[0.001 + 0.07 * d, 0.001 + 0.045 * d, 1]}><circleGeometry args={[1, 20]} /><meshStandardMaterial color="#a8865a" roughness={1} /></mesh>
      </group>
    <group position={[0.35, 0.06, 0]} scale={0.001 + ent(tt, 0.4)}>
      <RBox p={[0, 0.06, 0]} s={[0.5, 0.12, 0.34]} r={0.05}><meshStandardMaterial color="#e8eef4" roughness={0.9} /></RBox>
      <mesh position={[0, 0.121 - 0.05 * d, 0]} rotation={[-P2, 0, 0]} scale={[0.001 + 0.09 * d, 0.001 + 0.06 * d, 1]}><circleGeometry args={[1, 24]} /><meshStandardMaterial color="#8a98a8" roughness={1} /></mesh>
      {[-0.15, 0, 0.15].map((x) => <mesh key={x} position={[x, 0.122, 0.1]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.006, 8]} /><meshStandardMaterial color="#9aa8b4" /></mesh>)}
    </group>
    <Placa p={[0, 0.07, 0.36]} rot={[-0.9, 0, 0]} w={0.5} h={0.1} tex={cartel("co", "COMES BACK SLOWLY", { size: 80, w: 900 })} k={ent(tt, 2.4)} />
  </Estudio>;
}}</Stage>;

// ── 16 · PIEDRA: la piedra de hornear pasa de gris a brasa naranja de un borde al otro; arriba el aire tiembla
const piedraTex = (k: number) => ctex("e_piedra" + Math.round(k * 12), 256, 160, (g) => { const gr = g.createLinearGradient(0, 0, 256, 0); const c1 = `rgb(${90 + 165 * k},${86 + 40 * k},${80 - 50 * k})`;
  gr.addColorStop(0, c1); gr.addColorStop(Math.min(1, k * 1.2), c1); gr.addColorStop(Math.min(1, k * 1.2 + 0.15), "#5a5650"); gr.addColorStop(1, "#5a5650"); g.fillStyle = gr; g.fillRect(0, 0, 256, 160);
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(0,0,0,${0.08 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 256, rn(i, 3) * 160, 3, 3); } });
const H16Piedra: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#1c0e08">{(tt) => {
  const k = eio(tt, 0.6, 4.6);
  return <Estudio t={tt} cam={[0.1, 0.8, 1.3]} look={[0, 0.15, 0]} orbit={0.06}>
    <RBox p={[0, 0.03, 0]} s={[1.4, 0.06, 0.8]} r={0.02}><meshStandardMaterial color="#2c2a28" roughness={0.5} metalness={0.6} /></RBox>
    <RBox p={[0, 0.09, 0]} s={[1.0, 0.05, 0.6]} r={0.015}><meshStandardMaterial color="#5a5650" roughness={0.95} /></RBox>
    <mesh position={[0, 0.116, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.98, 0.58]} /><meshStandardMaterial map={piedraTex(k)} emissiveMap={piedraTex(k)} emissive="#ff7a30" emissiveIntensity={0.6 * k} roughness={0.9} /></mesh>
    {Array.from({ length: 6 }, (_, i) => { const q = (tt * 0.5 + i / 6) % 1; return <mesh key={i} position={[(i - 2.5) * 0.16, 0.15 + 0.4 * q, 0]} scale={[0.08, 0.12, 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial color="#ffb070" transparent opacity={0.25 * k * Math.sin(q * P)} depthWrite={false} /></mesh>; })}
    <pointLight position={[0, 0.4, 0.3]} intensity={0.01 + 2.5 * k} distance={2} color="#ff8a40" />
    <Placa p={[0.6, 0.35, 0.2]} rot={[0, -0.3, 0]} w={0.36} h={0.12} tex={cartel("pd", Math.round(20 + 230 * k) + "°C", { size: 120 })} k={ent(tt, 0.4)} />
  </Estudio>;
}}</Stage>;

// ── 17 · FLOR: el corte en la barra se abre como un capullo: los labios se separan y se levanta la oreja, pétalo dorado
const H17Flor: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const o = eio(tt, 1.0, 4.0);
  return <Estudio t={tt} cam={[0.12, 0.55, 0.95]} look={[0, 0.14, 0]} orbit={0.07} fov={30}>
    <Mesa w={1.4} d={0.8} />
    <Barra p={[0, 0.06, 0]} L={0.9} r={1.6} bake={0.5 + 0.4 * o} open={o} cuts={3} gloss={0.3 + 0.5 * o} />
  </Estudio>;
}}</Stage>;

// ── 18 · TRANSPORTADOR: el transportador de bronce marca 30°; la cuchilla se acuesta en ese ángulo y levanta la piel de la masa
const transTex = () => ctex("e_trans", 512, 256, (g) => { g.clearRect(0, 0, 512, 256); g.strokeStyle = "#5a3a10"; g.lineWidth = 3; g.beginPath(); g.arc(256, 250, 240, P, 2 * P); g.stroke();
  for (let i = 0; i <= 180; i += 5) { const a = P + (i / 180) * P, L = i % 30 === 0 ? 34 : 16; g.beginPath(); g.moveTo(256 + Math.cos(a) * 240, 250 + Math.sin(a) * 240); g.lineTo(256 + Math.cos(a) * (240 - L), 250 + Math.sin(a) * (240 - L)); g.stroke();
    if (i % 30 === 0) { g.fillStyle = "#5a3a10"; g.font = "bold 22px Arial"; g.fillText(String(i), 246 + Math.cos(a) * 190, 258 + Math.sin(a) * 190); } } });
const H18Transportador: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const ang = lerp(P2, P / 6, eio(tt, 0.8, 2.2)), cut = eio(tt, 2.6, 4.2);
  return <Estudio t={tt} cam={[0.0, 0.35, 1.2]} look={[0, 0.2, 0]} orbit={0.05} fov={32}>
    <Mesa w={1.6} d={0.8} />
    <mesh position={[0, 0.12, 0]} rotation={[0, 0, P2]} scale={[0.6, 1, 0.8]}><cylinderGeometry args={[0.16, 0.16, 1.1, 32]} />{masaMat("#f0e0bc", 0.4)}</mesh>
    <mesh position={[-0.35 + 0.6 * cut, 0.36, 0.08]} scale={0.001 + ent(tt, 0.3)}><planeGeometry args={[0.5, 0.25]} /><meshStandardMaterial map={transTex()} transparent color="#e8c870" depthWrite={false} /></mesh>
    <group position={[-0.35 + 0.6 * cut, 0.24, 0.1]} rotation={[0, 0, P - ang]}>
      <mesh position={[0.12, 0, 0]}><boxGeometry args={[0.24, 0.03, 0.003]} />{M.cromo("#e0e0e0")}</mesh>
      <mesh position={[-0.05, 0, 0]}><boxGeometry args={[0.12, 0.035, 0.02]} />{M.madera("#3a2414")}</mesh>
    </group>
    <mesh position={[-0.35 + 0.3 * cut, 0.238, 0.03]} rotation={[-0.5, 0, 0]} scale={[0.6 * cut + 0.001, 1, 1]}><planeGeometry args={[1, 0.02]} /><meshStandardMaterial color="#f6e8c8" side={THREE.DoubleSide} /></mesh>
    <Placa p={[0.32, 0.42, 0]} w={0.24} h={0.11} tex={cartel("tp", "30°", { size: 130, bg: "#c0281c", ink: "#fbf3e2" })} k={ent(tt, 2.2)} />
  </Estudio>;
}}</Stage>;

// ── 19 · DOS CORTES: dos cuchillas a la vez: la lenta arrastra la masa y la arruga; la rápida pasa limpia y el corte queda nítido
const H19Doscortes: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const slow = eio(tt, 0.8, 4.8), fast = eio(tt, 1.6, 2.0);
  return <Estudio t={tt} cam={[0.0, 0.9, 1.1]} look={[0, 0.1, 0]} orbit={0.05}>
    <Mesa w={1.6} d={1.0} />
    {[-0.2, 0.2].map((z, i) => { const u = i ? fast : slow; return <group key={i}>
      <Barra p={[0, 0.06, z]} L={0.9} r={1} masa cuts={0} />
      <mesh position={[-0.35 + 0.35 * u, 0.12, z]} rotation={[-P2, 0, 0]} scale={[0.7 * u + 0.001, 1, 1]}><planeGeometry args={[1, 0.006]} /><meshBasicMaterial color={i ? "#c8a46a" : "#b89a6a"} /></mesh>
      {i === 0 && Array.from({ length: 8 }, (_, j) => <mesh key={j} position={[-0.35 + 0.7 * u * (j / 8), 0.118, z + 0.012 * Math.sin(j * 2)]} rotation={[0, j, 0]} scale={[0.02, 0.008, 0.012]} visible={u > j / 8}><sphereGeometry args={[1, 8, 6]} />{masaMat("#e8d4a8", 0.4)}</mesh>)}
      <group position={[-0.35 + 0.7 * u, 0.16, z]} rotation={[0, 0, 0.5]}><mesh><boxGeometry args={[0.1, 0.02, 0.003]} />{M.cromo("#e0e0e0")}</mesh></group>
      <Placa p={[0.62, 0.07, z]} rot={[-0.9, 0, 0]} w={0.24} h={0.08} tex={cartel("dc" + i, i ? "FAST" : "SLOW", { size: 110, bg: i ? "#fbf3e2" : "#d8cfbf" })} k={ent(tt, 0.4 + i * 0.3)} />
    </group>; })}
  </Estudio>;
}}</Stage>;

// ── 20 · GÉISER: el agua hirviendo cae en la bandeja de hierro y la nube sale disparada hacia la cámara; la puerta se cierra de golpe
const H20Geiser: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#1c0e08">{(tt) => {
  const pour = cl((tt - 0.6) * 3) * (1 - cl((tt - 1.6) * 3)), burst = eio(tt, 1.2, 1.8), door = eio(tt, 4.7, 5.1);
  return <Estudio t={tt} cam={[0.0, 0.55, 1.5]} look={[0, 0.3, 0]} orbit={0.04}>
    <RBox p={[0, 0.35, -0.2]} s={[1.0, 0.7, 0.05]} r={0.01}><meshStandardMaterial color="#2c2a28" roughness={0.5} metalness={0.6} /></RBox>
    {[-0.5, 0.5].map((x) => <RBox key={x} p={[x, 0.35, 0.05]} s={[0.04, 0.7, 0.5]} r={0.01}><meshStandardMaterial color="#2c2a28" roughness={0.5} metalness={0.6} /></RBox>)}
    <RBox p={[0, 0.1, 0.05]} s={[0.8, 0.03, 0.4]} r={0.01}>{M.hierro()}</RBox>
    <mesh position={[0, 0.125, 0.05]}><boxGeometry args={[0.78 * pour + 0.001, 0.01, 0.38]} />{M.liquido("#d0e4ea", 0.6)}</mesh>
    <Chorro a={[0.3, 0.6, 0.15]} b={[0.1, 0.13, 0.05]} r={0.012} c="#e0eef2" o={0.85 * pour} t={tt} />
    <Vapor t={tt} p={[0, 0.15, 0.1]} o={0.85 * burst * (1 - door * 0.8)} h={0.6} s={0.5} spread={0.6} n={18} />
    <group position={[0, 0.0, 0.32]} rotation={[-P2 * (1 - door), 0, 0]}><RBox p={[0, 0.35, 0]} s={[1.0, 0.7, 0.04]} r={0.01}><meshStandardMaterial color="#3a3836" roughness={0.4} metalness={0.7} /></RBox>
      <mesh position={[0, 0.4, 0.021]}><planeGeometry args={[0.6, 0.3]} />{M.vidrio()}</mesh></group>
    <pointLight position={[0, 0.3, 0.3]} intensity={2.2} distance={2} color="#ff8a40" />
  </Estudio>;
}}</Stage>;

// ── 21 · BARNIZ: el pincel pasa por una tabla de madera y por la corteza a la vez: las dos quedan brillantes como barnizadas
const H21Barniz: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const u = eio(tt, 0.8, 4.0);
  return <Estudio t={tt} cam={[0.2, 0.7, 1.3]} look={[0, 0.12, 0]} orbit={0.07}>
    <Mesa w={1.8} d={1.0} c="#7a5232" />
    <RBox p={[0, 0.08, -0.2]} s={[1.0, 0.04, 0.2]} r={0.01}><meshPhysicalMaterial color="#9a6a3a" roughness={0.9} /></RBox>
    <mesh position={[-0.5 + 0.5 * u, 0.101, -0.2]} rotation={[-P2, 0, 0]} scale={[u + 0.001, 1, 1]}><planeGeometry args={[1.0, 0.2]} /><meshPhysicalMaterial color="#7a4a22" roughness={0.05} clearcoat={1} transparent opacity={0.6} /></mesh>
    <Barra p={[0, 0.06, 0.15]} L={1.0} r={1.1} bake={0.4 + 0.45 * u} gloss={u} open={0.8} />
    <group position={[-0.5 + u, 0.22, 0]} rotation={[0.5, 0, -0.3]} scale={0.001 + ent(tt, 0.3)}>
      <RBox p={[0, 0, 0]} s={[0.08, 0.04, 0.5]} r={0.01}>{M.madera("#c49a5a")}</RBox>
      <mesh position={[0, -0.04, 0]}><boxGeometry args={[0.07, 0.05, 0.48]} /><meshStandardMaterial color="#3a2410" roughness={0.9} /></mesh>
      <mesh position={[0.1, 0.02, 0]} rotation={[0, 0, -P2]}><cylinderGeometry args={[0.015, 0.02, 0.18, 10]} />{M.madera("#6a4a2a")}</mesh>
    </group>
  </Estudio>;
}}</Stage>;

// ── 22 · SEÑALES (los 5 errores): un poste con cinco carteles de chapa; en cada error un cartel gira sobre su eje y del otro lado está la foto
const H22Senales: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#10161c">{(tt) => {
  const E = IT(h), cur = curI(h, t);
  return <Estudio t={tt} cam={[0.3, 1.0, 2.75]} look={[0, 0.95, 0]} orbit={0.05}>
    <mesh rotation={[-P2, 0, 0]}><circleGeometry args={[2.0, 48]} /><meshStandardMaterial color="#6a5a44" roughness={1} /></mesh>
    <mesh position={[0, 0.9, -0.05]}><cylinderGeometry args={[0.03, 0.035, 1.8, 12]} /><meshStandardMaterial color="#8a8a8a" roughness={0.4} metalness={0.8} /></mesh>
    {Array.from({ length: 5 }, (_, i) => { const on = E[i] ? t >= E[i].a : false, f = on ? cl(phys(t - E[i].a, 0, 6, 0.5)) : 0, act = i === cur && on, y = 1.62 - i * 0.34, x = i % 2 ? -0.36 : 0.36;
      return <group key={i} position={[x * (act ? 1.05 : 1), y, act ? 0.1 : 0]} rotation={[0, P * f, 0]}>
        <RBox s={[0.68, 0.3, 0.02]} r={0.02}><meshStandardMaterial color={act ? "#e8b020" : "#c8a020"} roughness={0.4} metalness={0.5} /></RBox>
        <mesh position={[0, 0, 0.011]}><planeGeometry args={[0.6, 0.22]} /><meshStandardMaterial map={papel("e_sn" + i, [String(i + 1)], { w: 512, h: 192, size: 140, bg: "#c8a020", ink: "#1c1814" })} /></mesh>
        <group position={[0, 0, -0.012]} rotation={[0, P, 0]}>
          {on && <group position={[-0.13, 0, 0]}><Foto3D src={img(h.imgs?.[i] ?? h.bg ?? "")} w={0.36} h={0.24} /></group>}
          {on && E[i] && <mesh position={[0.2, 0, 0.002]}><planeGeometry args={[0.26, 0.24]} /><meshStandardMaterial map={papel("e_snt" + i, E[i].tx.split(" ").reduce((a: string[], w) => { const l = a[a.length - 1]; if (l && (l + " " + w).length <= 9) a[a.length - 1] = l + " " + w; else a.push(w); return a; }, []), { w: 300, h: 280, size: 50, bg: "#fbf3e2" })} /></mesh>}
        </group>
      </group>; })}
    <pointLight position={[0, 1.6, 1.4]} intensity={2.0} distance={4} color="#ffe0b0" />
  </Estudio>;
}}</Stage>;

// ── 23 · BUZÓN (CTA2): el buzón rojo del pueblo se llena: entran cartitas de a una, cada una con un nombre distinto del pan largo
const H23Buzon: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const N = ["BAGUETTE", "BARRA", "FRENCH BREAD", "PAN", "?"];
  return <Estudio t={tt} cam={[0.3, 0.75, 1.7]} look={[0, 0.5, 0]} orbit={0.07}>
    <RBox p={[0, 0.02, 0]} s={[2, 0.04, 1.2]} r={0.01}><meshStandardMaterial color="#9a9488" roughness={1} /></RBox>
    <mesh position={[0.25, 0.35, 0]}><cylinderGeometry args={[0.03, 0.03, 0.7, 10]} />{M.hierro()}</mesh>
    <group position={[0.25, 0.8, 0]}>
      <RBox s={[0.36, 0.3, 0.28]} r={0.04}><meshPhysicalMaterial color="#b01c14" roughness={0.35} clearcoat={0.8} /></RBox>
      <mesh position={[0, 0.06, 0.141]}><planeGeometry args={[0.2, 0.025]} /><meshStandardMaterial color="#1c1010" /></mesh>
    </group>
    {N.map((n, i) => { const a = 0.6 + i * 0.8, q = eio(tt, a, a + 0.6), inside = tt > a + 0.6;
      return <group key={i} position={[lerp(-0.6, 0.25, q), lerp(0.4 + 0.08 * i, 0.86, q), lerp(0.4, 0.15, q)]} rotation={[0, 0, (1 - q) * 0.3]} visible={tt > a - 0.1 && !inside}>
        <mesh><planeGeometry args={[0.2, 0.1]} /><meshStandardMaterial map={papel("e_bz" + i, [n], { w: 400, h: 200, size: n.length > 8 ? 54 : 80, bg: "#fbf3e2" })} side={THREE.DoubleSide} /></mesh></group>; })}
    <Placa p={[-0.45, 0.25, 0.3]} rot={[-0.3, 0.3, 0]} w={0.6} h={0.13} tex={cartel("bzq", "WHAT DO YOU CALL IT?", { size: 70, w: 900 })} k={ent(tt, 4.4)} />
  </Estudio>;
}}</Stage>;

// ── 24 · IMANES (rutina, bloque): en la puerta de la heladera cada paso llega pegado con un imán de color y se acomoda con un rebote
const H24Imanes: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const E = IT(h), cur = curI(h, t), cols = ["#c0281c", "#2c5a8a", "#e8b020", "#3f7a3a", "#8a3a8a", "#e86a20"];
  return <Estudio t={tt} cam={[0, 0.85, 2.2]} look={[0, 0.85, 0]} orbit={0.04}>
    <RBox p={[0, 0.85, -0.05]} s={[1.4, 1.7, 0.1]} r={0.06}><meshPhysicalMaterial color="#e8ecee" roughness={0.25} clearcoat={0.6} /></RBox>
    <RBox p={[0.62, 0.85, 0.02]} s={[0.04, 0.6, 0.04]} r={0.015}>{M.cromo("#c8c8c8")}</RBox>
    {E.map((e, i) => { const x = -0.38 + (i % 2) * 0.55, y = 1.32 - Math.floor(i / 2) * 0.4, k = t >= e.a ? ent(t, e.a) : 0, act = i === cur && t >= e.a;
      return <group key={i} position={[x, y + 0.3 * (1 - k), 0.02 + (act ? 0.04 : 0)]} rotation={[0, 0, (i % 2 ? 1 : -1) * 0.04]} scale={0.001 + k}>
        <mesh position={[0, -0.12, 0]}><planeGeometry args={[0.46, 0.26]} /><meshStandardMaterial map={papel("e_im" + i, e.tx.split(" · "), { w: 460, h: 260, size: 60, bg: act ? "#fbf3e2" : "#e6dccb" })} roughness={0.9} /></mesh>
        <mesh position={[0, 0.0, 0.015]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.035, 0.035, 0.025, 20]} /><meshPhysicalMaterial color={cols[i % cols.length]} roughness={0.3} clearcoat={1} /></mesh>
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 25 · GOTA: la cuchilla curva del maestro se moja en la taza, sale con una gota en la punta y se desliza por la masa sin trabarse
const H25Gota: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const dip = Math.sin(cl((tt - 0.7) / 1.0) * P), slide = eio(tt, 2.2, 3.6);
  return <Estudio t={tt} cam={[0.1, 0.45, 0.95]} look={[0.08, 0.14, 0]} orbit={0.06} fov={32}>
    <Mesa w={1.6} d={0.8} />
    <group position={[-0.4, 0.06, 0]}><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.08, 0.07, 0.14, 28, 1, true]} /><meshPhysicalMaterial color="#f2ead8" roughness={0.3} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.11, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.075, 24]} />{M.liquido("#cfe0e6", 0.7)}</mesh>
      {dip > 0.5 && [0, 1].map((i) => <mesh key={i} position={[0, 0.112, 0]} rotation={[-P2, 0, 0]} scale={0.02 + 0.05 * ((tt * 2 + i * 0.5) % 1)}><ringGeometry args={[0.9, 1, 24]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.5} depthWrite={false} /></mesh>)}</group>
    <Barra p={[0.25, 0.06, 0]} L={0.6} r={1} masa cuts={0} />
    <group position={[tt < 2.2 ? -0.4 : lerp(0.05, 0.55, slide), tt < 2.2 ? 0.32 - 0.16 * dip : 0.16, 0]} rotation={[0, 0, tt < 2.2 ? 1.2 : 0.4]}>
      <mesh position={[0.06, 0, 0]}><torusGeometry args={[0.12, 0.012, 6, 24, 1.2]} />{M.cromo("#e0e0e0")}</mesh>
      <mesh position={[-0.05, -0.02, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.02, 0.024, 0.16, 12]} />{M.madera("#6a4a2a")}</mesh>
      <mesh position={[0.13, 0.03, 0]} scale={[0.008, 0.011, 0.008]} visible={tt > 1.3 && tt < 3.0}><sphereGeometry args={[1, 10, 8]} />{M.liquido("#e0eef2", 0.9)}</mesh>
    </group>
    <mesh position={[0.05 + 0.25 * slide, 0.12, 0]} rotation={[-P2, 0, 0]} scale={[0.5 * slide + 0.001, 1, 1]}><planeGeometry args={[1, 0.005]} /><meshBasicMaterial color="#c8a46a" /></mesh>
  </Estudio>;
}}</Stage>;

// ── 26 · EMPAÑADO: la barra crujiente entra en la bolsa de plástico: la bolsa se empaña de gotitas y la corteza se arruga; al lado, en la bolsa de papel, sigue lisa
const H26Empanado: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const fog = eio(tt, 1.2, 4.4);
  return <Estudio t={tt} cam={[0.0, 0.52, 1.18]} look={[0, 0.13, 0]} orbit={0.06}>
    <Mesa w={1.8} d={0.9} />
    <group position={[-0.35, 0.06, 0]}><Barra L={0.6} r={1} bake={0.85 - 0.2 * fog} gloss={0.5 * (1 - fog)} open={1 - 0.5 * fog} cuts={3} />
      <mesh position={[0, 0.07, 0]} scale={[0.36, 0.1, 0.12]}><sphereGeometry args={[1, 24, 12]} /><meshPhysicalMaterial color="#f0f4f6" roughness={0.1 + 0.6 * fog} transmission={0.6 - 0.4 * fog} transparent opacity={0.35 + 0.35 * fog} /></mesh>
      {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.6, 0.06 + 0.07 * rn(i, 2), 0.12]} scale={0.004 * fog + 0.0005}><sphereGeometry args={[1, 6, 4]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} clearcoat={1} /></mesh>)}</group>
    <group position={[0.4, 0.06, 0]} rotation={[0, 0, 0.15]}>
      <Barra p={[0, 0.04, 0]} L={0.6} r={1} bake={0.85} gloss={0.5} cuts={3} />
      <mesh position={[0.08, 0.08, 0]} scale={[0.22, 0.1, 0.11]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#c49a6a" roughness={1} /></mesh>
    </group>
    <Placa p={[0.4, 0.07, 0.35]} rot={[-0.9, 0, 0]} w={0.3} h={0.08} tex={cartel("emp", "BREATHES", { size: 100 })} k={ent(tt, 3.0)} />
  </Estudio>;
}}</Stage>;

// ── 27 · TAPA: el horno a gas se ve por dentro: el vapor se escapa por las rejillas; la asadera dada vuelta baja y lo encierra
const H27Tapa: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#1c0e08">{(tt) => {
  const cover = eio(tt, 2.4, 3.4);
  return <Estudio t={tt} cam={[0.0, 0.6, 1.4]} look={[0, 0.3, 0]} orbit={0.05}>
    <RBox p={[0, 0.35, -0.25]} s={[1.1, 0.7, 0.04]} r={0.01}><meshStandardMaterial color="#2c2a28" roughness={0.5} metalness={0.6} /></RBox>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.25 + i * 0.1, 0.66, -0.22]}><boxGeometry args={[0.06, 0.012, 0.02]} /><meshStandardMaterial color="#0c0a08" /></mesh>)}
    <RBox p={[0, 0.1, 0]} s={[0.9, 0.02, 0.4]} r={0.01}>{M.hierro()}</RBox>
    {[0, 1].map((i) => <Barra key={i} p={[0, 0.11, -0.07 + i * 0.14]} L={0.6} r={0.8} bake={0.5} cuts={3} open={0.4 + 0.5 * cover} />)}
    <Vapor t={tt} p={[0, 0.2, 0]} o={0.7 * (1 - cover)} h={0.5} s={0.3} spread={0.4} n={14} />
    {Array.from({ length: 6 }, (_, i) => { const q = (tt * 0.9 + i / 6) % 1; return <mesh key={i} position={[-0.25 + i * 0.1, 0.66 + 0.25 * q, -0.22]} scale={0.03 + 0.05 * q}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.4 * (1 - q) * (1 - cover)} depthWrite={false} /></mesh>; })}
    <group position={[0, 0.12 + 0.5 * (1 - cover), 0]}><mesh position={[0, 0.1, 0]} rotation={[P, 0, 0]}><boxGeometry args={[0.8, 0.2, 0.36]} /><meshStandardMaterial color="#1c2a3a" roughness={0.3} metalness={0.3} side={THREE.DoubleSide} transparent opacity={0.92} /></mesh></group>
    <pointLight position={[0, 0.3, 0.4]} intensity={2} distance={2} color="#ff8a40" />
  </Estudio>;
}}</Stage>;

// ── 28 · CINTURÓN: al lado del cinturón de cuero, la barra chata y caída; se infla de a poco y se para alta, redonda, con sus orejas
const H28Cinturon: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const up = eio(tt, 2.4, 4.4);
  return <Estudio t={tt} cam={[0.2, 0.55, 1.3]} look={[0, 0.1, 0]} orbit={0.07}>
    <Mesa w={1.6} d={0.8} c="#7a5232" />
    <group position={[0, 0.065, -0.18]} scale={0.001 + ent(tt, 0.3)}>
      <mesh rotation={[-P2, 0, 0]}><planeGeometry args={[1.0, 0.07]} /><meshStandardMaterial color="#5a3010" roughness={0.6} /></mesh>
      <mesh position={[-0.45, 0.004, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.03, 0.045, 4]} />{M.cromo("#c8b060")}</mesh>
      {[0.1, 0.2, 0.3].map((x) => <mesh key={x} position={[x, 0.002, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.006, 10]} /><meshStandardMaterial color="#1c0c04" /></mesh>)}
    </group>
    <Barra p={[0, 0.06, 0.08]} L={0.9} r={0.8 + 0.4 * up} flat={1 - up} bake={0.8} open={up} cuts={4} gloss={0.3 + 0.3 * up} />
    <Placa p={[0.12, 0.07, 0.36]} rot={[-0.9, -0.1, 0]} w={0.32} h={0.09} tex={cartel("cin", "WORK IT COLD", { size: 80, w: 720 })} k={ent(tt, 2.8)} />
  </Estudio>;
}}</Stage>;

// ── 29 · DESHIELO: la barra sale del freezer cubierta de escarcha; entra al calor, la escarcha se derrite en gotas y la corteza vuelve a brillar y crujir
const H29Deshielo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#1c120c">{(tt) => {
  const melt = eio(tt, 1.2, 3.6), heat = eio(tt, 0.8, 2.0);
  return <Estudio t={tt} cam={[0.25, 0.55, 1.2]} look={[0, 0.12, 0]} orbit={0.07}>
    <RBox p={[0, 0.03, 0]} s={[1.4, 0.06, 0.7]} r={0.02}>{M.hierro()}</RBox>
    <Barra p={[0, 0.06, 0]} L={0.8} r={1.1} bake={0.6 + 0.3 * melt} gloss={0.2 + 0.6 * melt} cuts={4} />
    {Array.from({ length: 50 }, (_, i) => <mesh key={i} position={[-0.38 + rn(i, 1) * 0.76, 0.1 + 0.05 * rn(i, 2), (rn(i, 3) - 0.5) * 0.1]} rotation={[rn(i, 4), rn(i, 5), 0]} scale={(0.006 + 0.006 * rn(i, 6)) * (1 - melt) + 0.0005}><octahedronGeometry args={[1, 0]} /><meshPhysicalMaterial color="#eef6ff" roughness={0.2} transmission={0.4} /></mesh>)}
    {Array.from({ length: 8 }, (_, i) => { const q = cl((tt - 2.0 - rn(i, 1) * 1.2) / 0.6); return <mesh key={i} position={[-0.35 + rn(i, 2) * 0.7, 0.1 - 0.05 * q, 0.06]} scale={[0.006, 0.009, 0.006]} visible={q > 0 && q < 1}><sphereGeometry args={[1, 8, 6]} />{M.liquido("#e0eef2", 0.9)}</mesh>; })}
    <pointLight position={[0, 0.5, 0.3]} intensity={0.01 + 2.2 * heat} distance={2} color="#ff9a50" />
    <Placa p={[0.18, 0.4, 0.05]} rot={[0, -0.2, 0]} w={0.36} h={0.11} tex={cartel("ds", "200° · 8 MIN", { size: 90, w: 640 })} k={ent(tt, 2.4)} />
  </Estudio>;
}}</Stage>;

// ── 30 · MADERA: la barra del día anterior golpea la tabla como un palo («toc, toc») y suenan anillos secos; después se rebana para tostar
const H30Madera: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const knock = (a: number) => Math.sin(cl((tt - a) / 0.3) * P), k = Math.max(knock(0.8), knock(1.5)), sl = eio(tt, 2.6, 4.2);
  return <Estudio t={tt} cam={[0.1, 0.45, 1.05]} look={[-0.05, 0.12, 0]} orbit={0.07}>
    <Mesa w={1.6} d={0.8} c="#8a5a32" />
    <group position={[-0.1, 0.12 + 0.12 * k, 0]} rotation={[0, 0, 0.25 * k]} visible={sl < 0.05}><Barra L={0.8} r={1} bake={0.95} gloss={0.05} cuts={4} open={0.7} /></group>
    {[0.8, 1.5].map((a, i) => { const q = cl((tt - a - 0.15) / 0.7); return <mesh key={i} position={[-0.45, 0.07, 0]} rotation={[-P2, 0, 0]} scale={0.05 + 0.4 * q} visible={q > 0 && q < 1}><ringGeometry args={[0.95, 1, 40]} /><meshBasicMaterial color="#6a4a2a" transparent opacity={0.6 * (1 - q)} depthWrite={false} /></mesh>; })}
    {Array.from({ length: 7 }, (_, i) => <group key={i} position={[-0.45 + i * 0.12 + 0.03 * sl * i, 0.065 + 0.04 * (1 - ent(tt, 2.6 + i * 0.15)), 0]} rotation={[P2 * 0.85 * ent(tt, 2.6 + i * 0.15), 0, 0]} visible={sl > 0.05}>
      <mesh><cylinderGeometry args={[0.065, 0.065, 0.018, 24]} /><meshStandardMaterial color={hex(0.95)} roughness={0.8} /></mesh>
      <mesh position={[0, 0.0095, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.058, 24]} /><meshStandardMaterial color="#f2dcae" roughness={1} /></mesh></group>)}
    <Placa p={[0.08, 0.07, 0.32]} rot={[-0.9, -0.1, 0]} w={0.3} h={0.09} tex={cartel("md", "FOR SOUP", { size: 100 })} k={ent(tt, 3.6)} />
  </Estudio>;
}}</Stage>;

// ── 31 · PUNTA: tres barras calientes en el paño de Julián; la mano del maestro le quiebra la punta a la tercera y se la da
const H31Punta: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#1c120c">{(tt) => {
  const br = eio(tt, 1.6, 2.2), go = eio(tt, 2.6, 3.8);
  return <Estudio t={tt} cam={[0.2, 0.7, 1.3]} look={[0, 0.15, 0]} orbit={0.07}>
    <RBox p={[0, 0.03, 0]} s={[1.6, 0.06, 0.8]} r={0.02}>{M.madera("#5a3a22")}</RBox>
    <mesh position={[0, 0.062, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.0, 0.5]} /><meshStandardMaterial map={lino()} roughness={1} /></mesh>
    {[0, 1, 2].map((i) => <group key={i} position={[0, 0.07, -0.13 + i * 0.13]} scale={0.001 + ent(tt, 0.3 + i * 0.3)}><Barra p={[i === 2 ? -0.06 * br : 0, 0, 0]} L={i === 2 ? 0.8 - 0.12 * br : 0.8} r={0.9} bake={0.85} gloss={0.5} cuts={4} /></group>)}
    <group position={[0.4 + 0.3 * go, 0.12 + 0.15 * br, 0.13 + 0.15 * go]} rotation={[0, 0, 0.6 * br]} visible={br > 0.02}><mesh rotation={[0, 0, P2]} scale={[0.9, 0.12, 0.9]}><primitive object={barraGeo} attach="geometry" /><meshPhysicalMaterial color={hex(0.85)} roughness={0.4} clearcoat={0.5} /></mesh></group>
    <Vapor t={tt} p={[0, 0.12, 0]} o={0.35} h={0.4} s={0.15} spread={0.3} n={8} />
    <Placa p={[-0.32, 0.07, 0.4]} rot={[-0.9, 0.2, 0]} w={0.24} h={0.11} tex={cartel("pt", "2 + 1", { size: 130 })} k={ent(tt, 1.2)} />
  </Estudio>;
}}</Stage>;

// ── 32 · ARCILLA: la llana tapa la rajita del horno con barro y ceniza; el hilo de vapor que se escapaba se corta y la bóveda vuelve a brillar
const H32Arcilla: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#1c0e08">{(tt) => {
  const fill = eio(tt, 0.8, 3.0);
  return <Estudio t={tt} cam={[0.0, 0.5, 1.2]} look={[0, 0.4, 0]} orbit={0.05}>
    <mesh position={[0, 0.4, -0.1]}><planeGeometry args={[1.6, 1.0]} /><meshStandardMaterial map={ladTex()} roughness={0.9} /></mesh>
    <mesh position={[0, 0.45, -0.095]} rotation={[0, 0, 0.6]}><planeGeometry args={[0.5, 0.012]} /><meshBasicMaterial color="#080402" /></mesh>
    <mesh position={[-0.25 + 0.25 * fill, 0.45 - 0.14 * fill + 0.14 * fill, -0.09]} rotation={[0, 0, 0.6]} scale={[fill + 0.001, 1, 1]}><planeGeometry args={[0.5, 0.04]} /><meshStandardMaterial color="#9a8a72" roughness={1} /></mesh>
    <Vapor t={tt} p={[0.08, 0.5, -0.08]} o={0.6 * (1 - fill)} h={0.4} s={0.12} spread={0.05} n={8} />
    <group position={[-0.2 + 0.45 * fill, 0.33 + 0.26 * fill, 0.02]} rotation={[0, 0, 0.6]} scale={0.001 + ent(tt, 0.4)}>
      <mesh><boxGeometry args={[0.16, 0.08, 0.006]} />{M.cromo("#b8b8b8")}</mesh>
      <mesh position={[0, -0.02, 0.06]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.012, 0.014, 0.1, 8]} />{M.madera("#6a4a2a")}</mesh>
    </group>
    <group position={[0.55, 0.0, 0.1]} scale={0.001 + ent(tt, 0.2)}><mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.1, 0.08, 0.16, 20]} /><meshStandardMaterial color="#5a5a58" roughness={0.6} metalness={0.4} /></mesh><mesh position={[0, 0.155, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.095, 20]} /><meshStandardMaterial color="#8a7a62" roughness={1} /></mesh></group>
    <pointLight position={[0, 0.4, 0.4]} intensity={0.01 + 2 * fill} distance={2} color="#ffaa60" />
  </Estudio>;
}}</Stage>;
const ladTex = () => ctex("e_ladrillo", 512, 512, (g) => { g.fillStyle = "#6a3a24"; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 48) for (let x = -((y / 48) % 2) * 48; x < 512; x += 96) { g.fillStyle = `rgb(${130 + 30 * rn(x + y, 1)},${70 + 20 * rn(x + y, 2)},${45 + 10 * rn(x, 3)})`; g.fillRect(x + 3, y + 3, 90, 42); } });

// ── 33 · REGISTRADORA (cuentas, bloque): la caja registradora vieja: con cada gasto salta una banderita con el precio; al final el total anual
const H33Registradora: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const E = IT(h), cur = curI(h, t), drawer = E[3] ? eio(t, E[3].a, E[3].a + 0.6) : 0;
  return <Estudio t={tt} cam={[0.2, 0.75, 1.6]} look={[0, 0.4, 0]} orbit={0.05}>
    <Mesa w={1.8} d={0.9} c="#5a3a22" />
    <group position={[0, 0.06, 0]}>
      <RBox p={[0, 0.18, 0]} s={[0.8, 0.36, 0.5]} r={0.03}>{M.cromo("#b8902e")}</RBox>
      <RBox p={[0, 0.06, 0.25 + 0.15 * drawer]} s={[0.7, 0.1, 0.1]} r={0.02}>{M.madera("#4a2e1a")}</RBox>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.3 + (i % 6) * 0.12, 0.38, 0.12 + Math.floor(i / 6) * 0.08]} rotation={[0.4, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.02, 16]} /><meshStandardMaterial color="#f2ead8" roughness={0.4} /></mesh>)}
      <RBox p={[0, 0.52, -0.12]} s={[0.76, 0.22, 0.14]} r={0.02}>{M.cromo("#a07a28")}</RBox>
      {E[cur] && t >= E[cur].a && <mesh position={[0, 0.52, -0.049]} scale={0.001 + ent(t, E[cur].a)}><planeGeometry args={[0.66, 0.16]} /><meshStandardMaterial map={papel("e_rgv" + cur, [E[cur].tx], { w: 660, h: 160, size: E[cur].tx.length > 9 ? 84 : 110, bg: "#1c1408", ink: "#ffd27a" })} emissive="#ffd27a" emissiveIntensity={0.15} /></mesh>}
      {E.map((e, i) => { const up = t >= e.a ? ent(t, e.a) : 0, act = i === cur && t >= e.a, last = i === E.length - 1;
        return <group key={i} position={[-0.28 + i * 0.14, 0.55 + 0.14 * up, -0.06]} scale={0.001 + up * (last ? 1.4 : 1)} visible={up > 0.01}>
          <mesh><planeGeometry args={[0.13, 0.08]} /><meshStandardMaterial map={papel("e_rg" + i, [e.tx], { w: 320, h: 200, size: e.tx.length > 9 ? 44 : 60, bg: act ? "#fbf3e2" : "#e6dccb" })} /></mesh></group>; })}
    </group>
    {Array.from({ length: 6 }, (_, i) => <Moneda key={i} p={[-0.2 + i * 0.07, 0.12 + 0.01 * i * drawer, 0.4 + 0.15 * drawer]} s={0.03} c="#c9a64a" />)}
  </Estudio>;
}}</Stage>;

// ── 34 · GRAMÓFONO: la bocina del gramófono apunta a las barras recién salidas; el crujido sube por la bocina como chispitas doradas
const bocinaGeo = lathe([[0.02, 0], [0.03, 0.15], [0.06, 0.3], [0.13, 0.42], [0.25, 0.5]], 32);
const H34Gramofono: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#1c120c">{(tt) => {
  return <Estudio t={tt} cam={[0.3, 0.7, 1.5]} look={[0, 0.3, 0]} orbit={0.07}>
    <Mesa w={1.8} d={0.9} c="#5a3a22" />
    <group position={[-0.1, 0.07, 0.05]}>
      <RBox p={[0, 0.01, 0]} s={[0.9, 0.02, 0.4]} r={0.005}>{M.hierro()}</RBox>
      {[0, 1, 2].map((i) => <Barra key={i} p={[0, 0.02, -0.12 + i * 0.12]} L={0.8} r={0.9} bake={0.9} gloss={0.7} cuts={4} />)}
      {Array.from({ length: 30 }, (_, i) => { const q = (tt * (0.4 + 0.3 * rn(i, 1)) + rn(i, 2)) % 1; const x0 = (rn(i, 3) - 0.5) * 0.7, z0 = (rn(i, 4) - 0.5) * 0.3; return <mesh key={i} position={[lerp(x0, 0.62, q * q), 0.1 + 0.42 * q, lerp(z0, 0.0, q)]} scale={0.005 * Math.sin(q * P) + 0.001}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} /></mesh>; })}
    </group>
    <group position={[0.65, 0.07, -0.05]} scale={0.001 + ent(tt, 0.3)}>
      <RBox p={[0, 0.06, 0]} s={[0.24, 0.12, 0.24]} r={0.02}>{M.madera("#6a3a1a")}</RBox>
      <group position={[0, 0.14, 0]} rotation={[0, 0, 0.9]}><mesh geometry={bocinaGeo}><meshStandardMaterial color="#c8a040" roughness={0.3} metalness={0.8} side={THREE.DoubleSide} /></mesh></group>
    </group>
    <pointLight position={[0, 0.6, 0.5]} intensity={1.6} distance={2.5} color="#ffd9a0" />
  </Estudio>;
}}</Stage>;

// ── 35 · REBANADAS (repaso, bloque): la barra cortada en rodajas; con cada paso una rodaja se para de canto y en su miga aparece el paso
const H35Rebanadas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const E = IT(h), cur = curI(h, t), N = Math.max(1, E.length);
  return <Estudio t={tt} cam={[0, 0.42, 1.55]} look={[0, 0.2, 0]} orbit={0.05}>
    <RBox p={[0, 0.04, 0]} s={[2.0, 0.08, 0.7]} r={0.03}>{M.madera("#8a5a32")}</RBox>
    {E.map((e, i) => { const on = t >= e.a, k = on ? ent(t, e.a) : 0, act = i === cur && on, x = -0.72 + (i * 1.44) / Math.max(1, N - 1);
      return <group key={i} position={[x, 0.08 + 0.13 * k, 0]} rotation={[P2 * k - (act ? 0.12 : 0), 0, 0]}>
        <mesh><cylinderGeometry args={[0.095, 0.095, 0.03, 28]} /><meshStandardMaterial color={hex(0.85)} roughness={0.5} /></mesh>
        <mesh position={[0, 0.016, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.084, 28]} /><meshStandardMaterial map={papel("e_rb" + i, e.tx.split(" · "), { w: 300, h: 300, size: e.tx.length > 10 ? 52 : 66, bg: act ? "#fbf3e2" : "#efe0c0" })} roughness={1} /></mesh>
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 36 · RUEDA (el otro video): la hogaza redonda entra rodando como una rueda, frena junto a las barras y se acomoda; «la madre de todos»
const H36Rueda: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const r = 1 - eio(tt, 0.4, 2.0), tip = eio(tt, 2.1, 2.8), wob = Math.exp(-2 * Math.max(0, tt - 2.0)) * Math.sin(Math.max(0, tt - 2.0) * 9) * 0.15;
  return <Estudio t={tt} cam={[0.2, 0.6, 1.6]} look={[0, 0.25, 0]} orbit={0.07}>
    <Mesa w={2.0} d={0.9} />
    {[0, 1, 2].map((i) => <Barra key={i} p={[-0.55, 0.06, -0.25 + i * 0.1]} L={0.6} r={0.8} bake={0.88} gloss={0.5} cuts={3} />)}
    <group position={[0.2 + 1.4 * r, 0.06 + 0.24 * (1 - tip), 0.1]} rotation={[P2 * (1 - tip) + wob * (1 - tip), 0, -r * 9]}><Hogaza s={0.9} bake={0.85} rise={1} /></group>
    <Placa p={[0.2, 0.07, 0.42]} rot={[-0.9, 0, 0]} w={0.5} h={0.1} tex={cartel("ru", "THE MOTHER BREAD", { size: 80, w: 900 })} k={ent(tt, 2.4)} />
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  nube: H1Nube, timbre: H2Timbre, engranajes: H3Engranajes, pinza: H4Pinza, alambre: H5Alambre, acordeon: H6Acordeon, tren: H7Tren, guante: H8Guante,
  hamaca: H9Hamaca, cierre: H10Cierre, telescopio: H11Telescopio, diagonal: H12Diagonal, tela: H13Tela, baul: H14Baul, colchon: H15Colchon, piedra: H16Piedra,
  flor: H17Flor, transportador: H18Transportador, doscortes: H19Doscortes, geiser: H20Geiser, barniz: H21Barniz, senales: H22Senales, buzon: H23Buzon,
  imanes: H24Imanes, gota: H25Gota, empanado: H26Empanado, tapa: H27Tapa, cinturon: H28Cinturon, deshielo: H29Deshielo, madera: H30Madera, punta: H31Punta,
  arcilla: H32Arcilla, registradora: H33Registradora, gramofono: H34Gramofono, rebanadas: H35Rebanadas, rueda: H36Rueda,
};
