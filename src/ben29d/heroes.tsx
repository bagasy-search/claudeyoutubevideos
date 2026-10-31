// ben29d · «la torta de aceite de $1,50»: los componentes únicos del minuto (ninguno repite mecanismo de ben29a, ben29b ni ben29c).
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
  papel("d_" + key, [tx], { w: o.w ?? 512, h: o.h ?? 192, size: o.size ?? 120, bg: o.bg, ink: o.ink, font: `900 ${o.size ?? 120}px Georgia, serif` });
const Placa: React.FC<{ p: V3; rot?: V3; w: number; h: number; tex: THREE.Texture; k?: number }> = ({ p, rot, w, h, tex, k = 1 }) => (
  <group position={p} rotation={rot} scale={0.001 + k}>
    <RBox s={[w + 0.06, h + 0.06, 0.04]} r={0.015}>{M.madera("#5a3a22")}</RBox>
    <mesh position={[0, 0, 0.022]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={tex} roughness={0.85} /></mesh>
  </group>);
const hex = (b: number) => "#" + corteza(b).getHexString();
const MASA = "#efdcb4";
const ACEITE = "#c9a020";
const masaMat = (c = MASA, r = 0.6) => <meshPhysicalMaterial color={c} roughness={r} sheen={0.8} sheenColor="#fff1d6" clearcoat={0.15} />;
// cara de la torta vista de arriba: color de corteza, hoyuelos (sombra + brillo) y charcos de aceite opcionales
const focaTex = (bake: number, dimp: number, pools: number, key = "") => ctex(`d_foca${key}_${Math.round(bake * 10)}_${Math.round(dimp * 10)}_${Math.round(pools * 10)}`, 512, 360, (g) => {
  g.fillStyle = bake > 0.05 ? hex(0.3 + 0.6 * bake) : MASA; g.fillRect(0, 0, 512, 360);
  for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(255,240,210,${0.05 + 0.06 * rn(i, 3)})`; g.fillRect(rn(i, 1) * 512, rn(i, 2) * 360, 2, 2); }
  for (let j = 0; j < 5; j++) for (let i = 0; i < 7; i++) { const x = 40 + i * 72 + (j % 2) * 30 + (rn(i + j * 7, 4) - 0.5) * 16, y = 40 + j * 70 + (rn(i + j * 7, 5) - 0.5) * 14;
    if (dimp > 0.02) { g.fillStyle = `rgba(110,70,30,${0.45 * dimp})`; g.beginPath(); g.ellipse(x, y, 16 * dimp, 12 * dimp, 0.3, 0, 7); g.fill(); }
    if (pools > 0.02) { g.fillStyle = `rgba(255,222,140,${0.75 * pools})`; g.beginPath(); g.ellipse(x - 2, y - 2, 12 * pools, 8 * pools, 0.3, 0, 7); g.fill();
      g.fillStyle = `rgba(255,255,255,${0.8 * pools})`; g.beginPath(); g.ellipse(x - 5, y - 4, 4, 2.5, 0.3, 0, 7); g.fill(); } } });
// la torta: losa blanda en su bandeja de chapa oscura
const Foca: React.FC<{ p?: V3; w?: number; d?: number; h?: number; bake?: number; dimp?: number; pools?: number; gloss?: number; tk?: string }> = ({ p, w = 1, d = 0.7, h = 0.07, bake = 0, dimp = 0, pools = 0, gloss = 0.3, tk = "" }) => (
  <group position={p}>
    <RBox p={[0, h / 2, 0]} s={[w, h, d]} r={Math.min(0.03, h / 2.2)}><meshPhysicalMaterial color={bake > 0.05 ? hex(0.4 + 0.55 * bake) : MASA} roughness={0.6 - 0.3 * gloss} clearcoat={gloss} /></RBox>
    <mesh position={[0, h + 0.001, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[w - 0.04, d - 0.04]} /><meshPhysicalMaterial map={focaTex(bake, dimp, pools, tk)} roughness={0.55 - 0.35 * gloss} clearcoat={gloss} /></mesh>
  </group>);
const Chapa: React.FC<{ p?: V3; w?: number; d?: number; c?: string; rot?: V3; children?: React.ReactNode }> = ({ p, w = 1.1, d = 0.8, c = "#2c2a28", rot, children }) => (
  <group position={p} rotation={rot}>
    <mesh position={[0, 0.006, 0]} castShadow receiveShadow><boxGeometry args={[w, 0.012, d]} /><meshStandardMaterial color={c} roughness={0.35} metalness={0.8} /></mesh>
    {[[0, d / 2, w, 0], [0, -d / 2, w, 0], [w / 2, 0, d, P2], [-w / 2, 0, d, P2]].map(([x, z, L, r], i) => <mesh key={i} position={[x, 0.04, z]} rotation={[0, r, 0]} castShadow><boxGeometry args={[L + 0.012, 0.08, 0.012]} /><meshStandardMaterial color={c} roughness={0.35} metalness={0.8} /></mesh>)}
    <group position={[0, 0.012, 0]}>{children}</group>
  </group>);
const Mesa: React.FC<{ w?: number; d?: number; c?: string }> = ({ w = 1.8, d = 1.0, c = "#9a6a3a" }) => <RBox p={[0, 0.03, 0]} s={[w, 0.06, d]} r={0.03}>{M.madera(c)}</RBox>;
const kraft = () => ctex("d_kraft", 128, 128, (g) => { g.fillStyle = "#b48a5a"; g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(90,60,30,${0.1 + 0.15 * rn(i, 1)})`; g.beginPath(); g.moveTo(rn(i, 2) * 128, rn(i, 3) * 128); g.lineTo(rn(i, 4) * 128, rn(i, 5) * 128); g.stroke(); } });
const romero = (p: V3, s = 1, rot = 0, c = "#3f6a2c", k = 0) => <group key={p.join()} position={p} rotation={[0, rot, 0]} scale={s}>
  <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.006, 0.006, 0.2, 6]} /><meshStandardMaterial color="#6a5030" /></mesh>
  {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[-0.09 + i * 0.013, 0.01, (i % 2 ? 1 : -1) * 0.02]} rotation={[0, (i % 2 ? 1 : -1) * 0.8, 0]} scale={[0.004, 0.003, 0.026]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={c} roughness={0.5 + 0.4 * k} /></mesh>)}
</group>;

// ── 1 · CANDIL (CTA1): el candil de bronce del mostrador; el dedo aprieta la baldosa roja, el candil se enciende y la campanita de su gancho suena dos veces
const candilGeo = lathe([[0.001, 0], [0.12, 0], [0.13, 0.02], [0.05, 0.06], [0.04, 0.2], [0.09, 0.24], [0.1, 0.3], [0.03, 0.33], [0.001, 0.33]], 32);
const H1Candil: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#1c120c">{(tt) => {
  const press = Math.sin(cl((tt - 1.0) / 0.5) * P), lit = eio(tt, 1.25, 1.9), sw = Math.exp(-2 * Math.max(0, tt - 1.6)) * Math.sin((tt - 1.6) * 14) * (tt > 1.6 ? 1 : 0);
  return <Estudio t={tt} cam={[0.4, 0.9, 1.9]} look={[0.05, 0.35, 0]} orbit={0.08}>
    <Mesa w={1.8} d={0.9} c="#7a5232" />
    <group position={[0.3, 0.06, -0.05]}>
      <mesh geometry={candilGeo} castShadow>{M.cromo("#b8902e")}</mesh>
      <mesh position={[0.16, 0.3, 0]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.012, 0.016, 0.16, 10]} />{M.cromo("#b8902e")}</mesh>
      <group position={[0.22, 0.36, 0]} scale={0.001 + lit}><mesh scale={[0.03, 0.07, 0.03]} position={[0, 0.05, 0]}><sphereGeometry args={[1, 16, 12]} /><meshBasicMaterial color="#ffc060" toneMapped={false} /></mesh></group>
      <pointLight position={[0.22, 0.45, 0.05]} intensity={0.01 + 3.5 * lit} distance={2.2} color="#ffb050" />
      <mesh position={[0, 0.42, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.04, 0.008, 8, 20]} />{M.cromo("#b8902e")}</mesh>
      <group position={[0, 0.38, 0]} rotation={[0, 0, 0.35 * sw]}>
        <mesh position={[0, -0.06, 0]} geometry={campGeo} castShadow>{M.cromo("#c9a040")}</mesh>
        <mesh position={[0.02 * sw, -0.1, 0]}><sphereGeometry args={[0.01, 10, 8]} />{M.hierro()}</mesh>
      </group>
      {[1.7, 2.1].map((a, i) => <mesh key={i} position={[0, 0.3, 0]} scale={0.05 + 0.4 * cl((tt - a) / 0.8)} visible={tt > a && tt < a + 0.8}><torusGeometry args={[0.6, 0.01, 6, 40]} /><meshBasicMaterial color="#ffe0a0" transparent opacity={0.6 * (1 - cl((tt - a) / 0.8))} depthWrite={false} /></mesh>)}
    </group>
    <group position={[-0.35, 0.06 - 0.02 * press, 0.1]} scale={ent(tt, 0.3) + 0.001}>
      <mesh position={[0, 0.015, 0]}><cylinderGeometry args={[0.13, 0.14, 0.03, 40]} />{M.madera("#3a2414")}</mesh>
      <mesh position={[0, 0.03, 0]} scale={[1, 0.8, 1]}><sphereGeometry args={[0.11, 40, 20, 0, 2 * P, 0, P2]} />{M.cromo("#c9a24a")}</mesh>
      <mesh position={[0, 0.125 - 0.012 * press, 0]}><cylinderGeometry args={[0.012, 0.012, 0.03, 12]} />{M.cromo("#b8962e")}</mesh>
      <mesh position={[0, 0.142 - 0.012 * press, 0]}><sphereGeometry args={[0.02, 14, 10]} />{M.cromo("#b8962e")}</mesh>
    </group>
    <group position={[-0.35, 0.24 - 0.03 * press + 0.3 * (1 - ent(tt, 0.6)), 0.1]} rotation={[-0.2, 0, 0.15]}><mesh position={[0, 0.1, 0]}><capsuleGeometry args={[0.028, 0.15, 8, 16]} /><meshPhysicalMaterial color="#e0a888" roughness={0.55} sheen={0.5} sheenColor="#ffd0c0" /></mesh></group>
  </Estudio>;
}}</Stage>;
const campGeo = lathe([[0.001, 0.07], [0.02, 0.07], [0.03, 0.04], [0.045, 0.0], [0.05, -0.01], [0.001, -0.01]], 24);

