// ben29c · «12 panecillos, 1 bol»: los componentes únicos del minuto (ninguno repite mecanismo de ben29a ni de ben29b).
// Regla: el OBJETO cuenta la idea sin leer; llegan de a uno con resorte; cámara curva (Estudio orbita); ≤5 palabras por rótulo y DENTRO de la escena.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, img, lerp, phys, Stage } from "./ckit";
import { ctex, Estudio, fall, lathe, M, papel, RBox, rn, V3, Vapor } from "./estudio3d";
import { Chorro, Foto3D, Mano } from "./kit3d";
import { Bol, corteza, Hogaza, Masa, P, P2 } from "./kitpan";

type C = React.FC<{ t: number; h: H }>;
const ent = (tt: number, a: number) => cl(phys(tt, a, 6, 0.5));
const sp = (tt: number, a: number) => phys(tt, a, 6, 0.45);
const IT = (h: H) => (h.items ?? []) as { a: number; tx: string }[];
const curI = (h: H, t: number) => Math.max(0, IT(h).reduce((c, e, i) => (t >= e.a ? i : c), 0));
const cartel = (key: string, tx: string, o: { w?: number; h?: number; bg?: string; ink?: string; size?: number } = {}) =>
  papel("c_" + key, [tx], { w: o.w ?? 512, h: o.h ?? 192, size: o.size ?? 120, bg: o.bg, ink: o.ink, font: `900 ${o.size ?? 120}px Georgia, serif` });
const Placa: React.FC<{ p: V3; rot?: V3; w: number; h: number; tex: THREE.Texture; k?: number }> = ({ p, rot, w, h, tex, k = 1 }) => (
  <group position={p} rotation={rot} scale={0.001 + k}>
    <RBox s={[w + 0.06, h + 0.06, 0.04]} r={0.015}>{M.madera("#5a3a22")}</RBox>
    <mesh position={[0, 0, 0.022]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={tex} roughness={0.85} /></mesh>
  </group>);
const MASA = "#efdcb4";
const masaMat = (c = MASA, r = 0.6) => <meshPhysicalMaterial color={c} roughness={r} sheen={0.8} sheenColor="#fff1d6" clearcoat={0.15} />;
// el panecillo: media esfera achatada con corteza (bake 0 = masa cruda, 1 = dorado), brillo opcional y cruz
const Bollo: React.FC<{ p?: V3; s?: number; bake?: number; gloss?: number; cruz?: number; rot?: V3 }> = ({ p, s = 1, bake = 1, gloss = 0, cruz = 0, rot }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh scale={[0.13, 0.1, 0.13]} castShadow receiveShadow><sphereGeometry args={[1, 40, 20, 0, 2 * P, 0, P2]} />
      <meshPhysicalMaterial color={bake > 0.05 ? corteza(0.35 + 0.6 * bake) : MASA} roughness={0.7 - 0.5 * gloss} clearcoat={0.1 + 0.9 * gloss} clearcoatRoughness={0.25 - 0.2 * gloss} sheen={0.6} sheenColor="#ffe2b0" /></mesh>
    {cruz > 0 && [0, 1].map((i) => <mesh key={i} position={[0, 0.098, 0]} rotation={[-P2, 0, i * P2]}><planeGeometry args={[0.15 * cruz, 0.012 + 0.02 * cruz]} /><meshStandardMaterial color="#f2e2bc" roughness={0.9} /></mesh>)}
  </group>);
const Bandeja: React.FC<{ p?: V3; w?: number; d?: number }> = ({ p, w = 1.2, d = 0.8 }) => (
  <group position={p}><mesh position={[0, 0.012, 0]} castShadow receiveShadow><boxGeometry args={[w, 0.024, d]} />{M.cromo("#8a8a88")}</mesh>
    <mesh position={[0, 0.026, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[w - 0.06, d - 0.06]} /><meshStandardMaterial color="#efe6d0" roughness={1} /></mesh></group>);

// canasta de mimbre: cuerpo tejido abierto + borde acostado + fondo; paño blanco opcional
const Canasta: React.FC<{ p?: V3; r?: number; hgt?: number; pano?: number }> = ({ p, r = 0.2, hgt = 0.14, pano = 0 }) => (
  <group position={p}>
    <mesh position={[0, hgt / 2, 0]} castShadow receiveShadow><cylinderGeometry args={[r, r * 0.82, hgt, 32, 1, true]} /><meshStandardMaterial map={mimbre()} roughness={0.9} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.004, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[r * 0.82, 32]} /><meshStandardMaterial map={mimbre()} roughness={0.9} /></mesh>
    <mesh position={[0, hgt, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[r, 0.014, 8, 40]} />{M.madera("#b88a4a")}</mesh>
    {pano > 0 && <mesh position={[0, hgt + 0.01, 0]} scale={[r * 1.05, 0.05 * pano, r * 1.05]}><sphereGeometry args={[1, 32, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#f6f2ea" roughness={1} /></mesh>}
  </group>);
// bolsa de tela colgada: costal de lino a rayas con boca abierta y dos asas que suben al gancho
const bolsaGeo = lathe([[0.001, 0], [0.1, 0], [0.13, 0.03], [0.14, 0.12], [0.13, 0.22], [0.125, 0.25]], 28);
const lino = () => ctex("c_lino", 256, 256, (g) => { g.fillStyle = "#ece2cc"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 3) { g.fillStyle = `rgba(150,120,80,${0.05 + 0.05 * rn(i, 1)})`; g.fillRect(i, 0, 1, 256); g.fillRect(0, i, 256, 1); }
  g.fillStyle = "#b8482e"; g.fillRect(0, 150, 256, 10); g.fillRect(0, 168, 256, 4); });
const Bolsa: React.FC<{ p?: V3; s?: number; sw?: number; children?: React.ReactNode }> = ({ p, s = 1, sw = 0, children }) => (
  <group position={p} scale={s}>
    <group rotation={[0.08, 0, sw]}>
      <group position={[0, -0.36, 0]} scale={[1, 1, 0.55]}><mesh geometry={bolsaGeo} castShadow><meshStandardMaterial map={lino()} roughness={1} side={THREE.DoubleSide} /></mesh></group>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.05, -0.06, 0]} rotation={[0, 0, sd * 0.35]}><torusGeometry args={[0.08, 0.008, 6, 20, P]} /><meshStandardMaterial color="#d8ccb0" roughness={1} /></mesh>)}
      <group position={[0, -0.12, 0]}>{children}</group>
    </group>
  </group>);

// ── 1 · PUERTA (CTA1): la puerta de madera del pueblo; la bolsa de tela cuelga del picaporte, se llena de bollos y el llamador de bronce suena dos veces
const H1Puerta: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const knock = Math.max(0, Math.sin(cl((tt - 3.0) / 0.3) * P)) + Math.max(0, Math.sin(cl((tt - 3.5) / 0.3) * P));
  return <Estudio t={tt} cam={[0.4, 1.05, 2.1]} look={[0.1, 0.9, 0]} orbit={0.08}>
    <RBox p={[0, 1.1, -0.05]} s={[1.3, 2.2, 0.1]} r={0.02}>{M.madera("#5a3820")}</RBox>
    {[-0.42, -0.14, 0.14, 0.42].map((x) => <mesh key={x} position={[x, 1.1, 0.002]}><boxGeometry args={[0.012, 2.1, 0.01]} /><meshStandardMaterial color="#3a2414" /></mesh>)}
    <group position={[0, 1.45, 0.04]} rotation={[-0.6 * knock, 0, 0]}><mesh position={[0, -0.1, 0.02]} rotation={[P2, 0, 0]}><torusGeometry args={[0.08, 0.014, 10, 32]} />{M.cromo("#b8962e")}</mesh></group>
    <mesh position={[0, 1.45, 0.02]}><sphereGeometry args={[0.03, 16, 12]} />{M.cromo("#b8962e")}</mesh>
    <mesh position={[0.45, 1.0, 0.06]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.018, 0.018, 0.16, 12]} />{M.hierro()}</mesh>
    <Bolsa p={[0.45, 1.0, 0.1]} s={1.5} sw={0.06 * Math.sin(tt * 2)}>
      {[0, 1, 2].map((i) => <Bollo key={i} p={[(i - 1) * 0.07, 0.0 + fall(tt, 0.7 + i * 0.5, 0.8), 0]} s={0.55} bake={0.9} cruz={1} rot={[0.4, 0, (i - 1) * 0.3]} />)}
    </Bolsa>
    <group position={[-0.3, 0.55, 0.08]} scale={ent(tt, 1.8) + 0.001}>
      <Placa p={[0, 0, 0.02]} w={0.56} h={0.17} tex={cartel("c_sub", "SUBSCRIBE", { bg: "#6a4428", ink: "#f6e7c4" })} />
    </group>
  </Estudio>;
}}</Stage>;

