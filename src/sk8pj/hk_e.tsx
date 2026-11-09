// sk8pj · los componentes ÚNICOS del chahan (uno por minuto; ninguno repite so29/ssl29, ver D:/rtmp/premium8n_sachiko_COMPONENTES.md).
// Maqueta sobre la mesada (hk.tsx). Cada uno = UNA idea con un objeto: el grano, la sartén, el frasco blanco y la cuchara de soja.
import React, { useMemo } from "react";
import * as THREE from "three";
import { F, Hero, C, lerp, pop, Pop, Ink, cardTex, Steam, Pan, Bowl, Sign, Dial, Coin, cl, eio, orbita, Box, Cyl, AMB, V } from "./hk";
import { mk } from "./casa3d";

const RICE = "#f7f2e3", GOLD = "#ecb64c", SOY = "#3a1f0f", STEEL = "#d0d5db", IRON = "#26272a", RED = "#c8402a", GRN = "#6fae4a", LARD = "#f6efdc", COLD = "#a9c9e8", CREAM = "#fff3d6";
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const bob = (tt: number, f = 1, a = 0.01) => a * Math.sin(tt * f);

// un grano de arroz
const Grain: React.FC<{ p: V; rot?: V; s?: number; c?: string; gloss?: number }> = ({ p, rot = [0, 0, 0], s = 1, c = RICE, gloss = 0.3 }) =>
  <mesh position={p} rotation={rot} scale={s} castShadow><capsuleGeometry args={[0.011, 0.03, 5, 10]} /><meshPhysicalMaterial color={c} roughness={0.42} clearcoat={gloss} /></mesh>;
// montoncito de granos sueltos: n granos sobre un disco de radio R (más alto al centro)
const Mound: React.FC<{ p: V; n?: number; R?: number; H?: number; c?: string; s?: number; gloss?: number }> = ({ p, n = 90, R = 0.2, H = 0.1, c = RICE, s = 1, gloss = 0.3 }) =>
  <group position={p}>{Array.from({ length: n }, (_, i) => { const r = R * Math.sqrt(rnd(i)), a = i * 2.4; return <Grain key={i} s={s} c={c} gloss={gloss} p={[r * Math.cos(a), H * (1 - (r / R) * (r / R)) * rnd(i + 7) + 0.012, r * Math.sin(a)]} rot={[rnd(i) * 3, i, rnd(i + 3) * 3]} />; })}</group>;
const Ladle: React.FC<{ p: V; rot?: V; s?: number }> = ({ p, rot = [0, 0, 0], s = 1 }) =>
  <group position={p} rotation={rot} scale={s}>
    <mesh rotation={[Math.PI, 0, 0]}><sphereGeometry args={[0.09, 26, 14, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.18} side={THREE.DoubleSide} /></mesh>
    <Cyl p={[0.26, 0.09, 0]} r={0.012} h={0.42} c={STEEL} m={0.9} rough={0.2} rot={[0, 0, 1.1]} />
  </group>;
const Jar: React.FC<{ p: V; s?: number; lid?: number }> = ({ p, s = 1, lid = 0 }) =>
  <group position={p} scale={s}>
    <Cyl p={[0, 0.13, 0]} r={0.13} r2={0.11} h={0.26} c="#f7f4ec" rough={0.25} seg={40} />
    <mesh position={[0, 0.26, 0]}><sphereGeometry args={[0.13, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f7f4ec" roughness={0.25} /></mesh>
    <group position={[0, 0.34 + lid * 0.16, 0]} rotation={[0, 0, lid * 0.25]}><Cyl p={[0, 0, 0]} r={0.075} h={0.03} c="#ece7da" rough={0.25} /><mesh position={[0, 0.035, 0]}><sphereGeometry args={[0.022, 16, 12]} /><meshStandardMaterial color="#ece7da" roughness={0.25} /></mesh></group>
  </group>;
// figura chiquita de arcilla (la nena del recado y los vecinos)
const Mini: React.FC<{ p: V; c?: string; s?: number; rotY?: number; bowl?: boolean; head?: number; step?: number }> = ({ p, c = RED, s = 1, rotY = 0, bowl, head = 0, step = 0 }) =>
  <group position={[p[0], p[1] + Math.abs(step) * 0.008, p[2]]} rotation={[0, rotY, 0]} scale={s}>
    <Cyl p={[0, 0.06, 0]} r={0.022} r2={0.04} h={0.11} c={c} rough={0.75} />
    {[-1, 1].map((d) => <Cyl key={d} p={[0.012 * d, 0.0, step * d * 0.012]} r={0.007} h={0.03} c="#f1d9c4" rough={0.7} />)}
    <group position={[0, 0.14, 0]} rotation={[0, head, 0]}><mesh><sphereGeometry args={[0.03, 20, 16]} /><meshStandardMaterial color="#f1d9c4" roughness={0.7} /></mesh><mesh position={[0, 0.012, -0.006]}><sphereGeometry args={[0.031, 20, 12, 0, Math.PI * 2, 0, Math.PI / 1.8]} /><meshStandardMaterial color="#23201c" roughness={0.7} /></mesh></group>
    {bowl && <mesh position={[0.05, 0.085, 0]} rotation={[Math.PI, 0, 0]}><sphereGeometry args={[0.03, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#2c4a8a" side={THREE.DoubleSide} /></mesh>}
  </group>;
// fachada chica de local (para la calle de Osaka)
const Shop: React.FC<{ p: V; c?: string; lit?: number; w?: number; noren?: boolean; rotY?: number }> = ({ p, c = "#8a6a4a", lit = 0.2, w = 0.3, noren, rotY = 0 }) =>
  <group position={p} rotation={[0, rotY, 0]}>
    <Box p={[0, 0.17, 0]} s={[w, 0.34, 0.22]} c={c} r={0.85} rad={0.006} />
    <Box p={[0, 0.355, 0.02]} s={[w + 0.04, 0.03, 0.27]} c="#4a3a2e" r={0.8} rad={0.006} />
    <Box p={[0, 0.1, 0.112]} s={[w * 0.66, 0.15, 0.006]} c="#ffd08a" r={0.5} e="#ffb45a" ei={0.3 + 1.3 * lit} cast={false} />
    {noren && [0, 1, 2].map((i) => <Box key={i} p={[-0.06 + i * 0.06, 0.2, 0.122]} s={[0.052, 0.09, 0.004]} c="#2c4a8a" r={0.9} rad={0.002} cast={false} />)}
  </group>;
const Flame: React.FC<{ p: V; h: number; r: number; tt: number; i?: number }> = ({ p, h, r, tt, i = 0 }) => { const w = 1 + 0.07 * Math.sin(tt * 2 * 1.7 + i * 1.7); return <group position={p}>
  <mesh position={[0, h * w / 2, 0]}><coneGeometry args={[r, h * w, 18]} /><meshStandardMaterial color="#ff8a2a" emissive="#ff6a10" emissiveIntensity={0.9} transparent opacity={0.92} /></mesh>
  <mesh position={[0, h * w * 0.36, 0]}><coneGeometry args={[r * 0.55, h * w * 0.68, 14]} /><meshStandardMaterial color="#ffd27a" emissive="#ffc04a" emissiveIntensity={0.9} /></mesh>
</group>; };
const Burner: React.FC<{ p: V; r?: number }> = ({ p, r = 0.22 }) => <group position={p}><Cyl p={[0, 0.015, 0]} r={r} h={0.03} c="#3a3b3e" rough={0.5} m={0.6} />
  {[0, 1, 2, 3].map((i) => <Box key={i} p={[Math.cos(i * Math.PI / 2) * r * 0.78, 0.045, Math.sin(i * Math.PI / 2) * r * 0.78]} s={[r * 0.4, 0.012, 0.02]} c="#1a1a1c" rot={[0, -i * Math.PI / 2, 0]} rad={0.003} />)}</group>;
const Puff: React.FC<{ p: V; k: number; s?: number; c?: string; op?: number }> = ({ p, k, s = 1, c = "#ffffff", op = 0.5 }) => k < 0.02 ? null :
  <mesh position={[p[0], p[1] + 0.2 * k * s, p[2]]} scale={s * (0.3 + 0.9 * k)}><sphereGeometry args={[0.09, 16, 12]} /><meshStandardMaterial color={c} transparent opacity={op * (1 - k)} roughness={1} depthWrite={false} /></mesh>;
const Tag: React.FC<{ tt: number; at: number; p: V; lines: string[]; bg?: string; fg?: string; w?: number; h?: number; rotY?: number }> = ({ tt, at, p, lines, bg = "#fbf8f1", fg = "#1e1813", w = 0.34, h = 0.2, rotY = 0 }) => {
  const map = useMemo(() => cardTex(lines, { bg, fg }), [lines.join("|")]), k = pop(tt, at);
  return <Pop k={k} p={p}><Sign p={[0, 0, 0]} map={map} w={w} h={h} rotY={rotY} /></Pop>;
};

// 0:21 · LA CAJA DE US$ 9: la caja de cartón abre sus solapas y los granos salen flotando DE A UNO, sueltos, con olor
export const E_box9: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.05, 0.55, 1.5], [0, 0.26, 0]), C([0.32, 0.5, 1.4], [0, 0.28, 0]), 9)}
  set={{ spot: [0, 0.3, 0] as V, spotK: 0.45, warm: 0.5 , bg: "#7a6a58"}}
  scene={(tt) => { const op = eio(tt, 1.1, 2.4), n = Math.round(eio(tt, 1.8, 7.5) * 46);
    return <>
      <Box p={[0, 0.15, 0]} s={[0.42, 0.3, 0.34]} c="#f5f1e6" r={0.8} rad={0.01} />
      <Box p={[0, 0.17, 0.172]} s={[0.17, 0.11, 0.004]} c={RED} r={0.7} rad={0.002} cast={false} />
      <group position={[0, 0.3, 0.17]} rotation={[lerp(0, 1.9, op), 0, 0]}><Box p={[0, 0, -0.08]} s={[0.42, 0.006, 0.16]} c="#ece6d6" rad={0.002} /></group>
      <group position={[0, 0.3, -0.17]} rotation={[lerp(0, -1.9, op), 0, 0]}><Box p={[0, 0, 0.08]} s={[0.42, 0.006, 0.16]} c="#ece6d6" rad={0.002} /></group>
      <Mound p={[0, 0.28, 0]} n={40} R={0.17} H={0.03} c={GOLD} />
      {Array.from({ length: n }, (_, i) => { const u = cl((tt - 1.8 - i * 0.12) / 3.4), a = i * 2.4, r = 0.1 + 0.42 * Math.sqrt(rnd(i)) * u; return <Grain key={i} s={2.1} c={GOLD} gloss={0.7} p={[r * Math.cos(a + tt * 0.25), 0.31 + 0.42 * u + 0.06 * Math.sin(tt * 1.1 + i), r * Math.sin(a + tt * 0.25) * 0.75]} rot={[tt * 0.5 + i, i, tt * 0.4]} />; })}
      <Pop k={pop(tt, 0.5)} p={[-0.45, 0.02, 0.12]}><Coin p={[0, 0.03, 0]} s={1.5} /><Coin p={[0.01, 0.06, 0.01]} s={1.5} /><Coin p={[-0.01, 0.09, 0]} s={1.5} /></Pop>
      <Tag tt={tt} at={0.8} p={[-0.45, 0.28, 0.12]} lines={["$9"]} bg={RED} fg="#fff" w={0.26} h={0.16} rotY={0.25} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={4.0} txt="EVERY GRAIN · SEPARATE" col={AMB} />} />;

// 0:38 · EL RECADO: calle de Osaka en maqueta; la nena camina con el bol hacia el único local con luz
export const E_shopwalk: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([-0.5, 0.62, 1.3], [-0.1, 0.12, 0]), C([0.28, 0.42, 1.0], [0.3, 0.14, 0]), 9)}
  set={{ spot: [0.5, 0.2, 0] as V, spotK: 0.55, warm: 0.85, bg: "#3d4a63" }}
  scene={(tt) => { const k = eio(tt, 0.4, 6.8), x = lerp(-0.72, 0.36, k);
    return <>
      <Box p={[0, 0.006, 0.1]} s={[2.4, 0.012, 0.42]} c="#8e8678" r={0.95} rad={0.002} cast={false} />
      {[["#7f8b7a", -0.8], ["#9a7d62", -0.46], ["#6f7f92", -0.12], ["#8d7560", 0.2]].map(([c, x2], i) => <Shop key={i} p={[x2 as number, 0, -0.26]} c={c as string} lit={0.12} />)}
      <Shop p={[0.56, 0, -0.26]} c="#a06a3a" lit={0.85 + 0.15 * Math.sin(tt * 1.4)} noren w={0.36} />
      <pointLight position={[0.56, 0.2, 0.05]} intensity={0.8} distance={1} color="#ffb060" />
      <Mini p={[x, 0.012, 0.12]} s={1.5} rotY={Math.PI / 2} bowl step={Math.sin(tt * 7) * (k < 1 ? 1 : 0)} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="MR. CHEN'S COUNTER" col={AMB} />} />;

// 1:07 · SIETE BOLES: caen de a uno en fila; seis con arroz, el séptimo tapado y brillando
export const E_sevenbowls: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([-0.75, 0.55, 1.5], [-0.3, 0.1, 0]), C([0.75, 0.5, 1.35], [0.45, 0.14, 0]), 9)}
  set={{ spot: [0.9, 0, 0] as V, spotK: 0.45, warm: 0.5 , bg: "#8c9aa3"}}
  scene={(tt) => <>{Array.from({ length: 7 }, (_, i) => { const at = 0.5 + i * 0.62, k = pop(tt, at), x = -0.9 + i * 0.3, last = i === 6;
    return <Pop key={i} k={k} p={[x, 0, (i % 2) * -0.05]} s={0.62}><Bowl p={[0, 0, 0]} c={last ? "#a8302a" : "#2c4a8a"} fillK={last ? 0 : 1} />
      {!last && <Mound p={[0, 0.13, 0]} n={18} R={0.14} H={0.06} s={1.4} />}
      {last && <group position={[0, 0.24, 0]} rotation={[0, tt, 0]}><Cyl p={[0, 0, 0]} r={0.22} r2={0.2} h={0.03} c="#c8a24a" m={0.6} rough={0.3} /><mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.035, 16, 12]} /><meshStandardMaterial color="#e9c868" metalness={0.6} roughness={0.3} /></mesh></group>}
    </Pop>; })}
    <pointLight position={[0.9, 0.5, 0.3]} intensity={tt > 4.3 ? 1 + 0.4 * Math.sin(tt * 2) : 0.001} distance={1.3} color="#ffd27a" />
  </>}
  over={(tt) => <Ink tt={tt} at={5.0} txt="NUMBER SEVEN IS LAST" col={AMB} />} />;