// ── 2 · SUELO DEL HORNO: visto desde arriba; el fuego en el medio; la hogaza grande se quema del lado del fuego y la bandeja chata se dora pareja y fríe sus bordes
const ladTex = () => ctex("d_ladrillo", 512, 512, (g) => { g.fillStyle = "#6a3a24"; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 48) for (let x = -((y / 48) % 2) * 48; x < 512; x += 96) { g.fillStyle = `rgb(${130 + 30 * rn(x + y, 1)},${70 + 20 * rn(x + y, 2)},${45 + 10 * rn(x, 3)})`; g.fillRect(x + 3, y + 3, 90, 42); } });
const H2Suelo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#1c0e08">{(tt) => {
  const k = eio(tt, 1.0, 5.5);
  return <Estudio t={tt} cam={[0, 2.3, 1.3]} look={[0, 0, -0.1]} orbit={0.06} fov={36}>
    <mesh rotation={[-P2, 0, 0]} receiveShadow><circleGeometry args={[1.6, 64]} /><meshStandardMaterial map={ladTex()} roughness={0.9} /></mesh>
    <group position={[0, 0.0, -0.2]}>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[Math.cos(i) * 0.15, 0.05, Math.sin(i * 1.7) * 0.12]} rotation={[0, i, P2]}><cylinderGeometry args={[0.03, 0.035, 0.4, 8]} /><meshStandardMaterial color="#2a160c" emissive="#ff5a10" emissiveIntensity={0.6 + 0.3 * Math.sin(tt * 1.6 + i)} toneMapped={false} /></mesh>)}
      {Array.from({ length: 9 }, (_, i) => { const f = 0.7 + 0.3 * Math.sin(tt * 1.8 + i * 1.3); return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.35, 0.12 * f, (rn(i, 2) - 0.5) * 0.25]} scale={[0.06, 0.2 * f, 0.06]}><coneGeometry args={[1, 1, 8]} /><meshBasicMaterial color="#ffa030" transparent opacity={0.8} toneMapped={false} /></mesh>; })}
      {[0, 1, 2].map((i) => { const q = ((tt * 0.5 + i / 3) % 1); return <mesh key={i} position={[0, 0.01, 0]} rotation={[-P2, 0, 0]} scale={0.3 + 0.9 * q}><ringGeometry args={[0.95, 1, 48]} /><meshBasicMaterial color="#ff8a30" transparent opacity={0.35 * (1 - q)} depthWrite={false} /></mesh>; })}
      <pointLight position={[0, 0.4, 0]} intensity={4} distance={2.5} color="#ff8a40" />
    </group>
    <group position={[-0.62, 0, -0.15]} scale={0.001 + ent(tt, 0.3)}>
      <Hogaza s={0.75} bake={0.4 + 0.6 * k} rise={1} />
      <mesh position={[0.18, 0.12, 0]} scale={[0.08, 0.14 * k + 0.001, 0.2]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#120a06" roughness={1} /></mesh>
    </group>
    <group position={[0.55, 0, 0.35]} scale={0.001 + ent(tt, 0.6)}>
      <Chapa w={0.7} d={0.5}><Foca w={0.66} d={0.46} h={0.05} bake={k} dimp={1} pools={0.4 * (1 - k)} gloss={0.6} /></Chapa>
      {Array.from({ length: 14 }, (_, i) => { const side = i % 4, u = rn(i, 2) - 0.5, q = (tt * 1.3 + rn(i, 3)) % 1; const x = side < 2 ? u * 0.62 : (side === 2 ? 0.33 : -0.33), z = side < 2 ? (side ? 0.23 : -0.23) : u * 0.42;
        return <mesh key={i} position={[x, 0.07 + 0.02 * q, z]} scale={0.008 * Math.sin(q * P) * k + 0.001}><sphereGeometry args={[1, 8, 6]} /><meshPhysicalMaterial color="#ffe6a0" roughness={0.1} clearcoat={1} /></mesh>; })}
    </group>
  </Estudio>;
}}</Stage>;

// ── 3 · PAPEL: el pedazo envuelto en papel de estraza; la mancha de aceite se agranda en el papel y una gota corre hacia abajo
const manchaTex = () => ctex("d_mancha", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(70,40,10,.75)"); gr.addColorStop(0.75, "rgba(90,55,15,.55)"); gr.addColorStop(1, "rgba(90,55,15,0)"); g.fillStyle = gr; g.beginPath();
  for (let i = 0; i <= 40; i++) { const a = (i / 40) * 6.28, r = 110 + 16 * Math.sin(a * 5) + 10 * Math.sin(a * 9); g.lineTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r); } g.fill(); });
const H3Papel: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const st = eio(tt, 0.8, 5.0), drip = cl((tt - 2.4) / 2.5);
  return <Estudio t={tt} cam={[0.25, 0.75, 1.35]} look={[0, 0.3, 0]} orbit={0.08}>
    <RBox p={[0, 0.03, 0]} s={[1.4, 0.06, 0.7]} r={0.03}>{M.madera("#6a4a30")}</RBox>
    <group position={[0, 0.3, 0]} rotation={[0.15, -0.3, 0]} scale={0.001 + ent(tt, 0.2)}>
      <Foca p={[0, 0.12, -0.02]} w={0.3} d={0.08} h={0.22} bake={0.75} dimp={1} pools={0.6} gloss={0.7} tk="p" />
      <mesh position={[0, 0.1, 0.03]} rotation={[0, 0, 0]}><planeGeometry args={[0.44, 0.34]} /><meshStandardMaterial map={kraft()} roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.1, 0.031]} scale={[0.05 + 0.32 * st, 0.05 + 0.28 * st, 1]}><planeGeometry args={[1, 1]} /><meshStandardMaterial map={manchaTex()} transparent roughness={0.4} depthWrite={false} /></mesh>
      <mesh position={[0.06, 0.06 - 0.3 * drip, 0.04]} scale={[0.012, 0.02 + 0.01 * drip, 0.012]} visible={tt > 2.4 && drip < 1}><sphereGeometry args={[1, 12, 10]} />{M.liquido(ACEITE, 0.95)}</mesh>
    </group>
  </Estudio>;
}}</Stage>;

// ── 4 · LÍQUIDA: la palma abierta sostiene la masa y la masa se le escurre entre los dedos, hilo largo hasta el bol
const H4Liquida: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const run = eio(tt, 0.8, 4.8);
  return <Estudio t={tt} cam={[0.3, 0.75, 1.6]} look={[0, 0.45, 0]} orbit={0.08}>
    <Mesa w={1.6} d={0.9} />
    <Bol p={[0, 0.06, 0]} s={0.35}><Masa p={[0, 0.06, 0]} r={0.55} rise={0.1 + 0.4 * run} rough={0.3} t={tt} /></Bol>
    <group position={[0, 0.78, 0.05]}>
      <group rotation={[0, 0, 0.12]}><RBox p={[0, 0.02, 0]} s={[0.34, 0.016, 0.2]} r={0.008}>{M.madera("#b07a44")}</RBox><mesh position={[0.32, 0.03, 0]} rotation={[0, 0, P2 - 0.05]}><cylinderGeometry args={[0.018, 0.022, 0.32, 10]} />{M.madera("#6a4a2a")}</mesh></group>
      <mesh position={[0, 0.06, 0.04]} scale={[0.14 * (1 - 0.6 * run) + 0.02, 0.05 * (1 - 0.7 * run) + 0.01, 0.12 * (1 - 0.6 * run) + 0.02]}><sphereGeometry args={[1, 24, 16]} />{masaMat(MASA, 0.3)}</mesh>
    </group>
    {[-0.05, 0.03].map((x, i) => <Chorro key={i} a={[x, 0.76, -0.02]} b={[x * 0.5, 0.22, 0]} r={0.014 + 0.006 * i} c={MASA} o={0.95 * cl((tt - 0.8 - i * 0.3) * 3) * (1 - cl((tt - 5.2) * 3))} t={tt} splash={false} />)}
  </Estudio>;
}}</Stage>;

// ── 5 · NIVEL: dos vasos altos de vidrio: harina hasta la marca de 500; el agua sube hasta la raya del 80 %; arriba cae la capita dorada de aceite
const H5Nivel: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const f = eio(tt, 0.4, 1.6), w = eio(tt, 1.6, 3.6), o = eio(tt, 3.8, 4.6), H0 = 0.9;
  return <Estudio t={tt} cam={[0.2, 0.75, 2.0]} look={[0, 0.5, 0]} orbit={0.07}>
    <Mesa w={1.6} d={0.8} />
    {[-0.25, 0.25].map((x, i) => <group key={i} position={[x, 0.06, 0]}>
      <mesh position={[0, H0 / 2, 0]}><cylinderGeometry args={[0.15, 0.15, H0, 32, 1, true]} />{M.vidrio()}</mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.15, 32]} />{M.vidrio()}</mesh>
      {i === 0 && <mesh position={[0, (H0 * f) / 2, 0]} scale={[1, 0.001 + f, 1]}><cylinderGeometry args={[0.14, 0.14, H0, 32]} /><meshStandardMaterial color="#f6f1e6" roughness={1} /></mesh>}
      {i === 1 && <mesh position={[0, (H0 * 0.8 * w) / 2, 0]} scale={[1, 0.001 + w, 1]}><cylinderGeometry args={[0.14, 0.14, H0 * 0.8, 32]} />{M.liquido("#bcd8e0", 0.55)}</mesh>}
      {i === 1 && <mesh position={[0, H0 * 0.8 * w + 0.012 * o, 0]} scale={[1, 0.001 + o, 1]}><cylinderGeometry args={[0.14, 0.14, 0.025, 32]} />{M.liquido(ACEITE, 0.9)}</mesh>}
    </group>)}
    <mesh position={[0, 0.06 + H0 * 0.8, 0.0]}><boxGeometry args={[0.95 * ent(tt, 3.4) + 0.001, 0.006, 0.006]} /><meshBasicMaterial color="#c0281c" /></mesh>
    <mesh position={[0, 0.06 + H0, 0.0]}><boxGeometry args={[0.95 * ent(tt, 1.5) + 0.001, 0.004, 0.004]} /><meshBasicMaterial color="#5a3a22" /></mesh>
    <Placa p={[-0.25, 0.09, 0.3]} rot={[-0.5, 0, 0]} w={0.3} h={0.1} tex={cartel("n500", "500 g", { size: 120 })} k={ent(tt, 1.0)} />
    <Placa p={[0.25, 0.09, 0.3]} rot={[-0.5, 0, 0]} w={0.3} h={0.1} tex={cartel("n400", "400 g", { size: 120 })} k={ent(tt, 2.8)} />
    <Placa p={[0.62, 0.86, 0]} w={0.24} h={0.1} tex={cartel("n80", "4 TO 5", { size: 110, bg: "#c0281c", ink: "#fbf3e2" })} k={ent(tt, 3.6)} />
  </Estudio>;
}}</Stage>;