// ── 2 · AL CENTRO: corte de una hogaza grande y de un bollo; el calor entra como un frente naranja: el bollo se dora entero, la hogaza sigue cruda al medio
const calorTex = (k: number, n: string) => ctex("c_calor" + n + Math.round(k * 20), 256, 256, (g) => {
  const gr = g.createRadialGradient(128, 160, 0, 128, 160, 128); const e = Math.max(0.001, 1 - k);
  gr.addColorStop(0, "#efe0bc"); gr.addColorStop(e * 0.95, "#efe0bc"); gr.addColorStop(Math.min(1, e * 0.95 + 0.04), "#ffb060"); gr.addColorStop(1, "#c9781e");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const H2Centro: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#1c120c">{(tt) => {
  const k = eio(tt, 0.6, 5.2);
  return <Estudio t={tt} cam={[0, 0.85, 2.3]} look={[0, 0.3, 0]} orbit={0.06}>
    <RBox p={[0, 0.03, 0]} s={[2.0, 0.06, 0.8]} r={0.03}>{M.madera("#3a2a1c")}</RBox>
    <group position={[-0.45, 0.06, 0]}><mesh scale={[0.55, 0.42, 1]}><circleGeometry args={[1, 64, 0, P]} /><meshStandardMaterial map={calorTex(k * 0.45, "g")} roughness={0.9} /></mesh>
      <mesh scale={[0.55, 0.42, 0.5]}><sphereGeometry args={[1.01, 48, 24, P2, P, 0, P2]} /><meshPhysicalMaterial color={corteza(0.85)} roughness={0.75} side={THREE.DoubleSide} /></mesh></group>
    <group position={[0.6, 0.06, 0]}><mesh scale={[0.18, 0.14, 1]}><circleGeometry args={[1, 48, 0, P]} /><meshStandardMaterial map={calorTex(Math.min(1, k * 1.6), "c")} roughness={0.9} /></mesh>
      <mesh scale={[0.18, 0.14, 0.18]}><sphereGeometry args={[1.01, 32, 16, P2, P, 0, P2]} /><meshPhysicalMaterial color={corteza(0.85)} roughness={0.75} side={THREE.DoubleSide} /></mesh></group>
    <pointLight position={[0, 1.2, 0.8]} intensity={0.6 + 1.6 * k} distance={3} color="#ff9a50" />
    <Placa p={[0.6, 0.07, 0.45]} rot={[-0.6, 0, 0]} w={0.36} h={0.12} tex={cartel("20m", "20 MIN", { size: 100 })} k={ent(tt, 4.2)} />
  </Estudio>;
}}</Stage>;

// ── 3 · ESCALERA: el aprendiz empieza abajo: un bollo en el primer escalón; arriba esperan la hogaza, la trenza y el pan grande de Don Aurelio
const H3Escalera: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const st = (i: number): V3 => [-0.75 + i * 0.5, 0.1 + i * 0.22, -i * 0.12];
  return <Estudio t={tt} cam={[0.2, 1.15, 2.8]} look={[0, 0.55, 0]} orbit={0.1}>
    {[0, 1, 2, 3].map((i) => <RBox key={i} p={[st(i)[0], st(i)[1] / 2 + 0.02, st(i)[2]]} s={[0.46, st(i)[1] + 0.04, 0.5]} r={0.02}>{M.madera(i % 2 ? "#8a5a32" : "#7a4e2c")}</RBox>)}
    <group position={[st(0)[0], st(0)[1] + 0.06 + 0.25 * Math.abs(Math.sin(cl((tt - 0.5) / 1.2) * P * 2)) * (tt < 1.7 ? 1 : 0), st(0)[2]]}><Bollo s={1.3} bake={0.9} cruz={1} /></group>
    <group scale={ent(tt, 1.8) + 0.001} position={[st(1)[0], st(1)[1] + 0.06, st(1)[2]]}><Hogaza s={0.45} bake={0.8} /></group>
    <group scale={ent(tt, 2.4) + 0.001} position={[st(2)[0], st(2)[1] + 0.08, st(2)[2]]}>{[-1, 0, 1].map((j) => <mesh key={j} position={[j * 0.12, 0.02, 0]} rotation={[0, 0, j * 0.4]} scale={[0.09, 0.07, 0.18]}><sphereGeometry args={[1, 20, 12]} /><meshPhysicalMaterial color={corteza(0.85)} roughness={0.5} clearcoat={0.6} /></mesh>)}</group>
    <group scale={ent(tt, 3.0) + 0.001} position={[st(3)[0], st(3)[1] + 0.08, st(3)[2]]}><Hogaza s={0.7} bake={0.95} flour={0.4} /></group>
    <mesh position={[st(3)[0], st(3)[1] + 0.6, st(3)[2] - 0.1]} visible={tt > 3.6}><sphereGeometry args={[0.09, 24, 16]} /><meshStandardMaterial color="#ffd27a" emissive="#ffb040" emissiveIntensity={1.4 * cl(tt - 3.6)} toneMapped={false} /></mesh>
  </Estudio>;
}}</Stage>;

// ── 4 · DESVÍO: la masa en un carrito sobre una vía; el cambio de vía: a la izquierda el sol (2 horas), a la derecha la luna y la heladera (toda la noche)
const H4Desvio: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#161a26">{(tt) => {
  const go = eio(tt, 2.6, 5.2), sw = eio(tt, 1.4, 2.0), x = lerp(0, 0.9, go) * (sw > 0.5 ? 1 : -1), z = 0.9 - 1.0 * go;
  const Rail = ({ a, b }: { a: V3; b: V3 }) => { const dx = b[0] - a[0], dz = b[2] - a[2], L = Math.hypot(dx, dz), r = Math.atan2(dx, dz);
    return <group position={[(a[0] + b[0]) / 2, 0.02, (a[2] + b[2]) / 2]} rotation={[0, r, 0]}>{[-0.07, 0.07].map((o) => <mesh key={o} position={[o, 0, 0]}><boxGeometry args={[0.015, 0.02, L]} />{M.cromo("#7a7a78")}</mesh>)}
      {Array.from({ length: Math.floor(L / 0.12) }, (_, i) => <mesh key={i} position={[0, -0.01, -L / 2 + 0.06 + i * 0.12]}><boxGeometry args={[0.24, 0.015, 0.04]} />{M.madera("#5a3a22")}</mesh>)}</group>; };
  return <Estudio t={tt} cam={[0, 1.6, 2.6]} look={[0, 0.2, -0.3]} orbit={0.06}>
    <Rail a={[0, 0, 1.4]} b={[0, 0, 0.6]} /><Rail a={[0, 0, 0.6]} b={[-0.9, 0, -0.3]} /><Rail a={[0, 0, 0.6]} b={[0.9, 0, -0.3]} />
    <group position={[0.12, 0.08, 0.6]} rotation={[0, 0, -0.6 + 1.2 * sw]}><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />{M.hierro()}</mesh><mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.035, 12, 10]} /><meshPhysicalMaterial color="#c0281c" clearcoat={1} roughness={0.3} /></mesh></group>
    <group position={[go > 0 ? x : 0, 0.05, go > 0 ? z : 0.9 + 0.3 * (1 - ent(tt, 0.3))]} rotation={[0, go > 0 ? (sw > 0.5 ? -0.8 : 0.8) * cl(go * 3) : 0, 0]}>
      <RBox s={[0.26, 0.08, 0.32]} r={0.02}>{M.madera("#8a5a32")}</RBox>
      <Bol p={[0, 0.04, 0]} s={0.28}><Masa p={[0, 0.06, 0]} r={0.55} rise={0.4 + 0.5 * go} t={tt} /></Bol>
    </group>
    <group position={[-0.95, 0.75, -0.45]} scale={ent(tt, 0.6) + 0.001}><mesh><sphereGeometry args={[0.14, 32, 24]} /><meshStandardMaterial color="#ffd27a" emissive="#ffb040" emissiveIntensity={1.3} toneMapped={false} /></mesh><pointLight intensity={1.2} distance={2} color="#ffc070" /></group>
    <group position={[0.95, 0.75, -0.45]} scale={ent(tt, 0.9) + 0.001}><mesh><sphereGeometry args={[0.12, 32, 24]} /><meshStandardMaterial color="#eef0f8" emissive="#dfe6ff" emissiveIntensity={0.9} toneMapped={false} /></mesh><pointLight intensity={1.0} distance={2} color="#b8c8ff" /></group>
    <Placa p={[-0.95, 0.45, -0.45]} w={0.4} h={0.12} tex={cartel("fast", "2 HOURS", { size: 100 })} k={ent(tt, 0.8)} />
    <Placa p={[0.95, 0.45, -0.45]} w={0.4} h={0.12} tex={cartel("night", "ALL NIGHT", { size: 92 })} k={ent(tt, 1.1)} />
  </Estudio>;
}}</Stage>;

// ── 5 · DESIGUAL: tres bollos de distinto tamaño en la misma placa; a la vez el chico se quema, el del medio se dora y el grande sigue pálido
const H5Desigual: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#1c100a">{(tt) => {
  const k = cl((tt - 0.6) / 4.2);
  return <Estudio t={tt} cam={[0.1, 1.05, 1.9]} look={[0, 0.15, 0]} orbit={0.08}>
    <Bandeja p={[0, 0, 0]} w={1.4} d={0.7} />
    <Bollo p={[-0.45, 0.03, 0]} s={0.6} bake={Math.min(1, k * 1.8)} />
    <mesh position={[-0.45, 0.04, 0]} scale={[0.08, 0.062, 0.08]} visible={k > 0.55}><sphereGeometry args={[1, 24, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#1a0e08" transparent opacity={cl((k - 0.55) * 2.5)} roughness={1} /></mesh>
    <Bollo p={[0, 0.03, 0]} s={1.1} bake={k} cruz={1} />
    <Bollo p={[0.5, 0.03, 0]} s={1.8} bake={0.35 * k} />
    <Vapor t={tt} p={[-0.45, 0.1, 0]} o={0.4 * cl((k - 0.6) * 3)} h={0.6} s={0.1} spread={0.05} n={6} />
    <pointLight position={[0, 0.8, 0.2]} intensity={1.2 + 1.5 * k} distance={2} color="#ff9a50" />
  </Estudio>;
}}</Stage>;

