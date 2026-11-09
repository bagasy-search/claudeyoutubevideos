// sk8pk · los componentes ÚNICOS del bife de US$ 8 (uno por minuto; ninguno repite sk8pj, so29 ni ssl29).
// La idea central: las fibras son SOGAS; la cebolla, tijeritas; el cuchillo las deja cortas. Todo en maqueta sobre la mesada.
import React, { useMemo } from "react";
import * as THREE from "three";
import { F, Hero, C, lerp, pop, Pop, Ink, cardTex, Pan, Bowl, Sign, Coin, cl, eio, orbita, Box, Cyl, AMB, V } from "./hk";
import { mk } from "./casa3d";

const STEEL = "#d0d5db", RED = "#c8402a", GOLD = "#ecb64c", SOY = "#3a1f0f", GRN = "#7cb350", WOOD = "#8a6238", MEAT = "#a2362f", GRAY = "#8d7a72", CRUST = "#4f2a16", ONI = "#d8a24a", ONW = "#f6f0dc", SKIN = "#f1d9c4";
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();

// tapa del bife: fibras en UNA dirección (x) y, si fat, hilos blancos de grasa
const TX: Record<string, THREE.Texture> = {};
const steakTex = (kind: "cheap" | "wagyu" | "gray") => TX[kind] || (TX[kind] = mk(320, 200, (g) => {
  g.fillStyle = kind === "gray" ? "#8d7a72" : kind === "wagyu" ? "#c0534a" : "#a2362f"; g.fillRect(0, 0, 320, 200);
  for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(60,10,10,${0.12 + 0.2 * rnd(i)})`; g.lineWidth = 1 + 2 * rnd(i + 2); g.beginPath(); const y = rnd(i + 9) * 200; g.moveTo(0, y); g.bezierCurveTo(100, y + 4 * rnd(i), 220, y - 4 * rnd(i + 1), 320, y + 2); g.stroke(); }
  if (kind !== "gray") { const n = kind === "wagyu" ? 120 : 16; for (let i = 0; i < n; i++) { g.strokeStyle = `rgba(255,246,232,${kind === "wagyu" ? 0.85 : 0.6})`; g.lineWidth = kind === "wagyu" ? 2 + 3 * rnd(i) : 1.2; g.beginPath(); let x = rnd(i + 5) * 320, y = rnd(i + 6) * 200; g.moveTo(x, y); for (let j = 0; j < 5; j++) { x += 18 * rnd(i + j) - 4; y += 16 * (rnd(i + j + 3) - 0.5); g.lineTo(x, y); } g.stroke(); } }
}));
// bife: cruda → sellada con `crust` (0-1); `kind` manda la textura
const Steak: React.FC<{ p: V; s?: number; rot?: V; w?: number; d?: number; th?: number; crust?: number; kind?: "cheap" | "wagyu" | "gray" }> = ({ p, s = 1, rot = [0, 0, 0], w = 0.62, d = 0.38, th = 0.075, crust = 0, kind = "cheap" }) =>
  <group position={p} rotation={rot} scale={s}>
    <Box p={[0, 0, 0]} s={[w, th, d]} c={col(kind === "gray" ? GRAY : MEAT, CRUST, crust)} r={0.55} rad={0.018} />
    <mesh position={[0, th / 2 + 0.0015, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w * 0.95, d * 0.92]} /><meshStandardMaterial map={steakTex(kind)} roughness={0.5} /></mesh>
    {crust > 0.02 && <mesh position={[0, th / 2 + 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w * 0.97, d * 0.95]} /><meshStandardMaterial color={CRUST} roughness={0.55} transparent opacity={0.92 * crust} /></mesh>}
  </group>;
const Onion: React.FC<{ p: V; s?: number; half?: boolean }> = ({ p, s = 1, half }) => <group position={p} scale={s}>
  <mesh scale={[1, 0.86, 1]} castShadow><sphereGeometry args={[0.1, 28, 20, 0, Math.PI * 2, half ? Math.PI / 2 : 0, half ? Math.PI / 2 : Math.PI]} /><meshPhysicalMaterial color={ONI} roughness={0.42} clearcoat={0.5} /></mesh>
  {half ? <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.1, 28]} /><meshStandardMaterial color={ONW} roughness={0.5} /></mesh> : <mesh position={[0, 0.09, 0]}><coneGeometry args={[0.018, 0.06, 10]} /><meshStandardMaterial color="#b8894a" /></mesh>}
</group>;
const Knife: React.FC<{ p: V; rot?: V; s?: number; dull?: boolean }> = ({ p, rot = [0, 0, 0], s = 1, dull }) => <group position={p} rotation={rot} scale={s}>
  <Box p={[0, 0, 0]} s={[0.42, 0.075, 0.008]} c={dull ? "#8f8f8a" : STEEL} m={0.9} r={dull ? 0.6 : 0.16} rad={0.002} />
  <Box p={[0.31, 0.012, 0]} s={[0.22, 0.052, 0.03]} c="#3a2a1c" r={0.7} rad={0.008} />
</group>;
const Scissors: React.FC<{ p: V; s?: number; open?: number; rotY?: number }> = ({ p, s = 1, open = 0.3, rotY = 0 }) => <group position={p} rotation={[0, rotY, 0]} scale={s}>
  {[-1, 1].map((d) => <group key={d} rotation={[0, 0, d * open]}><Box p={[0.075, 0, d * 0.002]} s={[0.15, 0.016, 0.003]} c={STEEL} m={0.9} r={0.18} rad={0.001} />
    <mesh position={[-0.05, -d * 0.01, 0]}><torusGeometry args={[0.022, 0.006, 8, 18]} /><meshStandardMaterial color={RED} roughness={0.5} /></mesh></group>)}
</group>;
const Mini: React.FC<{ p: V; c?: string; s?: number; rotY?: number; head?: number; lean?: number }> = ({ p, c = RED, s = 1, rotY = 0, head = 0, lean = 0 }) => <group position={p} rotation={[0, rotY, lean]} scale={s}>
  <Cyl p={[0, 0.06, 0]} r={0.022} r2={0.04} h={0.11} c={c} rough={0.75} />
  <group position={[0, 0.14, 0]} rotation={[0, head, 0]}><mesh><sphereGeometry args={[0.03, 20, 16]} /><meshStandardMaterial color={SKIN} roughness={0.7} /></mesh><mesh position={[0.024, 0.005, 0]}><sphereGeometry args={[0.006, 8, 8]} /><meshStandardMaterial color="#2a1a12" /></mesh></group>
</group>;
// vaca de arcilla de perfil: patches = qué zona trabaja (0 hombro, 1 pata, 2 panza)
const Cow: React.FC<{ p: V; s?: number; rotY?: number; glow?: number[]; step?: number }> = ({ p, s = 1, rotY = 0, glow = [0, 0, 0], step = 0 }) => <group position={p} rotation={[0, rotY, 0]} scale={s}>
  <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><capsuleGeometry args={[0.15, 0.36, 10, 20]} /><meshStandardMaterial color="#efe4d2" roughness={0.75} /></mesh>
  <mesh position={[0.37, 0.42, 0]} castShadow scale={[1.2, 0.9, 0.85]}><sphereGeometry args={[0.095, 20, 16]} /><meshStandardMaterial color="#efe4d2" roughness={0.75} /></mesh>
  <mesh position={[0.46, 0.39, 0]} scale={[0.7, 0.62, 0.7]}><sphereGeometry args={[0.07, 16, 12]} /><meshStandardMaterial color="#e6b7a8" /></mesh>
  {[-1, 1].map((d) => <mesh key={d} position={[0.34, 0.52, d * 0.07]} rotation={[d * 0.7, 0, 0]}><coneGeometry args={[0.015, 0.06, 8]} /><meshStandardMaterial color="#ded2bc" /></mesh>)}
  {[[-0.21, 0.07], [-0.21, -0.07], [0.2, 0.07], [0.2, -0.07]].map(([x, z], i) => <group key={i} position={[x, 0.19, z]} rotation={[0, 0, Math.sin(step + i * 1.57) * 0.35]}><Cyl p={[0, -0.09, 0]} r={0.032} h={0.19} c="#e6dac6" rough={0.75} /></group>)}
  {[[-0.14, 0.4, 0.09, 1.25], [0.08, 0.31, 0.13, 0.85], [-0.3, 0.3, 0.1, 0.8], [-0.04, 0.41, -0.09, 1.1], [0.36, 0.47, 0.06, 0.45]].map(([x, y, z, k], i) => <mesh key={i} position={[x, y, z]} scale={[k, 0.72 * k, 0.5]}><sphereGeometry args={[0.095, 18, 14]} /><meshStandardMaterial color="#2f2823" roughness={0.8} /></mesh>)}
  {[-1, 1].map((d) => <mesh key={d} position={[0.3, 0.45, d * 0.1]} rotation={[d * 0.5, 0, 0]} scale={[0.55, 0.3, 1]}><sphereGeometry args={[0.05, 12, 10]} /><meshStandardMaterial color="#d8c6ae" roughness={0.8} /></mesh>)}
  {[[0.22, 0.36, 0], [-0.24, 0.24, 0], [0, 0.18, 0]].map(([x, y, z], i) => glow[i] > 0.02 && <mesh key={i} position={[x, y, z + 0.115]} scale={[1, 0.9, 0.4]}><sphereGeometry args={[0.085, 18, 14]} /><meshStandardMaterial color="#ff7a52" emissive="#ff5a2a" emissiveIntensity={0.9 * glow[i]} transparent opacity={0.92 * glow[i]} /></mesh>)}
</group>;
const Puff: React.FC<{ p: V; k: number; s?: number; c?: string; op?: number }> = ({ p, k, s = 1, c = "#ffffff", op = 0.5 }) => k < 0.02 ? null : <mesh position={[p[0], p[1] + 0.2 * k * s, p[2]]} scale={s * (0.3 + 0.9 * k)}><sphereGeometry args={[0.09, 16, 12]} /><meshStandardMaterial color={c} transparent opacity={op * (1 - k)} roughness={1} depthWrite={false} /></mesh>;
const Tag: React.FC<{ tt: number; at: number; p: V; lines: string[]; bg?: string; fg?: string; w?: number; h?: number; rotY?: number }> = ({ tt, at, p, lines, bg = "#fbf8f1", fg = "#1e1813", w = 0.34, h = 0.2, rotY = 0 }) => {
  const map = useMemo(() => cardTex(lines, { bg, fg }), [lines.join("|")]), k = pop(tt, at);
  return <Pop k={k} p={p}><Sign p={[0, 0, 0]} map={map} w={w} h={h} rotY={rotY} /></Pop>; };
const Rope: React.FC<{ a: V; L: number; r?: number; c?: string }> = ({ a, L, r = 0.016, c = "#b84a40" }) => <mesh position={a} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[r, r, L, 10]} /><meshStandardMaterial color={c} roughness={0.72} /></mesh>;
const PackTray: React.FC<{ p: V; children?: React.ReactNode; s?: number }> = ({ p, children, s = 1 }) => <group position={p} scale={s}><Box p={[0, 0.02, 0]} s={[0.76, 0.04, 0.5]} c="#f4f2ec" r={0.55} rad={0.015} />{children}</group>;
const Teeth: React.FC<{ y: number; up?: boolean; n?: number }> = ({ y, up, n = 8 }) => <group position={[0, y, 0]}>{Array.from({ length: n }, (_, i) => <Box key={i} p={[-0.56 + i * 0.16, 0, 0]} s={[0.145, 0.15, 0.2]} c="#fbf8ec" r={0.22} rad={0.04} rot={[up ? 0 : 0, 0, 0]} />)}</group>;

// 0:05 · LA ETIQUETA: el que querías se da vuelta y dice 23; la bandeja se va y entra la de US$ 8
export const E_sticker: F = ({ t, h }) => <Hero t={t} h={h} d={1.35} ly={0.12} mode="drop" cam={(tt) => orbita(tt, C([-0.2, 0.72, 1.3], [0, 0.04, 0]), C([0.28, 0.66, 1.2], [0.1, 0.04, 0]), 9)} set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.2 }}
  scene={(tt) => { const away = eio(tt, 3.4, 4.5), inn = eio(tt, 3.5, 4.6), fl = eio(tt, 1.3, 2.2);
    return <>
      <group position={[lerp(-0.45, -2.2, away), 0, 0]}><PackTray p={[0, 0, 0]}><Steak p={[0, 0.095, 0]} s={1} th={0.1} kind="wagyu" /></PackTray>
        <group position={[0.14, 0.17, 0.14]} rotation={[-1.1, 0, 0]}><group rotation={[Math.PI * fl, 0, 0]}><Box p={[0, 0, 0]} s={[0.26, 0.15, 0.004]} c="#fff5cf" rad={0.002} cast={false} /></group></group></group>
      <Tag tt={tt} at={2.0} p={[lerp(-0.3, -2.0, away), 0.42, 0.1]} lines={["$23.40"]} bg={RED} fg="#fff" w={0.3} h={0.16} />
      <group position={[lerp(1.5, 0.45, inn), 0, 0]}><PackTray p={[0, 0, 0]}><Steak p={[0, 0.08, 0]} s={0.92} th={0.05} /></PackTray></group>
      <Tag tt={tt} at={5.6} p={[0.45, 0.4, 0.1]} lines={["$8.12"]} bg={GOLD} w={0.3} h={0.16} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={6} txt="THE OTHER PACKAGE" col={AMB} />} />;

// 0:41 · EL TICKET: el papelito se desenrolla sobre la mesa entre los tres tenedores hasta el total
export const E_receipt: F = ({ t, h }) => { const tx = useMemo(() => mk(240, 560, (g) => { g.fillStyle = "#fbf7ec"; g.fillRect(0, 0, 240, 560); g.fillStyle = "#3a3530"; g.font = "bold 22px Courier New"; g.textAlign = "center"; g.fillText("SUPERMARKET", 120, 44); g.font = "17px Courier New"; g.textAlign = "left"; ["ONION      .40", "PAPER TWL  ----", "CHUCK EYE", " 1 LB      7.72"].forEach((l, i) => g.fillText(l, 22, 100 + i * 42)); g.fillRect(20, 300, 200, 2); g.font = "bold 40px Courier New"; g.textAlign = "center"; g.fillText("TOTAL", 120, 370); g.font = "bold 58px Courier New"; g.fillStyle = "#a8302a"; g.fillText("$8.12", 120, 450); }), []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.1, 1.15, 0.72], [0, 0.02, 0.1]), C([-0.12, 1.0, 0.7], [0, 0.02, 0.2]), 9)} set={{ spot: [0, 0, 0.15] as V, spotK: 0.12, warm: 0.5 }}
    scene={(tt) => { const u = eio(tt, 0.6, 3.6), L = 0.08 + 0.96 * u;
      return <>
        <mesh position={[0, 0.042, -0.44 + L / 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.42, L]} /><meshStandardMaterial map={tx} roughness={0.85} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.07, -0.44 + L]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.028, 0.028, 0.42, 20]} /><meshStandardMaterial color="#f3ecdb" /></mesh>
        {[[-0.48, -0.1, 0.5], [0.5, -0.05, -0.5], [0.46, 0.42, -0.9]].map(([x, z, r], i) => <Pop key={i} k={pop(tt, 3.8 + i * 0.5)} p={[x, 0.044, z]} rot={[0, r, 0]}><Box p={[0, 0, 0]} s={[0.04, 0.008, 0.34]} c={STEEL} m={0.9} r={0.2} rad={0.002} />{[-1, 0, 1].map((d) => <Box key={d} p={[d * 0.014, 0, -0.2]} s={[0.006, 0.006, 0.1]} c={STEEL} m={0.9} r={0.2} rad={0.001} />)}</Pop>)}
      </>; }}
    over={(tt) => <Ink tt={tt} at={6} txt="THEY DID NOT BELIEVE ME" col={AMB} size={72} />} />; };

// 1:10 · EL CAJÓN DE CEBOLLAS: entre las cinco, una se levanta sola y gira con su precio
export const E_crate: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 0.52, 1.25], [0, 0.2, 0]), C([-0.2, 0.5, 1.15], [0, 0.26, 0]), 8)} set={{ spot: [0, 0.3, 0] as V, spotK: 0.55, warm: 0.6 }}
  scene={(tt) => { const up = eio(tt, 1.6, 3.2);
    return <>
      {[0, 1, 2].map((i) => <Box key={i} p={[0, 0.05 + i * 0.075, 0.26]} s={[0.84, 0.055, 0.02]} c={WOOD} r={0.8} rad={0.005} />)}{[0, 1, 2].map((i) => <Box key={i} p={[0, 0.05 + i * 0.075, -0.26]} s={[0.84, 0.055, 0.02]} c={WOOD} r={0.8} rad={0.005} />)}
      {[-1, 1].map((d) => <Box key={d} p={[d * 0.42, 0.11, 0]} s={[0.02, 0.21, 0.54]} c={WOOD} r={0.8} rad={0.005} />)}
      {[[-0.26, 0.08], [0.25, -0.08], [-0.05, -0.1], [0.28, 0.1], [0, 0.11]].map(([x, z], i) => <Onion key={i} p={[x, 0.135, z]} s={1.3} />)}
      <group position={[-0.06, lerp(0.15, 0.52, up), 0.02]} rotation={[0, tt * 0.8, 0.12 * Math.sin(tt)]}><Onion p={[0, 0, 0]} s={1.5} /></group>
      <pointLight position={[0, 0.8, 0.3]} intensity={up * 1.2 + 0.001} distance={1.4} color="#ffd27a" />
      <Tag tt={tt} at={3.6} p={[0.42, 0.56, 0.18]} lines={["40¢"]} bg={GOLD} w={0.26} h={0.16} rotY={-0.25} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={4.6} txt="ALREADY IN YOUR KITCHEN" col={AMB} />} />;

// 1:31 · LA GRASA NO SE PINTA: un pincel traza vetas blancas sobre el barato y se borran solas
export const E_marble: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.85, 1.05], [0, 0.04, 0]), C([0.2, 0.78, 1.0], [0.1, 0.04, 0]), 8)} set={{ spot: [0.1, 0, 0] as V, spotK: 0.4, warm: 0.4 }}
  scene={(tt) => { const sw = (tt * 0.9) % 1, ink = eio(tt, 1, 2.2) * (1 - eio(tt, 3.2, 4.6));
    return <>
      <Box p={[0, 0.016, 0]} s={[1.75, 0.032, 0.62]} c="#a9804e" r={0.72} rad={0.008} />
      <Steak p={[-0.42, 0.075, 0]} s={1.05} th={0.1} kind="wagyu" /><Steak p={[0.42, 0.075, 0]} s={1.05} th={0.1} />
      {Array.from({ length: 8 }, (_, i) => <Box key={i} p={[0.42 + 0.27 * (rnd(i) - 0.5) * 2, 0.131, -0.15 + i * 0.04]} s={[0.24, 0.002, 0.008]} c="#fff6e8" op={ink} cast={false} rad={0.001} rot={[0, rnd(i + 2) - 0.5, 0]} />)}
      <group position={[0.42 + 0.26 * Math.sin(tt * 2.6), 0.28 - 0.1 * ink, 0.02 + 0.12 * Math.cos(tt * 2.3)]} rotation={[0, 0, 0.45]}><Cyl p={[0, 0.18, 0]} r={0.016} h={0.36} c="#7a5634" /><Cyl p={[0, -0.03, 0]} r={0.034} r2={0.018} h={0.09} c="#fbf8ec" rough={0.9} /></group>
      <Tag tt={tt} at={0.9} p={[-0.42, 0.34, -0.1]} lines={["WAGYU"]} bg="#23201c" fg="#fff" w={0.3} h={0.13} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={4.6} txt="BORN THAT WAY" col={AMB} />} />;

// 2:29 · EL SECRETO DEL CARNICERO: mira a un lado, al otro, se inclina y saca el cartelito
export const E_whisper: F = ({ t, h }) => <Hero t={t} h={h} d={1.45} ly={0.14} mode="drop" cam={(tt) => orbita(tt, C([-0.15, 0.48, 1.1], [0, 0.3, 0]), C([0.18, 0.44, 0.98], [0, 0.3, 0]), 8.5)} set={{ spot: [0, 0.3, 0] as V, spotK: 0.5, warm: 0.55, bg: "#4a443c" }}
  scene={(tt) => { const look = tt < 1 ? 0 : tt < 2.2 ? 1.2 * Math.sin((tt - 1) * Math.PI / 1.2 * 2) : 0, lean = -0.32 * eio(tt, 2.6, 3.4);
    return <>
      <Box p={[0, 0.13, -0.02]} s={[1.3, 0.26, 0.34]} c="#ded7c8" r={0.3} rad={0.015} /><Box p={[0, 0.27, -0.02]} s={[1.38, 0.025, 0.42]} c="#4a3a2e" r={0.6} rad={0.006} />
      <Mini p={[0.22, 0.28, -0.1]} c="#f4f1ea" s={2.6} rotY={Math.PI} head={look} lean={-lean} />
      <Mini p={[-0.42, 0.28, 0.08]} c="#7a3b52" s={1.9} head={0.3} />
      <Tag tt={tt} at={3.8} p={[-0.1, 0.56, 0.1]} lines={["CHUCK EYE"]} bg={GOLD} w={0.44} h={0.16} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={5.2} txt="WHAT THE BUTCHER TAKES HOME" col={AMB} size={68} />} />;

// 2:43 · AL LADO DEL RIBEYE: la vaca muestra dónde; dos parches contiguos, mitad de precio
export const E_cowmap: F = ({ t, h }) => <Hero t={t} h={h} d={1.5} ly={0.2} mode="wipe" cam={(tt) => orbita(tt, C([-0.08, 0.5, 1.5], [0.06, 0.3, 0]), C([0.26, 0.5, 1.35], [0.14, 0.3, 0]), 8.5)} set={{ spot: [0.2, 0.2, 0] as V, spotK: 0.3, warm: 0.45 }}
  scene={(tt) => <>
    <Cow p={[-0.1, 0, 0]} s={1.15} glow={[eio(tt, 0.8, 1.6), 0, 0]} />
    <Pop k={pop(tt, 2.4)} p={[0.14, 0.58, 0.2]}><Steak p={[0, 0, 0]} s={0.42} th={0.08} rot={[1.25, 0, 0]} /></Pop>
    <Tag tt={tt} at={2.7} p={[0.2, 0.8, 0.2]} lines={["CHUCK EYE $"]} bg={GOLD} w={0.42} h={0.13} />
    <Tag tt={tt} at={3.6} p={[-0.4, 0.8, 0.05]} lines={["RIBEYE $$$"]} bg="#f4f1ea" w={0.42} h={0.13} />
    <Tag tt={tt} at={4.8} p={[0.66, 0.34, 0.1]} lines={["SAME MUSCLE", "HALF PRICE"]} bg="#23201c" fg="#fff" w={0.42} h={0.24} rotY={-0.3} />
  </>} />;

// 3:18 · LA CINTA: la vaca camina en una cinta y se encienden las partes que trabajan todo el día
export const E_treadcow: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 0.5, 1.5], [0, 0.3, 0]), C([-0.22, 0.48, 1.4], [0, 0.3, 0]), 8)} set={{ spot: [0, 0.1, 0] as V, spotK: 0.35, warm: 0.45, bg: "#39424e" }}
  scene={(tt) => { const g = [0, 1, 2].map((i) => eio(tt, 1.4 + i * 1.3, 2 + i * 1.3));
    return <>
      <Box p={[0, 0.03, 0]} s={[1.55, 0.06, 0.5]} c="#2a2b2e" r={0.6} rad={0.012} />
      {Array.from({ length: 16 }, (_, i) => <Box key={i} p={[-0.78 + (((i * 0.1 - tt * 0.34) % 1.6) + 1.6) % 1.6, 0.063, 0]} s={[0.03, 0.003, 0.48]} c="#55575c" cast={false} rad={0.001} />)}
      <Cow p={[0, 0.06, 0]} s={1.3} glow={g} step={tt * 5} />
      {["SHOULDER", "LEG", "BELLY"].map((n, i) => <Tag key={n} tt={tt} at={1.5 + i * 1.3} p={[-0.62 + i * 0.62, 0.92, 0.1]} lines={[n]} bg={GOLD} w={0.32} h={0.11} />)}
    </>; }}
  over={(tt) => <Ink tt={tt} at={5.4} txt="THEY WORK ALL DAY" col={AMB} />} />;

// 3:32 · SON SOGAS: el bife se aparta y deja un haz de sogas; los dientes muerden y rebotan
export const E_ropes: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.05, 0.42, 1.25], [0, 0.26, 0]), C([-0.22, 0.42, 1.15], [0, 0.26, 0]), 9)} set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.45, bg: "#2c2622" }}
  scene={(tt) => { const op = eio(tt, 1.1, 2.3), bite = tt > 3 ? Math.max(0, Math.sin((tt - 3) * 3.6)) : 0;
    return <>
      <Box p={[0, 0.02, 0]} s={[1.5, 0.04, 0.56]} c="#a9804e" r={0.7} rad={0.008} />
      <group position={[0, 0.09, 0]}>{Array.from({ length: 22 }, (_, i) => <Rope key={i} a={[0, 0.02 + (i % 4) * 0.03, -0.2 + (i % 8) * 0.055]} L={1.1 + 0.05 * rnd(i)} r={0.018} c={["#b84a40", "#a63d36", "#c25a4e"][i % 3]} />)}</group>
      {op < 0.98 && <group position={[0, 0.17 + 0.7 * op, 0]}><Steak p={[0, 0, 0]} s={1.8} th={0.12} /></group>}
      {op > 0.3 && <><Teeth y={0.5 - 0.27 * bite} /><Teeth y={0.05 + 0.0 * bite} up /></>}
    </>; }}
  over={(tt) => <Ink tt={tt} at={4.4} txt="YOUR TEETH VS. ROPES" col={AMB} />} />;

// 4:07 · LA MUELA: una muela enorme late en rojo; el bife se acerca y retrocede
export const E_tooth: F = ({ t, h }) => <Hero t={t} h={h} d={1.35} ly={0.2} mode="drop" cam={(tt) => orbita(tt, C([0.1, 0.4, 1.3], [0, 0.32, 0]), C([-0.2, 0.42, 1.2], [0, 0.32, 0]), 8)} set={{ spot: [0, 0.3, 0] as V, spotK: 0.18, warm: 0.3, bg: "#2a2428" }}
  scene={(tt) => { const pul = 0.5 + 0.5 * Math.sin(tt * 4.2), near = Math.max(0, Math.sin((tt - 1.8) * 1.4)) * (tt > 1.8 ? 1 : 0);
    return <>
      <Mini p={[-0.22, 0, 0]} c="#26242c" s={5} />
      <group position={[-0.22, 0.6, 0.17]}>{[-1, 1].map((d) => <mesh key={d} position={[d * 0.05, 0, 0]} scale={[1.2, 0.8, 0.5]}><sphereGeometry args={[0.04, 14, 10]} /><meshStandardMaterial color="#a8302a" roughness={0.5} /></mesh>)}</group>
      <mesh position={[-0.14, 0.66, 0.135]}><sphereGeometry args={[0.05 + 0.02 * pul, 20, 16]} /><meshStandardMaterial color="#ff3a2a" emissive="#ff2a1a" emissiveIntensity={0.5 + 0.7 * pul} transparent opacity={0.75} depthWrite={false} /></mesh>
      <pointLight position={[-0.14, 0.66, 0.5]} intensity={0.12 + 0.25 * pul} distance={1.2} color="#ff5a3a" />
      <group position={[lerp(0.75, 0.2, near), 0.66 + 0.02 * Math.sin(tt * 3), 0.1]} rotation={[1.2, 0, 0.1]}><Steak p={[0, 0, 0]} s={0.58} th={0.12} crust={0.8} /></group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.6} txt="HE COULD NOT CHEW" col="#ff9d8a" />} />;

// 4:59 · LAS TIJERITAS: tiras de proteína; llueven tijeras chiquitas y cada una corta un eslabón
export const E_snip: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.44, 1.05], [0, 0.22, 0]), C([0.2, 0.42, 0.98], [0, 0.22, 0]), 9.5)} set={{ spot: [0, 0, 0] as V, spotK: 0.2, warm: 0.25, bg: "#352238" }}
  scene={(tt) => { const N = 13, cut = (i: number) => eio(tt, 1.7 + i * 0.45, 2.1 + i * 0.45);
    return <>
      {[0, 1, 2].map((r) => <group key={r} position={[0, 0.11 + r * 0.16, -0.05 * r]}>{Array.from({ length: N }, (_, i) => { const off = (i % 3 === 1 ? cut(r + i) * 0.05 * Math.sign(i - 6) : 0) * (i - 6) * 0.38; return <mesh key={i} position={[-0.7 + i * 0.117 + off, 0.012 * Math.sin(i * 1.2 + tt), 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.036, 0.05, 6, 12]} /><meshPhysicalMaterial color={["#d35b4f", "#c74c43", "#e27a65"][i % 3]} roughness={0.5} clearcoat={0.4} /></mesh>; })}</group>)}
      {Array.from({ length: 9 }, (_, i) => { const at = 0.6 + i * 0.45, k = eio(tt, at, at + 0.7), y = lerp(0.95, 0.2 + (i % 3) * 0.16, k), snip = k >= 1 ? 0.06 + 0.3 * Math.abs(Math.sin(tt * 9 + i)) : 0.3; return tt < at ? null : <Scissors key={i} p={[-0.55 + i * 0.14, y, 0.13]} s={0.85} open={snip} rotY={0.2} />; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={4.2} txt="TEN THOUSAND TINY SCISSORS" col={AMB} size={68} />} />;

// 5:32 · GOLPECITOS: entre film, la base de una sartén chica golpea y el grosor baja contra la regla
export const E_tap: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.28, 0.42, 1.0], [0, 0.14, 0]), C([-0.1, 0.42, 0.92], [0, 0.14, 0]), 8.5)} set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.4 }}
  scene={(tt) => { const b = tt > 1 && tt < 7 ? Math.pow(Math.abs(Math.sin((tt - 1) * 3)), 2.2) : 1, th = lerp(0.13, 0.075, eio(tt, 1.2, 5.6));
    return <>
      <Box p={[0, 0.016, 0]} s={[1.2, 0.032, 0.7]} c="#a9804e" r={0.7} rad={0.008} />
      <Steak p={[0, 0.03 + th / 2, 0]} s={1.05} th={th} />
      <Box p={[0, 0.03 + th / 2, 0]} s={[0.72, th + 0.014, 0.48]} c="#e8f2f8" op={0.22} r={0.08} rad={0.012} cast={false} />
      <group position={[0, 0.07 + th + 0.18 * b, 0]}><Cyl p={[0, 0.03, 0]} r={0.2} r2={0.17} h={0.07} c="#2c2d30" m={0.5} rough={0.5} /><Box p={[0.32, 0.045, 0]} s={[0.36, 0.024, 0.05]} c="#2c2d30" rad={0.008} /></group>
      <Box p={[0.5, 0.11, 0]} s={[0.04, 0.2, 0.02]} c="#efe8d6" r={0.7} rad={0.003} />
      {[0, 1, 2, 3].map((i) => <Box key={i} p={[0.5, 0.036 + i * 0.035, 0.012]} s={[0.04, 0.003, 0.004]} c="#3a2a18" cast={false} rad={0.001} />)}
      <Tag tt={tt} at={5.8} p={[0.5, 0.33, 0.05]} lines={["3/4 INCH"]} bg={GOLD} w={0.26} h={0.11} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.4} txt="TAP, DON'T PUNISH" col={AMB} />} />;

// 5:48 · EL RALLADOR: la media cebolla baja y sube, se achica; la pulpa crece y cae una lágrima
export const E_grater: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 0.42, 1.2], [0, 0.26, 0]), C([-0.18, 0.42, 1.1], [0, 0.26, 0]), 8.5)} set={{ spot: [0, 0.2, 0] as V, spotK: 0.4, warm: 0.4 }}
  scene={(tt) => { const y = Math.sin(tt * 4.4), sh = lerp(1.25, 0.75, eio(tt, 0.8, 6.5)), pile = eio(tt, 1, 7), tear = cl((tt - 5.0) / 0.9);
    return <>
      <Cyl p={[-0.22, 0.012, 0.1]} r={0.34} h={0.024} c="#fbfaf5" rough={0.25} seg={40} />
      <mesh position={[-0.28, 0.024, 0.1]} scale={[0.26 * (0.4 + 0.6 * pile), 0.09 * pile + 0.004, 0.2 * (0.4 + 0.6 * pile)]}><sphereGeometry args={[1, 26, 18, 0, 6.283, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#f2ecd3" roughness={0.25} clearcoat={0.9} transparent opacity={0.96} /></mesh>
      <group position={[-0.05, 0.27, 0]}><mesh rotation={[0, Math.PI / 4, 0]}><cylinderGeometry args={[0.11, 0.17, 0.5, 4, 1, true]} /><meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.28} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.06, 0.012, 8, 20, Math.PI]} /><meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.28} /></mesh></group>
      <group position={[-0.19, 0.3 + 0.13 * y, 0.14]} rotation={[0, 0.3, 1.25]}><Onion p={[0, 0, 0]} s={sh} half /></group>
      {tear > 0 && tear < 1 && <mesh position={[0.45, lerp(0.75, 0.04, tear * tear), 0.2]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.03, 18, 14]} /><meshPhysicalMaterial color="#cfeafa" roughness={0.05} clearcoat={1} transparent opacity={0.9} /></mesh>}
      {tear >= 1 && <mesh position={[0.45, 0.036, 0.2]} rotation={[-Math.PI / 2, 0, 0]} scale={0.5 + 0.8 * cl(tt - 5.9)}><ringGeometry args={[0.03, 0.05, 28]} /><meshBasicMaterial color="#cfeafa" transparent opacity={Math.max(0, 0.9 - (tt - 5.9))} /></mesh>}
    </>; }}
  over={(tt) => <Ink tt={tt} at={4.6} txt="IT WILL MAKE YOU CRY" col={AMB} />} />;

// 6:08 · LA BARRERA: el plato corre sobre una vía; 1 hora va bien, a las 2 baja la barrera roja
export const E_gate: F = ({ t, h }) => <Hero t={t} h={h} d={1.25} ly={0.04} mode="split" cam={(tt) => orbita(tt, C([-0.15, 0.62, 1.42], [0.1, 0.1, 0]), C([0.25, 0.56, 1.3], [0.2, 0.1, 0]), 8)} set={{ spot: [0.35, 0, 0] as V, spotK: 0.35, warm: 0.3 }}
  scene={(tt) => { const x = lerp(-0.72, 0.42, eio(tt, 0.7, 4.0)), arm = eio(tt, 3.0, 3.8), hit = tt > 4 ? Math.max(0, Math.sin((tt - 4) * 9)) * Math.exp(-(tt - 4) * 3) : 0;
    return <>
      <Box p={[0, 0.016, 0.02]} s={[2.1, 0.032, 0.34]} c="#d9d2c0" r={0.6} rad={0.006} />
      {[[-0.05, "1 HOUR", GRN], [0.62, "2 HOURS", RED]].map(([xx, n, c], i) => <group key={i}><Box p={[xx as number, 0.034, 0.02]} s={[0.012, 0.004, 0.34]} c={c as string} cast={false} rad={0.001} /><Tag tt={tt} at={0.4 + i * 0.5} p={[xx as number, 0.05, 0.28]} lines={[n as string]} bg={c as string} fg="#fff" w={0.3} h={0.11} /></group>)}
      <group position={[x - 0.03 * hit, 0.033, 0.02]}><Cyl p={[0, 0.012, 0]} r={0.2} r2={0.16} h={0.024} c="#fbfaf5" rough={0.25} /><Steak p={[0, 0.05, 0]} s={0.52} th={0.05} /><mesh position={[0, 0.082, 0]} scale={[0.15, 0.02, 0.1]}><sphereGeometry args={[1, 18, 12, 0, 6.283, 0, Math.PI / 2]} /><meshStandardMaterial color="#f2ecd3" /></mesh></group>
      <group position={[0.65, 0, -0.18]}><Cyl p={[0, 0.13, 0]} r={0.018} h={0.26} c="#55575c" /><group position={[0, 0.26, 0]} rotation={[0, 0, lerp(1.25, 0, arm)]}><Box p={[0, 0, 0.18]} s={[0.05, 0.05, 0.4]} c={RED} rad={0.008} /></group></group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={4.4} txt="NEVER MORE THAN TWO" col="#ff9d8a" />} />;

// 6:22 · LA BOLSA MOJADA: una bolsa de papel se moja desde abajo y se desploma al lado del bife pálido
export const E_wetbag: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.15, 0.48, 1.25], [0, 0.22, 0]), C([-0.2, 0.46, 1.15], [0, 0.2, 0]), 8)} set={{ spot: [0, 0.1, 0] as V, spotK: 0.3, warm: 0.3, bg: "#3b3a3e" }}
  scene={(tt) => { const wet = eio(tt, 0.7, 4.0), fall = eio(tt, 4.0, 5.4);
    return <>
      <Steak p={[0.42, 0.05, 0.06]} s={0.85} th={0.09} kind="gray" />
      <group position={[-0.3, 0, 0]} rotation={[0, 0.2, 0]} scale={[1 + 0.25 * fall, 1 - 0.74 * fall, 1 + 0.1 * fall]}>
        <Box p={[0, 0.3, 0]} s={[0.4, 0.6, 0.26]} c="#c2a074" r={0.92} rad={0.01} />
        <Box p={[0, 0.3 * wet + 0.002, 0.001]} s={[0.405, 0.6 * wet + 0.004, 0.265]} c="#6d5236" r={0.65} rad={0.01} cast={false} />
        <Box p={[0, 0.605, 0]} s={[0.41, 0.012, 0.27]} c="#a58658" rad={0.002} cast={false} />
      </group>
      {[...Array(5)].map((_, i) => <mesh key={i} position={[-0.3 + 0.3 * (rnd(i) - 0.5), 0.036, 0.2 + 0.1 * rnd(i + 2)]} rotation={[-Math.PI / 2, 0, 0]} scale={cl(wet * 2 - 0.6)}><circleGeometry args={[0.06 + 0.05 * rnd(i + 5), 24]} /><meshPhysicalMaterial color="#5d4632" roughness={0.1} clearcoat={1} /></mesh>)}
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.8} txt="ONE NIGHT WAS TOO LONG" col={AMB} />} />;

// 6:51 · EL AGUA ARRIBA: sal cae y, al ratito, salen gotas por toda la superficie
export const E_beads: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.05, 0.6, 0.9], [0, 0.07, 0]), C([-0.2, 0.55, 0.85], [0, 0.07, 0]), 8.5)} set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.3 }}
  scene={(tt) => <>
    <Box p={[0, 0.016, 0]} s={[1.05, 0.032, 0.68]} c="#a9804e" r={0.7} rad={0.008} /><Steak p={[0, 0.07, 0]} s={1.2} th={0.09} />
    {Array.from({ length: 36 }, (_, i) => { const u = (tt * 0.8 + rnd(i)) % 1; return tt < 2.2 ? <mesh key={i} position={[-0.3 + 0.6 * rnd(i), lerp(0.7, 0.13, u), -0.18 + 0.36 * rnd(i + 3)]}><boxGeometry args={[0.012, 0.012, 0.012]} /><meshStandardMaterial color="#ffffff" /></mesh> : null; })}
    {Array.from({ length: 34 }, (_, i) => { const k = eio(tt, 2.8 + rnd(i) * 2.8, 3.5 + rnd(i) * 2.8), r = (0.016 + 0.016 * rnd(i + 8)) * k; return k < 0.03 ? null : <mesh key={i} position={[-0.3 + 0.6 * rnd(i + 11), 0.135 + r * 0.45, -0.19 + 0.38 * rnd(i + 13)]} scale={[1, 0.65, 1]}><sphereGeometry args={[r, 16, 12]} /><meshPhysicalMaterial color="#e6f4fb" roughness={0.04} clearcoat={1} transparent opacity={0.85} /></mesh>; })}
    <Tag tt={tt} at={2.6} p={[0.5, 0.38, -0.12]} lines={["10 MINUTES"]} bg="#23201c" fg="#fff" w={0.34} h={0.12} rotY={-0.2} />
  </>}
  over={(tt) => <Ink tt={tt} at={5.6} txt="THE WORST OF IT" col="#ff9d8a" />} />;

// 7:43 · GRIS O DORADO: en la sartén hierve su propia agua; pasa el papel, y recién dora
export const E_grey: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 0.68, 1.05], [0, 0.12, 0]), C([-0.2, 0.62, 1.0], [0, 0.12, 0]), 8)} set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.5 }}
  scene={(tt) => { const wipe = eio(tt, 3.6, 4.5) * (1 - eio(tt, 4.5, 5)), wet = 1 - eio(tt, 3.8, 4.5), c = eio(tt, 5, 7);
    return <>
      <Pan p={[0, 0, 0]} s={1.05} heat={0.75} /><Steak p={[0, 0.13, 0]} s={0.95} th={0.08} kind={wet > 0.5 ? "gray" : "cheap"} crust={c} />
      {wet > 0.1 && [...Array(10)].map((_, i) => { const u = (tt * 1.2 + i / 10) % 1; return <mesh key={i} position={[-0.3 + 0.6 * rnd(i), 0.1, 0.2 * (rnd(i + 3) - 0.5) * 2]} scale={wet * (0.5 + u)}><sphereGeometry args={[0.022, 12, 10]} /><meshPhysicalMaterial color="#dff2fa" roughness={0.04} clearcoat={1} transparent opacity={0.7} /></mesh>; })}
      {wet > 0.1 && [...Array(7)].map((_, i) => { const u = (tt * 0.6 + i / 7) % 1; return <Puff key={i} p={[0.3 * Math.cos(i * 2.2), 0.2, 0.2 * Math.sin(i * 2.2)]} k={u} s={1.5} op={0.55 * wet} />; })}
      {tt > 3.3 && tt < 5.2 && <group position={[lerp(-0.7, 0.7, wipe), 0.24, 0]} rotation={[0, 0, 0.2]}><Box p={[0, 0, 0]} s={[0.34, 0.03, 0.3]} c="#fbfaf5" r={0.95} rad={0.012} /></group>}
    </>; }}
  over={(tt) => <Ink tt={tt} at={1.2} txt={tt < 5 ? "WET STEAK · GRAY STEAK" : "DRY IT · THEN IT BROWNS"} col={tt < 5 ? "#ff9d8a" : AMB} />} />;

// 8:48 · VUELTA CADA MINUTO: el bife salta, gira y cada cara vuelve más dorada
export const E_flip: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([-0.2, 0.62, 1.15], [0, 0.2, 0]), C([0.22, 0.58, 1.08], [0, 0.22, 0]), 9)} set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.6 }}
  scene={(tt) => { const P = 1.75, n = Math.max(0, Math.floor((tt - 0.6) / P)), u = cl((tt - 0.6 - n * P) / 0.75), jump = 4 * u * (1 - u), turn = n % 2 + eio(u, 0, 1), c = cl(0.12 + n * 0.22);
    return <>
      <Pan p={[0, 0, 0]} s={1.15} heat={0.9} />
      <group position={[0, 0.14 + jump * 0.42, 0]} rotation={[Math.PI * (tt < 0.6 ? 0 : turn), 0, 0]}><Steak p={[0, 0, 0]} s={1} th={0.08} crust={c} /></group>
      {[...Array(5)].map((_, i) => { const v = (tt * 0.6 + i / 5) % 1; return <Puff key={i} p={[0.28 * Math.cos(i * 2.2), 0.14, 0.2 * Math.sin(i * 2.2)]} k={v} s={0.7} c="#d8c8b0" op={0.4} />; })}
      {[1, 2, 3, 4].map((i) => <Pop key={i} k={pop(tt, 0.6 + (i - 1) * P)} p={[-0.82 + (i - 1) * 0.12, 0.32, 0]}><Cyl p={[0, 0, 0]} r={0.046} h={0.022} c={GOLD} m={0.3} rough={0.4} rot={[Math.PI / 2, 0, 0]} /></Pop>)}
    </>; }}
  over={(tt) => <Ink tt={tt} at={1.0} txt="EVERY MINUTE" col={AMB} />} />;

// 9:19 · LA AGUJA: el termómetro pincha lo más grueso y los números suben hasta 145
export const E_probe: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.25, 0.52, 1.0], [0, 0.18, 0]), C([-0.1, 0.52, 0.92], [0.03, 0.2, 0]), 9)} set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.55 }}
  scene={(tt) => { const pierce = eio(tt, 0.7, 1.5);
    return <>
      <Pan p={[0, 0, 0]} s={1.1} heat={0.55} /><Steak p={[0, 0.14, 0]} s={1} th={0.13} crust={0.9} />
      <group position={[0.02, lerp(0.92, 0.5, pierce), 0]} rotation={[0, 0, 0.14]}>
        <Cyl p={[0, -0.18, 0]} r={0.008} h={0.42} c={STEEL} m={0.9} rough={0.2} />
        <Box p={[0, 0.1, 0]} s={[0.17, 0.16, 0.045]} c="#d8302a" r={0.4} rad={0.02} /><Box p={[0, 0.1, 0.024]} s={[0.125, 0.085, 0.002]} c="#cfe8c8" r={0.3} e="#bde8ae" ei={0.4} cast={false} rad={0.001} />
      </group>
    </>; }}
  over={(tt) => { const d = Math.round(lerp(40, 145, eio(tt, 1.6, 5.6))); return <><Ink tt={tt} at={1.5} txt={`${d}°F`} col={d >= 145 ? AMB : "#ffffff"} size={130} y={240} /><Ink tt={tt} at={6.3} txt="THEN REST 3 MINUTES" col={AMB} /></>; }} />;

// 10:08 · LOS PEDACITOS: el fondo de la sartén vacía brilla por partes y le caen monedas
export const E_fond: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.08, 0.98, 0.7], [0, 0.07, 0]), C([-0.16, 0.86, 0.72], [0, 0.07, 0]), 9)} set={{ spot: [0, 0, 0] as V, spotK: 0.55, warm: 0.8, bg: "#2d2622" }}
  scene={(tt) => <>
    <Pan p={[0, 0, 0]} s={1.3} heat={0.1} />
    {Array.from({ length: 52 }, (_, i) => { const a = i * 2.4, r = 0.36 * Math.sqrt(rnd(i)), g = eio(tt, 1 + rnd(i) * 2.8, 1.6 + rnd(i) * 2.8); return <mesh key={i} position={[r * Math.cos(a), 0.113, r * Math.sin(a)]} scale={[1 + rnd(i + 2), 0.5, 1 + rnd(i + 3)]}><sphereGeometry args={[0.014 + 0.01 * rnd(i + 4), 12, 10]} /><meshStandardMaterial color={col("#3a1f0f", "#8a4a1c", g)} emissive="#b0601a" emissiveIntensity={0.55 * g} roughness={0.55} /></mesh>; })}
    {[0, 1, 2, 3, 4].map((i) => <Pop key={i} k={pop(tt, 4.2 + i * 0.4)} p={[-0.18 + i * 0.09, 0.15, 0.05 * (i % 2)]}><Coin p={[0, 0, 0]} s={1.25} /></Pop>)}
  </>}
  over={(tt) => <Ink tt={tt} at={5.8} txt="WORTH MORE THAN THE STEAK" col={AMB} size={72} />} />;

// 10:43 · LA RAYA: tres chorritos entran y la cuchara dibuja una raya que no se cierra
export const E_line: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.05, 0.92, 0.72], [0, 0.08, 0]), C([-0.18, 0.84, 0.72], [0, 0.08, 0]), 8)} set={{ spot: [0, 0, 0] as V, spotK: 0.55, warm: 0.85, bg: "#2d2622" }}
  scene={(tt) => { const pour = [0, 1, 2].map((i) => eio(tt, 0.4 + i * 0.7, 0.8 + i * 0.7) * (1 - eio(tt, 0.95 + i * 0.7, 1.15 + i * 0.7))), v = eio(tt, 3.1, 5.2), x = lerp(-0.34, 0.34, v);
    return <>
      <Pan p={[0, 0, 0]} s={1.2} heat={0.35} />
      <Cyl p={[0, 0.102, 0]} r={0.43} h={0.008} c="#5b2d12" rough={0.1} cast={false} />
      {Array.from({ length: 34 }, (_, i) => <mesh key={i} position={[0.36 * Math.sqrt(rnd(i)) * Math.cos(i * 2.4), 0.109, 0.36 * Math.sqrt(rnd(i)) * Math.sin(i * 2.4)]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#d8b268" roughness={0.4} /></mesh>)}
      {pour.map((k, i) => k > 0.03 && <Cyl key={i} p={[-0.2 + i * 0.2, 0.4, 0.04]} r={0.01} h={0.58} c={["#2a160a", "#9a6a2a", "#ded6c0"][i]} rough={0.1} cast={false} />)}
      {v > 0.01 && <Box p={[(-0.34 + x) / 2, 0.1085, 0.02]} s={[x + 0.34, 0.002, 0.055]} c="#2a2b2e" m={0.7} r={0.28} cast={false} rad={0.001} />}
      <group position={[x, 0.2, 0.02]} rotation={[1.1, 0.1, -0.4]}><Cyl p={[0, 0.2, 0]} r={0.015} h={0.5} c="#7a5634" /><Box p={[0, -0.06, 0]} s={[0.08, 0.1, 0.012]} c="#7a5634" rad={0.012} /></group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={5.4} txt="THICK ENOUGH TO LEAVE A LINE" col={AMB} size={68} />} />;

// 11:37 · LO QUE COME UNA FAMILIA: el bife gigante sobre el plato estalla en tiras hacia cuatro boles
export const E_fourbowls: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([-0.15, 0.82, 1.25], [0, 0.06, 0]), C([0.2, 0.76, 1.15], [0, 0.06, 0]), 9.5)} set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.55 }}
  scene={(tt) => { const cut = eio(tt, 2.8, 3.6), P: V[] = [[-0.62, 0, -0.26], [0.62, 0, -0.26], [-0.62, 0, 0.3], [0.62, 0, 0.3]];
    return <>
      <Cyl p={[0, 0.015, 0]} r={0.36} r2={0.3} h={0.03} c="#fbfaf5" rough={0.25} seg={44} />
      {cut < 0.98 && <Steak p={[0, 0.08, 0]} s={1.6 * (1 - 0.2 * cut)} th={0.09} crust={0.85} />}
      {P.map((q, i) => <Pop key={i} k={pop(tt, 2.5 + i * 0.15)} p={q} s={0.75}><Bowl p={[0, 0, 0]} c={["#2c4a8a", "#a8302a", "#ded5c4", "#2c4a8a"][i]} fill="#fbfaf5" /></Pop>)}
      {P.flatMap((q, i) => Array.from({ length: 5 }, (_, j) => { const u = eio(tt, 3.1 + j * 0.16 + i * 0.1, 3.8 + j * 0.16 + i * 0.1); return u < 0.02 ? null : <group key={`${i}${j}`} position={[lerp(0, q[0], u), lerp(0.14, 0.135, u) + 0.4 * 4 * u * (1 - u), lerp(0, q[2], u) + (j - 2) * 0.02]} rotation={[0, j * 0.3, 0]}><Box p={[0, 0, 0]} s={[0.15, 0.012, 0.05]} c={CRUST} r={0.5} rad={0.004} /></group>; }))}
    </>; }}
  over={(tt) => <Ink tt={tt} at={5.6} txt="ONE STEAK · FOUR PEOPLE" col={AMB} />} />;

// 12:06 · EL REPOLLO: el cuchillo baja rápido y las hebras finitas se apilan como pluma
export const E_cabbage: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 0.5, 1.15], [0, 0.18, 0]), C([-0.18, 0.46, 1.05], [0, 0.18, 0]), 8)} set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.3 }}
  scene={(tt) => { const n = Math.round(eio(tt, 0.8, 7) * 110), chop = Math.abs(Math.sin(tt * 7));
    return <>
      <Box p={[0, 0.025, 0]} s={[1.3, 0.05, 0.7]} c="#b98f55" r={0.7} rad={0.012} />
      <mesh position={[-0.42, 0.2, 0]} castShadow scale={[1 - 0.25 * eio(tt, 0.8, 7), 1, 1]}><sphereGeometry args={[0.18, 28, 20]} /><meshPhysicalMaterial color="#b6d68a" roughness={0.42} clearcoat={0.5} /></mesh>
      <Knife p={[-0.19, 0.2 + 0.11 * chop, 0.02]} rot={[0, 1.57, 0]} s={1.25} />
      {Array.from({ length: n }, (_, i) => { const a = i * 2.4, r = 0.3 * Math.sqrt(rnd(i)); return <mesh key={i} position={[0.22 + r * Math.cos(a), 0.058 + 0.13 * (1 - r / 0.3) * rnd(i + 2), r * Math.sin(a) * 0.72]} rotation={[rnd(i) * 3, i, 1.57 + rnd(i + 1)]}><torusGeometry args={[0.05, 0.0024, 4, 12, 2.2]} /><meshStandardMaterial color={i % 3 ? "#d7ecb4" : "#bcdc8c"} roughness={0.5} /></mesh>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.8} txt="AS THIN AS YOU CAN" col={AMB} />} />;

// 12:40 · VUELVE A CORDÓN: la feta se enrosca en la sartén y termina siendo un cordón de zapato
export const E_shoelace: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.05, 0.62, 1.0], [0, 0.12, 0]), C([-0.2, 0.58, 0.95], [0, 0.12, 0]), 8)} set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.5 }}
  scene={(tt) => { const k = eio(tt, 0.8, 3.4), lace = eio(tt, 3.3, 5);
    return <>
      <Pan p={[0, 0, 0]} s={1.15} heat={0.85} />
      {lace < 0.98 && [0, 1, 2].map((i) => <Box key={i} p={[-0.14 + i * 0.14, 0.13 + 0.03 * k, 0]} s={[0.1 * (1 - 0.5 * k), 0.016 + 0.05 * k, 0.5 * (1 - 0.4 * k)]} c={col("#a65a4a", "#3a2316", k)} r={0.55} rad={0.012} op={1 - lace} />)}
      {lace > 0.02 && Array.from({ length: 30 }, (_, i) => { const u = i / 29, x = -0.42 + 0.84 * u, z = 0.13 * Math.sin(u * 16) * lace; return <mesh key={i} position={[x, 0.145, z]}><sphereGeometry args={[0.017 * lace, 10, 8]} /><meshStandardMaterial color="#efe6d2" roughness={0.9} /></mesh>; })}
      {lace > 0.5 && [-1, 1].map((d) => <Cyl key={d} p={[d * 0.46, 0.145, 0.13 * Math.sin((d + 1) / 2 * 16)]} r={0.019} h={0.09} c="#c8c0ac" rot={[0, 0, Math.PI / 2]} />)}
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.9} txt="BACK INTO SHOELACES" col="#ff9d8a" />} />;

// 13:28 · EL CHARCO: dos bandejas se inclinan; en una corre el jugo rojo, la otra sigue seca
export const E_puddle: F = ({ t, h }) => <Hero t={t} h={h} d={1.28} ly={0.08} mode="wipe" cam={(tt) => orbita(tt, C([-0.15, 0.82, 1.2], [0, 0.04, 0]), C([0.22, 0.75, 1.1], [0, 0.04, 0]), 8.5)} set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.15 }}
  scene={(tt) => { const tilt = eio(tt, 0.9, 1.9) * 0.2, f = eio(tt, 1.4, 4);
    return <>
      <group position={[-0.44, 0.02, 0]} rotation={[tilt, 0, 0]}><PackTray p={[0, 0, 0]} s={1.05}><Steak p={[0, 0.08, -0.04]} s={0.85} th={0.07} />
        <mesh position={[0, 0.043, 0.16]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.32, 0.06 + 0.08 * f, 1]}><circleGeometry args={[1, 30]} /><meshPhysicalMaterial color="#8e1f1b" roughness={0.08} clearcoat={1} /></mesh></PackTray></group>
      <group position={[0.44, 0.02, 0]} rotation={[tilt, 0, 0]}><PackTray p={[0, 0, 0]} s={1.05}><Steak p={[0, 0.08, -0.04]} s={0.85} th={0.07} /></PackTray></group>
      <Tag tt={tt} at={3.6} p={[-0.44, 0.26, -0.1]} lines={["WAITED TOO LONG"]} bg="#23201c" fg="#fff" w={0.46} h={0.11} />
      <Tag tt={tt} at={4.6} p={[0.44, 0.26, -0.1]} lines={["DRIEST TRAY"]} bg={GOLD} w={0.4} h={0.11} />
    </>; }} />;

// 13:48 · TRES CAPAS: film, papel de aluminio y una bolsa que se aprieta hasta sacarle el aire
export const E_wrap: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.12, 0.58, 1.05], [0, 0.1, 0]), C([-0.18, 0.54, 1.0], [0, 0.1, 0]), 8)} set={{ spot: [0, 0, 0] as V, spotK: 0.45, warm: 0.2 }}
  scene={(tt) => { const film = eio(tt, 0.5, 1.5), foil = eio(tt, 2, 3.2), air = eio(tt, 3.8, 4.5), squeeze = eio(tt, 4.8, 6.6);
    return <>
      <Steak p={[0, 0.07, 0]} s={1.05} th={0.1} />
      {film > 0.02 && <Box p={[0, 0.07, 0]} s={[0.68 * film, 0.11, 0.44 * film]} c="#dff0f8" op={0.28} r={0.06} rad={0.016} cast={false} />}
      {foil > 0.02 && <group position={[0, 0.07, 0]} scale={[foil, 1, foil]}><Box p={[0, 0, 0]} s={[0.7, 0.12, 0.46]} c="#dadde2" m={0.95} r={0.26} rad={0.022} />{Array.from({ length: 16 }, (_, i) => <Box key={i} p={[-0.3 + 0.6 * rnd(i), 0.062, -0.2 + 0.4 * rnd(i + 3)]} s={[0.12, 0.003, 0.02]} c="#b6bbc3" m={0.95} r={0.36} rot={[0, rnd(i + 5) * 3, 0]} cast={false} rad={0.001} />)}</group>}
      {air > 0.02 && <mesh position={[0, 0.17 - 0.08 * squeeze, 0]} scale={[lerp(0.56, 0.4, squeeze) * air, lerp(0.26, 0.09, squeeze) * air, lerp(0.42, 0.28, squeeze) * air]}><sphereGeometry args={[1, 30, 22]} /><meshPhysicalMaterial color="#eef6fb" roughness={0.1} clearcoat={1} transparent opacity={0.3} depthWrite={false} /></mesh>}
      {["PLASTIC", "FOIL", "BAG"].map((n, i) => <Tag key={n} tt={tt} at={[0.9, 2.5, 4.1][i]} p={[-0.5 + i * 0.5, 0.42, -0.1]} lines={[n]} bg={GOLD} w={0.28} h={0.11} />)}
    </>; }}
  over={(tt) => <Ink tt={tt} at={5.8} txt="PRESS THE AIR OUT" col={AMB} />} />;

// 14:23 · EL CUCHILLO SIN FILO: aplasta las sogas y sale jugo; el filoso las pasa limpio
export const E_dull: F = ({ t, h }) => <Hero t={t} h={h} d={1.25} ly={0.08} mode="split" cam={(tt) => orbita(tt, C([0, 0.68, 1.15], [0, 0.1, 0]), C([0.22, 0.62, 1.05], [0.05, 0.1, 0]), 8.5)} set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0.4 }}
  scene={(tt) => { const a = eio(tt, 0.8, 2.3), b = eio(tt, 3.6, 4.8), gap = 0.055 * eio(tt, 4.6, 5.3), sq = 1 - 0.55 * a;
    return <>
      <Box p={[0, 0.016, 0]} s={[1.9, 0.032, 0.62]} c="#a9804e" r={0.7} rad={0.008} />
      <group position={[-0.48, 0.03, 0]}>
        {Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[0, 0.03 * sq + 0.004, -0.2 + i * 0.04]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, sq]}><cylinderGeometry args={[0.02, 0.02, 0.62, 10]} /><meshStandardMaterial color="#b84a40" roughness={0.72} /></mesh>)}
        <mesh position={[0, 0.004, 0.18]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.1 * a + 0.01, 0.12 * a + 0.01, 1]}><circleGeometry args={[0.3, 30]} /><meshPhysicalMaterial color="#8e1f1b" roughness={0.08} clearcoat={1} /></mesh>
        <Knife p={[0.06, lerp(0.42, 0.13, a), 0]} rot={[0, 1.57, 0]} dull />
      </group>
      <group position={[0.48, 0.03, 0]}>
        {Array.from({ length: 11 }, (_, i) => <group key={i}>{[-1, 1].map((d) => <mesh key={d} position={[d * (0.16 + gap), 0.03, -0.2 + i * 0.04]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.02, 0.02, 0.3, 10]} /><meshStandardMaterial color="#c75a4d" roughness={0.6} /></mesh>)}</group>)}
        <Knife p={[0.06, lerp(0.42, 0.06, b), 0]} rot={[0, 1.57, 0]} />
      </group>
      <Tag tt={tt} at={2.4} p={[-0.48, 0.28, -0.2]} lines={["SQUASHED"]} bg={RED} fg="#fff" w={0.3} h={0.11} />
      <Tag tt={tt} at={5.2} p={[0.48, 0.28, -0.2]} lines={["CUT"]} bg={GOLD} w={0.2} h={0.11} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={6} txt="PLEASE SHARPEN YOURS" col={AMB} />} />;

// 15:27 · EL FRASQUITO DE GRASA: la gota blanca cae y el nivel sube; nada se tiraba
export const E_fatjar: F = ({ t, h }) => <Hero t={t} h={h} d={1.22} mode="blinds" cam={(tt) => orbita(tt, C([0.1, 0.42, 1.02], [0, 0.26, 0]), C([-0.18, 0.42, 0.95], [0, 0.26, 0]), 8.5)} set={{ spot: [0, 0.2, 0] as V, spotK: 0.65, warm: 0.8, bg: "#2d2622" }}
  scene={(tt) => { const lv = eio(tt, 1, 7), d = (tt * 0.9) % 1;
    return <>
      <Cyl p={[0, 0.19, 0]} r={0.16} h={0.38} c="#e6f2f6" op={0.25} rough={0.05} seg={40} /><Cyl p={[0, 0.04 + 0.13 * lv, 0]} r={0.145} h={0.02 + 0.26 * lv} c="#f4ebcf" rough={0.4} seg={40} />
      <mesh position={[0, 0.39, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.16, 0.012, 10, 40]} /><meshStandardMaterial color="#e6f2f6" transparent opacity={0.55} /></mesh>
      <group position={[0.18, 0.8, 0.02]} rotation={[0, 0, 0.5]}><Steak p={[0, 0, 0]} s={0.42} th={0.09} /><Box p={[0.12, -0.02, 0]} s={[0.1, 0.1, 0.13]} c="#f4ebcf" r={0.45} rad={0.02} /></group>
      <mesh position={[0, lerp(0.74, 0.2 + 0.26 * lv, d * d), 0]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.02, 14, 10]} /><meshPhysicalMaterial color="#f7efd4" roughness={0.1} clearcoat={1} /></mesh>
      <Tag tt={tt} at={4.4} p={[0.36, 0.14, 0.14]} lines={["TOMORROW'S", "VEGETABLES"]} bg={GOLD} w={0.34} h={0.2} rotY={-0.25} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={5.8} txt="NOTHING THROWN AWAY" col={AMB} />} />;

// 16:32 · CUÁN FUERTE: cuatro frutas en fila, cada una con unas tijeras más grandes y menos tiempo
export const E_strength: F = ({ t, h }) => <Hero t={t} h={h} d={1.36} ly={0.02} mode="drop" cam={(tt) => orbita(tt, C([-0.3, 0.55, 1.75], [0, 0.32, 0]), C([0.3, 0.55, 1.6], [0.1, 0.36, 0]), 8.5)} set={{ spot: [0.6, 0.2, 0] as V, spotK: 0.3, warm: 0.45 }}
  scene={(tt) => { const X = [-0.8, -0.27, 0.27, 0.8], S = [0.65, 1, 1.4, 2], L = ["1 HOUR", "PEAR", "20 MIN", "15 MIN"];
    return <>
      {[0, 1, 2, 3].map((i) => <Pop key={i} k={pop(tt, 0.5 + i * 1.05)} p={[X[i], 0, 0]}>
        {i === 0 && <Onion p={[0, 0.11, 0]} s={1.3} />}
        {i === 1 && <><mesh position={[0, 0.1, 0]} castShadow><sphereGeometry args={[0.11, 22, 16]} /><meshPhysicalMaterial color="#d7c75a" roughness={0.4} clearcoat={0.4} /></mesh><mesh position={[0, 0.21, 0]} castShadow><sphereGeometry args={[0.07, 18, 14]} /><meshPhysicalMaterial color="#d7c75a" roughness={0.4} /></mesh></>}
        {i === 2 && <group position={[0, 0.11, 0]}><mesh scale={[0.92, 1, 0.92]} castShadow><sphereGeometry args={[0.11, 24, 16]} /><meshStandardMaterial color="#6f5136" roughness={0.9} /></mesh><mesh position={[0, 0, 0.102]}><circleGeometry args={[0.092, 28]} /><meshStandardMaterial color="#8cc04a" roughness={0.5} /></mesh><mesh position={[0, 0, 0.104]}><circleGeometry args={[0.025, 20]} /><meshStandardMaterial color="#f4f2d0" /></mesh></group>}
        {i === 3 && <group><mesh position={[0, 0.15, 0]} scale={[0.82, 1.12, 0.82]} castShadow><sphereGeometry args={[0.13, 24, 18]} /><meshStandardMaterial color="#d59a2e" roughness={0.75} /></mesh>{Array.from({ length: 8 }, (_, j) => <mesh key={j} position={[0.03 * Math.cos(j * 0.8), 0.34, 0.03 * Math.sin(j * 0.8)]} rotation={[0.45 * Math.cos(j * 0.8), 0, -0.45 * Math.sin(j * 0.8)]}><coneGeometry args={[0.022, 0.2, 6]} /><meshStandardMaterial color="#4f8a3a" /></mesh>)}</group>}
        <Scissors p={[0, 0.5 + 0.1 * i, 0.08]} s={S[i]} open={0.1 + 0.28 * Math.abs(Math.sin(tt * (3 + i)))} />
      </Pop>)}
      {[0, 2, 3].map((i) => <Tag key={i} tt={tt} at={1.2 + i * 1.05} p={[X[i] * 0.94, 0.04, 0.3]} lines={[L[i]]} bg={i === 0 ? GRN : RED} fg="#fff" w={0.28} h={0.1} />)}
    </>; }}
  over={(tt) => <Ink tt={tt} at={5.4} txt="THE ONION IS FORGIVING" col={AMB} />} />;

// 17:38 · DE A DOS TANDAS: entra la tanda, el hierro se apaga; sale, vuelve el rojo, entra la otra
export const E_batches: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.15, 0.72, 1.05], [0, 0.1, 0]), C([-0.2, 0.68, 1.0], [0, 0.1, 0]), 8.5)} set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.6 }}
  scene={(tt) => { const in1 = eio(tt, 0.5, 1.1) * (1 - eio(tt, 3.0, 3.6)), in2 = eio(tt, 5.4, 6), heat = lerp(lerp(1, 0.15, eio(tt, 0.7, 1.8)), 1, eio(tt, 3.4, 5.2)) * (1 - 0.8 * in2);
    return <>
      <Pan p={[0, 0, 0]} s={1.2} heat={heat} /><Cyl p={[0, 0.102, 0]} r={0.44} h={0.003} c={col("#222", "#b5401a", heat)} e="#ff5a1a" ei={0.9 * heat} rough={0.5} cast={false} />
      {in1 > 0.02 && <Steak p={[lerp(-1.6, 0, in1), 0.15, 0]} s={0.82} th={0.09} crust={0.5 * in1} />}
      {in2 > 0.02 && <Steak p={[lerp(1.6, 0, in2), 0.15, 0]} s={0.82} th={0.09} kind="cheap" />}
      <Tag tt={tt} at={0.6} p={[-0.62, 0.42, -0.1]} lines={["1"]} bg={GOLD} w={0.14} h={0.14} /><Tag tt={tt} at={5.5} p={[0.62, 0.42, -0.1]} lines={["2"]} bg={GOLD} w={0.14} h={0.14} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.8} txt="LET THE PAN GET HOT AGAIN" col={AMB} size={72} />} />;

// 18:25 · CINCO MINUTOS: en corte; el jugo apretado en el centro vuelve a los lados bajo el papel
export const E_rest: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.3, 1.3], [0, 0.17, 0]), C([0.22, 0.32, 1.2], [0, 0.17, 0]), 9)} set={{ spot: [0, 0.1, 0] as V, spotK: 0.3, warm: 0.55, bg: "#2d2622" }}
  scene={(tt) => { const k = eio(tt, 1.6, 7.6), tent = eio(tt, 0.4, 1.3), N = 15;
    return <>
      <Box p={[0, 0.02, 0]} s={[1.4, 0.04, 0.5]} c="#a9804e" r={0.7} rad={0.008} />
      <Box p={[0, 0.14, -0.02]} s={[1.02, 0.2, 0.34]} c={CRUST} r={0.6} rad={0.024} />
      {Array.from({ length: N }, (_, i) => { const d = Math.abs(i - 7) / 7, hh = lerp(Math.max(0.01, 1 - d * 1.5), 0.62, k) * 0.16; return <Box key={i} p={[-0.45 + i * 0.0643, 0.06 + hh / 2, 0.152]} s={[0.058, hh, 0.003]} c={col("#ff3a2a", "#c7554a", k)} e="#ff2a1a" ei={0.55 * (1 - k)} cast={false} rad={0.001} />; })}
      <group position={[0, 0.36 + 0.5 * (1 - tent), 0]}>{[-1, 1].map((d) => <group key={d} rotation={[0, 0, -d * 0.42]} position={[d * 0.28, -0.1, 0]}><Box p={[0, 0, 0]} s={[0.66, 0.008, 0.44]} c="#dadde2" m={0.95} r={0.26} op={0.82} rad={0.003} /></group>)}</group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={5} txt="THE JUICE GOES BACK" col={AMB} />} />;

// 18:55 · A TRAVÉS: el cuchillo inclinado avanza; cada feta se abre y deja ver las sogas cortadas
export const E_across: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.3, 0.84, 0.95], [0, 0.06, 0]), C([-0.2, 0.75, 0.88], [0.05, 0.06, 0]), 10)} set={{ spot: [0, 0, 0] as V, spotK: 0.5, warm: 0.6 }}
  scene={(tt) => { const N = 9, x0 = -0.56, W = 0.13, kn = (i: number) => eio(tt, 1.2 + i * 0.62, 1.7 + i * 0.62), head = cl((tt - 1.2) / (0.62 * N));
    return <>
      <Box p={[0, 0.016, 0]} s={[1.6, 0.032, 0.7]} c="#a9804e" r={0.7} rad={0.008} />
      {Array.from({ length: N }, (_, i) => { const k = kn(i), sp = k * (i - (N - 1) / 2) * 0.05; return <group key={i} position={[x0 + (i + 0.5) * W + sp, 0.06, 0]} rotation={[0, 0, -0.35 * k]}>
        <Box p={[0, 0, 0]} s={[W * 0.96, 0.08, 0.42]} c={CRUST} r={0.55} rad={0.012} />
        {[...Array(5)].map((_, j) => <Box key={j} p={[0, 0.0415, -0.17 + j * 0.085]} s={[W * 0.9, 0.002, 0.016]} c="#6a3220" cast={false} rad={0.001} />)}
        {k > 0.5 && <Box p={[W * 0.49, 0, 0]} s={[0.002, 0.07, 0.4]} c="#c7574a" cast={false} rad={0.001} />}
      </group>; })}
      <Knife p={[x0 + head * W * N - 0.02, lerp(0.42, 0.18, Math.abs(Math.sin(tt * 3.2 * 1.6))), 0.02]} rot={[0, 1.57, 0.55]} s={1.5} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="ACROSS, NEVER ALONG" col={AMB} />} />;

// 19:12 · NADA QUE MORDER: los tramitos de soga quedan chiquitos y los dientes descansan
export const E_nochew: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.05, 0.42, 1.25], [0, 0.26, 0]), C([-0.22, 0.42, 1.15], [0, 0.26, 0]), 8.5)} set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.55, bg: "#2c2622" }}
  scene={(tt) => { const split = eio(tt, 0.8, 2.6), bite = tt > 3.2 ? 0.5 + 0.5 * Math.sin((tt - 3.2) * 2.2) : 0;
    return <>
      <Box p={[0, 0.02, 0]} s={[1.5, 0.04, 0.56]} c="#a9804e" r={0.7} rad={0.008} />
      {Array.from({ length: 9 }, (_, r) => Array.from({ length: 16 }, (_, i) => { const g = 0.07 * split; return <mesh key={`${r}${i}`} position={[(-7.5 + i) * (0.05 + g), 0.1 + (r % 3) * 0.04 + 0.01 * Math.sin(i + tt), -0.2 + r * 0.05]} rotation={[0.8 * split * rnd(i + r), 0.7 * split * rnd(i * r + 3), Math.PI / 2]}><cylinderGeometry args={[0.018, 0.018, 0.058, 8]} /><meshStandardMaterial color={["#c25a4e", "#b84a40"][(r + i) % 2]} roughness={0.6} /></mesh>; }))}
      <Teeth y={0.56 - 0.16 * bite} /><Teeth y={0.05} up />
    </>; }}
  over={(tt) => <Ink tt={tt} at={4.2} txt="NOTHING LEFT TO CHEW" col={AMB} />} />;