// ── 6 · GACHAS: el bol de masa grumosa como gachas espesas; la cuchara de palo queda parada sola en el medio y después se recuesta despacito contra el borde
const H6Gachas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const tip = eio(tt, 3.2, 5.4), plop = (i: number) => { const q = (tt * 0.6 + rn(i, 1)) % 1; return Math.sin(q * P) * (q < 0.5 ? 1 : 0); };
  return <Estudio t={tt} cam={[0.3, 1.1, 1.5]} look={[0, 0.3, 0]} orbit={0.08}>
    <Mesa w={1.6} d={1.0} />
    <Bol p={[0, 0.06, 0]} s={0.5}><Masa p={[0, 0.08, 0]} r={0.62} rise={0.15} rough={1} t={tt} bub={0.3} /></Bol>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[Math.cos(i * 1.1) * 0.15, 0.2 + 0.01 * plop(i), Math.sin(i * 1.1) * 0.15]} scale={0.001 + 0.018 * plop(i)}><sphereGeometry args={[1, 10, 8, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color="#f6e8c8" roughness={0.15} clearcoat={1} /></mesh>)}
    <group position={[0, 0.18, 0]} rotation={[0, 0.4, -0.75 * tip]} scale={0.001 + ent(tt, 0.6)}>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.014, 0.018, 0.55, 10]} />{M.madera("#b07a48")}</mesh>
      <mesh position={[0, 0.02, 0]} scale={[0.05, 0.08, 0.025]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#b07a48" roughness={0.6} /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

// ── 7 · SEDA: cuatro boles en fila = los cuatro pliegues; de charco chato y opaco a domo liso, brillante y lleno de burbujas
const H7Seda: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  return <Estudio t={tt} cam={[0.0, 1.15, 2.3]} look={[0, 0.2, 0]} orbit={0.06}>
    <Mesa w={2.6} d={0.9} />
    {[0, 1, 2, 3].map((i) => { const k = ent(tt, 0.4 + i * 1.3), q = i / 3;
      return <group key={i} position={[-0.96 + i * 0.64, 0.06, 0]} scale={0.001 + k}>
        <Bol s={0.36}><Masa p={[0, 0.05, 0]} r={0.62} rise={0.05 + 0.9 * q} rough={0.9 * (1 - q)} t={tt} bub={q} c={q > 0.6 ? "#f4e4c0" : MASA} /></Bol>
        <mesh position={[0, 0.12 + 0.12 * q, 0]} rotation={[-P2, 0, 0]} scale={0.001 + 0.08 * q}><circleGeometry args={[1, 24]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.25 * q} depthWrite={false} /></mesh>
        <Placa p={[0, 0.03, 0.32]} rot={[-0.6, 0, 0]} w={0.1} h={0.1} tex={cartel("sd" + i, String(i + 1), { w: 192, h: 192, size: 150 })} k={k} />
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 8 · MÉTRICA: la bandeja de chapa vacía; la cinta métrica amarilla se desenrolla por el lado largo (33) y por el corto (23)
const cintaTex = () => ctex("d_cinta", 1024, 64, (g) => { g.fillStyle = "#f2c230"; g.fillRect(0, 0, 1024, 64); g.fillStyle = "#1a1a1a";
  for (let i = 0; i <= 100; i++) { const x = i * 10.24, L = i % 10 === 0 ? 34 : i % 5 === 0 ? 24 : 14; g.fillRect(x, 0, 2, L); if (i % 10 === 0 && i > 0 && i < 100) { g.font = "bold 22px Arial"; g.fillText(String(i / 3 | 0), x + 4, 58); } } });
const H8Metrica: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const a = eio(tt, 0.6, 2.2), b = eio(tt, 2.4, 3.8);
  return <Estudio t={tt} cam={[0.35, 1.6, 2.05]} look={[0.05, 0, 0.1]} orbit={0.07}>
    <Mesa w={2.0} d={1.4} />
    <Chapa p={[0, 0.06, 0]} w={1.1} d={0.78} />
    <mesh position={[-0.55 + 0.55 * a, 0.15, 0.43]} scale={[1.1 * a + 0.001, 1, 1]} rotation={[-P2 + 0.25, 0, 0]}><planeGeometry args={[1, 0.05]} /><meshStandardMaterial map={cintaTex()} roughness={0.5} /></mesh>
    <mesh position={[0.6, 0.15, 0.39 - 0.39 * b]} scale={[1, 1, 1]} rotation={[-P2 + 0.25, 0, P2]}><planeGeometry args={[0.78 * b + 0.001, 0.05]} /><meshStandardMaterial map={cintaTex()} roughness={0.5} /></mesh>
    <RBox p={[-0.55 + 1.1 * a, 0.12, 0.47]} s={[0.12, 0.12, 0.06]} r={0.03}><meshPhysicalMaterial color="#d8a820" roughness={0.35} clearcoat={0.6} /></RBox>
    <Placa p={[0, 0.07, 0.62]} rot={[-0.9, 0, 0]} w={0.36} h={0.11} tex={cartel("m33", "33 cm", { size: 120 })} k={ent(tt, 2.0)} />
    <Placa p={[0.6, 0.07, 0.12]} rot={[-0.9, -0.5, 0]} w={0.36} h={0.11} tex={cartel("m23", "23 cm", { size: 120 })} k={ent(tt, 3.6)} />
  </Estudio>;
}}</Stage>;

// ── 9 · FRITURA: corte de costado de la bandeja en el horno: la capa de aceite burbujea y la base de la masa se vuelve una costra dorada que crece desde abajo
const H9Fritura: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#1c0e08">{(tt) => {
  const k = eio(tt, 1.0, 5.0);
  return <Estudio t={tt} cam={[0.1, 0.38, 1.05]} look={[0, 0.2, 0]} orbit={0.05} fov={32}>
    {[-0.4, -0.13, 0.13, 0.4].map((x, i) => <mesh key={i} position={[x, 0.06, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.012, 0.012, 0.22, 8]} /><meshStandardMaterial color="#3a1a0c" emissive="#ff4a10" emissiveIntensity={1.2 + 0.4 * Math.sin(tt * 1.4 + i)} toneMapped={false} /></mesh>)}
    <mesh position={[0, 0.12, 0]}><boxGeometry args={[1.2, 0.02, 0.4]} /><meshStandardMaterial color="#2c2a28" roughness={0.35} metalness={0.8} /></mesh>
    <mesh position={[0, 0.145, 0]}><boxGeometry args={[1.16, 0.03, 0.38]} />{M.liquido(ACEITE, 0.85)}</mesh>
    <mesh position={[0, 0.27, 0]}><boxGeometry args={[1.14, 0.22, 0.36]} /><meshStandardMaterial map={migaD()} roughness={0.9} /></mesh>
    <mesh position={[0, 0.16 + 0.03 * k, 0]} scale={[1, 0.001 + k, 1]}><boxGeometry args={[1.145, 0.06, 0.365]} /><meshPhysicalMaterial color={hex(0.7 + 0.2 * k)} roughness={0.35} clearcoat={0.8} /></mesh>
    {Array.from({ length: 24 }, (_, i) => { const q = (tt * 1.6 + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 1.1, 0.135 + 0.02 * q, 0.19]} scale={0.006 + 0.008 * Math.sin(q * P)}><sphereGeometry args={[1, 8, 6]} /><meshPhysicalMaterial color="#fff2c0" roughness={0.05} clearcoat={1} transparent opacity={0.9} /></mesh>; })}
    {[0, 1, 2].map((i) => { const q = (tt * 0.7 + i / 3) % 1; return <mesh key={i} position={[(i - 1) * 0.35, 0.02 + 0.08 * q, 0.1]} scale={[0.1, 0.04, 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial color="#ff8a40" transparent opacity={0.3 * Math.sin(q * P)} depthWrite={false} /></mesh>; })}
    <pointLight position={[0, 0.0, 0.5]} intensity={2.5} distance={2} color="#ff7a30" />
  </Estudio>;
}}</Stage>;

// ── 10 · RESORTE: la mano estira la masa hacia la esquina y vuelve como un resorte (el resorte de verdad se ve debajo); el paño la tapa, descansa, y al segundo empujón llega
const resorteGeo = (() => { const pts: THREE.Vector3[] = []; for (let i = 0; i <= 200; i++) { const u = i / 200; pts.push(new THREE.Vector3(u - 0.5, 0.04 * Math.sin(u * 14 * P), 0.04 * Math.cos(u * 14 * P))); }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 0.006, 6, false); })();
const H10Resorte: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const pull = (a: number) => { const x = tt - a; if (x < 0) return 0; if (x < 0.6) return x / 0.6; return Math.exp(-3 * (x - 0.6)) * Math.cos((x - 0.6) * 9); };
  const towel = Math.sin(cl((tt - 2.6) / 2.0) * P), end = eio(tt, 4.8, 5.8), st = tt < 4.6 ? pull(0.6) * 0.3 : 0.3 * (1 - end), w = 0.55 + st + 0.25 * end;
  return <Estudio t={tt} cam={[0.2, 1.3, 1.5]} look={[0, 0.05, 0]} orbit={0.06}>
    <Mesa w={1.8} d={1.2} />
    <Chapa p={[0, 0.06, 0]} w={1.1} d={0.78}>
      <RBox p={[-0.53 + w / 2, 0.025, 0]} s={[w, 0.05, 0.4 + 0.3 * end]} r={0.025}>{masaMat("#f2e0b8", 0.35)}</RBox>
      <mesh position={[-0.53 + w + (1.06 - w) / 2, 0.03, -0.1]} scale={[Math.max(0.02, 1.06 - w), 1, 1]} visible={end < 0.95}><primitive object={resorteGeo} attach="geometry" />{M.cromo("#c8c8c8")}</mesh>
    </Chapa>
    <group position={[-0.53 + w + 0.02, 0.13 + 0.25 * cl((tt - 1.3) * 2) * (tt < 4.6 ? 1 : 0), 0.0]} rotation={[0, 0, -0.25]}><mesh position={[0, 0.1, 0]}><capsuleGeometry args={[0.028, 0.15, 8, 16]} /><meshPhysicalMaterial color="#e0a888" roughness={0.55} sheen={0.5} sheenColor="#ffd0c0" /></mesh></group>
    <mesh position={[0, 0.13 + 0.8 * (1 - towel), 0]} rotation={[-P2, 0, 0]} visible={towel > 0.02}><planeGeometry args={[1.2, 0.86, 8, 8]} /><meshStandardMaterial color="#a89e8a" roughness={1} side={THREE.DoubleSide} /></mesh>
  </Estudio>;
}}</Stage>;