// ── 6 · JAULA: la mano hecha jaula gira en círculos sobre el bollo; la piel pasa de opaca y floja a tensa y brillante (aparece el reflejo)
const H6Jaula: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const k = eio(tt, 0.8, 4.8), a = tt * 9;
  return <Estudio t={tt} cam={[0.25, 0.7, 1.15]} look={[0, 0.12, 0]} orbit={0.06} fov={30}>
    <RBox p={[0, 0.03, 0]} s={[1.4, 0.06, 0.9]} r={0.03}>{M.madera("#a8784a")}</RBox>
    <mesh position={[0.03 * Math.cos(a) * (1 - k), 0.06, 0.03 * Math.sin(a) * (1 - k)]} scale={[0.17 * lerp(1.25, 1, k), 0.13 * lerp(0.6, 1, k), 0.17 * lerp(1.2, 1, k)]} castShadow>
      <sphereGeometry args={[1, 48, 24, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color={MASA} roughness={lerp(0.85, 0.25, k)} clearcoat={0.7 * k} clearcoatRoughness={0.15} sheen={0.8} sheenColor="#fff1d6" /></mesh>
    <Mano p={[0.05 * Math.cos(a), 0.3, 0.05 * Math.sin(a)]} rot={[-1.5, a * 0.15, 0]} pinza={0.15} s={0.95} />
    {Array.from({ length: 16 }, (_, i) => { const q = (tt * 0.8 + i / 16) % 1, r = 0.24 + 0.02 * Math.sin(i); return <mesh key={i} position={[Math.cos(i * 0.4 + a * 0.1) * r, 0.062, Math.sin(i * 0.4 + a * 0.1) * r]} rotation={[-P2, 0, 0]} scale={0.006 * (1 - q)}><circleGeometry args={[1, 6]} /><meshBasicMaterial color="#fbf6ea" transparent opacity={0.7} /></mesh>; })}
    <pointLight position={[0.4, 0.6, 0.4]} intensity={0.8 + 1.2 * k} distance={2} color="#fff0d8" />
  </Estudio>;
}}</Stage>;

// ── 7 · ESPACIO: tres dedos de madera miden el hueco entre bollos crudos; en el horno crecen hasta casi tocarse y quedan redondos
const H7Espacio: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const g = eio(tt, 2.8, 5.2), meas = ent(tt, 0.8) * (1 - eio(tt, 2.3, 2.8));
  return <Estudio t={tt} cam={[0, 1.4, 1.6]} look={[0, 0.05, 0]} orbit={0.06} fov={34}>
    <Bandeja w={1.5} d={1.0} />
    {Array.from({ length: 9 }, (_, i) => { const x = ((i % 3) - 1) * 0.42, z = (Math.floor(i / 3) - 1) * 0.3; return <Bollo key={i} p={[x, 0.03, z]} s={lerp(1.0, 1.45, g)} bake={g * 0.85} cruz={g} />; })}
    <group position={[-0.21, 0.04 + 0.2 * (1 - meas), 0.0]} scale={0.001 + meas}>{[0, 1, 2].map((j) => <mesh key={j} position={[(j - 1) * 0.05, 0.03, 0]} rotation={[P2, 0, 0]} scale={[1, 1, 1]}><capsuleGeometry args={[0.022, 0.12, 6, 12]} />{M.madera("#c49a6a")}</mesh>)}</group>
    <Placa p={[0, 0.06, 0.62]} rot={[-0.9, 0, 0]} w={0.5} h={0.12} tex={cartel("3f", "3 FINGERS", { size: 100 })} k={ent(tt, 1.3)} />
  </Estudio>;
}}</Stage>;

// ── 8 · DEDO: tres bollos con su hoyito; cada uno con un relojito de arena: uno salta enseguida, otro no vuelve, el del medio vuelve despacio (ese)
const H8Dedo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const X = [-0.5, 0, 0.5], S0 = [0.5, 1.7, 2.9], pr = S0.map((s0) => cl((tt - s0) / 0.25)),
    back = [cl((tt - S0[0] - 0.6) / 0.3), 0.1 * cl((tt - S0[1] - 0.6) / 4), cl((tt - S0[2] - 0.6) / 3.0) * 0.85],
    seg = Math.min(2, Math.max(0, Math.floor((tt - 0.1) / 1.2))), u = cl((tt - 0.1 - seg * 1.2) / 1.2),
    hx = lerp(X[Math.max(0, seg - 1)], X[seg], seg === 0 ? 1 : cl(u / 0.35)), dip = Math.sin(cl((u - 0.3) / 0.5) * P) * (tt > 4.3 ? 0 : 1);
  return <Estudio t={tt} cam={[0, 0.95, 1.7]} look={[0, 0.15, 0]} orbit={0.06}>
    <RBox p={[0, 0.03, 0]} s={[1.6, 0.06, 0.8]} r={0.03}>{M.madera("#9a6a3a")}</RBox>
    {X.map((x, i) => <group key={i} position={[x, 0.06, 0]}>
      <Bollo s={1.35} bake={0} />
      <mesh position={[0, 0.135 - 0.04 * (1 - back[i]) * pr[i], 0.02]} scale={[0.035, 0.012 + 0.03 * (1 - back[i]) * pr[i], 0.035]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#d8c49a" roughness={1} /></mesh>
      <group position={[0.2, 0.0, 0.12]} scale={ent(tt, 0.3 + i * 0.2) + 0.001}>
        <mesh position={[0, 0.06, 0]} geometry={relojA}>{M.vidrio()}</mesh>
        <mesh position={[0, 0.09, 0]} scale={[1, 0.001 + (1 - back[i]), 1]}><coneGeometry args={[0.025, 0.04, 16]} /><meshStandardMaterial color="#e8c890" /></mesh>
        <mesh position={[0, 0.025, 0]} scale={[1, 0.001 + back[i], 1]}><coneGeometry args={[0.03, 0.035, 16]} /><meshStandardMaterial color="#e8c890" /></mesh>
      </group>
    </group>)}
    <group position={[hx, 0.23 - 0.05 * dip + 0.15 * (1 - dip) + 0.2 * cl((tt - 4.3) / 0.6), 0.04]} rotation={[-0.25, 0, 0.15]}><mesh position={[0, 0.1, 0]}><capsuleGeometry args={[0.035, 0.18, 8, 16]} /><meshPhysicalMaterial color="#e0a888" roughness={0.55} sheen={0.5} sheenColor="#ffd0c0" /></mesh><mesh position={[0, 0.0, 0.025]} rotation={[-0.3, 0, 0]} scale={[0.024, 0.009, 0.028]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#f0c8b8" roughness={0.3} /></mesh></group>
    <mesh position={[X[2], 0.42, 0]} visible={tt > 4.4}><torusGeometry args={[0.24, 0.012, 8, 48]} /><meshStandardMaterial color="#ffd27a" emissive="#ffb040" emissiveIntensity={1.2} toneMapped={false} /></mesh>
  </Estudio>;
}}</Stage>;
const relojA = lathe([[0.001, 0], [0.035, 0], [0.035, 0.005], [0.006, 0.06], [0.035, 0.115], [0.035, 0.12], [0.001, 0.12]], 24);

// ── 9 · BRILLO (bloque): tres bollos bajo tres jarritos; el pincel pasa y cada corteza cambia: agua = mate pálido, leche = dorado, huevo = espejo
const H9Brillo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const E = IT(h), cur = curI(h, t), X = [-0.55, 0, 0.55], G = [0.05, 0.4, 1], B = [0.55, 0.8, 1];
  return <Estudio t={tt} cam={[0, 0.9, 1.9]} look={[0, 0.18, 0]} orbit={0.06}>
    <RBox p={[0, 0.03, 0]} s={[1.8, 0.06, 0.8]} r={0.03}>{M.madera("#9a6a3a")}</RBox>
    {X.map((x, i) => { const on = E[i] ? t >= E[i].a : false, k = on ? eio(t - E[i].a, 0.3, 1.6) : 0;
      return <group key={i} position={[x, 0.06, 0]}>
        <Bollo s={1.3} bake={lerp(0.1, B[i], k)} gloss={G[i] * k} cruz={1} />
        <group position={[0.18, 0, -0.15]} scale={ent(tt, 0.3 + i * 0.25) + 0.001}>
          <mesh geometry={jarrito}>{i === 2 ? M.barro("#c9a06a") : M.vidrio()}</mesh>
          <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.042, 0.04, 0.07, 20]} />{i === 0 ? M.liquido("#d8eef6", 0.5) : <meshStandardMaterial color={i === 1 ? "#fbf8f0" : "#f2b432"} roughness={0.2} />}</mesh>
        </group>
        <group position={[0.15 - 0.3 * k, 0.2 + 0.03 * Math.sin(k * P * 3), 0]} rotation={[0, 0, 0.9]} visible={on && k < 0.99}>
          <mesh><cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />{M.madera("#c49a6a")}</mesh><mesh position={[0, -0.13, 0]}><coneGeometry args={[0.025, 0.06, 10]} /><meshStandardMaterial color="#f0e2c0" /></mesh>
        </group>
        {E[i] && <Placa p={[0, 0.01, 0.32]} rot={[-0.7, 0, 0]} w={0.34} h={0.1} tex={cartel("br" + i, E[i].tx, { size: 100 })} k={on ? ent(t - E[i].a, 0.1) : 0} />}
      </group>; })}
    <pointLight position={[0.6, 0.9, 0.8]} intensity={1.6} distance={3} color="#fff0d8" />
  </Estudio>;
}}</Stage>;
const jarrito = lathe([[0.001, 0], [0.045, 0], [0.05, 0.06], [0.04, 0.1], [0.05, 0.11], [0.001, 0.11]], 24);