// 2:17 · EL LADRILLO: un ladrillo de arroz frío cae en la sartén roja, la espátula lo parte y la sartén se apaga
export const E_brick: F = ({ t, h }) => { const sp = useMemo(() => mk(128, 128, (g) => { g.fillStyle = "#e9e3d2"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(255,255,255,.85)`; g.save(); g.translate((i * 97) % 128, (i * 53) % 128); g.rotate(i); g.fillRect(-1, -5, 3, 10); g.restore(); } }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 0.75, 1.2], [0, 0.1, 0]), C([-0.25, 0.68, 1.1], [0, 0.1, 0]), 9)} set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.6 , bg: "#3f3a36"}}
    scene={(tt) => { const f = cl(pop(tt, 0.6, 5.2, 0.5)), hit = Math.max(0, Math.sin((tt - 2.2) * 3.2)) * (tt > 2.2 && tt < 6 ? 1 : 0), heat = lerp(1, 0.08, eio(tt, 1, 5)), crack = eio(tt, 2.4, 5.4);
      return <>
        <Pan p={[0, 0, 0]} s={1.15} heat={heat} />
        <Cyl p={[0, 0.098, 0]} r={0.42} h={0.003} c={col("#222", "#b5401a", heat)} e="#ff5a1a" ei={0.9 * heat} rough={0.5} cast={false} />
        <Box p={[-0.1 * crack - 0.02, lerp(0.75, 0.2, f), -0.02]} s={[0.26, 0.2, 0.34]} c="#fff" map={sp} r={0.85} rad={0.01} rot={[0, 0.15 + crack * 0.3, 0.1 * crack]} />
        <Box p={[0.14 * crack + 0.04, lerp(0.75, 0.2, f), 0.02]} s={[0.2, 0.2, 0.34]} c="#fff" map={sp} r={0.85} rad={0.01} rot={[0, 0.15 - crack * 0.35, -0.1 * crack]} />
        <group position={[0.02, 0.52 - 0.22 * hit, 0.02]} rotation={[0, 0.4, 0.15]}><Box p={[0, 0, 0]} s={[0.26, 0.012, 0.16]} c={STEEL} m={0.9} r={0.2} rad={0.003} rot={[0, 0, 1.3]} /><Cyl p={[0.03, 0.3, 0]} r={0.016} h={0.36} c="#3a2a1c" rough={0.7} /></group>
        {Array.from({ length: Math.round(crack * 26) }, (_, i) => <Grain key={i} s={1.8} c="#d8d2c0" p={[(rnd(i) - 0.5) * 0.7, 0.11, (rnd(i + 5) - 0.5) * 0.6]} rot={[0, i, Math.PI / 2]} />)}
      </>; }}
    over={(tt) => <Ink tt={tt} at={4.2} txt="THE PAN COOLS · GRAINS CRUSH" col="#ff8a7a" size={70} />} />; };

// 2:51 · LA BANDEJA: el arroz extendido; una revista aletea y el vapor se va de costado
export const E_tray: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([-0.3, 0.8, 1.15], [0, 0.08, 0]), C([0.25, 0.72, 1.1], [0, 0.08, 0]), 8)} set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.4 , bg: "#b38b64"}}
  scene={(tt) => { const f = Math.sin(tt * 5) * 0.55, gone = eio(tt, 2, 6.5);
    return <>
      <Box p={[0, 0.018, 0]} s={[1.05, 0.036, 0.62]} c={STEEL} m={0.85} r={0.25} rad={0.012} />
      {Array.from({ length: 130 }, (_, i) => <Grain key={i} s={1.3} p={[-0.47 + (i % 13) * 0.078 + 0.02 * rnd(i), 0.05 + 0.01 * rnd(i + 2), -0.25 + Math.floor(i / 13) * 0.056 + 0.02 * rnd(i + 3)]} rot={[Math.PI / 2, rnd(i) * 3, rnd(i + 1)]} />)}
      {[...Array(9)].map((_, i) => { const u = (tt * 0.5 + i / 9) % 1; return <Puff key={i} p={[-0.4 + i * 0.1 + 0.55 * u, 0.1, -0.15 + 0.3 * rnd(i)]} k={u} s={1.4 * (1 - gone * 0.75)} op={0.55 * (1 - 0.7 * gone)} />; })}
      <group position={[-0.72, 0.28, 0.12]} rotation={[0, 0.2, 0]}>
        <Box p={[0, -0.12, 0]} s={[0.012, 0.22, 0.012]} c="#f1d9c4" rad={0.003} />
        <group rotation={[0, f, 0]}><Box p={[0.11, 0.05, 0]} s={[0.22, 0.26, 0.004]} c="#d9483a" rad={0.002} /></group>
        <group rotation={[0, -f, 0]}><Box p={[-0.11, 0.05, 0]} s={[0.22, 0.26, 0.004]} c="#f0c84a" rad={0.002} /></group>
      </group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.0} txt="THE WATER LEAVING" col={AMB} />} />;

// 3:24 · LA REGLA DE LAS TRES VECES UNO: la bandeja entra en la heladera, y aparecen 1 hora, 1 día y 1 recalentada
export const E_onehour: F = ({ t, h }) => { const face = useMemo(() => mk(256, 256, (g) => { g.fillStyle = "#fbf3df"; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); g.fillStyle = "#3a2a18"; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; g.save(); g.translate(128, 128); g.rotate(a); g.fillRect(-3, -112, 6, i % 3 ? 14 : 24); g.restore(); } }), []);
  return <Hero t={t} h={h} d={1.35} mode="split" cam={(tt) => orbita(tt, C([-0.2, 0.58, 1.75], [0.05, 0.34, 0]), C([0.3, 0.55, 1.6], [0.05, 0.34, 0]), 9)} set={{ spot: [0.3, 0.2, 0] as V, spotK: 0.3, warm: 0.2 , bg: "#5e6a62"}}
    scene={(tt) => { const sw = eio(tt, 0.5, 3.2), inn = eio(tt, 1.2, 3.0), door = 1 - eio(tt, 3.2, 3.9);
      return <>
        <Box p={[0.5, 0.42, -0.12]} s={[0.5, 0.84, 0.46]} c="#ecebe6" r={0.3} rad={0.02} />
        <Box p={[0.5, 0.42, 0.11]} s={[0.44, 0.78, 0.01]} c="#5a6a78" e="#dfeeff" ei={0.3} rad={0.003} cast={false} />
        <group position={[0.27, 0.42, 0.12]} rotation={[0, -1.7 * door, 0]}><Box p={[0.24, 0, 0]} s={[0.48, 0.82, 0.03]} c="#f4f3ef" r={0.3} rad={0.015} /></group>
        <group position={[lerp(-0.42, 0.5, inn), 0.24 - 0.0 * inn, lerp(0.15, 0.03, inn)]} scale={[0.8, 0.8, 0.8]}><Box p={[0, 0, 0]} s={[0.38, 0.03, 0.28]} c={STEEL} m={0.85} r={0.25} rad={0.008} /><Mound p={[0, 0.02, 0]} n={26} R={0.13} H={0.02} /></group>
        <Dial p={[-0.5, 0.66, -0.1]} ang={-sw * 6.283} s={0.62} face={face} />
        <Tag tt={tt} at={3.9} p={[-0.52, 0.2, 0.2]} lines={["1 HOUR"]} bg="#2c4a8a" fg="#fff" w={0.3} h={0.15} rotY={0.25} />
        <Tag tt={tt} at={5.0} p={[-0.14, 0.2, 0.26]} lines={["1 DAY"]} bg={GOLD} w={0.3} h={0.15} rotY={0.1} />
        <Tag tt={tt} at={6.0} p={[0.24, 0.2, 0.32]} lines={["HEAT ONCE"]} bg={RED} fg="#fff" w={0.46} h={0.15} rotY={-0.08} />
      </>; }} />; };

// 3:56 · EL ALMIDÓN ES PEGAMENTO: granos gigantes que tiran y no se sueltan, hilos blancos que estiran
export const E_glue: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.42, 0.95], [0, 0.18, 0]), C([0.2, 0.4, 0.86], [0, 0.18, 0]), 8)} set={{ spot: [0, 0.1, 0] as V, spotK: 0.4, warm: 0.4 , bg: "#a9a093"}}
  scene={(tt) => { const pull = Math.abs(Math.sin(tt * 0.9)) * eio(tt, 0.6, 1.6), L = 0.34 + 0.34 * pull;
    return <>
      <Box p={[0, 0.016, 0]} s={[1.3, 0.032, 0.7]} c="#2a2c30" r={0.35} m={0.3} rad={0.008} />
      {[-1, 1].map((d, n) => <group key={n} position={[d * L * 0.5, 0.16 + 0.008 * Math.sin(tt * 1.3 + n), 0]} rotation={[0, 0, Math.PI / 2 + d * 0.06]} scale={5.5}><mesh castShadow><capsuleGeometry args={[0.018, 0.04, 8, 18]} /><meshPhysicalMaterial color={RICE} roughness={0.35} clearcoat={0.7} /></mesh></group>)}
      {Array.from({ length: 7 }, (_, i) => { const y = 0.1 + i * 0.022, sag = 0.018 * (1 + pull) * Math.sin(i * 1.4); return <mesh key={i} position={[0, y - sag, -0.05 + i * 0.017]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.011 - 0.0035 * pull, 0.011 - 0.0035 * pull, L, 10]} /><meshPhysicalMaterial color="#ffffff" roughness={0.25} transparent opacity={0.92} clearcoat={0.9} /></mesh>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.6} txt="LOOSE STARCH IS GLUE" col={AMB} />} />;

// 4:18 · CUATRO AGUAS: cuatro boles de vidrio de leche a clara; en el cuarto se ven los dedos
export const E_fourwaters: F = ({ t, h }) => <Hero t={t} h={h} d={1.28} mode="drop" cam={(tt) => orbita(tt, C([-0.55, 0.62, 1.3], [-0.05, 0.1, 0]), C([0.45, 0.55, 1.2], [0.1, 0.1, 0]), 8)} set={{ spot: [0.45, 0, 0] as V, spotK: 0.3, warm: 0.35 , bg: "#46505a"}}
  scene={(tt) => <>{[0, 1, 2, 3].map((i) => { const k = pop(tt, 0.5 + i * 0.85), mil = [1, 0.68, 0.34, 0.05][i], x = -0.72 + i * 0.48;
    return <Pop key={i} k={k} p={[x, 0, 0]} s={0.92}>
      <Cyl p={[0, 0.08, 0]} r={0.2} r2={0.15} h={0.16} c="#dff2fb" op={0.26} rough={0.08} seg={40} />
      <Cyl p={[0, 0.065, 0]} r={0.185} r2={0.146} h={0.12} c={col("#b5e2f6", "#ffffff", mil)} op={0.35 + 0.6 * mil} rough={0.15} seg={40} />
      <Mound p={[0, 0.012, 0]} n={26} R={0.12} H={0.03} s={1.2} />
      {i === 3 && tt > 4 && [0, 1, 2, 3].map((f) => <Cyl key={f} p={[-0.075 + f * 0.05, 0.1, 0.02 + 0.015 * Math.sin(tt * 2 + f)]} r={0.019} h={0.2} c="#f1d9c4" rough={0.6} />)}
    </Pop>; })}</>}
  over={(tt) => <Ink tt={tt} at={4.4} txt="BY THE FOURTH WATER" col={AMB} />} />;

// 4:47 · EL FRASCO: en el estante bajo una luz; una manito sube, tiembla y se escapa
export const E_jar: F = ({ t, h }) => <Hero t={t} h={h} d={1.3} ly={0.08} mode="blinds" cam={(tt) => orbita(tt, C([0.15, 0.42, 1.05], [0, 0.32, 0]), C([-0.2, 0.42, 0.95], [0, 0.34, 0]), 9)} set={{ spot: [0, 0.3, 0] as V, spotK: 0.8, warm: 0.9, bg: "#2a2622" }}
  scene={(tt) => { const up = eio(tt, 1.6, 3.2) * (1 - eio(tt, 4.2, 4.6)), lid = tt > 3.4 && tt < 4.3 ? 0.08 + 0.05 * Math.sin(tt * 18) : 0;
    return <>
      <Box p={[0, 0.2, 0]} s={[1.2, 0.04, 0.42]} c="#7a5634" r={0.7} rad={0.008} />
      <Jar p={[0, 0.22, 0]} s={1.1} lid={lid} />
      <group position={[0.24, lerp(0.02, 0.42, up), 0.15]} rotation={[0, 0, 0.8]}><Cyl p={[0, -0.25, 0]} r={0.05} h={0.45} c="#b24a3e" rough={0.85} /><mesh scale={[1, 1.2, 0.7]}><sphereGeometry args={[0.06, 20, 16]} /><meshStandardMaterial color="#f1d9c4" roughness={0.6} /></mesh>
        {[0, 1, 2, 3].map((i) => <mesh key={i} position={[-0.04 + i * 0.027, 0.075, 0]}><capsuleGeometry args={[0.012, 0.04, 6, 10]} /><meshStandardMaterial color="#f1d9c4" roughness={0.6} /></mesh>)}</group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={4.8} txt="NOBODY TOUCHED IT" col={AMB} />} />;

// 5:05 · DIEZ VECES EL FUEGO: la hornalla de casa al lado del anillo de restaurante; la columna diez veces más alta contra la regla
export const E_btu: F = ({ t, h }) => { const r = eio(1, 0, 1);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([-0.15, 0.6, 2.25], [0.1, 0.6, 0]), C([0.35, 0.55, 2.1], [0.1, 0.62, 0]), 9)} set={{ spot: [0.3, 0.2, 0] as V, spotK: 0.35, warm: 0.7, bg: "#1f1c1a" }}
    scene={(tt) => { const home = pop(tt, 0.5), big = eio(tt, 2.2, 5.0);
      return <>
        <Box p={[0, 0.02, 0]} s={[1.7, 0.04, 0.6]} c="#3a3b3e" r={0.4} m={0.4} rad={0.01} />
        <Burner p={[-0.45, 0.04, 0.05]} r={0.13} /><Burner p={[0.4, 0.04, 0.05]} r={0.22} />
        {[0, 1, 2, 3, 4].map((i) => <Flame key={i} p={[-0.45 + 0.07 * Math.cos(i * 1.25), 0.075, 0.05 + 0.07 * Math.sin(i * 1.25)]} h={0.12 * cl(home)} r={0.02} tt={tt} i={i} />)}
        {Array.from({ length: 11 }, (_, i) => <Flame key={i} p={[0.4 + 0.12 * Math.cos(i * 0.57), 0.075, 0.05 + 0.12 * Math.sin(i * 0.57)]} h={Math.max(0.05, 1.2 * big)} r={0.045} tt={tt} i={i + r} />)}
        <Box p={[0.05, 0.75, -0.3]} s={[0.05, 1.5, 0.02]} c="#efe8d6" r={0.7} rad={0.004} />
        {Array.from({ length: 11 }, (_, i) => <Box key={i} p={[0.05, 0.1 + i * 0.13, -0.285]} s={[0.05, i % 5 ? 0.006 : 0.012, 0.006]} c="#3a2a18" cast={false} rad={0.001} />)}
      </>; }}
    over={(tt) => <Ink tt={tt} at={5.2} txt="TEN TIMES THE FIRE" col="#ffb27a" />} />; };

// 5:21 · CUATRO TAZAS: la montaña apaga la sartén y se cuece en vapor; con dos tazas la sartén sigue roja y los granos saltan
export const E_fourcups: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.7, 1.25], [0, 0.12, 0]), C([0.28, 0.66, 1.15], [0, 0.12, 0]), 9.5)} set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.55 , bg: "#c9b79a"}}
  scene={(tt) => { const a = eio(tt, 0.5, 1.6), back = eio(tt, 4.4, 5.3), heat = back > 0.02 ? lerp(0.1, 1, back) : lerp(1, 0.1, a), big = 1 - back;
    return <>
      <Pan p={[0, 0, 0]} s={1.15} heat={heat} />
      <Cyl p={[0, 0.098, 0]} r={0.42} h={0.003} c={col("#222", "#b5401a", heat)} e="#ff5a1a" ei={0.9 * heat} rough={0.5} cast={false} />
      <Mound p={[0, 0.1, 0]} n={back > 0.5 ? 70 : 170} R={back > 0.5 ? 0.24 : 0.38} H={lerp(0.26, 0.05, back) * a} s={1.5} />
      {big > 0.1 && a > 0.3 && [...Array(10)].map((_, i) => { const u = (tt * 0.42 + i / 10) % 1; return <Puff key={i} p={[0.3 * Math.cos(i * 2.4), 0.2, 0.3 * Math.sin(i * 2.4)]} k={u} s={2} op={0.6 * big} />; })}
      {back > 0.5 && Array.from({ length: 12 }, (_, i) => <Grain key={i} s={1.7} c={GOLD} p={[0.22 * Math.cos(i * 2.4), 0.14 + Math.abs(Math.sin(tt * 3.6 + i)) * 0.1, 0.22 * Math.sin(i * 2.4)]} rot={[tt * 2, i, 0]} />)}
    </>; }}
  over={(tt) => <><Ink tt={tt} at={1.8} txt={tt < 4.4 ? "FOUR CUPS · STEAM" : "TWO CUPS · IT FRIES"} col={tt < 4.4 ? "#ff8a7a" : AMB} /></>} />;

// 5:57 · LA GOTA QUE BAILA: una gota corre sobre el hierro caliente, deja vapor y se va
export const E_bead: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.05, 0.5, 0.82], [0, 0.08, 0]), C([-0.2, 0.46, 0.78], [0, 0.08, 0]), 7.5)} set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.7, bg: "#262322" }}
  scene={(tt) => { const a = tt * 2.3, x = 0.22 * Math.sin(a) * Math.cos(a * 0.47), z = 0.16 * Math.sin(a * 0.73 + 1), s = 1 - eio(tt, 5.2, 6.8), wob = 1 + 0.2 * Math.sin(tt * 11);
    return <>
      <Pan p={[0, 0, 0]} s={1.1} heat={1} />
      <Cyl p={[0, 0.094, 0]} r={0.4} h={0.003} c="#3d2418" rough={0.35} m={0.7} cast={false} />
      {s > 0.04 && <mesh position={[x, 0.118, z]} scale={[s * wob, s * 0.72 / wob, s * wob]} castShadow><sphereGeometry args={[0.032, 24, 16]} /><meshPhysicalMaterial color="#d5eefa" roughness={0.05} transmission={0.4} clearcoat={1} /></mesh>}
      {[...Array(7)].map((_, i) => { const u = (tt * 0.8 + i / 7) % 1, a2 = (tt - u * 1.2) * 2.3; return <Puff key={i} p={[0.22 * Math.sin(a2) * Math.cos(a2 * 0.47), 0.12, 0.16 * Math.sin(a2 * 0.73 + 1)]} k={u} s={0.42} op={0.5 * s} />; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="DANCES LIKE A BEAD" col={AMB} />} />;

// 6:34 · DOS CUCHARAS: aceite (nada) y manteca (una cinta de olor tibia que sube y se enrosca)
export const E_smell: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.52, 1.05], [0, 0.28, 0]), C([0.25, 0.5, 0.95], [0.05, 0.3, 0]), 9)} set={{ spot: [0.3, 0, 0] as V, spotK: 0.4, warm: 0.75 , bg: "#7a6a58"}}
  scene={(tt) => { const n = Math.round(eio(tt, 1.6, 5.5) * 26);
    return <>
      {[[-0.34, "#f3d873", 0.55], [0.34, LARD, 0.9]].map(([x, c, rg], i) => <group key={i} position={[x as number, 0.05, 0]}>
        <Cyl p={[0, 0.0, 0]} r={0.11} r2={0.08} h={0.04} c={STEEL} m={0.9} rough={0.2} /><Cyl p={[0, 0.024, 0]} r={0.098} h={0.008} c={c as string} rough={rg as number} cast={false} />
        <Box p={[-0.27, 0.01, 0]} s={[0.34, 0.012, 0.03]} c={STEEL} m={0.9} r={0.2} rad={0.003} /></group>)}
      {Array.from({ length: n }, (_, i) => { const u = i / 26, y = 0.1 + u * 0.7, r = 0.05 + 0.06 * u, a = u * 11 + tt * 1.1; return <mesh key={i} position={[0.34 + r * Math.sin(a), y, r * Math.cos(a)]} scale={1 + 1.4 * u}><sphereGeometry args={[0.022, 12, 10]} /><meshStandardMaterial color="#ffb765" emissive="#ff8f3a" emissiveIntensity={0.5} transparent opacity={0.82 - 0.55 * u} depthWrite={false} /></mesh>; })}
      <Tag tt={tt} at={1.0} p={[-0.34, 0.32, 0]} lines={["OIL"]} bg="#f4f1ea" w={0.2} h={0.12} />
      <Tag tt={tt} at={1.5} p={[0.34, 0.92, 0]} lines={["LARD"]} bg={GOLD} w={0.22} h={0.13} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={5.4} txt="THE SMELL OF THE BOX" col={AMB} />} />;

// 7:18 · LA MAYONESA: los granos ruedan por un charco blanco y salen brillantes, uno por uno
export const E_mayo: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.66, 1.05], [0, 0.08, 0]), C([0.25, 0.6, 1.0], [0, 0.08, 0]), 8)} set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.4 , bg: "#8c9aa3"}}
  scene={(tt) => <>
    <Bowl p={[0, 0, 0]} s={2.1} c="#d9cfbd" fillK={0} />
    <mesh position={[0, 0.135, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 1]}><circleGeometry args={[0.32, 40]} /><meshPhysicalMaterial color="#fff6dc" roughness={0.2} clearcoat={1} /></mesh>
    {Array.from({ length: 34 }, (_, i) => { const u = cl((tt * 0.55 + i * 0.03) % 1.2 / 1.2), a = i * 2.4 + tt * 0.9, r = lerp(0.3, 0.08, u) * (0.75 + 0.35 * rnd(i)); return <Grain key={i} s={2.3} c={col(RICE, "#fff7df", u)} gloss={u} p={[r * Math.cos(a), 0.155 + 0.015 * Math.sin(tt * 3 + i), r * Math.sin(a)]} rot={[Math.PI / 2, 0, a]} />; })}
    <group position={[0.1 * Math.cos(tt * 1.3), 0.3, 0.1 * Math.sin(tt * 1.3)]} rotation={[0.5, tt * 1.3, 0.3]}><Ladle p={[0, 0, 0]} s={0.9} /></group>
  </>}
  over={(tt) => <Ink tt={tt} at={2.6} txt="COATS EVERY GRAIN" col={AMB} />} />;

// 7:53 · LA NUBE DE HUEVO: el huevo cae a la grasa y se infla; antes de cuajar, cae el arroz encima
export const E_eggcloud: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.15, 0.62, 1.05], [0, 0.14, 0]), C([-0.2, 0.58, 1.0], [0, 0.14, 0]), 8)} set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.65 , bg: "#3f3a36"}}
  scene={(tt) => { const pour = eio(tt, 0.4, 1.3), puff = cl(pop(tt, 1.3, 4, 0.5)), drop = cl(pop(tt, 4.3, 6, 0.55));
    return <>
      <Pan p={[0, 0, 0]} s={1.1} heat={1} />
      {tt < 1.6 && <Cyl p={[0, lerp(0.75, 0.42, pour), 0]} r={0.018} h={0.66} c={GOLD} rough={0.2} cast={false} />}
      {puff > 0.02 && <group position={[0, 0.11, 0]} scale={[puff, puff * (0.5 + 0.1 * Math.sin(tt * 2)), puff]}>{Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[0.17 * Math.cos(i * 1.05) * rnd(i + 2), 0.06, 0.17 * Math.sin(i * 1.05) * rnd(i + 2)]} castShadow><sphereGeometry args={[0.13, 20, 14]} /><meshStandardMaterial color={GOLD} roughness={0.55} /></mesh>)}<mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.28, 24, 16]} /><meshStandardMaterial color="#f1c460" roughness={0.6} /></mesh></group>}
      {drop > 0.02 && <group position={[0, lerp(0.72, 0.2, drop), 0]}><Mound p={[0, 0, 0]} n={70} R={0.26} H={0.13} s={1.5} /></group>}
    </>; }}
  over={(tt) => <Ink tt={tt} at={4.6} txt="RICE ON TOP · NOT BESIDE" col={AMB} size={76} />} />;

// 8:24 · PARA-PARA: un hilo de granos dorados cae como la arena y arma un cono perfecto
export const E_para: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.42, 1.2], [0, 0.34, 0]), C([0.25, 0.42, 1.1], [0, 0.32, 0]), 8)} set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.45, bg: "#37302a" }}
  scene={(tt) => { const g = eio(tt, 0.6, 6.5);
    return <>
      <Bowl p={[0, 0, 0]} s={1.5} c="#fbfaf5" fillK={0} />
      <mesh position={[0, 0.17, 0]}><coneGeometry args={[0.1 + 0.2 * g, 0.03 + 0.2 * g, 30]} /><meshStandardMaterial color={GOLD} roughness={0.8} /></mesh>
      {Array.from({ length: 46 }, (_, i) => { const u = (tt * 0.55 + i / 46) % 1; return <Grain key={i} s={1.8} c={GOLD} gloss={0.6} p={[0.02 * Math.sin(i * 3), 0.92 - 0.76 * u * u, 0.02 * Math.cos(i * 2)]} rot={[i + tt, i, 0]} />; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="PARA-PARA · LIKE SAND" col={AMB} />} />;

// 9:20 · LAS MANOS LISTAS: los boles chiquitos llegan de a uno y rodean la hornalla antes de prenderla
export const E_littlebowls: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([-0.28, 0.82, 1.15], [0, 0.04, 0]), C([0.3, 0.76, 1.08], [0, 0.04, 0]), 8)} set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.4 , bg: "#b38b64"}}
  scene={(tt) => { const I: [string, string][] = [["#2c4a8a", "#f1c460"], ["#a8302a", "#83c24e"], ["#ded5c4", "#d98a7a"], ["#2c4a8a", "#fbfaf5"], ["#a8302a", SOY], ["#ded5c4", "#efe0b0"]];
    return <>
      <Burner p={[0, 0.0, 0]} r={0.26} />
      {I.map(([c, f], i) => { const a = -Math.PI * 0.95 + i * Math.PI * 0.38, k = phys2(tt, 0.5 + i * 0.75); return <group key={i} position={[lerp(a < 0 ? -1.5 : 1.5, 0.5 * Math.cos(a), k), 0, lerp(0.5, 0.5 * Math.sin(a) * 0.8 + 0.04, k)]}><Bowl p={[0, 0, 0]} s={0.5} c={c} fill={f} /></group>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={5.2} txt="YOUR HANDS READY" col={AMB} />} />;
const phys2 = (tt: number, a: number) => Math.min(1.0, Math.max(0, eio(tt, a, a + 0.7) + 0.06 * Math.sin(Math.max(0, tt - a - 0.7) * 9) * Math.exp(-Math.max(0, tt - a - 0.7) * 4) * (tt > a + 0.7 ? 1 : 0)));

// 10:20 · BOMBITAS DE VAPOR: arvejas y zanahoria entran a la sartén y cada una revienta en una nube
export const E_steambomb: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.2, 0.68, 1.15], [0, 0.12, 0]), C([-0.2, 0.62, 1.08], [0, 0.12, 0]), 8)} set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.5 , bg: "#5e6a62"}}
  scene={(tt) => <><Pan p={[0, 0, 0]} s={1.15} heat={0.8} /><Mound p={[0, 0.1, 0]} n={70} R={0.34} H={0.03} s={1.5} c={GOLD} />
    {Array.from({ length: 11 }, (_, i) => { const at = 0.5 + i * 0.52, fall = eio(tt, at, at + 0.55), a = i * 2.4, r = 0.3 * rnd(i + 3) + 0.05, x = r * Math.cos(a), z = r * Math.sin(a), u = cl((tt - at - 0.55) / 1.4), c = [GRN, "#e77d2a", "#f1c43a"][i % 3];
      return tt < at ? null : <group key={i}><mesh position={[x, lerp(0.75, 0.15, fall), z]} castShadow><sphereGeometry args={[0.032, 18, 12]} /><meshStandardMaterial color={c} roughness={0.4} /></mesh>{u > 0 && <Puff p={[x, 0.15, z]} k={u} s={2.4} op={0.75} />}</group>; })}
  </>}
  over={(tt) => <Ink tt={tt} at={3.6} txt="LITTLE BOMBS OF STEAM" col={AMB} />} />;

// 10:53 · EL PLATITO: cuatro cucharitas llegan e inclinan su polvo en el mismo platito
export const E_dish: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([-0.15, 0.62, 1.15], [0, 0.14, 0]), C([0.2, 0.58, 1.05], [0, 0.14, 0]), 9)} set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.45 , bg: "#a9a093"}}
  scene={(tt) => <><Cyl p={[0, 0.025, 0]} r={0.2} r2={0.15} h={0.05} c="#fbfaf5" rough={0.25} />
    {[["SALT", "#ffffff"], ["SUGAR", "#fbf1d0"], ["WHITE PEPPER", "#e7dcc0"], ["STOCK", "#e6b56a"]].map(([n, c], i) => { const at = 0.5 + i * 1.5, k = eio(tt, at, at + 0.5), tip = eio(tt, at + 0.55, at + 0.95) * (1 - eio(tt, at + 1.1, at + 1.4)), a = i * 1.57 + 0.6, gone = eio(tt, at + 1.1, at + 1.55), R = lerp(lerp(1.1, 0.16, k), 1.1, gone);
      return <group key={i}>{k > 0.02 && gone < 0.98 && <group position={[R * Math.cos(a), 0.2 + 0.12 * (1 - k), R * Math.sin(a) * 0.7]} rotation={[0, -a, -1.3 * tip]}><Cyl p={[0, 0, 0]} r={0.07} r2={0.05} h={0.035} c={STEEL} m={0.9} rough={0.2} /><Box p={[0.16, 0.01, 0]} s={[0.22, 0.008, 0.024]} c={STEEL} m={0.9} r={0.2} rad={0.003} /><Cyl p={[0, 0.02, 0]} r={0.055} h={0.008} c={c} cast={false} /></group>}
        {tt > at + 0.7 && <Mound p={[0.05 * Math.cos(a), 0.05, 0.05 * Math.sin(a)]} n={16} R={0.06} H={0.018} c={c} s={0.45} />}
        <Tag tt={tt} at={at} p={[-0.56 + i * 0.37, 0.43, -0.25]} lines={[n]} bg="#fbf8f1" w={0.32} h={0.11} /></group>; })}
  </>}
  over={(tt) => <Ink tt={tt} at={6.8} txt="THE TAKEOUT TASTE" col={AMB} />} />;

// 11:12 · LA LATA QUE NADIE ADMITE: una lata detrás de cada mostrador, fila infinita que se pierde
export const E_tin: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.45, 0.28, 1.35], [0, 0.18, -0.9]), C([0.1, 0.28, 1.05], [0, 0.18, -1.1]), 7)} set={{ spot: [0, 0, -0.4] as V, spotK: 0.45, warm: 0.65, bg: "#2d2822" }}
  scene={(tt) => <>{Array.from({ length: 10 }, (_, i) => { const k = pop(tt, 0.4 + i * 0.32), z = 0.55 - i * 0.42;
    return <Pop key={i} k={k} p={[((i % 2) - 0.5) * 0.12, 0, z]}><Box p={[0, 0.06, 0]} s={[0.34, 0.12, 0.2]} c="#7a5634" rad={0.008} /><Cyl p={[0, 0.2, 0]} r={0.075} h={0.16} c="#c9b77a" rough={0.3} m={0.7} /><Cyl p={[0, 0.2, 0]} r={0.077} h={0.07} c="#a8302a" rough={0.6} cast={false} /><Cyl p={[0, 0.284, 0]} r={0.07} h={0.012} c={STEEL} m={0.9} rough={0.2} /></Pop>; })}</>}
  over={(tt) => <Ink tt={tt} at={3.0} txt="EVERY SHOP HAS ONE" col={AMB} />} />;

// 11:27 · EL DÍA DEL ARROZ: el sol cruza la ventana mientras la bandeja reposa y aparecen los boles
export const E_sunday: F = ({ t, h }) => <Hero t={t} h={h} d={1.12} mode="drop" cam={(tt) => orbita(tt, C([0, 0.42, 1.55], [0, 0.42, 0]), C([0.24, 0.42, 1.45], [0.05, 0.42, 0]), 9)} set={(tt: number) => ({ spot: [0, 0, 0] as V, spotK: 0.2, warm: lerp(0.15, 0.9, cl(tt / 7)) })}
  scene={(tt) => { const k = eio(tt, 0.5, 7), a = lerp(Math.PI * 0.95, Math.PI * 0.08, k);
    return <>
      <Box p={[0, 0.6, -0.42]} s={[1.35, 0.72, 0.03]} c={col("#a8d2f0", "#f4b070", k)} e="#ffffff" ei={0.25} rad={0.005} cast={false} />
      <mesh position={[0.56 * Math.cos(a), 0.45 + 0.42 * Math.sin(a), -0.39]}><circleGeometry args={[0.1, 32]} /><meshStandardMaterial color="#fff2c8" emissive="#ffd27a" emissiveIntensity={1.1} /></mesh>
      <Box p={[0, 0.6, -0.4]} s={[1.4, 0.04, 0.04]} c="#7a5634" rad={0.006} cast={false} /><Box p={[0, 0.6, -0.4]} s={[0.04, 0.78, 0.04]} c="#7a5634" rad={0.006} cast={false} />
      <Box p={[0, 0.02, 0.02]} s={[0.78, 0.03, 0.45]} c={STEEL} m={0.85} r={0.25} rad={0.01} />
      <Mound p={[0, 0.04, 0.02]} n={80} R={0.3} H={0.04} s={1.25} />
      {[0, 1, 2].map((i) => <Pop key={i} k={pop(tt, 5 + i * 0.5)} p={[-0.5 + i * 0.5, 0, 0.42]}><Bowl p={[0, 0, 0]} s={0.42} c={["#2c4a8a", "#a8302a", "#ded5c4"][i]} fill={["#f1c460", "#83c24e", "#fbfaf5"][i]} /></Pop>)}
    </>; }}
  over={(tt) => <Ink tt={tt} at={1.5} txt={tt < 5 ? "MORNING · WASH AND DRY" : "DINNER · LITTLE BOWLS"} col={AMB} />} />;

// 12:25 · LLUVIA SOBRE CHAPA: chapa ondulada en corte; cada gota es un grano que salta sobre la sartén
export const E_rain: F = ({ t, h }) => <Hero t={t} h={h} d={1.22} ly={-0.1} mode="split" cam={(tt) => orbita(tt, C([0.1, 0.46, 1.5], [0, 0.34, 0]), C([-0.22, 0.46, 1.4], [0, 0.34, 0]), 8)} set={{ spot: [0, 0, 0] as V, spotK: 0.25, warm: 0.2, bg: "#59656f" }}
  scene={(tt) => <><Pan p={[0, 0, 0.1]} s={0.9} heat={0.9} /><Mound p={[0, 0.08, 0.1]} n={60} R={0.28} H={0.03} s={1.4} c={GOLD} />
    {Array.from({ length: 16 }, (_, i) => <Grain key={i} s={1.6} c={GOLD} p={[0.3 * rnd(i) - 0.15, 0.1 + Math.abs(Math.sin(tt * (3 + rnd(i + 2)) + i)) * 0.14, 0.1 + 0.3 * rnd(i + 7) - 0.15]} rot={[tt * 2 + i, i, 0]} />)}
    <group position={[0, 0.72, -0.02]} rotation={[-0.32, 0, 0]}>{Array.from({ length: 20 }, (_, i) => <mesh key={i} position={[-1 + i * 0.105, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.055, 0.055, 0.9, 12, 1, true, -Math.PI / 2, Math.PI]} /><meshStandardMaterial color="#9fa5ab" metalness={0.8} roughness={0.38} side={THREE.DoubleSide} /></mesh>)}</group>
    {Array.from({ length: 26 }, (_, i) => { const u = (tt * 1.1 + rnd(i)) % 1; return <mesh key={i} position={[-0.9 + 1.8 * rnd(i + 5), 1.5 - 0.72 * u, -0.2 + 0.4 * rnd(i + 2)]}><capsuleGeometry args={[0.005, 0.05, 4, 8]} /><meshStandardMaterial color="#d8e8f6" transparent opacity={0.8} /></mesh>; })}
  </>}
  over={(tt) => <Ink tt={tt} at={2.8} txt="DRY RICE SOUNDS LIKE RAIN" col={AMB} size={74} />} />;

// 13:46 · SE ESTÁ DESPERTANDO: granos azules de frío se entibian de a uno hasta el dorado y se desperezan
export const E_wake: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 0.52, 0.95], [0, 0.1, 0]), C([-0.2, 0.5, 0.9], [0, 0.1, 0]), 7)} set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.4 , bg: "#46505a"}}
  scene={(tt) => <><Pan p={[0, 0, 0]} s={1.05} heat={0.55} />
    {Array.from({ length: 40 }, (_, i) => { const a = i * 2.4, r = 0.32 * Math.sqrt(rnd(i)), k = eio(tt, 0.8 + rnd(i + 3) * 4.6, 1.6 + rnd(i + 3) * 4.6); return <Grain key={i} s={2.1} c={col(COLD, GOLD, k)} gloss={0.3 + 0.5 * k} p={[r * Math.cos(a), 0.115 + k * 0.012 * Math.abs(Math.sin(tt * 3 + i)), r * Math.sin(a)]} rot={[Math.PI / 2, 0, a + 0.4 * k * Math.sin(tt * 2 + i)]} />; })}
  </>}
  over={(tt) => <Ink tt={tt} at={2.6} txt="IT'S JUST WAKING UP" col={AMB} />} />;

// 14:18 · LA COLINA: el bol se da vuelta y queda la colinita; al lado el montón pierde calor por todos lados
export const E_hill: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([-0.15, 0.55, 1.3], [0, 0.12, 0]), C([0.2, 0.5, 1.2], [0, 0.12, 0]), 9)} set={{ spot: [0.4, 0, 0] as V, spotK: 0.4, warm: 0.55 , bg: "#c9b79a"}}
  scene={(tt) => { const lift = eio(tt, 1.2, 2.1), k = eio(tt, 3, 8);
    return <>
      <Cyl p={[-0.45, 0.012, 0]} r={0.3} h={0.024} c="#fbfaf5" rough={0.25} /><Cyl p={[0.42, 0.012, 0]} r={0.3} h={0.024} c="#fbfaf5" rough={0.25} />
      <Mound p={[-0.45, 0.025, 0]} n={110} R={0.25} H={0.09} s={1.5} c={GOLD} />
      <mesh position={[0.42, 0.025, 0]} scale={[1, 0.9, 1]}><sphereGeometry args={[0.19, 32, 20, 0, 6.283, 0, Math.PI / 2]} /><meshStandardMaterial color={GOLD} roughness={0.75} /></mesh>
      <Mound p={[0.42, 0.09, 0]} n={70} R={0.16} H={0.09} s={1.15} c={GOLD} />
      <group position={[0.42, lerp(0.15, 0.85, lift), 0]} rotation={[0, 0, 0]}><Bowl p={[0, 0.2, 0]} s={1.0} c="#2c4a8a" fillK={0} /></group>
      {[...Array(9)].map((_, i) => { const u = (tt * 0.8 + i / 9) % 1; return tt > 2.2 && <Puff key={i} p={[-0.45 + 0.28 * Math.cos(i * 2.2) * (1 - 0.2 * k), 0.1, 0.25 * Math.sin(i * 2.2)]} k={u} s={1.1} op={0.5} />; })}
      {[0, 1, 2].map((i) => { const u = (tt * 0.42 + i / 3) % 1; return tt > 2.2 && <Puff key={i} p={[0.42, 0.25, 0]} k={u} s={0.9} op={0.55} />; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={4} txt="LESS SKIN · STAYS HOT" col={AMB} />} />;

// 14:44 · CUATRO CENTAVOS: la tacita de caldo claro con cebolla verde; cuatro centavos se apilan al lado
export const E_soup: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.2, 0.5, 0.95], [0, 0.13, 0]), C([-0.2, 0.47, 0.88], [0, 0.13, 0]), 8.5)} set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.7 , bg: "#7a6a58"}}
  scene={(tt) => <><Cyl p={[-0.12, 0.09, 0]} r={0.16} r2={0.11} h={0.18} c="#2c4a8a" rough={0.2} seg={40} /><Cyl p={[-0.12, 0.18, 0]} r={0.145} h={0.005} c="#d9b276" rough={0.08} cast={false} />
    {Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[-0.12 + 0.11 * Math.cos(i * 2.4 + tt * 0.3) * Math.sqrt(rnd(i)), 0.185, 0.11 * Math.sin(i * 2.4 + tt * 0.3) * Math.sqrt(rnd(i))]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.012, 0.0045, 8, 14]} /><meshStandardMaterial color={GRN} /></mesh>)}
    <Steam p={[-0.12, 0.2, 0]} t={tt} k={0.9} s={0.5} />
    {[0, 1, 2, 3].map((i) => <Pop key={i} k={pop(tt, 2 + i * 0.7)} p={[0.34, 0.02 + i * 0.024, 0.03]}><Coin p={[0, 0, 0]} s={1.3} /></Pop>)}
  </>}
  over={(tt) => <Ink tt={tt} at={5.2} txt="ABOUT FOUR CENTS" col={AMB} />} />;

// 15:12 · LA RUEDA DE LA SEMANA: una bandeja giratoria; cada día se ilumina UN solo ingrediente
export const E_week: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.75, 1.25], [0, 0.08, 0]), C([0.24, 0.7, 1.15], [0, 0.08, 0]), 9)} set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.5 , bg: "#8c9aa3"}}
  scene={(tt) => { const rot = eio(tt, 0.6, 2.4) * 2.1 + eio(tt, 3.2, 4.8) * 2.1 + eio(tt, 5.6, 7.2) * 2.1;
    return <group rotation={[0, rot, 0]}><Cyl p={[0, 0.02, 0]} r={0.56} h={0.04} c="#a87a4a" rough={0.5} seg={60} />
      {[["#f0e6c8", "#efe8c6"], ["#f2894f", "#e8764a"], ["#b7c84a", "#94ae3a"]].map(([b, c], i) => { const a = i * 2.1 + 1.57; return <group key={i} position={[0.36 * Math.cos(a), 0.04, 0.36 * Math.sin(a)]}><Bowl p={[0, 0, 0]} s={0.75} c="#fbfaf5" fill={b} />{Array.from({ length: 9 }, (_, j) => <mesh key={j} position={[0.12 * Math.cos(j * 2.4) * rnd(j), 0.135, 0.12 * Math.sin(j * 2.4) * rnd(j)]}><sphereGeometry args={[0.022, 12, 10]} /><meshStandardMaterial color={c} roughness={0.5} /></mesh>)}</group>; })}
    </group>; }}
  over={(tt) => <Ink tt={tt} at={1.2} txt={tt < 3.2 ? "MONDAY · GARLIC" : tt < 5.6 ? "WEDNESDAY · SALMON" : "ONE AT A TIME"} col={AMB} />} />;

// 16:18 · LA CANASTA: la canasta de bambú colgada en lo más fresco; la gallina espera lo que sobre
export const E_basket: F = ({ t, h }) => <Hero t={t} h={h} d={1.4} ly={0.14} mode="blinds" cam={(tt) => orbita(tt, C([0.15, 0.42, 1.2], [0, 0.4, 0]), C([-0.18, 0.42, 1.1], [0, 0.4, 0]), 8)} set={{ spot: [0, 0.4, 0] as V, spotK: 0.55, warm: 0.7, bg: "#2d2822" }}
  scene={(tt) => { const sw = 0.05 * Math.sin(tt * 1.1), peck = Math.max(0, Math.sin(tt * 3.2));
    return <>
      <Cyl p={[0, 1.0, 0]} r={0.007} h={0.5} c="#7a5634" rough={0.9} />
      <group position={[0, 0.74, 0]} rotation={[sw, 0, sw * 0.7]}>
        {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0, -i * 0.024, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.18 - i * 0.008, 0.011, 8, 40]} /><meshStandardMaterial color={i % 2 ? "#b9925a" : "#a9804a"} roughness={0.9} /></mesh>)}
        <mesh position={[0, 0.03, 0]} scale={[1, 0.28, 1]}><sphereGeometry args={[0.2, 26, 16]} /><meshStandardMaterial color="#e8e0cc" roughness={0.95} /></mesh>
      </group>
      <group position={[0.34, 0, 0.25]} rotation={[0, -0.8, 0]}><mesh position={[0, 0.1, 0]} scale={[1.2, 1, 0.8]}><sphereGeometry args={[0.1, 22, 16]} /><meshStandardMaterial color="#c48a4a" roughness={0.9} /></mesh>
        <group position={[0.1, 0.17, 0]} rotation={[0, 0, -0.75 * peck]}><mesh position={[0.05, 0.03, 0]}><sphereGeometry args={[0.05, 18, 14]} /><meshStandardMaterial color="#c48a4a" roughness={0.9} /></mesh><mesh position={[0.11, 0.03, 0]} rotation={[0, 0, -1.57]}><coneGeometry args={[0.018, 0.05, 10]} /><meshStandardMaterial color="#e9b23a" /></mesh><mesh position={[0.05, 0.09, 0]}><sphereGeometry args={[0.022, 12, 10]} /><meshStandardMaterial color="#c8302a" /></mesh></group></group>
      {[0, 1, 2, 3, 4].map((i) => <Grain key={i} s={1.5} p={[0.5 + 0.03 * i, 0.012, 0.25 + 0.07 * rnd(i)]} rot={[Math.PI / 2, i, 0]} />)}
    </>; }}
  over={(tt) => <Ink tt={tt} at={3} txt="OSAKA · NO REFRIGERATOR" col={AMB} />} />;

// 17:22 · WOK SOBRE HORNALLA PLANA: en corte, el wok toca sólo un puntito; la sartén pesada toca con todo el fondo
export const E_wok: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.68, 1.3], [0, 0.1, 0]), C([0.2, 0.62, 1.2], [0, 0.1, 0]), 8.5)} set={{ spot: [0, 0, 0] as V, spotK: 0.25, warm: 0.6 , bg: "#3f3a36"}}
  scene={(tt) => { const g = eio(tt, 1.2, 3.4);
    return <>
      <Box p={[0, 0.05, 0]} s={[1.9, 0.1, 0.6]} c="#17171a" r={0.2} m={0.3} rad={0.01} />
      <Cyl p={[-0.5, 0.102, 0]} r={0.26} h={0.003} c={col("#1a1a1c", "#ff5a1a", g)} e="#ff4a10" ei={0.2 * g} cast={false} /><Cyl p={[0.5, 0.102, 0]} r={0.26} h={0.003} c={col("#1a1a1c", "#ff5a1a", g)} e="#ff4a10" ei={0.6 * g} cast={false} />
      <group position={[-0.5, 0.3, 0]}><mesh rotation={[Math.PI, 0, 0]}><sphereGeometry args={[0.36, 42, 16, 0, Math.PI * 2, 0, 1.1]} /><meshStandardMaterial color={IRON} metalness={0.6} roughness={0.42} side={THREE.DoubleSide} /></mesh></group>
      <Pop k={g} p={[-0.5, 0.102, 0.0]}><Cyl p={[0, 0.005, 0]} r={0.04} h={0.006} c="#ffc04a" e="#ff9a2a" ei={1.6} cast={false} /></Pop>
      <Pan p={[0.5, 0.1, 0]} s={0.82} heat={g} />
      <Pop k={g} p={[0.5, 0.102, 0.0]}><Cyl p={[0, 0.0, 0]} r={0.3} h={0.004} c="#ffc04a" e="#ff9a2a" ei={1.1} cast={false} /></Pop>
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.4} txt="FLAT STOVE · FLAT PAN" col={AMB} />} />;

// 18:47 · EN LA PARED DE LA SARTÉN: el arroz sostenido a un lado; la cuchara vierte sobre el metal desnudo y sale el humo
export const E_pourwall: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.12, 0.92, 0.72], [0, 0.1, 0]), C([-0.18, 0.78, 0.78], [0, 0.1, 0]), 8.5)} set={{ spot: [0.2, 0, 0] as V, spotK: 0.6, warm: 0.85, bg: "#2d2622" }}
  scene={(tt) => { const pour = eio(tt, 1.6, 2.2) * (1 - eio(tt, 3.2, 3.6)), l = eio(tt, 1.9, 3.3), sm2 = eio(tt, 2.2, 3.4);
    return <group rotation={[0, 0, 0.12]}>
      <Pan p={[0, 0, 0]} s={1.3} heat={1} />
      <Mound p={[-0.2, 0.11, 0]} n={120} R={0.25} H={0.11} s={1.6} c={GOLD} />
      <Ladle p={[0.02, 0.2, 0.02]} rot={[1.2, 0.2, -0.5]} s={1.2} />
      <group position={[0.34, 0.4 + 0.3 * (1 - pour), 0.06]} rotation={[0.2, 0, 1.0 * pour]}><Cyl p={[0, 0, 0]} r={0.075} r2={0.05} h={0.04} c={STEEL} m={0.9} rough={0.2} /><Cyl p={[0, 0.02, 0]} r={0.06} h={0.01} c={SOY} cast={false} /><Box p={[0.2, 0.01, 0]} s={[0.28, 0.008, 0.026]} c={STEEL} m={0.9} r={0.2} rad={0.003} /></group>
      {pour > 0.2 && <Cyl p={[0.28, 0.25, 0.06]} r={0.008} h={0.3} c={SOY} rough={0.2} cast={false} />}
      <mesh position={[0.28, 0.11, 0.06]} rotation={[-Math.PI / 2, 0, 0]} scale={[l, l * 0.75, 1]}><circleGeometry args={[0.14, 30]} /><meshPhysicalMaterial color="#160a04" roughness={0.1} clearcoat={1} /></mesh>
      {[...Array(14)].map((_, i) => { const u = (tt * 0.7 + i / 14) % 1; return <Puff key={i} p={[0.28 + 0.05 * Math.sin(i * 3), 0.13 + u * 0.6, 0.06 + 0.05 * Math.cos(i * 2)]} k={u} s={0.85 * sm2 + 0.001} c="#d8c8b0" op={0.3 * sm2} />; })}
    </group>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="NOT ON THE RICE" col={AMB} />} />;

// 19:06 · HASTA LA VEREDA: la cinta de olor sale por la puerta y los tres hombres se paran y giran la cabeza
export const E_street: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.15, 0.55, 1.45], [0.3, 0.16, 0]), C([0.55, 0.5, 1.3], [0.45, 0.16, 0]), 9)} set={{ spot: [0.5, 0.1, 0] as V, spotK: 0.55, warm: 0.85, bg: "#3d4a63" }}
  scene={(tt) => { const n = Math.round(eio(tt, 0.6, 5.0) * 42), turn = (i: number) => eio(tt, 3.2 + i * 0.6, 3.8 + i * 0.6), stop = (i: number) => eio(tt, 3 + i * 0.6, 3.5 + i * 0.6);
    return <>
      <Box p={[0.4, 0.006, 0.12]} s={[2.6, 0.012, 0.5]} c="#8e8678" r={0.95} rad={0.002} cast={false} />
      <Shop p={[-0.2, 0, -0.26]} c="#a06a3a" lit={1} noren w={0.42} />
      {[["#6f7f92", 0.24], ["#7f8b7a", 0.58], ["#9a7d62", 0.92]].map(([c, x], i) => <Shop key={i} p={[x as number, 0, -0.26]} c={c as string} lit={0.1} />)}
      {Array.from({ length: n }, (_, i) => { const u = i / 42, x = -0.2 + 1.35 * u, y = 0.2 + 0.05 * Math.sin(u * 14 + tt * 1.2), z = 0.02 + 0.13 * u; return <mesh key={i} position={[x, y, z]} scale={1 + 1.2 * u}><sphereGeometry args={[0.024, 12, 10]} /><meshStandardMaterial color="#d9a463" emissive="#b8743a" emissiveIntensity={0.4} transparent opacity={0.7 - 0.38 * u} depthWrite={false} /></mesh>; })}
      {[0, 1, 2].map((i) => { const st = stop(i), x = 0.2 + i * 0.32 + 0.15 * (1 - st) * (1 - Math.min(1, tt / 3)); return <Mini key={i} p={[x, 0.012, 0.3]} s={1.7} c={["#3a4a68", "#5a5046", "#46515c"][i]} rotY={Math.PI / 2} head={-1.6 * turn(i)} step={st < 1 ? Math.sin(tt * 7 + i) : 0} />; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={5} txt="GROWN MEN STOPPED" col={AMB} />} />;

// 19:53 · DOS Y AFUERA: la sartén da un golpe de muñeca, el arroz vuela y cae: una, dos, y al plato
export const E_onespoon: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([-0.2, 0.6, 1.3], [0, 0.24, 0]), C([0.22, 0.56, 1.22], [0, 0.26, 0]), 7.5)} set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.7 , bg: "#b38b64"}}
  scene={(tt) => { const toss = (a: number) => { const u = cl((tt - a) / 1.0); return 4 * u * (1 - u); }, h2 = Math.max(toss(1.6), toss(3.4)), tilt = 0.26 * Math.max(Math.sin(cl((tt - 1.6) / 0.5) * Math.PI), Math.sin(cl((tt - 3.4) / 0.5) * Math.PI));
    return <group rotation={[0, 0, tilt]}>
      <Pan p={[0, 0, 0]} s={1.1} heat={0.9} /><Mound p={[0, 0.1, 0]} n={40} R={0.26} H={0.03} s={1.5} c={GOLD} />
      {Array.from({ length: 50 }, (_, i) => { const a = i * 2.4, r = 0.28 * Math.sqrt(rnd(i)); return <Grain key={i} s={1.7} c={GOLD} gloss={0.6} p={[r * Math.cos(a), 0.12 + h2 * (0.42 + 0.2 * rnd(i + 3)), r * Math.sin(a)]} rot={[h2 * 3 + i, i, h2 * 2]} />; })}
      <Pop k={pop(tt, 2.7)} p={[-0.5, 0.42, 0.1]} s={1}><Coin p={[0, 0, 0]} s={0.001} /></Pop>
    </group>; }}
  over={(tt) => <Ink tt={tt} at={1.7} txt={tt < 3.4 ? "ONE" : tt < 5 ? "TWO" : "AND THAT'S ALL"} col={AMB} size={tt < 5 ? 130 : 84} />} />;

// 20:55 · EL ESTACIONAMIENTO: el local de Mr. Chen se hunde en el asfalto y aparecen las líneas; queda la nena con su bol
export const E_parking: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 0.55, 1.3], [0.05, 0.16, 0]), C([-0.1, 0.5, 1.2], [0.05, 0.16, 0]), 7.5)} set={(tt: number) => ({ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.95 - 0.5 * eio(tt, 1, 5), bg: "#34363d" })}
  scene={(tt) => { const sink = eio(tt, 1.2, 4.4), lines = eio(tt, 3.4, 5.6);
    return <>
      <Box p={[0, 0.006, 0.05]} s={[2.2, 0.012, 1.05]} c={col("#8e8678", "#3f4145", lines)} r={0.95} rad={0.002} cast={false} />
      <group position={[0, -0.45 * sink, 0]}>{sink < 0.98 && <Shop p={[0, 0, -0.2]} c="#a06a3a" lit={1 - sink} noren w={0.46} />}</group>
      {[...Array(5)].map((_, i) => <Pop key={i} k={cl((lines - i * 0.15) * 2.5)} p={[-0.6 + i * 0.3, 0.014, -0.05]}><Box p={[0, 0, 0]} s={[0.02, 0.002, 0.42]} c="#f0efe9" r={0.8} rad={0.001} cast={false} /></Pop>)}
      <Mini p={[0.2, 0.012, 0.28]} s={1.7} rotY={-1.2} bowl />
    </>; }}
  over={(tt) => <Ink tt={tt} at={4.8} txt="NINE YEARS OLD AGAIN" col={AMB} />} />;