// ── 11 · TIEMBLA: dos bandejas sacudidas de lado a lado: la lista tiembla como gelatina (ondas que llegan tarde); la verde se mueve tiesa, de una pieza
const H11Tiembla: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const sh = Math.sin(tt * 7) * 0.05 * (tt > 0.8 && tt < 5.2 ? 1 : 0), lag = Math.sin(tt * 7 - 1.2) * (tt > 0.8 && tt < 5.6 ? 1 : 0);
  return <Estudio t={tt} cam={[0, 1.2, 2.0]} look={[0, 0.1, 0]} orbit={0.05}>
    <Mesa w={2.4} d={1.0} />
    {[-0.6, 0.6].map((x, i) => <group key={i} position={[x + sh, 0.06, 0]} scale={0.001 + ent(tt, 0.3 + i * 0.3)}>
      <Chapa w={0.95} d={0.7}>
        {i === 0 ? Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[-0.39 + j * 0.156, 0.06 + 0.012 * Math.sin(tt * 7 - j * 0.8) * (tt > 0.8 && tt < 5.6 ? 1 : 0), 0]} scale={[0.078 + 0.008 * lag * Math.cos(j), 0.06 + 0.01 * Math.sin(tt * 7 - j * 0.8), 0.31]}>
          <sphereGeometry args={[1, 16, 10, 0, 2 * P, 0, P2]} />{masaMat("#f4e4c0", 0.3)}</mesh>)
          : <RBox p={[0, 0.03, 0]} s={[0.9, 0.06, 0.64]} r={0.025}>{masaMat(MASA, 0.8)}</RBox>}
      </Chapa>
      <Placa p={[0, 0.03, 0.5]} rot={[-0.7, 0, 0]} w={0.4} h={0.1} tex={cartel("tb" + i, i ? "STIFF" : "JIGGLES", { size: 110, bg: i ? "#e0d6c4" : "#fbf3e2" })} k={ent(tt, 1.6 + i * 0.4)} />
    </group>)}
  </Estudio>;
}}</Stage>;

// ── 12 · PIANO: el teclado de madera al lado de la bandeja; cada tecla que baja hunde un hoyuelo en la masa, de izquierda a derecha, como una escala
const H12Piano: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const N = 10, kd = (i: number) => Math.sin(cl((tt - 0.8 - i * 0.38) / 0.3) * P), on = (i: number) => cl((tt - 0.95 - i * 0.38) / 0.15);
  return <Estudio t={tt} cam={[0.0, 1.25, 1.55]} look={[0, 0.05, 0.05]} orbit={0.05}>
    <Mesa w={2.0} d={1.3} />
    <Chapa p={[0, 0.06, -0.12]} w={1.2} d={0.6}><Foca w={1.16} d={0.56} h={0.06} dimp={0} gloss={0.6} />
      {Array.from({ length: N * 2 }, (_, j) => { const i = j % N, row = Math.floor(j / N); return <mesh key={j} position={[-0.5 + i * 0.111, 0.062, row ? 0.1 : -0.1]} rotation={[-P2, 0, 0]} scale={0.001 + 0.035 * on(i)}><circleGeometry args={[1, 20]} /><meshStandardMaterial color="#b98a52" roughness={0.35} /></mesh>; })}
    </Chapa>
    <group position={[0, 0.06, 0.38]} scale={0.001 + ent(tt, 0.3)}>
      <RBox p={[0, 0.03, 0]} s={[1.2, 0.06, 0.24]} r={0.02}>{M.madera("#2a1a10")}</RBox>
      {Array.from({ length: N }, (_, i) => <RBox key={i} p={[-0.5 + i * 0.111, 0.075 - 0.02 * kd(i), 0.01]} s={[0.1, 0.03, 0.2]} r={0.01}><meshPhysicalMaterial color="#f6f0e2" roughness={0.25} clearcoat={0.8} /></RBox>)}
      {Array.from({ length: N - 1 }, (_, i) => i % 7 !== 2 && i % 7 !== 6 && <RBox key={i} p={[-0.445 + i * 0.111, 0.1, -0.04]} s={[0.05, 0.03, 0.12]} r={0.008}><meshPhysicalMaterial color="#141210" roughness={0.3} clearcoat={0.8} /></RBox>)}
    </group>
    {Array.from({ length: N }, (_, i) => { const k = kd(i); return <mesh key={i} position={[-0.5 + i * 0.111, 0.35 + 0.15 * k, 0.1]} scale={0.001 + 0.03 * k} visible={k > 0.05}><torusGeometry args={[1, 0.15, 6, 20]} /><meshBasicMaterial color="#ffe0a0" transparent opacity={0.7 * k} depthWrite={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 13 · PROFUNDO: corte de costado: un hoyo tímido arriba y uno hondo hasta la chapa; el horno hace subir la masa: el tímido se borra, el hondo queda
const H13Profundo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#1c120c">{(tt) => {
  const r = eio(tt, 2.0, 5.0), Hm = 0.16 + 0.1 * r;
  return <Estudio t={tt} cam={[0.15, 0.42, 1.25]} look={[0, 0.18, 0]} orbit={0.05} fov={32}>
    <mesh position={[0, 0.06, 0]}><boxGeometry args={[1.5, 0.02, 0.4]} /><meshStandardMaterial color="#2c2a28" roughness={0.35} metalness={0.8} /></mesh>
    {[[-0.75, -0.42], [-0.34, 0.14], [0.2, 0.75]].map(([a, b], i) => <mesh key={i} position={[(a + b) / 2, 0.07 + Hm / 2, 0]}><boxGeometry args={[b - a, Hm, 0.38]} /><meshStandardMaterial map={migaD()} roughness={0.9} /></mesh>)}
    {[[-0.75, -0.42], [-0.34, 0.14], [0.2, 0.75]].map(([a, b], i) => <mesh key={"c" + i} position={[(a + b) / 2, 0.07 + Hm + 0.008, 0]}><boxGeometry args={[b - a, 0.016, 0.385]} /><meshPhysicalMaterial color={hex(0.45 + 0.45 * r)} roughness={0.45} clearcoat={0.5} /></mesh>)}
    <mesh position={[-0.38, 0.07 + Hm - 0.05 * (1 - r), 0]} scale={[1, 1 - r + 0.001, 1]}><boxGeometry args={[0.08, 0.06, 0.38]} /><meshPhysicalMaterial color={hex(0.4 + 0.4 * r)} roughness={0.6} /></mesh>
    <mesh position={[-0.38, 0.07 + Hm - 0.06 * (1 - r) - 0.0, 0.0]} visible={r < 0.98}><boxGeometry args={[0.08, 0.002, 0.381]} /><meshStandardMaterial color="#6a4020" /></mesh>
    <mesh position={[0.17, 0.08, 0]}><boxGeometry args={[0.06, 0.02, 0.36]} />{M.liquido(ACEITE, 0.9)}</mesh>
    {[0, 1, 2].map((i) => { const q = (tt * 0.8 + i / 3) % 1; return <mesh key={i} position={[(i - 1) * 0.5, 0.5 + 0.2 * q, 0]} scale={[0.25, 0.02, 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial color="#ff9a50" transparent opacity={0.4 * Math.sin(q * P) * cl(tt - 1.6)} depthWrite={false} /></mesh>; })}
    <pointLight position={[0, 0.9, 0.4]} intensity={0.01 + 2 * cl(tt - 1.6)} distance={2.5} color="#ff9a50" />
  </Estudio>;
}}</Stage>;

// ── 14 · CHARCOS: la bandeja con hoyuelos vista de arriba; la taza se inclina y el hilo turbio recorre la masa: cada hoyo se vuelve un charquito que brilla
const tazaGeo = lathe([[0.001, 0], [0.08, 0], [0.1, 0.02], [0.11, 0.14], [0.1, 0.15]], 28);
const H14Charcos: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const u = eio(tt, 1.0, 4.6), px = lerp(-0.45, 0.45, u), pz = 0.12 * Math.sin(u * P * 3);
  return <Estudio t={tt} cam={[0.0, 1.6, 1.1]} look={[0, 0.05, 0]} orbit={0.05}>
    <Mesa w={1.8} d={1.2} />
    <Chapa p={[0, 0.06, 0]} w={1.1} d={0.78}><Foca w={1.06} d={0.74} h={0.06} dimp={1} gloss={0.5} />
      {Array.from({ length: 24 }, (_, i) => { const x = -0.45 + (i % 6) * 0.18, z = -0.27 + Math.floor(i / 6) * 0.18, k = cl((px - x) * 8 + 0.5) * (Math.abs(pz - z) < 0.3 ? 1 : cl(u * 1.2));
        return <mesh key={i} position={[x, 0.063, z]} rotation={[-P2, 0, 0]} scale={0.001 + 0.04 * k}><circleGeometry args={[1, 20]} /><meshPhysicalMaterial color="#e8d090" roughness={0.03} clearcoat={1} transparent opacity={0.85} envMapIntensity={2} /></mesh>; })}
    </Chapa>
    <group position={[px + 0.15, 0.55, pz]} rotation={[0, 0, 1.9 * ent(tt, 0.6)]} scale={0.001 + ent(tt, 0.3)}><mesh geometry={tazaGeo} castShadow><meshPhysicalMaterial color="#f2ead8" roughness={0.3} clearcoat={0.8} side={THREE.DoubleSide} /></mesh></group>
    <Chorro a={[px + 0.04, 0.5, pz]} b={[px, 0.13, pz]} r={0.008} c="#e8dcc0" o={0.8 * cl((tt - 1.0) * 3) * (1 - cl((tt - 4.7) * 3))} t={tt} />
  </Estudio>;
}}</Stage>;

// ── 15 · TAZA DE TRES (bloque): un hoyuelo gigante cortado al medio; agua = sube en vapor; sal = los granos bajan a la miga; aceite = la tapa se vuelve vidrio dorado y cruje
const H15Taza3: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#1c120c">{(tt) => {
  const E = IT(h), on = (i: number) => (E[i] ? cl((t - E[i].a) / 1.2) : 0), cur = curI(h, t);
  const crack = on(2);
  return <Estudio t={tt} cam={[0, 0.62, 2.05]} look={[0, 0.4, 0]} orbit={0.05} fov={32}>
    <mesh position={[0, 0.06, 0]}><boxGeometry args={[1.6, 0.03, 0.5]} /><meshStandardMaterial color="#2c2a28" roughness={0.35} metalness={0.8} /></mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.5, 0.29, 0]}><boxGeometry args={[0.6, 0.42, 0.48]} /><meshStandardMaterial map={migaD()} roughness={0.9} /></mesh>)}
    <mesh position={[0, 0.12, 0]}><boxGeometry args={[0.4, 0.1, 0.48]} /><meshStandardMaterial map={migaD()} roughness={0.9} /></mesh>
    <mesh position={[0, 0.19, 0]}><boxGeometry args={[0.4, 0.04 * (1 - on(0) * 0.8) + 0.002, 0.46]} />{M.liquido("#d8e4e0", 0.6)}</mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.5, 0.505, 0]}><boxGeometry args={[0.6, 0.012, 0.48]} /><meshPhysicalMaterial color={hex(0.5 + 0.35 * crack)} roughness={0.5 - 0.45 * crack} clearcoat={crack} clearcoatRoughness={0.05} /></mesh>)}
    {crack > 0.3 && Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(i < 4 ? -0.5 : 0.5) + (rn(i, 1) - 0.5) * 0.4, 0.513, (rn(i, 2) - 0.5) * 0.3]} rotation={[-P2, 0, rn(i, 3) * 3]}><planeGeometry args={[0.15 * crack, 0.004]} /><meshBasicMaterial color="#5a3010" /></mesh>)}
    <Vapor t={tt} p={[0, 0.2, 0]} o={0.7 * on(0) * (1 - on(1) * 0.6)} h={0.8} s={0.25} spread={0.2} n={10} />
    {Array.from({ length: 10 }, (_, i) => { const k = on(1), d = cl(k * 1.3 - rn(i, 1) * 0.3); return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.3 + (rn(i, 2) > 0.5 ? 0.3 : -0.3) * d, 0.22 - 0.12 * d, (rn(i, 3) - 0.5) * 0.3]} scale={(0.012 + 0.006 * rn(i, 4)) * (1 - 0.6 * d)} visible={k > 0}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.3} /></mesh>; })}
    {E.map((e, i) => <Placa key={i} p={[-0.6 + i * 0.6, 0.68, 0.1]} w={0.48} h={0.1} tex={cartel("t3" + i, e.tx, { size: 80, w: 640, bg: i === cur ? "#fbf3e2" : "#d8cfbf" })} k={t >= e.a ? ent(t, e.a + 0.2) : 0} />)}
  </Estudio>;
}}</Stage>;
const migaD = () => ctex("d_miga", 256, 256, (g) => { g.fillStyle = "#f4e6c4"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 160; i++) { const r = 2 + rn(i, 4) ** 2 * 14; g.fillStyle = `rgba(170,130,80,${0.15 + 0.25 * rn(i, 5)})`; g.beginPath(); g.ellipse(rn(i, 1) * 256, rn(i, 2) * 256, r * 1.3, r, rn(i, 3) * 3, 0, 7); g.fill(); } });