// ── 10 · FLOR: el bollo con la cruz de tijera; en el horno las cuatro puntas se abren como pétalos y se doran
const petalo = (() => { const s = new THREE.Shape(); s.moveTo(0, 0); s.quadraticCurveTo(0.09, 0.06, 0, 0.14); s.quadraticCurveTo(-0.09, 0.06, 0, 0); return new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 3 }); })();
const H10Flor: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#1c120c">{(tt) => {
  const o = eio(tt, 1.0, 4.2);
  return <Estudio t={tt} cam={[0, 0.9, 1.0]} look={[0, 0.12, 0]} orbit={0.1} fov={32}>
    <Bandeja w={1.0} d={0.8} />
    <mesh position={[0, 0.03, 0]} scale={[0.17, 0.11, 0.17]} castShadow><sphereGeometry args={[1, 40, 20, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color={corteza(0.3 + 0.6 * o)} roughness={0.6} clearcoat={0.4} /></mesh>
    <mesh position={[0, 0.13, 0]} scale={[0.08 * o, 0.03, 0.08 * o]}><sphereGeometry args={[1, 24, 12]} />{masaMat("#f4e6c4", 0.8)}</mesh>
    {[0, 1, 2, 3].map((i) => <group key={i} rotation={[0, i * P2 + P / 4, 0]}><group position={[0, 0.135, 0]} rotation={[-P2 + 1.1 * o, 0, 0]}>
      <mesh geometry={petalo} position={[0, 0, -0.015]} castShadow><meshPhysicalMaterial color={corteza(0.4 + 0.55 * o)} roughness={0.5} clearcoat={0.5} /></mesh></group></group>)}
    <pointLight position={[0, 0.6, 0.3]} intensity={1.5 + 1.5 * o} distance={2} color="#ffa860" />
  </Estudio>;
}}</Stage>;

// ── 11 · ROMPE: el bollo dorado se parte en dos; sale el vapor, saltan escamas de corteza y la miga blanda se estira entre las mitades
const H11Rompe: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const b = eio(tt, 0.9, 2.0);
  return <Estudio t={tt} cam={[0.1, 0.72, 1.15]} look={[0, 0.2, 0]} orbit={0.08} fov={32}>
    <RBox p={[0, 0.03, 0]} s={[1.3, 0.06, 0.7]} r={0.03}>{M.madera("#9a6a3a")}</RBox>
    {[-1, 1].map((sd) => <group key={sd} position={[sd * (0.004 + 0.2 * b), 0.24, 0]} rotation={[0, sd * 0.95 * b, 0]}>
      <group rotation={[0, 0, -sd * P2]} scale={[0.17, 0.2, 0.18]}>
        <mesh castShadow><sphereGeometry args={[1, 40, 20, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color={corteza(0.85)} roughness={0.55} clearcoat={0.4} /></mesh>
        <mesh position={[0, -0.002, 0]} rotation={[P2, 0, 0]}><circleGeometry args={[1, 40]} /><meshStandardMaterial map={migaC()} roughness={0.95} side={THREE.DoubleSide} /></mesh>
      </group>
    </group>)}
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0, 0.2 + (i - 2) * 0.035, 0]} scale={[0.22 * b + 0.001, 0.006, 0.006]} visible={b > 0.05 && b < 0.95}><cylinderGeometry args={[1, 1, 1, 6]} />{masaMat("#f4e8cc", 0.9)}</mesh>)}
    {Array.from({ length: 22 }, (_, i) => { const x = tt - 1.0 - rn(i, 1) * 0.2, y = Math.max(-0.5, 1.2 * x - 4.9 * x * x); return <mesh key={i} position={[(rn(i, 2) - 0.5) * (0.3 + 0.8 * Math.max(0, x)), 0.32 + y, (rn(i, 3) - 0.5) * 0.3]} rotation={[rn(i, 4) * 3, rn(i, 5) * 3, 0]} scale={0.012 + 0.012 * rn(i, 6)} visible={x > 0 && y > -0.3}><tetrahedronGeometry args={[1, 0]} /><meshStandardMaterial color={corteza(0.9)} /></mesh>; })}
    <Vapor t={tt} p={[0, 0.25, 0]} o={0.6 * b} h={0.9} s={0.25} spread={0.1} n={12} />
  </Estudio>;
}}</Stage>;
const migaC = () => ctex("c_miga", 256, 256, (g) => { g.fillStyle = "#f4e8cc"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 300; i++) { const r = 1 + rn(i, 4) ** 3 * 9; g.fillStyle = `rgba(170,130,80,${0.15 + 0.25 * rn(i, 5)})`; g.beginPath(); g.ellipse(rn(i, 1) * 256, rn(i, 2) * 256, r * 1.3, r, rn(i, 3) * 3, 0, 7); g.fill(); } });

// ── 12 · DOMINÓ (los 5 errores): cinco fichas de madera paradas en fila; cada error voltea la suya y muestra la foto de ese error
const H12Domino: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#2a0f0a">{(tt) => {
  const E = IT(h), cur = curI(h, t);
  return <Estudio t={tt} cam={[0.3, 0.9, 2.5]} look={[0.0, 0.42, 0]} orbit={0.05}>
    <RBox p={[0, 0.03, 0]} s={[2.4, 0.06, 0.9]} r={0.03}>{M.madera("#6a4428")}</RBox>
    {Array.from({ length: 5 }, (_, i) => { const on = E[i] ? t >= E[i].a : false, f = on ? cl(phys(t - E[i].a, 0, 6, 0.5)) : 0, act = i === cur;
      return <group key={i} position={[-0.9 + i * 0.45, 0.06, act ? 0.15 * f : 0]} rotation={[0, P * (1 - f) , 0]}>
        <RBox p={[0, 0.34, 0]} s={[0.38, 0.62, 0.05]} r={0.02}>{M.madera(on ? "#efe6d2" : "#3a2414")}</RBox>
        <mesh position={[0, 0.42, 0.027]}><planeGeometry args={[0.32, 0.32]} /><meshStandardMaterial map={null} color="#000" transparent opacity={0} /></mesh>
        {on && <group position={[0, 0.42, 0.028]}><Foto3D src={img(h.imgs?.[i] ?? h.bg ?? "")} w={0.32} h={0.3} /></group>}
        {on && E[i] && <mesh position={[0, 0.13, 0.028]}><planeGeometry args={[0.34, 0.12]} /><meshStandardMaterial map={papel("c_dm" + i, [E[i].tx], { w: 640, h: 220, size: 70 })} roughness={0.9} /></mesh>}
        <mesh position={[0, 0.34, -0.027]} rotation={[0, P, 0]}><circleGeometry args={[0.05, 20]} /><meshStandardMaterial color="#efe6d2" /></mesh>
      </group>; })}
    <pointLight position={[0, 1.4, 1.4]} intensity={2.2} distance={3.5} color="#ffe0b0" />
  </Estudio>;
}}</Stage>;

// ── 13 · RELLENO (CTA2): el bollo se abre y caen adentro, de a uno, las rodajas de chorizo; el hilo de aceite; la pregunta en la tabla
const H13Relleno: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const op = eio(tt, 0.4, 1.2);
  return <Estudio t={tt} cam={[0.15, 0.95, 1.25]} look={[0, 0.15, 0]} orbit={0.08}>
    <RBox p={[0, 0.03, 0]} s={[1.5, 0.06, 0.8]} r={0.04}>{M.madera("#9a6a3a")}</RBox>
    <group position={[-0.05, 0.14, 0]}>
      <group scale={[0.24, 0.08, 0.16]} rotation={[P, 0, 0]}><mesh castShadow><sphereGeometry args={[1, 32, 16, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color={corteza(0.85)} roughness={0.6} /></mesh></group>
      <mesh position={[0, 0.001, 0]} rotation={[-P2, 0, 0]} scale={[0.24, 0.16, 1]}><circleGeometry args={[1, 40]} /><meshStandardMaterial map={migaC()} roughness={0.95} /></mesh>
      <group position={[0, 0.005, -0.16]} rotation={[-1.25 * op, 0, 0]}><group position={[0, 0, 0.16]}>
        <group scale={[0.24, 0.1, 0.16]}><mesh castShadow><sphereGeometry args={[1, 32, 16, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color={corteza(0.85)} roughness={0.6} /></mesh></group>
        <mesh position={[0, -0.001, 0]} rotation={[P2, 0, 0]} scale={[0.24, 0.16, 1]}><circleGeometry args={[1, 40]} /><meshStandardMaterial map={migaC()} roughness={0.95} /></mesh>
      </group></group>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.13 + i * 0.065, 0.012 + fall(tt, 1.2 + i * 0.3, 0.7), (i % 2) * 0.04 - 0.02]} rotation={[0.08 * (i - 2), 0, 0.1]}><cylinderGeometry args={[0.045, 0.045, 0.01, 24]} /><meshStandardMaterial map={chorizoT()} roughness={0.5} /></mesh>)}
    </group>
    <Chorro a={[0.4, 0.55, 0]} b={[0.0, 0.16, 0]} r={0.008} c="#c9a020" o={0.85 * cl((tt - 3.0) * 3) * (1 - cl((tt - 4.6) * 3))} t={tt} splash={false} />
    <group position={[0.45, 0.58, 0]} rotation={[0, 0, 2.2]} scale={ent(tt, 2.6) + 0.001}><mesh geometry={aceitera}><meshPhysicalMaterial color="#b8962c" roughness={0.12} clearcoat={1} transparent opacity={0.85} /></mesh></group>
    <Placa p={[0, 0.07, 0.36]} rot={[-0.7, 0, 0]} w={0.84} h={0.13} tex={cartel("bd", "BREAKFAST OR DINNER?", { size: 66, w: 900 })} k={ent(tt, 1.0)} />
  </Estudio>;
}}</Stage>;
const chorizoT = () => ctex("c_chorizo", 128, 128, (g) => { g.fillStyle = "#9a2218"; g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 40; i++) { g.fillStyle = rn(i, 3) > 0.5 ? "#f0d8c0" : "#c84a30"; g.beginPath(); g.ellipse(rn(i, 1) * 128, rn(i, 2) * 128, 3 + 4 * rn(i, 4), 2 + 3 * rn(i, 5), rn(i, 6) * 3, 0, 7); g.fill(); } });
const aceitera = lathe([[0.001, 0], [0.06, 0], [0.07, 0.08], [0.05, 0.15], [0.015, 0.2], [0.012, 0.26], [0.001, 0.26]], 24);

// ── 14 · GIRATORIO (rutina de la mañana): la bandeja giratoria de la cocina; a cada hora gira y trae al frente su estación
const H14Giratorio: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const E = IT(h), N = Math.max(1, E.length), cur = curI(h, t), rot = E.reduce((s, e, i) => i === 0 ? 0 : s + eio(t, e.a - 0.3, e.a + 0.6), 0) * (2 * P / N);
  const Est = ({ i }: { i: number }) => i === 0 ? <Bol s={0.3}><Masa p={[0, 0.06, 0]} r={0.55} rise={0.2} rough={0.9} t={tt} /></Bol>
    : i === 1 ? <Bol s={0.3}><Masa p={[0, 0.06, 0]} r={0.55} rise={0.6} t={tt} /></Bol>
    : i === 2 ? <group><mesh position={[0, 0.05, 0]}><boxGeometry args={[0.22, 0.1, 0.18]} /><meshPhysicalMaterial color="#d8382a" clearcoat={1} roughness={0.3} /></mesh><mesh position={[0, 0.13, 0]} scale={[0.07, 0.05, 0.07]}><sphereGeometry args={[1, 16, 10]} />{masaMat()}</mesh></group>
    : i === 3 ? <group>{[0, 1, 2, 3].map((j) => <Bollo key={j} p={[((j % 2) - 0.5) * 0.14, 0, (Math.floor(j / 2) - 0.5) * 0.14]} s={0.5} bake={0} />)}</group>
    : i === 4 ? <group><RBox p={[0, 0.1, 0]} s={[0.26, 0.2, 0.2]} r={0.02}>{M.hierro()}</RBox><mesh position={[0, 0.1, 0.101]}><planeGeometry args={[0.18, 0.12]} /><meshStandardMaterial color="#ff8a30" emissive="#ff6a10" emissiveIntensity={1.2} toneMapped={false} /></mesh></group>
    : <group>{[0, 1, 2].map((j) => <Bollo key={j} p={[(j - 1) * 0.1, 0, 0]} s={0.55} bake={0.95} cruz={1} />)}<mesh position={[0.14, 0.05, 0.08]}><cylinderGeometry args={[0.03, 0.025, 0.07, 16]} /><meshStandardMaterial color="#f4f0e6" /></mesh></group>;
  return <Estudio t={tt} cam={[0, 0.95, 1.9]} look={[0, 0.2, 0]} orbit={0.04}>
    <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.75, 0.75, 0.04, 64]} />{M.madera("#8a5a32")}</mesh>
    <group rotation={[0, -rot, 0]}>
      {E.map((e, i) => { const a = (i / N) * 2 * P; return <group key={i} position={[Math.sin(a) * 0.5, 0.04, Math.cos(a) * 0.5]} rotation={[0, a, 0]} scale={(i === cur ? 1.25 : 0.9) * (i <= cur ? 1 : 0.85)}><Est i={i} /></group>; })}
    </group>
    {E.map((e, i) => <Placa key={i} p={[0, 0.06, 0.85]} rot={[-0.7, 0, 0]} w={0.5} h={0.12} tex={cartel("rt" + i, e.tx, { size: 90 })} k={i === cur ? ent(t, e.a) : 0} />)}
  </Estudio>;
}}</Stage>;

// ── 15 · REPARTO (bloque): la calle de casitas; de la canasta salen los bollos en arco hasta la bolsa de cada puerta, la cuenta de la lista
const H15Reparto: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false} tone="#161a26">{(tt) => {
  const E = IT(h), cur = curI(h, t), N = [3, 6, 5, 8], cols = ["#e8dcc0", "#d8c8a8", "#efe2c4", "#cdbb98"];
  return <Estudio t={tt} cam={[0, 1.25, 2.7]} look={[0, 0.4, -0.3]} orbit={0.05}>
    <mesh rotation={[-P2, 0, 0]} position={[0, 0.002, 0.2]}><planeGeometry args={[3, 0.5]} /><meshStandardMaterial color="#8a8070" roughness={1} /></mesh>
    {[0, 1, 2, 3].map((i) => { const x = -0.9 + i * 0.6, on = E[i] ? t >= E[i].a : false;
      return <group key={i} position={[x, 0, -0.3]}>
        <RBox p={[0, 0.35, 0]} s={[0.52, 0.7, 0.4]} r={0.02}><meshStandardMaterial color={cols[i]} roughness={0.95} /></RBox>
        <mesh position={[0, 0.82, 0]} rotation={[0, P / 4, 0]}><coneGeometry args={[0.38, 0.25, 4]} /><meshStandardMaterial color="#a8482a" roughness={0.85} /></mesh>
        <RBox p={[0, 0.2, 0.205]} s={[0.18, 0.36, 0.02]} r={0.01}>{M.madera("#5a3820")}</RBox>
        <mesh position={[0.1, 0.48, 0.205]}><planeGeometry args={[0.12, 0.1]} /><meshStandardMaterial color="#2a1a10" emissive="#ffb050" emissiveIntensity={on ? 1.6 : 0.3} toneMapped={false} /></mesh>
        <Bolsa p={[0.06, 0.3, 0.24]} s={0.45} />
        {Array.from({ length: N[i] }, (_, j) => { const a = E[i] ? E[i].a + 0.15 * j : 99, k = cl((t - a) / 0.6), x0 = 0 - x, y = 0.2 + Math.sin(k * P) * 0.6;
          return <Bollo key={j} p={[lerp(x0, 0.06, k) + (j % 3 - 1) * 0.02 * k, k >= 1 ? 0.27 + Math.floor(j / 3) * 0.02 : y, lerp(0.9, 0.27, k)]} s={0.35} bake={0.9} />; })}
      </group>; })}
    <Canasta p={[0, 0.0, 0.6]} r={0.3} hgt={0.2} pano={1} />
    {E.map((e, i) => <Placa key={i} p={[-0.9 + i * 0.6, 0.95, -0.12]} w={0.5} h={0.11} tex={cartel("rp" + i, e.tx, { size: 76, w: 640 })} k={t >= e.a ? ent(t, e.a + 0.3) : 0} />)}
  </Estudio>;
}}</Stage>;