// ── 16 · CUADRANTES (bloque): la bandeja partida en cuatro con hilo de cocina; a cada cosa le toca su cuarto; el de sal y aceite (el de los pastores) queda iluminado
const H16Cuadrantes: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const E = IT(h), on = (i: number) => (E[i] ? t >= E[i].a : false), at = (i: number) => (E[i] ? E[i].a : 99), Q: [number, number][] = [[-0.26, -0.18], [0.26, -0.18], [-0.26, 0.18], [0.26, 0.18]];
  return <Estudio t={tt} cam={[0.1, 1.55, 1.15]} look={[0, 0.05, 0.05]} orbit={0.05}>
    <Mesa w={1.8} d={1.3} />
    <Chapa p={[0, 0.06, 0]} w={1.1} d={0.78}><Foca w={1.06} d={0.74} h={0.06} dimp={1} pools={0.7} gloss={0.7} tk="q" />
      <mesh position={[0, 0.07, 0]}><boxGeometry args={[1.04, 0.004, 0.004]} /><meshStandardMaterial color="#f2ead8" /></mesh>
      <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.004, 0.004, 0.72]} /><meshStandardMaterial color="#f2ead8" /></mesh>
      {on(0) && [0, 1, 2, 3].map((j) => romero([Q[0][0] + (j % 2 - 0.5) * 0.2, 0.07 + fall(t, at(0) + j * 0.15, 0.6), Q[0][1] + (j > 1 ? 0.07 : -0.07)], 0.9, j))}
      {on(1) && Array.from({ length: 7 }, (_, j) => <mesh key={j} position={[Q[1][0] + (rn(j, 1) - 0.5) * 0.36, 0.08 + fall(t, at(1) + j * 0.1, 0.6), Q[1][1] + (rn(j, 2) - 0.5) * 0.24]} scale={[0.025, 0.02, 0.032]}><sphereGeometry args={[1, 14, 10]} /><meshPhysicalMaterial color="#1c1418" roughness={0.15} clearcoat={1} /></mesh>)}
      {on(2) && Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[Q[2][0] + (rn(j, 3) - 0.5) * 0.34, 0.072 + fall(t, at(2) + j * 0.1, 0.6), Q[2][1] + (rn(j, 4) - 0.5) * 0.22]} rotation={[P2, 0, 0]}><torusGeometry args={[0.035 + 0.01 * rn(j, 5), 0.006, 6, 20]} /><meshStandardMaterial color="#9a3a6a" roughness={0.4} /></mesh>)}
      {on(3) && Array.from({ length: 16 }, (_, j) => <mesh key={j} position={[Q[3][0] + (rn(j, 6) - 0.5) * 0.4, 0.07 + fall(t, at(3) + j * 0.04, 0.4), Q[3][1] + (rn(j, 7) - 0.5) * 0.26]} rotation={[rn(j, 1), rn(j, 2), 0]} scale={0.008}><octahedronGeometry args={[1, 0]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} clearcoat={1} /></mesh>)}
      <mesh position={[Q[3][0], 0.071, Q[3][1]]} rotation={[-P2, 0, 0]} visible={on(3)}><ringGeometry args={[0.2, 0.215, 40]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.9 * (on(3) ? cl(t - at(3) - 1) : 0)} toneMapped={false} /></mesh>
    </Chapa>
    {E.map((e, i) => <Placa key={i} p={[Q[i][0] * 2.2, 0.08, Q[i][1] * 2.6 + 0.05]} rot={[-1.0, 0, 0]} w={0.3} h={0.08} tex={cartel("cq" + i, e.tx, { size: 76, w: 640 })} k={on(i) ? ent(t, e.a + 0.3) : 0} />)}
  </Estudio>;
}}</Stage>;

// ── 17 · ESQUINA: la espátula se mete debajo de la torta y levanta la esquina: abajo, la costra dorada y frita
const H17Esquina: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const lift = eio(tt, 1.4, 2.6), slide = eio(tt, 0.5, 1.3);
  return <Estudio t={tt} cam={[0.6, 0.78, 1.5]} look={[0.15, 0.1, 0.1]} orbit={0.05}>
    <Mesa w={1.8} d={1.2} />
    <Chapa p={[0, 0.06, 0]} w={1.0} d={0.7}>
      <group position={[-0.48, 0, -0.33]} rotation={[-0.14 * lift, 0, 0.3 * lift]}>
        <group position={[0.48, 0, 0.33]}><Foca w={0.96} d={0.66} h={0.07} bake={0.85} dimp={1} pools={0.3} gloss={0.7} tk="e" />
          <mesh position={[0, 0.001, 0]} rotation={[P2, 0, 0]}><planeGeometry args={[0.95, 0.65]} /><meshPhysicalMaterial color={hex(0.95)} roughness={0.3} clearcoat={0.8} /></mesh></group>
      </group>
    </Chapa>
    <group position={[0.75 - 0.25 * slide, 0.08 + 0.2 * lift, 0.5 - 0.15 * slide]} rotation={[0, -0.6, -0.3 * lift]} scale={0.001 + ent(tt, 0.3)}>
      <mesh><boxGeometry args={[0.22, 0.004, 0.14]} />{M.cromo("#d0d2d4")}</mesh>
      <mesh position={[0.25, 0.03, 0]} rotation={[0, 0, P2 - 0.2]}><cylinderGeometry args={[0.018, 0.02, 0.3, 10]} />{M.madera("#3a2414")}</mesh>
    </group>
    <Placa p={[-0.12, 0.07, 0.66]} rot={[-0.8, 0.3, 0]} w={0.5} h={0.1} tex={cartel("eq", "GOLDEN BOTTOM", { size: 90, w: 700 })} k={ent(tt, 2.6)} />
  </Estudio>;
}}</Stage>;

// ── 18 · LATAS (los 5 errores): cinco latas cuadradas de aceite en el estante; en cada error la tapa del frente cae como ventanita y adentro está la foto
const H18Latas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#2a0f0a">{(tt) => {
  const E = IT(h), cur = curI(h, t);
  return <Estudio t={tt} cam={[0.2, 0.75, 2.5]} look={[0, 0.48, 0]} orbit={0.05}>
    <RBox p={[0, 0.05, 0]} s={[2.5, 0.05, 0.6]} r={0.02}>{M.madera("#5a3a22")}</RBox>
    {Array.from({ length: 5 }, (_, i) => { const on = E[i] ? t >= E[i].a : false, f = on ? cl(phys(t - E[i].a, 0, 6, 0.5)) : 0, act = i === cur && on;
      return <group key={i} position={[-0.96 + i * 0.48, 0.075, act ? 0.08 * f : 0]} rotation={[act ? -0.08 * f : 0, 0, 0]}>
        <RBox p={[0, 0.33, 0]} s={[0.4, 0.66, 0.3]} r={0.02}><meshStandardMaterial color={on ? "#7a8a4a" : "#5a6a3a"} roughness={0.35} metalness={0.7} /></RBox>
        <mesh position={[0, 0.69, 0.08]}><cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />{M.cromo("#c8b060")}</mesh>
        <mesh position={[0, 0.42, 0.152]}><planeGeometry args={[0.32, 0.3]} /><meshStandardMaterial color="#111" /></mesh>
        {on && <group position={[0, 0.42, 0.153]}><Foto3D src={img(h.imgs?.[i] ?? h.bg ?? "")} w={0.3} h={0.28} /></group>}
        <group position={[0, 0.27, 0.152]} rotation={[-(P2 + 0.6) * f, 0, 0]}><mesh position={[0, 0.15, 0.003]}><planeGeometry args={[0.34, 0.32]} /><meshStandardMaterial color="#c9a64a" roughness={0.3} metalness={0.8} side={THREE.DoubleSide} /></mesh></group>
        {on && E[i] && <mesh position={[0, 0.13, 0.153]}><planeGeometry args={[0.36, 0.11]} /><meshStandardMaterial map={papel("d_lt" + i, [E[i].tx], { w: 640, h: 200, size: 66 })} roughness={0.9} /></mesh>}
      </group>; })}
    <pointLight position={[0, 1.4, 1.4]} intensity={2.2} distance={3.5} color="#ffe0b0" />
  </Estudio>;
}}</Stage>;