// ── 16 · PROMESA: la misma puerta, mañana tras mañana: el almanaque de la pared arranca sus hojas y cada mañana aparecen los mismos tres bollos
const H16Promesa: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#161a26">{(tt) => {
  const d = Math.floor(cl((tt - 0.6) / 5) * 5.99), ph = ((tt - 0.6) % (5 / 6)) / (5 / 6), sun = tt > 0.6 ? Math.sin(ph * P) : 0;
  return <Estudio t={tt} cam={[0.35, 1.0, 2.0]} look={[0, 0.8, 0]} orbit={0.06}>
    <RBox p={[0, 1.0, -0.06]} s={[1.6, 2.0, 0.1]} r={0.02}><meshStandardMaterial color="#e2d6c0" roughness={0.95} /></RBox>
    <RBox p={[-0.25, 0.8, 0.0]} s={[0.6, 1.5, 0.05]} r={0.02}>{M.madera("#5a3820")}</RBox>
    <mesh position={[0.02, 0.85, 0.05]}><sphereGeometry args={[0.025, 12, 10]} />{M.cromo("#b8962e")}</mesh>
    <RBox p={[-0.25, 0.03, 0.15]} s={[0.9, 0.06, 0.35]} r={0.01}><meshStandardMaterial color="#9a9488" roughness={1} /></RBox>
    <group position={[-0.1, 0.06 + 0.4 * (1 - cl(phys(ph * 5 / 6, 0.05, 6, 0.5))), 0.18]} rotation={[0, 0.3, 0]} visible={tt > 0.6}>
      <RBox p={[0, 0.06, 0]} s={[0.26, 0.12, 0.18]} r={0.03}><meshStandardMaterial map={kraft()} roughness={0.95} /></RBox>
      <mesh position={[0, 0.061, 0]}><boxGeometry args={[0.012, 0.125, 0.185]} /><meshStandardMaterial color="#e8dcc0" roughness={1} /></mesh>
      <mesh position={[0, 0.061, 0]}><boxGeometry args={[0.265, 0.125, 0.012]} /><meshStandardMaterial color="#e8dcc0" roughness={1} /></mesh>
      <mesh position={[0, 0.13, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.025, 0.006, 6, 16]} /><meshStandardMaterial color="#e8dcc0" roughness={1} /></mesh>
    </group>
    <group position={[0.45, 1.25, 0.0]}>
      <RBox s={[0.36, 0.42, 0.02]} r={0.01}><meshStandardMaterial color="#c0281c" roughness={0.6} /></RBox>
      <mesh position={[0, -0.04, 0.012]}><planeGeometry args={[0.32, 0.3]} /><meshStandardMaterial map={papel("c_dia" + d, [["MON", "TUE", "WED", "THU", "FRI", "SAT"][d]], { w: 320, h: 300, size: 110 })} roughness={0.9} /></mesh>
      <mesh position={[0, -0.04 - 0.4 * ph, 0.03 + 0.2 * ph]} rotation={[0.8 * ph, 0, 0.6 * ph]} visible={ph > 0.05 && ph < 0.6 && d < 5}><planeGeometry args={[0.32, 0.3]} /><meshStandardMaterial color="#fbf6ea" side={THREE.DoubleSide} transparent opacity={1 - ph * 1.5} /></mesh>
    </group>
    <pointLight position={[1.2, 1.4, 1.0]} intensity={0.4 + 1.8 * sun} distance={4} color="#ffd9a0" />
  </Estudio>;
}}</Stage>;