// ── 19 · BANDERITAS (CTA2): palillos con banderitas de colores se clavan uno a uno en los hoyuelos; al final el grande con la pregunta
const H19Banderitas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const cols = ["#c0281c", "#2c5a8a", "#e8b020", "#3f7a3a", "#8a3a8a", "#e86a20", "#1c8a8a", "#f2ead8"];
  return <Estudio t={tt} cam={[0.2, 1.1, 1.5]} look={[0, 0.15, 0]} orbit={0.06}>
    <Mesa w={1.8} d={1.2} />
    <Chapa p={[0, 0.06, -0.05]} w={1.1} d={0.78}><Foca w={1.06} d={0.74} h={0.06} bake={0.8} dimp={1} pools={0.5} gloss={0.7} tk="b" /></Chapa>
    {cols.map((c, i) => { const x = -0.42 + (i % 4) * 0.28, z = -0.25 + Math.floor(i / 4) * 0.3, y = 0.13 + fall(tt, 0.5 + i * 0.35, 0.8), wv = Math.sin(tt * 3 + i) * 0.15;
      return <group key={i} position={[x, y, z]} visible={tt > 0.45 + i * 0.35}>
        <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.004, 0.004, 0.24, 6]} />{M.madera("#e0c89a")}</mesh>
        <mesh position={[0.045, 0.19, 0]} rotation={[0, wv, 0]}><planeGeometry args={[0.09, 0.06, 4, 1]} /><meshStandardMaterial color={c} roughness={0.8} side={THREE.DoubleSide} /></mesh>
      </group>; })}
    <Placa p={[0, 0.07, 0.5]} rot={[-0.7, 0, 0]} w={0.8} h={0.13} tex={cartel("bq", "WHAT'S ON TOP?", { size: 96, w: 900 })} k={ent(tt, 3.4)} />
  </Estudio>;
}}</Stage>;

// ── 20 · TENDEDERO (rutina, bloque): una soga entre dos postes; cada hora llega colgada de un broche y se hamaca con su peso
const H20Tendedero: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#10161c">{(tt) => {
  const E = IT(h), n = E.length || 1, cur = curI(h, t);
  return <Estudio t={tt} cam={[0, 0.95, 2.9]} look={[0, 0.8, 0]} orbit={0.05}>
    {[-1.35, 1.35].map((x) => <mesh key={x} position={[x, 0.65, 0]}><cylinderGeometry args={[0.03, 0.035, 1.3, 10]} />{M.madera("#5a3a22")}</mesh>)}
    <mesh position={[0, 1.24, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.006, 0.006, 2.7, 6]} /><meshStandardMaterial color="#e8dcc0" /></mesh>
    {E.map((e, i) => { const x = -1.15 + (i * 2.3) / Math.max(1, n - 1), dt = t - e.a, k = cl(dt / 0.7), slide = 1 - eio(dt, 0, 0.7), sw = dt > 0 ? Math.exp(-1.6 * dt) * Math.sin(dt * 7) * 0.5 : 0;
      return <group key={i} position={[x + 1.4 * slide, 1.24, 0]} rotation={[0, 0, sw]} visible={dt > -0.01}>
        <RBox p={[0, -0.02, 0.01]} s={[0.03, 0.08, 0.02]} r={0.006}>{M.madera("#c49a5a")}</RBox>
        <mesh position={[0, -0.21, 0]} rotation={[0, 0, 0]}><planeGeometry args={[0.3, 0.3]} /><meshStandardMaterial map={papel("d_td" + i, e.tx.split(" · "), { w: 360, h: 360, size: 64, bg: i === cur ? "#fbf3e2" : "#e6dccb" })} roughness={0.9} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -0.21, -0.002]} scale={k}><planeGeometry args={[0.3, 0.3]} /><meshStandardMaterial color="#c8bca8" side={THREE.DoubleSide} /></mesh>
      </group>; })}
    <mesh rotation={[-P2, 0, 0]}><circleGeometry args={[2.0, 48]} /><meshStandardMaterial color="#6a5a44" roughness={1} /></mesh>
  </Estudio>;
}}</Stage>;

// ── 21 · MONEDA: la moneda de Matías gira sobre el mostrador, tambalea y se acuesta; la torta de sólo sal y aceite se desliza hasta ella
const H21Moneda: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#1c120c">{(tt) => {
  const sp = Math.max(0, 1 - tt / 3.4), ang = tt * 14 * sp + tt * 2, tilt = (1 - sp) * P2, came = eio(tt, 3.6, 4.6);
  return <Estudio t={tt} cam={[0.2, 0.55, 1.1]} look={[0, 0.12, 0]} orbit={0.06} fov={32}>
    <RBox p={[0, 0.03, 0]} s={[1.4, 0.06, 0.7]} r={0.03}>{M.madera("#5a3a22")}</RBox>
    <group position={[-0.05, 0.06 + 0.045 * Math.cos(tilt) + 0.004, 0]} rotation={[0, ang, P2 - tilt * 0.98]} scale={0.001 + ent(tt, 0.2)}><Moneda p={[0, 0, 0]} s={0.05} c="#b89040" /></group>
    <group position={[lerp(0.8, 0.2, came), 0.06, 0.02]}>
      <mesh position={[0, 0.002, 0]} rotation={[-P2, 0, 0.2]}><planeGeometry args={[0.32, 0.3]} /><meshStandardMaterial map={kraft()} roughness={0.95} /></mesh>
      <Foca p={[0, 0.003, 0]} w={0.2} d={0.18} h={0.07} bake={0.8} dimp={1} pools={0.6} gloss={0.8} tk="m" />
    </group>
    <mesh position={[-0.6, 0.45, -0.25]} rotation={[0, 0, 0.18]}><cylinderGeometry args={[0.015, 0.02, 0.9, 8]} />{M.madera("#6a4a2a")}</mesh>
  </Estudio>;
}}</Stage>;

// ── 22 · GRIETA: la bóveda del horno vista desde adentro; la raya negra avanza por el techo de ladrillo y por ella se cuela el humo
const grietaPts = Array.from({ length: 24 }, (_, i) => { const u = i / 23, a = -1.1 + 2.2 * u; return new THREE.Vector3(Math.sin(a) * 0.95, Math.cos(a) * 0.95 * 0.7 + 0.02 * Math.sin(i * 2.3), (rn(i, 1) - 0.5) * 0.1 + 0.15 * Math.sin(u * 5)); });
const grietaGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(grietaPts), 200, 0.012, 6, false);
const H22Grieta: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#0c0806">{(tt) => {
  const g = eio(tt, 0.8, 4.0), n = Math.max(2, Math.round(g * 23) + 1);
  return <Estudio t={tt} cam={[0, -0.05, 1.3]} look={[0, 0.5, 0]} orbit={0.04} fov={44}>
    <mesh scale={[1, 0.7, 1]} rotation={[0, 0, 0]}><sphereGeometry args={[1, 48, 24, 0, P, 0, P]} /><meshStandardMaterial map={ladTex()} roughness={0.9} side={THREE.BackSide} color="#c88a6a" /></mesh>
    <mesh geometry={grietaGeo} scale={[1, 1, 1]} position={[0, 0, -0.02]}><meshBasicMaterial color="#080402" /></mesh>
    <mesh position={grietaPts[n - 1]} scale={0.04}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#ffb060" toneMapped={false} /></mesh>
    {[4, 10, 16].map((i, j) => <Vapor key={i} t={tt + j} p={[grietaPts[i].x, grietaPts[i].y - 0.05, grietaPts[i].z]} o={0.5 * cl(g * 23 - i)} h={-0.5} s={0.15} spread={0.05} n={6} />)}
    <pointLight position={[0, 0.0, 0.5]} intensity={2.5} distance={3} color="#ff8a40" />
  </Estudio>;
}}</Stage>;

// ── 23 · PALOTES: en la pared encalada, el carbón marca palotes de a cinco; la cámara los recorre hasta doscientos
const palTex = (n: number) => ctex("d_pal" + n, 1024, 512, (g) => { g.fillStyle = "#ece4d4"; g.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(160,140,110,${0.05 + 0.08 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 1024, rn(i, 3) * 512, 6, 3); }
  g.strokeStyle = "#1c1814"; g.lineWidth = 4; g.lineCap = "round";
  for (let k = 0; k < n; k++) { const b = Math.floor(k / 5), j = k % 5, bx = 30 + (b % 10) * 98, by = 30 + Math.floor(b / 10) * 120;
    g.beginPath(); if (j < 4) { g.moveTo(bx + j * 16, by + rn(k, 1) * 6); g.lineTo(bx + j * 16 + 3, by + 80 + rn(k, 2) * 6); } else { g.moveTo(bx - 8, by + 70); g.lineTo(bx + 62, by + 10); } g.stroke(); } });