const kraft = () => ctex("c_kraft", 128, 128, (g) => { g.fillStyle = "#b48a5a"; g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(90,60,30,${0.1 + 0.15 * rn(i, 1)})`; g.beginPath(); g.moveTo(rn(i, 2) * 128, rn(i, 3) * 128); g.lineTo(rn(i, 4) * 128, rn(i, 5) * 128); g.stroke(); } });

// ── 17 · TORRE: de sesenta a dos mil: las canastas se apilan del piso al techo; la cámara sube con la pila y la vela cuenta en el piso
const H17Torre: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const n = Math.floor(cl((tt - 0.4) / 5.0) * 24), up = eio(tt, 0.6, 6.2);
  return <Estudio t={tt} cam={[0.4, 0.8 + 1.4 * up, 3.0]} look={[0, 0.5 + 1.3 * up, 0]} orbit={0.06}>
    <mesh rotation={[-P2, 0, 0]}><circleGeometry args={[2.0, 48]} /><meshStandardMaterial color="#b85a3a" roughness={0.9} /></mesh>
    {Array.from({ length: 24 }, (_, i) => { const col = i % 3, row = Math.floor(i / 3), k = i < n ? 1 : i === n ? cl(((tt - 0.4) / 5.0) * 24 - n) : 0;
      return <group key={i} position={[(col - 1) * 0.62, row * 0.34 + 0.6 * (1 - k), (col === 1 ? -0.1 : 0) + rn(i, 1) * 0.04]} rotation={[0, (rn(i, 2) - 0.5) * 0.3, 0]} scale={0.001 + k}>
        <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.28, 0.24, 0.26, 24, 1, true]} /><meshStandardMaterial color="#c49a5a" roughness={0.9} map={mimbre()} side={THREE.DoubleSide} /></mesh>
        {Array.from({ length: 5 }, (_, j) => <Bollo key={j} p={[Math.cos(j * 1.3) * 0.12, 0.2, Math.sin(j * 1.3) * 0.12]} s={0.7} bake={0.95} gloss={1} cruz={1} />)}
      </group>; })}
    <Placa p={[0.95, 0.12, 0.5]} rot={[-0.5, -0.3, 0]} w={0.42} h={0.12} tex={cartel(n > 20 ? "2000" : "60", n > 20 ? "2,000" : "60", { size: 110 })} k={1} />
  </Estudio>;
}}</Stage>;
const mimbre = () => ctex("c_mimbre", 256, 128, (g) => { g.fillStyle = "#b88a4a"; g.fillRect(0, 0, 256, 128); for (let y = 0; y < 128; y += 10) for (let x = 0; x < 256; x += 20) { g.fillStyle = (x / 20 + y / 10) % 2 ? "#d8aa62" : "#9a6e36"; g.beginPath(); g.ellipse(x + 10, y + 5, 10, 4, 0, 0, 7); g.fill(); } });

// ── 18 · RALLADOR: el bollo duro de ayer baja por el rallador de lata y el pan rallado cae en el cucurucho de papel
const H18Rallador: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const stroke = Math.sin(tt * 5) * (tt > 0.8 && tt < 5 ? 1 : 0), fill = eio(tt, 1.0, 5.0), wear = eio(tt, 0.8, 5.0);
  return <Estudio t={tt} cam={[0.3, 0.9, 1.9]} look={[0, 0.4, 0]} orbit={0.08}>
    <RBox p={[0, 0.03, 0]} s={[1.6, 0.06, 0.8]} r={0.03}>{M.madera("#9a6a3a")}</RBox>
    <group position={[-0.25, 0.06, 0]} rotation={[0, 0.3, -0.25]}>
      <mesh position={[0, 0.3, 0]}><boxGeometry args={[0.24, 0.6, 0.012]} />{M.cromo("#b8bcc0")}</mesh>
      {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[((i % 5) - 2) * 0.04, 0.08 + Math.floor(i / 5) * 0.06, 0.008]}><circleGeometry args={[0.008, 6]} /><meshBasicMaterial color="#202224" /></mesh>)}
      <mesh position={[0, 0.65, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.05, 0.01, 6, 16, P]} />{M.cromo("#b8bcc0")}</mesh>
      <group position={[0, 0.38 + 0.12 * stroke, 0.07]}><mesh scale={[0.12 * (1 - 0.4 * wear), 0.09, 0.08 * (1 - 0.5 * wear)]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color={corteza(0.75)} roughness={0.9} /></mesh></group>
    </group>
    {Array.from({ length: 24 }, (_, i) => { const q = (tt * 1.4 + rn(i, 1)) % 1; return <mesh key={i} position={[-0.1 + (rn(i, 2) - 0.5) * 0.12 + 0.35 * q, 0.35 - q * 0.25, 0.05 + (rn(i, 3) - 0.5) * 0.1]} scale={0.008} visible={tt > 1 && tt < 5.2}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#d8a860" /></mesh>; })}
    <group position={[0.35, 0.06, 0.05]} rotation={[0.2, 0, 0]}>
      <mesh position={[0, 0.15, 0]} rotation={[P, 0, 0]}><coneGeometry args={[0.12, 0.3, 32, 1, true]} /><meshStandardMaterial color="#e8dcc0" roughness={1} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.1 + 0.18 * fill, 0]} scale={[1, 0.001 + fill, 1]}><sphereGeometry args={[0.11, 24, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#d8a860" roughness={1} /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

// ── 19 · CESTITA: junto a la puerta la canastita de medio bollo; uno a uno los bollitos se van solos y la canastita se vuelve a llenar cada mañana
const H19Cestita: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const gone = Math.floor(cl((tt - 1.0) / 3.0) * 6), refill = eio(tt, 4.6, 5.6);
  return <Estudio t={tt} cam={[0.15, 0.62, 0.95]} look={[-0.15, 0.27, 0]} orbit={0.08}>
    <RBox p={[0.3, 0.8, -0.35]} s={[0.6, 1.6, 0.06]} r={0.02}>{M.madera("#5a3820")}</RBox>
    <RBox p={[-0.6, 0.8, -0.4]} s={[1.6, 1.6, 0.04]} r={0.01}>{M.madera("#7a5232")}</RBox>
    <RBox p={[-0.15, 0.2, 0]} s={[0.4, 0.04, 0.4]} r={0.01}>{M.madera("#8a5a32")}</RBox>
    {[[-0.32, -0.17], [0.02, -0.17], [-0.32, 0.17], [0.02, 0.17]].map(([x, z], i) => <mesh key={i} position={[x, 0.1, z]}><cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />{M.madera("#6a4428")}</mesh>)}
    <group position={[-0.15, 0.22, 0]}>
      <Canasta r={0.16} hgt={0.09} />
      {Array.from({ length: 6 }, (_, i) => { const away = i < gone && refill < 0.5, back = refill;
        return <Bollo key={i} p={[Math.cos(i * 1.05) * 0.07, 0.04 + (i % 2) * 0.03 + (away ? 0.6 : 0) * (1 - back), Math.sin(i * 1.05) * 0.07 + (away ? 0.6 : 0) * (1 - back)]} s={0.5} bake={0.9} />; })}
    </group>
    <pointLight position={[0.8, 1.2, 0.8]} intensity={1.6} distance={3} color="#ffd9a0" />
  </Estudio>;
}}</Stage>;

// ── 20 · SÉSAMO: la palma aplasta la bola en un disco; pincelada de huevo y llueve el sésamo
const H20Sesamo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const fl = eio(tt, 0.6, 1.5), ss = cl((tt - 2.2) / 2.0);
  return <Estudio t={tt} cam={[0.2, 0.9, 1.2]} look={[0, 0.1, 0]} orbit={0.08} fov={32}>
    <RBox p={[0, 0.03, 0]} s={[1.3, 0.06, 0.8]} r={0.03}>{M.madera("#a8784a")}</RBox>
    <mesh position={[0, 0.06, 0]} scale={[0.15 * lerp(1, 1.6, fl), 0.13 * lerp(1, 0.35, fl), 0.15 * lerp(1, 1.6, fl)]} castShadow><sphereGeometry args={[1, 40, 20, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color={MASA} roughness={0.5 - 0.3 * cl(tt - 1.8)} clearcoat={0.8 * cl(tt - 1.8)} sheen={0.8} sheenColor="#fff1d6" /></mesh>
    <Mano p={[0, 0.2 + 0.22 * (1 - Math.sin(cl((tt - 0.4) / 1.5) * P)), 0]} rot={[-1.55, 0, 0]} pinza={0} s={1.0} />
    {Array.from({ length: 80 }, (_, i) => { const a = 2.2 + rn(i, 1) * 1.6, y = fall(tt, a, 0.6), r = Math.sqrt(rn(i, 2)) * 0.2, th = rn(i, 3) * 2 * P;
      return <mesh key={i} position={[Math.cos(th) * r, 0.11 + y * 1.2, Math.sin(th) * r]} rotation={[-P2, 0, rn(i, 4) * 3]} scale={[0.008, 0.004, 0.004]} visible={tt > a}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#f2e2b8" roughness={0.6} /></mesh>; })}
    <Placa p={[0.42, 0.07, 0.32]} rot={[-0.6, -0.3, 0]} w={0.32} h={0.11} tex={cartel("100", "100 g", { size: 110 })} k={ent(tt, 1.6)} />
    {ss < 0 && <group />}
  </Estudio>;
}}</Stage>;

// ── 21 · REVIVE: el bollo de ayer, gris y duro como piedra; las gotas de agua caen, entra al calor y vuelve dorado con su vapor
const piedraTex = () => ctex("c_piedra", 256, 256, (g) => { g.fillStyle = "#a8a092"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? "70,66,60" : "200,194,182"},${0.2 + 0.3 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 2 + rn(i, 5) * 5, 2 + rn(i, 6) * 5); } });
const H21Revive: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#1c120c">{(tt) => {
  const life = eio(tt, 2.6, 4.8), heat = cl((tt - 2.4) / 0.6) * (1 - cl((tt - 5.2) / 0.6));
  return <Estudio t={tt} cam={[0.15, 0.75, 1.3]} look={[0, 0.15, 0]} orbit={0.1} fov={32}>
    <RBox p={[0, 0.03, 0]} s={[1.3, 0.06, 0.8]} r={0.03}>{M.madera("#6a4428")}</RBox>
    <mesh position={[0, 0.06, 0]} scale={[0.17, 0.12 + 0.015 * life, 0.17]} castShadow><sphereGeometry args={[1, 40, 20, 0, 2 * P, 0, P2]} />
      <meshPhysicalMaterial color={new THREE.Color("#ffffff").lerp(new THREE.Color(corteza(0.9)), life)} map={life < 0.5 ? piedraTex() : null} roughness={lerp(0.95, 0.45, life)} clearcoat={0.5 * life} /></mesh>
    {Array.from({ length: 16 }, (_, i) => { const a = 0.7 + i * 0.08, y = fall(tt, a, 0.5); return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.25, 0.2 + y, (rn(i, 2) - 0.5) * 0.2]} scale={[0.01, 0.014, 0.01]} visible={tt > a && tt < a + 0.55}><sphereGeometry args={[1, 10, 8]} />{M.liquido("#cfe8f4", 0.7)}</mesh>; })}
    {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.3 + i * 0.06, -0.3]} rotation={[0, 0, 0]} scale={[1, 1, 1]}><torusGeometry args={[0.3 - i * 0.04, 0.01, 8, 48, P]} /><meshStandardMaterial color="#401810" emissive="#ff4a10" emissiveIntensity={2 * heat} toneMapped={false} transparent opacity={heat} /></mesh>)}
    <Vapor t={tt} p={[0, 0.2, 0]} o={0.5 * cl((tt - 4.2) * 2)} h={0.8} s={0.2} spread={0.1} n={10} />
    <pointLight position={[0, 0.5, 0.2]} intensity={0.4 + 2.5 * heat} distance={2} color="#ff9050" />
    <Placa p={[0.42, 0.07, 0.3]} rot={[-0.6, -0.3, 0]} w={0.34} h={0.11} tex={cartel("5m", "5 MIN", { size: 110 })} k={ent(tt, 3.0)} />
  </Estudio>;
}}</Stage>;

// ── 22 · MITADES: sin balanza: el disco de masa se parte en dos, cada mitad en dos, cada cuarto en tres: doce pedazos parejos
const H22Mitades: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const a = eio(tt, 0.7, 1.4), b = eio(tt, 2.0, 2.7), c = eio(tt, 3.3, 4.2), rd = eio(tt, 4.6, 5.6);
  return <Estudio t={tt} cam={[0, 1.6, 1.4]} look={[0, 0.05, 0]} orbit={0.05} fov={34}>
    <RBox p={[0, 0.03, 0]} s={[1.8, 0.06, 1.2]} r={0.03}>{M.madera("#a8784a")}</RBox>
    {Array.from({ length: 12 }, (_, i) => { const half = i < 6 ? -1 : 1, q = Math.floor(i / 3), qz = q % 2 ? 1 : -1, j = i % 3;
      const x = half * 0.04 * a + half * 0.18 * b * (q % 2 === 0 ? 1 : 1) + (j - 1) * 0.13 * c, z = qz * 0.17 * b, s0 = lerp(1, 0.5, rd);
      const ang = (i / 12) * 2 * P;
      return <group key={i} position={[lerp(x, Math.cos(ang) * 0.45, rd * 0) + 0 * ang, 0.06, z]}>
        <mesh scale={[0.065 * (rd > 0 ? s0 * 1.4 : 1), 0.05 + 0.04 * rd, 0.065 * (rd > 0 ? s0 * 1.4 : 1)]} castShadow><sphereGeometry args={[1, 24, 12, 0, 2 * P, 0, P2]} />{masaMat()}</mesh>
      </group>; })}
    <group position={[0.75, 0.1 + 0.15 * Math.abs(Math.sin(tt * 3)) * (tt < 4.4 ? 1 : 0), 0.3]} rotation={[0, -0.6, 0.3]}><mesh><boxGeometry args={[0.2, 0.14, 0.008]} />{M.cromo()}</mesh><mesh position={[0, 0.08, 0]}><boxGeometry args={[0.22, 0.03, 0.03]} />{M.madera("#3a2416")}</mesh></group>
    <Placa p={[0, 0.06, 0.7]} rot={[-0.8, 0, 0]} w={0.4} h={0.12} tex={cartel("x12", "2 · 2 · 3", { size: 100 })} k={ent(tt, 3.6)} />
  </Estudio>;
}}</Stage>;

// ── 23 · CAJA: la caja registradora vieja; marca 0,80 para la placa de doce bollos y 5,00 para la bolsa de ocho del súper; el cajón salta
const regTex = (v: string) => ctex("c_reg" + v, 256, 96, (g) => { g.fillStyle = "#101418"; g.fillRect(0, 0, 256, 96); g.fillStyle = "#ffd27a"; g.font = "900 70px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(v, 128, 52); });
const H23Caja: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const v = tt < 3.2 ? "$0.80" : "$5.00", dr = Math.max(0, Math.sin(cl((tt - 1.0) / 0.8) * P)) + Math.max(0, Math.sin(cl((tt - 3.4) / 0.8) * P));
  return <Estudio t={tt} cam={[0.1, 1.0, 2.4]} look={[0, 0.45, 0]} orbit={0.08}>
    <RBox p={[0, 0.03, 0]} s={[2.0, 0.06, 0.9]} r={0.03}>{M.madera("#9a6a3a")}</RBox>
    <group position={[0, 0.06, -0.1]}>
      <RBox p={[0, 0.25, 0]} s={[0.6, 0.38, 0.5]} r={0.04}>{M.cromo("#b8962e")}</RBox>
      <RBox p={[0, 0.08, 0.05 + 0.2 * Math.min(1, dr)]} s={[0.56, 0.1, 0.5]} r={0.02}>{M.madera("#3a2416")}</RBox>
      <mesh position={[0, 0.58, 0.05]} rotation={[-0.3, 0, 0]}><planeGeometry args={[0.36, 0.13]} /><meshBasicMaterial map={regTex(v)} toneMapped={false} /></mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.2 + (i % 4) * 0.13, 0.45, 0.2 + Math.floor(i / 4) * 0.06]} rotation={[-0.6, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.02, 16]} /><meshStandardMaterial color="#fbf6e8" roughness={0.4} /></mesh>)}
    </group>
    <group position={[-0.7, 0.06, 0.15]} scale={ent(tt, 0.4) + 0.001}><Bandeja w={0.5} d={0.4} />{Array.from({ length: 12 }, (_, i) => <Bollo key={i} p={[((i % 4) - 1.5) * 0.11, 0.03, (Math.floor(i / 4) - 1) * 0.11]} s={0.42} bake={0.95} cruz={1} />)}</group>
    <group position={[0.72, 0.06, 0.15]} scale={ent(tt, 2.8) + 0.001}>
      <mesh position={[0, 0.12, 0]} scale={[0.22, 0.13, 0.15]}><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color="#f6f4ee" roughness={0.15} transmission={0.5} transparent opacity={0.6} /></mesh>
      {Array.from({ length: 8 }, (_, i) => <Bollo key={i} p={[((i % 4) - 1.5) * 0.08, 0.02 + Math.floor(i / 4) * 0.08, 0]} s={0.38} bake={0.25} />)}
    </group>
  </Estudio>;
}}</Stage>;

// ── 24 · SEMANA: la placa de bollos crudos en su bolsa-globo dentro de la heladera; cada día salen tres al horno chico y salen dorados
const H24Semana: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#10161c">{(tt) => {
  const d = Math.floor(cl((tt - 1.0) / 5.4) * 3.99), ph = cl(((tt - 1.0) % 1.35) / 1.35), left = 12 - 3 * d;
  return <Estudio t={tt} cam={[0.3, 1.0, 2.6]} look={[0.1, 0.65, 0]} orbit={0.06}>
    <RBox p={[-0.45, 0.75, -0.1]} s={[0.9, 1.5, 0.7]} r={0.06}><meshPhysicalMaterial color="#eef1f2" roughness={0.3} clearcoat={0.8} side={THREE.BackSide} /></RBox>
    <pointLight position={[-0.45, 1.3, 0.1]} intensity={1.3} distance={1.6} color="#e8f4ff" />
    <mesh position={[-0.45, 0.6, -0.1]}><boxGeometry args={[0.8, 0.015, 0.6]} />{M.vidrio()}</mesh>
    <group position={[-0.45, 0.62, -0.1]}><Bandeja w={0.6} d={0.4} />
      {Array.from({ length: 12 }, (_, i) => <Bollo key={i} p={[((i % 4) - 1.5) * 0.13, 0.03, (Math.floor(i / 4) - 1) * 0.12]} s={i < 12 - left ? 0.001 : 0.42} bake={0} />)}
      <mesh position={[0, 0.12, 0]} scale={[0.36, 0.14, 0.25]}><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} transparent opacity={0.22} depthWrite={false} /></mesh></group>
    <group position={[0.65, 0.06, 0.1]}>
      <RBox p={[0, 0.22, 0]} s={[0.55, 0.4, 0.4]} r={0.04}><meshPhysicalMaterial color="#e8e0d0" roughness={0.4} clearcoat={0.6} /></RBox>
      <mesh position={[0, 0.22, 0.201]}><planeGeometry args={[0.36, 0.22]} /><meshStandardMaterial color="#2a1a10" emissive="#ff8a30" emissiveIntensity={0.8} toneMapped={false} /></mesh>
      {[0, 1, 2].map((j) => <Bollo key={j} p={[(j - 1) * 0.12, 0.47 + 0.3 * (1 - ent(ph * 1.35, 0.6)), 0.05]} s={0.45} bake={ph} cruz={ph} />)}
    </group>
    {[0, 1, 2, 3].map((i) => <Placa key={i} p={[0.65, 0.95, 0.1]} w={0.42} h={0.12} tex={cartel("dw" + i, ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"][i], { size: 80 })} k={i === d ? ent(tt, 1.0 + i * 1.35) : 0} />)}
  </Estudio>;
}}</Stage>;

// ── 25 · ÁBACO (repaso): el ábaco de madera del panadero; cada paso corre una cuenta de un lado al otro y cuelga su papelito
const H25Abaco: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const E = IT(h), N = E.length, cur = curI(h, t);
  return <Estudio t={tt} cam={[0, 0.95, 2.5]} look={[0, 0.85, 0]} orbit={0.04}>
    <RBox p={[-1.0, 0.85, 0]} s={[0.08, 1.5, 0.12]} r={0.02}>{M.madera("#5a3a22")}</RBox>
    <RBox p={[1.0, 0.85, 0]} s={[0.08, 1.5, 0.12]} r={0.02}>{M.madera("#5a3a22")}</RBox>
    <RBox p={[0, 0.08, 0]} s={[2.2, 0.08, 0.3]} r={0.02}>{M.madera("#5a3a22")}</RBox>
    {E.map((e, i) => { const y = 1.5 - i * 0.18, on = t >= e.a, k = on ? cl(phys(t - e.a, 0, 6, 0.5)) : 0;
      return <group key={i} position={[0, y, 0]}>
        <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.008, 0.008, 2.0, 8]} />{M.cromo("#9a9a98")}</mesh>
        <mesh position={[lerp(-0.85, 0.85, k), 0, 0]} rotation={[0, 0, P2]} scale={[1, 1, 1]}><sphereGeometry args={[0.065, 24, 16]} /><meshPhysicalMaterial color={corteza(0.85)} roughness={0.5} clearcoat={0.6} /></mesh>
        <mesh position={[0.1, -0.005, 0.03]} visible={i === cur && on}><planeGeometry args={[1.1, 0.13]} /><meshStandardMaterial map={papel("c_ab" + i, [e.tx], { w: 1024, h: 120, size: 92, bg: "#efe4c8" })} transparent opacity={cl((t - e.a) * 3)} roughness={0.9} /></mesh>
      </group>; })}
    {N === 0 && <group />}
  </Estudio>;
}}</Stage>;

// ── 26 · HOYUELOS (lo que viene): la placa de focaccia; los dedos la llenan de hoyitos, cae el aceite y brilla en cada hoyo
const H26Hoyuelos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const d = Math.floor(cl((tt - 0.6) / 3.0) * 24), oil = eio(tt, 3.6, 5.0);
  return <Estudio t={tt} cam={[0.2, 1.3, 1.6]} look={[0, 0.05, 0]} orbit={0.08} fov={34}>
    <mesh position={[0, 0.03, 0]}><boxGeometry args={[1.2, 0.06, 0.8]} />{M.cromo("#3a3a38")}</mesh>
    <RBox p={[0, 0.08, 0]} s={[1.1, 0.07, 0.7]} r={0.03}><meshPhysicalMaterial color="#f0dcb0" roughness={lerp(0.6, 0.15, oil)} clearcoat={oil} sheen={0.6} sheenColor="#fff1d6" /></RBox>
    {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[((i % 6) - 2.5) * 0.17, 0.117, (Math.floor(i / 6) - 1.5) * 0.15]} rotation={[-P2, 0, 0]} scale={i < d ? 1 : 0.001}><circleGeometry args={[0.03, 16]} /><meshPhysicalMaterial color={oil > 0.2 ? "#d8b040" : "#d8c49a"} roughness={0.1} clearcoat={oil} /></mesh>)}
    <Mano p={[((d % 6) - 2.5) * 0.17, 0.3, (Math.floor(d / 6) - 1.5) * 0.15 + 0.05]} rot={[-1.5, 0, 0]} pinza={0.9} s={0.7} />
    <Chorro a={[0.6, 0.6, -0.2]} b={[-0.2, 0.13, 0]} r={0.008} c="#c9a020" o={0.8 * cl((tt - 3.6) * 3) * (1 - cl((tt - 5.0) * 3))} t={tt} splash={false} />
    <Placa p={[0.55, 0.06, 0.55]} rot={[-0.7, -0.2, 0]} w={0.34} h={0.12} tex={cartel("150", "$1.50", { size: 110 })} k={ent(tt, 1.6)} />
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  puerta: H1Puerta, centro: H2Centro, escalera: H3Escalera, desvio: H4Desvio, desigual: H5Desigual, jaula: H6Jaula, espacio: H7Espacio, dedo: H8Dedo,
  brillo: H9Brillo, flor: H10Flor, rompe: H11Rompe, domino: H12Domino, relleno: H13Relleno, giratorio: H14Giratorio, reparto: H15Reparto, promesa: H16Promesa,
  torre: H17Torre, rallador: H18Rallador, cestita: H19Cestita, sesamo: H20Sesamo, revive: H21Revive, mitades: H22Mitades, caja: H23Caja, semana: H24Semana,
  abaco: H25Abaco, hoyuelos: H26Hoyuelos,
};