const H23Palotes: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const n = Math.floor(eio(tt, 0.4, 5.6) * 200), pan = eio(tt, 0.4, 5.8);
  return <Estudio t={tt} cam={[-0.6 + 1.0 * pan, 0.75 - 0.25 * pan, 1.4]} look={[-0.6 + 1.0 * pan, 0.75 - 0.25 * pan, 0]} orbit={0.03} fov={36}>
    <mesh position={[0, 0.6, -0.02]}><planeGeometry args={[2.4, 1.2]} /><meshStandardMaterial map={palTex(Math.round(n / 5) * 5)} roughness={0.95} /></mesh>
    <group position={[0.5 * pan - 0.55, 0.88 - 0.36 * Math.floor((n / 5) / 10) / 4, 0.08]} rotation={[0, 0, -0.8]}><mesh><cylinderGeometry args={[0.012, 0.016, 0.16, 6]} /><meshStandardMaterial color="#141210" roughness={1} /></mesh></group>
    <Placa p={[0.75, 0.12, 0.2]} rot={[0, -0.2, 0]} w={0.42} h={0.13} tex={cartel("p200", String(Math.max(1, n)), { size: 120 })} k={ent(tt, 0.6)} />
  </Estudio>;
}}</Stage>;

// ── 24 · BOTELLA: la botellita de aceite nuevo, verde y turbia; las partículas giran adentro; sale el corcho y una gota cae sobre la torta de sólo sal
const botGeo = lathe([[0.001, 0], [0.09, 0], [0.1, 0.02], [0.1, 0.22], [0.04, 0.3], [0.03, 0.4], [0.034, 0.42]], 28);
const H24Botella: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const cork = eio(tt, 2.0, 2.6), dr = cl((tt - 2.8) / 0.8);
  return <Estudio t={tt} cam={[0.25, 0.6, 1.3]} look={[0, 0.25, 0]} orbit={0.07} fov={32}>
    <RBox p={[0, 0.03, 0]} s={[1.3, 0.06, 0.7]} r={0.03}>{M.madera("#7a5232")}</RBox>
    <group position={[-0.15, 0.06, 0]} rotation={[0, 0, -0.6 * eio(tt, 2.6, 3.0)]} scale={0.001 + ent(tt, 0.2)}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.092, 0.092, 0.22, 28]} /><meshPhysicalMaterial color="#7a8a20" roughness={0.3} transparent opacity={0.85} /></mesh>
      <mesh geometry={botGeo}>{M.vidrio()}</mesh>
      {Array.from({ length: 30 }, (_, i) => { const a = tt * (0.6 + rn(i, 1)) + i, r = 0.02 + 0.06 * rn(i, 2); return <mesh key={i} position={[Math.cos(a) * r, 0.03 + 0.18 * rn(i, 3) + 0.02 * Math.sin(a * 2), Math.sin(a) * r]} scale={0.004 + 0.003 * rn(i, 4)}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#c8d060" /></mesh>; })}
      <mesh position={[0.15 * cork, 0.44 + 0.2 * cork, 0]} rotation={[0, 0, 1.4 * cork]}><cylinderGeometry args={[0.03, 0.026, 0.06, 12]} /><meshStandardMaterial color="#b88a5a" roughness={1} /></mesh>
    </group>
    <mesh position={[0.12, 0.42 - 0.3 * dr, 0]} scale={[0.012, 0.016, 0.012]} visible={tt > 2.8 && dr < 1}><sphereGeometry args={[1, 12, 10]} />{M.liquido("#8a9a20", 0.95)}</mesh>
    <group position={[0.2, 0.06, 0.05]}><Foca w={0.3} d={0.24} h={0.06} bake={0.8} dimp={1} pools={0.3 + 0.5 * cl(tt - 3.6)} gloss={0.8} tk="g" /></group>
  </Estudio>;
}}</Stage>;

// ── 25 · LATA: la botella de plástico barata se arruga sola y se apaga; aterriza la lata grande de la cooperativa, con su pico
const plasGeo = lathe([[0.001, 0], [0.07, 0], [0.075, 0.02], [0.07, 0.25], [0.03, 0.32], [0.025, 0.36]], 24);
const H25Lata: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const cr = eio(tt, 0.8, 2.4), land = tt > 2.4 ? cl(phys(tt, 2.4, 6, 0.4)) : 0;
  return <Estudio t={tt} cam={[0.2, 0.7, 1.8]} look={[0, 0.3, 0]} orbit={0.07}>
    <Mesa w={1.8} d={0.9} />
    <group position={[-0.35 - 0.2 * cl(tt - 2.4), 0.06, 0]} scale={[1 - 0.45 * cr, 1 - 0.25 * cr, 1 - 0.4 * cr]} rotation={[0, 0, 0.25 * cr]}>
      <mesh geometry={plasGeo} scale={1.3}><meshPhysicalMaterial color={new THREE.Color("#e8d070").lerp(new THREE.Color("#a8a090"), cr)} roughness={0.2} transparent opacity={0.6} side={THREE.DoubleSide} /></mesh>
    </group>
    <group position={[0.3, 0.06 + 0.8 * (1 - land), 0]}>
      <RBox p={[0, 0.25, 0]} s={[0.36, 0.5, 0.26]} r={0.02}><meshStandardMaterial color="#c8a040" roughness={0.3} metalness={0.8} /></RBox>
      <mesh position={[0, 0.25, 0.132]}><planeGeometry args={[0.3, 0.3]} /><meshStandardMaterial map={papel("d_ev", ["EXTRA", "VIRGIN"], { w: 400, h: 400, size: 90, bg: "#3f6a2c", ink: "#f6e8a8" })} roughness={0.6} /></mesh>
      <mesh position={[0.1, 0.53, 0.06]}><cylinderGeometry args={[0.025, 0.03, 0.06, 14]} />{M.cromo("#d0b860")}</mesh>
      <mesh position={[-0.05, 0.53, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.06, 0.008, 6, 20, P]} />{M.cromo("#d0b860")}</mesh>
    </group>
    {land > 0.9 && <mesh position={[0.3, 0.065, 0]} rotation={[-P2, 0, 0]} scale={0.2 + 0.8 * cl((tt - 2.7) / 0.6)} visible={tt < 3.3}><ringGeometry args={[0.28, 0.3, 40]} /><meshBasicMaterial color="#fff2d8" transparent opacity={0.5 * (1 - cl((tt - 2.7) / 0.6))} depthWrite={false} /></mesh>}
  </Estudio>;
}}</Stage>;

// ── 26 · ASTILLAS: el frasco viejo de romero seco vuelca sus hojas: se vuelven astillas de madera y se queman negras; al lado, la ramita fresca sigue verde y brillante
const H26Astillas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#1c120c">{(tt) => {
  const tip = eio(tt, 0.6, 1.4), wood = eio(tt, 2.0, 3.2), burn = eio(tt, 3.4, 4.8);
  return <Estudio t={tt} cam={[0.15, 0.7, 1.3]} look={[0, 0.2, 0]} orbit={0.07}>
    <Mesa w={1.6} d={0.9} c="#7a5232" />
    <group position={[-0.35, 0.06, 0]} rotation={[0, 0, -1.2 * tip]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.07, 0.07, 0.24, 24, 1, true]} />{M.vidrio()}</mesh>
      <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.072, 0.072, 0.03, 24]} /><meshStandardMaterial color="#6a5a3a" roughness={0.8} /></mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.065, 0.065, 0.1, 20]} /><meshStandardMaterial color="#7a7a4a" roughness={1} /></mesh>
    </group>
    {Array.from({ length: 18 }, (_, i) => { const x = -0.18 + rn(i, 1) * 0.3, z = (rn(i, 2) - 0.5) * 0.25, c = new THREE.Color("#7a7a4a").lerp(new THREE.Color("#8a5a30"), wood).lerp(new THREE.Color("#120a06"), burn);
      return <mesh key={i} position={[x, 0.075 + fall(tt, 1.2 + rn(i, 3) * 0.4, 0.25), z]} rotation={[0, rn(i, 4) * 3, 0]} scale={[0.004 + 0.006 * wood, 0.004 + 0.004 * wood, 0.025 + 0.015 * wood]} visible={tt > 1.0}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={c} roughness={1} /></mesh>; })}
    <Vapor t={tt} p={[-0.05, 0.08, 0]} o={0.45 * burn} h={0.6} s={0.15} spread={0.2} n={8} />
    <group position={[0.35, 0.075, 0.05]} scale={0.001 + ent(tt, 2.4)}>{romero([0, 0, 0], 1.4, 0.3, "#3f7a2c", 0)}<mesh position={[0, 0.03, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.14, 0.15, 40]} /><meshBasicMaterial color="#c8f0a0" transparent opacity={0.6 * cl(tt - 3.6)} toneMapped={false} /></mesh></group>
  </Estudio>;
}}</Stage>;

// ── 27 · FONDOS: tres moldes boca abajo se dan vuelta de a uno: chapa oscura = fondo tostado; redondo = dorado; vidrio = pálido y blando
const H27Fondos: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const D = [{ x: -0.62, b: 1.0, c: "#1c1a18", lab: "DARK METAL" }, { x: 0, b: 0.75, c: "#5a5a5a", lab: "ROUND" }, { x: 0.62, b: 0.25, c: "#cfe4ea", lab: "GLASS" }];
  return <Estudio t={tt} cam={[0, 1.1, 2.0]} look={[0, 0.2, 0]} orbit={0.06}>
    <Mesa w={2.2} d={1.0} />
    {D.map((d, i) => { const fl = eio(tt, 0.8 + i * 1.3, 1.6 + i * 1.3);
      return <group key={i} position={[d.x, 0.18, 0]} rotation={[P * (1 - fl) + 0.25 * fl, 0, 0]} scale={0.001 + ent(tt, 0.2 + i * 0.2)}>
        {i === 1 ? <mesh><cylinderGeometry args={[0.25, 0.23, 0.06, 40, 1, true]} /><meshStandardMaterial color={d.c} roughness={0.35} metalness={0.8} side={THREE.DoubleSide} /></mesh>
          : <mesh><boxGeometry args={[0.46, 0.06, 0.36]} />{i === 2 ? M.vidrio() : <meshStandardMaterial color={d.c} roughness={0.35} metalness={0.8} />}</mesh>}
        <mesh position={[0, -0.026, 0]} rotation={[P2, 0, 0]}>{i === 1 ? <circleGeometry args={[0.22, 40]} /> : <planeGeometry args={[0.43, 0.33]} />}<meshPhysicalMaterial color={hex(d.b)} roughness={0.6 - 0.3 * d.b} clearcoat={d.b} /></mesh>
        <mesh position={[0, -0.01, 0]} rotation={[P2, 0, 0]} visible={i === 2}><planeGeometry args={[0.44, 0.34]} /><meshStandardMaterial color={hex(0.25)} roughness={0.9} transparent opacity={0.7} /></mesh>
      </group>; })}
    {D.map((d, i) => <Placa key={i} p={[d.x, 0.07, 0.4]} rot={[-0.7, 0, 0]} w={0.42} h={0.09} tex={cartel("fd" + i, d.lab, { size: 90, w: 640 })} k={ent(tt, 1.6 + i * 1.3)} />)}
  </Estudio>;
}}</Stage>;

// ── 28 · MANZANA: la manzana se abre en láminas finas que vuelan en abanico a los hoyuelos; llueve el azúcar y caen tres gotas de anís
const H28Manzana: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  return <Estudio t={tt} cam={[0.2, 1.15, 1.35]} look={[0, 0.12, 0]} orbit={0.06}>
    <Mesa w={1.8} d={1.2} />
    <Chapa p={[0, 0.06, 0]} w={1.0} d={0.7}><Foca w={0.96} d={0.66} h={0.06} dimp={1} gloss={0.6} tk="a" /></Chapa>
    <group position={[-0.65, 0.45, 0.1]} scale={0.001 + ent(tt, 0.2) * (1 - cl((tt - 0.9) * 2))}><mesh><sphereGeometry args={[0.1, 32, 20]} /><meshPhysicalMaterial color="#b8281c" roughness={0.3} clearcoat={0.8} /></mesh></group>
    {Array.from({ length: 10 }, (_, i) => { const k = eio(tt, 1.0 + i * 0.22, 1.8 + i * 0.22), x = -0.36 + (i % 5) * 0.18, z = i < 5 ? -0.13 : 0.13;
      return <group key={i} position={[lerp(-0.65, x, k), lerp(0.45, 0.14, k) + 0.25 * Math.sin(k * P), lerp(0.1, z, k)]} rotation={[-P2 * k + 0.3, 0, k * 0.6]} visible={tt > 0.9 + i * 0.22}>
        <mesh scale={[0.06, 0.06, 1]}><circleGeometry args={[1, 24, 0, P]} /><meshStandardMaterial color="#f4e8c0" roughness={0.6} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0, 0.001]} scale={[0.06, 0.06, 1]}><ringGeometry args={[0.92, 1, 24, 1, 0, P]} /><meshStandardMaterial color="#b8281c" side={THREE.DoubleSide} /></mesh>
      </group>; })}
    {Array.from({ length: 30 }, (_, i) => { const q = cl((tt - 3.6 - rn(i, 1) * 0.6) / 0.8); return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.8, 0.13 + 0.5 * (1 - q), (rn(i, 3) - 0.5) * 0.5]} scale={0.006} visible={tt > 3.6}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} /></mesh>; })}
    {[0, 1, 2].map((i) => { const q = cl((tt - 4.6 - i * 0.3) / 0.5); return <mesh key={i} position={[-0.2 + i * 0.2, 0.55 - 0.42 * q, 0]} scale={[0.01, 0.014, 0.01]} visible={tt > 4.6 + i * 0.3 && q < 1}><sphereGeometry args={[1, 10, 8]} />{M.liquido("#f0f0e0", 0.7)}</mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 29 · MONEDAS (cuentas, bloque): cada gasto cae como moneditas dentro de los hoyuelos; al final las monedas se juntan en una pila y brilla el total
const H29Monedas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const E = IT(h), N = [5, 1, 7, 2], tot = E[4] ? eio(t, E[4].a, E[4].a + 1.0) : 0;
  let idx = 0;
  const coins: React.ReactNode[] = [];
  N.forEach((n, g) => { for (let j = 0; j < n; j++, idx++) { const a = E[g] ? E[g].a + j * 0.12 : 99, x = -0.42 + (idx % 6) * 0.17, z = -0.22 + Math.floor(idx / 6) * 0.17;
    const px = lerp(x, 0.0, tot), pz = lerp(z, 0.42, tot), py = lerp(0.135 + fall(t, a, 0.6), 0.1 + idx * 0.012, tot);
    coins.push(<Moneda key={idx} p={[px, py, pz]} s={0.035} c={g === 2 ? "#c9a64a" : "#b8b8b0"} />); } });
  return <Estudio t={tt} cam={[0.15, 1.55, 1.85]} look={[0, 0.1, 0.18]} orbit={0.05}>
    <Mesa w={1.8} d={1.4} />
    <Chapa p={[0, 0.06, -0.05]} w={1.1} d={0.66}><Foca w={1.06} d={0.62} h={0.06} bake={0.8} dimp={1} gloss={0.7} tk="c" /></Chapa>
    {t > (E[0]?.a ?? 99) - 0.1 && coins}
    {E.slice(0, 4).map((e, i) => <Placa key={i} p={[-0.6 + i * 0.4, 0.07, 0.62]} rot={[-0.9, 0, 0]} w={0.36} h={0.08} tex={cartel("mo" + i, e.tx, { size: 70, w: 640 })} k={t >= e.a ? ent(t, e.a + 0.3) * (1 - tot) : 0} />)}
    <Placa p={[0.35, 0.3, 0.42]} rot={[-0.3, -0.2, 0]} w={0.36} h={0.14} tex={cartel("mot", "$1.50", { size: 130, bg: "#c0281c", ink: "#fbf3e2" })} k={tot} />
  </Estudio>;
}}</Stage>;

// ── 30 · CUADRÍCULA (repaso, bloque): la torta cortada en 9 cuadrados; con cada paso un cuadrado salta con su banderita de papel
const H30Cuadricula: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const E = IT(h), cur = curI(h, t);
  const ax = cur >= 0 ? -0.4 + (cur % 3) * 0.4 : 0, az = cur >= 0 ? -0.32 + Math.floor(cur / 3) * 0.33 : 0;
  return <Estudio t={tt} cam={[ax * 0.6, 0.95, az + 1.05]} look={[ax * 0.8, 0.18, az]} orbit={0.04}>
    <RBox p={[0, 0.04, 0]} s={[1.4, 0.08, 1.1]} r={0.04}>{M.madera("#8a5a32")}</RBox>
    {Array.from({ length: 9 }, (_, i) => { const e = E[i], on = e ? t >= e.a : false, k = on ? ent(t, e.a) : 0, act = i === cur && on, x = -0.4 + (i % 3) * 0.4, z = -0.32 + Math.floor(i / 3) * 0.33;
      return <group key={i} position={[x, 0.08 + 0.06 * k * (act ? 1 : 0.3), z]}>
        <Foca w={0.36} d={0.29} h={0.07} bake={0.85} dimp={1} pools={0.4} gloss={0.7} tk={"r" + (i % 3)} />
        {e && <group position={[0, 0.08, 0]} scale={0.001 + k * (act ? 1 : 0.5)}>
          <mesh position={[-0.12, 0.08, 0]}><cylinderGeometry args={[0.004, 0.004, 0.18, 6]} />{M.madera("#e0c89a")}</mesh>
          <mesh position={[0.02, 0.13, 0]} rotation={[-0.3, 0, 0]}><planeGeometry args={[0.36, 0.13]} /><meshStandardMaterial map={papel("d_cg" + i, [e.tx], { w: 560, h: 200, size: 64, bg: act ? "#fbf3e2" : "#e6dccb" })} roughness={0.9} side={THREE.DoubleSide} /></mesh>
        </group>}
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 31 · BARRA (adelanto): la barra larga entra rodando sobre la tabla, frena y su corteza canta: las grietas se abren y suenan anillos
const barraGeo = lathe(Array.from({ length: 21 }, (_, i) => { const y = i / 20; return [0.06 * Math.sqrt(Math.max(0, Math.sin(y * P))) + 0.001, y * 1.2] as [number, number]; }), 32);
const H31Barra: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#1c120c">{(tt) => {
  const roll = 1 - eio(tt, 0.3, 1.8), sing = cl(tt - 2.2);
  return <Estudio t={tt} cam={[0.1, 0.68, 1.2]} look={[0, 0.1, 0]} orbit={0.06}>
    <RBox p={[0, 0.03, 0]} s={[1.9, 0.06, 0.7]} r={0.03}>{M.madera("#8a5a32")}</RBox>
    <group position={[1.6 * roll, 0.12, 0]} rotation={[roll * 8, 0, 0]}>
      <group rotation={[0, 0, P2]} position={[0.6, 0, 0]}><mesh geometry={barraGeo} castShadow><meshPhysicalMaterial color={hex(0.85)} roughness={0.45} clearcoat={0.4} /></mesh></group>
      {[-0.35, -0.12, 0.11, 0.34].map((x, i) => <mesh key={i} position={[x, 0.047, 0]} rotation={[-P2, 0, 0.5]} scale={[1, 0.3 + 0.7 * sing, 1]}><planeGeometry args={[0.16, 0.025]} /><meshStandardMaterial color="#f2dcae" roughness={0.9} /></mesh>)}
    </group>
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.0, 0.18, (rn(i, 2) - 0.5) * 0.05]} rotation={[-P2, 0, rn(i, 3) * 3]} visible={false}><planeGeometry args={[0.06 * sing, 0.003]} /><meshBasicMaterial color="#5a3010" /></mesh>)}
    {[2.3, 2.9, 3.5].map((a, i) => { const q = cl((tt - a) / 1.0); return <mesh key={i} position={[0, 0.15, 0]} rotation={[0, P2, 0]} scale={0.05 + 0.6 * q} visible={q > 0 && q < 1}><torusGeometry args={[1, 0.008, 6, 48]} /><meshBasicMaterial color="#ffe0a0" transparent opacity={0.6 * (1 - q)} depthWrite={false} /></mesh>; })}
    <pointLight position={[0.6, 0.8, 0.8]} intensity={1.6} distance={3} color="#ffd9a0" />
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  candil: H1Candil, suelo: H2Suelo, papel: H3Papel, liquida: H4Liquida, nivel: H5Nivel, gachas: H6Gachas, seda: H7Seda, metrica: H8Metrica,
  fritura: H9Fritura, resorte: H10Resorte, tiembla: H11Tiembla, piano: H12Piano, profundo: H13Profundo, charcos: H14Charcos, taza3: H15Taza3,
  cuadrantes: H16Cuadrantes, esquina: H17Esquina, latas: H18Latas, banderitas: H19Banderitas, tendedero: H20Tendedero, moneda: H21Moneda,
  grieta: H22Grieta, palotes: H23Palotes, botella: H24Botella, lata: H25Lata, astillas: H26Astillas, fondos: H27Fondos, manzana: H28Manzana,
  monedas: H29Monedas, cuadricula: H30Cuadricula, barra: H31Barra,
};
