// ohf9na · componentes de la segunda mitad: la lámina, la humedad, los errores, los contratistas, el secreto.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { H, Stage } from "./hkit";
import { P } from "./lib";
import { M, cl, eio, lerp, phys, rn } from "./h3d";
import { Bubbles, FlowPath, Tape } from "./okit";
import { Bottle, Dial, Envelope, Foto, Patch, Petri, PI, Plate, Slab, W3, Word } from "./moldkit";

type C = React.FC<{ t: number; h: H }>;
const K = (tt: number, a: number) => phys(tt, a, 8, 0.45);
const R = (tt: number, a: number) => cl((tt - a) / 0.5);

// ===== LA LÁMINA: seis lugares donde empieza el moho, corte de una pared exterior =====
const SPOT: { x: number; y: number; n: string; l: string[]; lx: number; ly: number }[] = [
  { x: 325, y: 700, n: "1", l: ["BOTTOM", "OUTSIDE CORNER"], lx: 322, ly: 545 }, { x: 930, y: 472, n: "2", l: ["UNDER THE WINDOW"], lx: 1322, ly: 372 }, { x: 930, y: 145, n: "3", l: ["TOP OF THE WALL"], lx: 1322, ly: 238 },
  { x: 1365, y: 640, n: "4", l: ["BEHIND THE", "TOILET TANK"], lx: 1340, ly: 510 }, { x: 1635, y: 700, n: "5", l: ["UNDER", "THE SINK"], lx: 1672, ly: 490 }, { x: 630, y: 660, n: "6", l: ["BACK OF", "THE CLOSET"], lx: 722, ly: 545 },
];
const blotch = (x: number, y: number, s: number, i: number) => Array.from({ length: 34 }, (_, j) => <circle key={j} cx={x + (rn(j, i) - 0.5) * s} cy={y + (rn(j, i + 3) - 0.5) * s * 0.72} r={3 + rn(j, i + 5) * s * 0.1} fill="#14110d" opacity={0.82} />);
const Label: React.FC<{ x: number; y: number; l: string[]; red?: boolean }> = ({ x, y, l, red }) => { const w = Math.max(...l.map((q) => q.length)) * 27.5 + 52, h = l.length * 50 + 26; return <g>
  <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={10} fill={red ? "#b3261e" : "#fbf6e8"} stroke="#3a2c1c" strokeWidth={3} />
  {l.map((q, i) => <text key={i} x={x} y={y - h / 2 + 49 + i * 50} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={800} fontSize={36} fill={red ? "#fff" : "#1d2b3a"}>{q}</text>)}
</g>; };
export const HLamina: C = ({ t, h }) => {
  const focus: number = h.focus ?? -1, shown: number = h.shown ?? 6, arrows: boolean = !!h.arrows, f = focus >= 0 ? SPOT[focus] : null;
  return <Stage t={t} h={h} mode="iris" bg="#efe6d0">{(tt) => {
    const k = f ? eio(tt, 0.2, 1.3) : 0, Z = arrows ? 1.25 : 1.7, z = lerp(1, Z, k), tx = f ? Math.max(1920 - 1920 * Z, Math.min(0, 960 - f.x * Z)) * k : 0, ty = f ? Math.max(1080 - 1080 * Z, Math.min(0, 540 - f.y * Z)) * k : 0, w = eio(tt, 0, 1);
    return <AbsoluteFill style={{ transform: `translate(${tx}px,${ty}px) scale(${z})`, transformOrigin: "0 0" }}><svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <rect width={1920} height={1080} fill="#efe6d0" />
      <polygon points="120,190 960,24 1800,190" fill="#5e4e3f" stroke="#2c2117" strokeWidth={6} />
      <rect x={150} y={190} width={1620} height={650} fill="#dfdcc7" stroke="#3a2c1c" strokeWidth={10} /><rect x={90} y={840} width={1740} height={64} fill="#8e8778" /><rect x={90} y={904} width={1740} height={176} fill="#6e5c44" />
      {Array.from({ length: 16 }, (_, i) => <line key={i} x1={150 + i * 108} y1={190} x2={150 + i * 108} y2={840} stroke="#cfcbb2" strokeWidth={3} />)}
      <rect x={800} y={270} width={260} height={170} fill="#bfe0ee" stroke="#3a2c1c" strokeWidth={8} /><line x1={930} y1={270} x2={930} y2={440} stroke="#3a2c1c" strokeWidth={6} /><rect x={782} y={440} width={296} height={20} fill="#7a5a3a" />
      <rect x={210} y={640} width={230} height={200} fill="#7a5433" stroke="#3a2c1c" strokeWidth={4} /><rect x={225} y={665} width={200} height={52} fill="#694626" /><rect x={225} y={735} width={200} height={52} fill="#694626" />
      <rect x={520} y={480} width={220} height={360} fill="#a78a60" stroke="#3a2c1c" strokeWidth={5} /><circle cx={720} cy={670} r={7} fill="#3a2c1c" />
      <rect x={1305} y={580} width={120} height={120} rx={8} fill="#f7f4ec" stroke="#6a6a6a" strokeWidth={4} /><rect x={1335} y={700} width={60} height={56} fill="#f7f4ec" stroke="#6a6a6a" strokeWidth={4} /><ellipse cx={1365} cy={776} rx={82} ry={44} fill="#f7f4ec" stroke="#6a6a6a" strokeWidth={4} />
      <rect x={1540} y={560} width={190} height={280} fill="#c9b895" stroke="#3a2c1c" strokeWidth={4} /><rect x={1520} y={544} width={230} height={20} fill="#7a7468" /><line x1={1635} y1={566} x2={1635} y2={838} stroke="#3a2c1c" strokeWidth={4} />
      {arrows && [300, 460, 620].map((y, i) => { const a = eio(tt, 0.5 + i * 0.3, 1.6 + i * 0.3), x2 = 1480 - 620 * a; return <g key={i}><line x1={1480} y1={y} x2={x2 + 36} y2={y} stroke="#2f7fc4" strokeWidth={14} strokeDasharray="28 16" />{a > 0.05 && <polygon points={`${x2},${y} ${x2 + 40},${y - 26} ${x2 + 40},${y + 26}`} fill="#2f7fc4" />}</g>; })}
      {SPOT.map((s, i) => i < shown && <g key={i} opacity={cl(w * 2)}>{blotch(s.x, s.y, 170, i + 1)}<circle cx={s.x} cy={s.y} r={38} fill="#b3261e" stroke="#fff" strokeWidth={5} /><text x={s.x} y={s.y + 16} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={800} fontSize={46} fill="#fff">{s.n}</text><g opacity={focus < 0 || i === focus ? 1 : 1 - k}><Label x={s.lx} y={s.ly} l={s.l} red={i === focus} /></g></g>)}
    </svg></AbsoluteFill>;
  }}</Stage>;
};

// 18:21 · LA PÁGINA: la figura del libro sale de la pared
export const HPage: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="#1d1a16">{(tt) => { const f = eio(tt, 0, 0.45); return <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
  <Img src={staticFile(P + "book_cta.jpg")} style={{ height: 880, borderRadius: 8, boxShadow: "0 40px 90px rgba(0,0,0,.7)", transform: `translateY(${(1 - f) * 260}px) rotate(${(1 - f) * -3}deg)` }} />
</AbsoluteFill>; }}</Stage>;

// 18:52 · LA TARJETA: dice MOLD; se da vuelta y dice WATER
export const HFlipTag: C = ({ t, h }) => <W3 t={t} h={h} mode="split" floor="wood" wall="brick" cam={{ at: [0, 0.6, 0], az: [-0.1, 0.1], el: [0.03, 0.06], r: [1.4, 1.2], fov: 30 }}>{(tt) => { const f = eio(tt, 1.8, 2.8); return <>
  <group position={[0, 0.6, 0]} rotation={[0, f * PI, 0]}>
    <Slab s={[0.9, 0.56, 0.016]} col="#e8dcbc" /><Word txt="MOLD" p={[0, 0, 0.012]} w={0.72} col="#17140f" />
    <Word txt="WATER" p={[0, 0, -0.012]} rot={[0, PI, 0]} w={0.72} col="#2f6fa8" />
  </group>
  {f > 0.85 && <Bubbles tt={tt} n={20} box={[0.8, 0.5, 0.02]} p={[0, 0.6, 0.05]} v={-0.2} r={0.012} col="#2f6fa8" op={0.85} />}
</>; }}</W3>;

// 20:43 · LA HUMEDAD: la aguja barre; de 60 para arriba brota
export const HHumid: C = ({ t, h }) => <W3 t={t} h={h} mode="iris" cam={{ at: [0, 0.58, -0.3], az: [0.16, -0.1], el: [0.03, 0.08], r: [2.1, 1.85], fov: 32 }}>{(tt) => { const a = tt < 3 ? eio(tt, 0.3, 2.4) * 0.45 : lerp(0.45, 0.72, eio(tt, 3, 4.6)), s = cl((a - 0.6) / 0.12); return <>
  <Dial id={"hum" + Math.round(a * 60)} v={a} p={[0, 0.62, -0.4]} r={0.4} marks={100} green={[0.3, 0.5]} red={[0.6, 1]} rim="brass" />
  {[0, 1, 2, 3, 4].map((i) => <Patch key={i} p={[-0.7 + i * 0.35, 0.2 + (i % 2) * 0.05, -0.488]} w={0.17} k={s} seed={30 + i} />)}
  <Tape txt="30-50%" col="#1b6e43" p={[0, 0.12, -0.42]} w={0.3} k={K(tt, 2.3)} rev={R(tt, 2.3)} />
</>; }}</W3>;

// 21:56 · LA PARED SIN AISLAR: el frío avanza desde la esquina
const frio = (q: number) => `rgb(${Math.round(lerp(92, 217, q))},${Math.round(lerp(142, 207, q))},${Math.round(lerp(192, 189, q))})`;
export const HCold: C = ({ t, h }) => <W3 t={t} h={h} mode="wipe" wall="plaster" bg="#0d1216" cam={{ at: [-0.3, 0.6, -0.25], az: [0.42, 0.56], el: [0.04, 0.09], r: [1.6, 1.42], fov: 34 }}>{(tt) => { const k = eio(tt, 0.3, 2.6); return <>
  <Slab s={[0.02, 1.8, 1.5]} p={[-0.86, 0.9, 0.25]} col="#d9cfbd" />
  {Array.from({ length: 12 }, (_, i) => i / 12 < k ? <Slab key={i} s={[0.112, 1.4, 0.012]} p={[-0.79 + i * 0.11, 0.7, -0.486]} col={frio(i / 11)} /> : null)}
  {Array.from({ length: 10 }, (_, i) => i / 10 < k ? <Slab key={i} s={[0.012, 1.4, 0.112]} p={[-0.846, 0.7, -0.44 + i * 0.11]} col={frio(i / 9)} /> : null)}
  <Tape txt="COLD CORNER" col="#1c2a3a" p={[-0.34, 1.02, -0.44]} w={0.5} k={K(tt, 1)} rev={R(tt, 1)} />
  <Patch p={[-0.6, 0.42, -0.476]} w={0.56} k={eio(tt, 1.2, 3.2)} seed={61} />
</>; }}</W3>;

// 22:41 · CINCO ERRORES: las fichas en el tablero; la primera se da vuelta
export const HChips: C = ({ t, h }) => <W3 t={t} h={h} mode="drop" floor="wood" wall="brick" cam={{ at: [0, 0.6, 0], az: [0.22, -0.14], el: [0.05, 0.1], r: [2.3, 2.05], fov: 32 }}>{(tt) => <>
  <Slab s={[2.05, 0.6, 0.03]} p={[0, 0.6, -0.1]} col="#7a5a3a" />
  {[0, 1, 2, 3, 4].map((i) => { const f = K(tt, 0.2 + i * 0.15), fl = i === 0 ? eio(tt, 1.2, 2) : 0; return <group key={i} position={[-0.76 + i * 0.38, 0.6, -0.04]} rotation={[0, fl * PI, 0]} scale={[cl(f), cl(f), 1]}><Slab s={[0.34, 0.42, 0.06]} col="#d8c28e" /><Word txt={String(i + 1)} p={[0, 0, 0.032]} w={0.34} col="#1c2a3a" />{i === 0 && <group rotation={[0, PI, 0]} position={[0, 0, -0.032]}><Slab s={[0.03, 0.14, 0.01]} p={[0, 0.13, 0.002]} col="#8a5a2e" /><Slab s={[0.09, 0.08, 0.014]} p={[0, 0.04, 0.003]} col="#b3261e" /><Word txt="PAINT" p={[0, -0.1, 0.012]} w={0.32} col="#b3261e" /></group>}</group>; })}
</>}</W3>;

// 22:51 · LA PIEL DE PINTURA: abajo, a oscuras, el moho sigue contento
export const HSkin: C = ({ t, h }) => <W3 t={t} h={h} mode="split" floor="wood" wall="brick" bg="#10130f" cam={{ at: [0, 0.46, 0.1], az: [-0.26, 0.12], el: [0.2, 0.26], r: [2.2, 1.95], fov: 30 }}>{(tt) => { const k = eio(tt, 0.4, 2.6); return <>
  <Slab s={[1.7, 0.5, 0.4]} p={[0, 0.3, 0]} col="#4a4336" />
  {[0.14, 0.42, 0.7].map((x, i) => <Patch key={i} p={[x, 0.4, 0.205]} w={0.4} k={cl(k * 3 - i * 0.6)} seed={70 + i} />)}
  <Slab s={[0.85, 0.5, 0.014]} p={[-0.425, 0.305, 0.215]} col="#eee9db" />
  <group position={[0.425, 0.055, 0.215]} rotation={[k * 1.1, 0, 0]}><Slab s={[0.85, 0.5, 0.014]} p={[0, 0.25, 0]} col="#eee9db" /></group>
  <Tape txt="PAINT ON TOP" p={[-0.42, 0.74, 0.1]} w={0.5} k={K(tt, 1)} rev={R(tt, 1)} />
  <Tape txt="STILL GROWING" col="#b3261e" p={[0.42, 0.74, 0.1]} w={0.56} k={K(tt, 3)} rev={R(tt, 3)} />
</>; }}</W3>;

// 23:23 · LA ASPIRADORA POR DENTRO: entra por delante, sale por atrás
const HOSE = new THREE.CatmullRomCurve3([[-0.2, 0.5, 0.04], [-0.42, 0.6, 0.1], [-0.68, 0.42, 0.14], [-0.8, 0.12, 0.14], [-0.96, 0.05, 0.14]].map((q) => new THREE.Vector3(q[0], q[1], q[2])));
export const HVac: C = ({ t, h }) => <W3 t={t} h={h} mode="iris" wall="plaster" cam={{ at: [0.02, 0.44, 0], az: [-0.1, 0.06], el: [0.1, 0.14], r: [2.4, 2.12], fov: 32 }}>{(tt) => <>
  <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.26, 0.23, 0.48, 40]} />{M.plastic({ col: "#b8a040", op: 0.72 })}</mesh>
  <mesh position={[0, 0.58, 0]} castShadow><cylinderGeometry args={[0.2, 0.275, 0.1, 40]} />{M.plastic({ col: "#25282b" })}</mesh>
  {([[-0.2, 0.15], [0.2, 0.15], [-0.2, -0.15], [0.2, -0.15]] as number[][]).map((q, i) => <mesh key={i} position={[q[0], 0.04, q[1]]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.03, 18]} />{M.rubber({ col: "#111" })}</mesh>)}
  <mesh><tubeGeometry args={[HOSE, 40, 0.032, 12, false]} />{M.rubber({ col: "#26262a" })}</mesh>
  <mesh position={[0.27, 0.48, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.06, 0.06, 0.1, 22]} />{M.plastic({ col: "#25282b" })}</mesh>
  <FlowPath tt={tt} pts={[[-1, 0.05, 0.14], [-0.68, 0.42, 0.14], [-0.2, 0.5, 0.04], [0, 0.35, 0.02], [0.3, 0.48, 0], [1, 0.62, 0.1]]} k={eio(tt, 0.3, 1.5)} col="#17140f" r={0.015} />
  <Bubbles tt={tt} n={32} box={[0.5, 0.42, 0.4]} p={[0.72, 0.6, 0.05]} v={0.2} r={0.012} col="#17140f" op={0.85} />
  <Tape txt="OUT THE BACK" col="#b3261e" p={[0.56, 0.98, -0.44]} w={0.48} k={K(tt, 1.8)} rev={R(tt, 1.8)} />
</>}</W3>;

// 24:51 · 14 MESES: caen las hojas del almanaque y vuelve la misma mancha
export const HCal: C = ({ t, h }) => <W3 t={t} h={h} mode="drop" cam={{ at: [0, 0.6, -0.3], az: [-0.18, 0.12], el: [0.03, 0.08], r: [1.55, 1.3], fov: 32 }}>{(tt) => { const n = Math.min(14, Math.floor(cl((tt - 0.3) / 3.8) * 14)); return <>
  <Slab s={[0.46, 0.6, 0.02]} p={[-0.48, 0.68, -0.47]} col="#f2ecdc" /><Word txt={String(n)} p={[-0.48, 0.68, -0.452]} w={0.3} col="#b3261e" />
  <Word txt="MONTHS" p={[-0.48, 0.44, -0.452]} w={0.28} col="#1c2a3a" />
  <Patch p={[0.42, 0.56, -0.488]} w={0.72} k={eio(tt, 0.5, 4.2)} seed={1} />
</>; }}</W3>;

// 25:13 · DOS GORRAS: el que mira y el que cobra se separan con una cuña
const Cap: React.FC<{ x: number; col: string; dark: string; ry: number }> = ({ x, col, dark, ry }) => <group position={[x, 0.66, 0.02]} rotation={[0.12, ry, 0]}>
  <mesh scale={[1, 0.84, 1.08]} castShadow><sphereGeometry args={[0.22, 36, 18, 0, PI * 2, 0, PI / 2]} />{M.matte({ col })}</mesh>
  <mesh position={[0, 0.195, 0]}><sphereGeometry args={[0.022, 14, 14]} />{M.matte({ col: dark })}</mesh>
  <mesh position={[0, 0.008, 0.2]} scale={[0.92, 1, 1.3]} castShadow><cylinderGeometry args={[0.21, 0.21, 0.016, 36, 1, false, -PI / 2, PI]} />{M.matte({ col: dark })}</mesh>
</group>;
export const HBadges: C = ({ t, h }) => <W3 t={t} h={h} mode="split" floor="wood" wall="brick" cam={{ at: [0, 0.62, 0], az: [0.14, -0.1], el: [0.06, 0.1], r: [2.25, 2], fov: 32 }}>{(tt) => { const s = eio(tt, 1.2, 2.4), w = phys(tt, 1, 8, 0.4), xl = -0.24 - s * 0.32, xr = 0.24 + s * 0.32; return <>
  <Cap x={xl} col="#2f6fa8" dark="#1c4468" ry={1} /><Cap x={xr} col="#c23b2e" dark="#7c2019" ry={-1} />
  <Tape txt="WHO TESTS" p={[xl, 0.32, 0.12]} w={0.46} /><Tape txt="WHO FIXES" col="#b3261e" p={[xr, 0.32, 0.12]} w={0.46} />
  <mesh position={[0, lerp(1.7, 0.74, cl(w)), 0.02]} rotation={[0, 0, PI]}><coneGeometry args={[0.1, 0.56, 4]} />{M.wood({ base: [120, 78, 44] })}</mesh>
</>; }}</W3>;

// 25:50 · CUALQUIER MESADA: la caja de Petri abierta se llena sola
export const HDishAny: C = ({ t, h }) => <W3 t={t} h={h} mode="iris" floor="wood" wall="plaster" cam={{ at: [0, 0.1, 0], az: [-0.3, 0.2], el: [0.6, 0.72], r: [1, 0.82], fov: 30 }}>{(tt) => <>
  <Petri p={[0, 0.02, 0]} s={2.1} seed={41} k={eio(tt, 0.3, 3.2)} />
  <Tape txt="ANY COUNTER, ANY HOUSE" p={[0, 0.03, 0.46]} rot={[-1.1, 0, 0]} w={0.72} k={K(tt, 2.4)} rev={R(tt, 2.4)} />
</>}</W3>;

// 26:53 · EL SOBRE: se abre y KILL queda tachado
export const HPayoff: C = ({ t, h }) => <W3 t={t} h={h} mode="drop" floor="wood" wall="brick" cam={{ at: [0, 0.62, 0], az: [0.2, -0.12], el: [0.03, 0.08], r: [2.6, 2.3], fov: 32 }}>{(tt) => { const o = eio(tt, 0.5, 1.5), u = eio(tt, 1.4, 2.6), x = eio(tt, 3.2, 3.8); return <>
  <Envelope p={[0, 0.34, -0.22]} rot={[0, 0.22, -0.07]} s={1.5} open={o} />
  <Plate txt="KILL" p={[0, lerp(0.3, 0.98, u), 0.1]} w={1.05} />
  <Slab s={[Math.max(0.01, 1.2 * x), 0.05, 0.01]} p={[0, 0.98, 0.15]} rot={[0, 0, 0.06]} col="#d3362b" />
  <Tape txt="DEAD MOLD IS STILL MOLD" col="#b3261e" p={[0, 0.2, 0.2]} w={0.95} k={K(tt, 4.2)} rev={R(tt, 4.2)} />
</>; }}</W3>;

// 27:15 · VIVA O MUERTA: las dos caen; el pulmón se enciende igual
const Lung: React.FC<{ x: number; on: number }> = ({ x, on }) => { const mat = <meshStandardMaterial color={on > 0.3 ? "#d3362b" : "#a58c86"} emissive="#d3362b" emissiveIntensity={on * 0.7} roughness={0.65} />; return <group position={[x, 0.46, 0]}>
  <mesh position={[0, 0.32, 0]}><cylinderGeometry args={[0.026, 0.03, 0.26, 18]} />{M.matte({ col: "#c9b7ae" })}</mesh>
  {[-1, 1].map((s) => <group key={s}>
    <mesh position={[s * 0.06, 0.15, 0.03]} rotation={[0, 0, s * 0.8]}><cylinderGeometry args={[0.016, 0.02, 0.18, 12]} />{M.matte({ col: "#c9b7ae" })}</mesh>
    <mesh position={[s * 0.15, 0.11, 0]} scale={[0.72, 0.8, 0.42]}>{<sphereGeometry args={[0.15, 26, 26]} />}{mat}</mesh>
    <mesh position={[s * 0.17, -0.09, 0]} scale={[0.92, 1.02, 0.42]}>{<sphereGeometry args={[0.16, 26, 26]} />}{mat}</mesh>
  </group>)}
</group>; };
export const HLung: C = ({ t, h }) => <W3 t={t} h={h} mode="split" floor="wood" wall="brick" bg="#0d1013" cam={{ at: [0, 0.6, 0], az: [-0.1, 0.1], el: [0.03, 0.06], r: [2.4, 2.15], fov: 32 }}>{(tt) => { const f = eio(tt, 0.5, 1.5), on = eio(tt, 1.5, 2.2); return <>
  <Lung x={-0.56} on={on} /><Lung x={0.56} on={on} />
  <Patch p={[-0.56, lerp(1.1, 0.72, f), 0.12]} w={0.2} k={1 - on} seed={51} base="#6a6a62" /><Patch p={[0.56, lerp(1.1, 0.72, f), 0.12]} w={0.2} k={1 - on} seed={52} />
  <Tape txt="DEAD" p={[-0.56, 1.0, 0]} w={0.24} k={K(tt, 0.3)} rev={R(tt, 0.3)} /><Tape txt="ALIVE" p={[0.56, 1.0, 0]} w={0.26} k={K(tt, 0.3)} rev={R(tt, 0.3)} />
  {tt > 2.2 && <Word txt="SAME" p={[0, 0.5, 0.1]} w={0.5} col="#f7f4ee" k={K(tt, 2.2)} />}
</>; }}</W3>;

// 28:07 · NINGÚN ATOMIZADOR: la fila se cae y queda una palabra
export const HDry: C = ({ t, h }) => <W3 t={t} h={h} mode="wipe" wall="brick" cam={{ at: [-0.02, 0.44, 0], az: [-0.14, 0.12], el: [0.12, 0.16], r: [2.4, 2.14], fov: 32 }}>{(tt) => <>
  {[0, 1, 2].map((i) => { const f = eio(tt, 0.3 + i * 0.26, 0.9 + i * 0.26); return <Bottle key={i} p={[-0.88 + i * 0.6, f * 0.1, 0.06 * (i % 2)]} rot={[0, 0, -f * PI / 2]} s={1.55} col={["#8fc1a8", "#e0b84c", "#d9d9d2"][i]} fill={0} />; })}
  {tt > 1.7 && <Word txt="DRY" p={[-0.02, 0.62, 0.08]} w={0.9} col="#f7f4ee" k={K(tt, 1.7)} />}
</>}</W3>;

// 28:50 · EL REPASO: la línea de pasos se va tildando
const STEPS = ["SWAB", "MEASURE", "SOAP", "RAG", "PEROXIDE", "DRY"];
export const HRecap: C = ({ t, h }) => <W3 t={t} h={h} mode="drop" floor="wood" wall="paper" cam={{ at: [0, 0, 0.24], az: [0.08, -0.05], el: [1.15, 1.25], r: [2.35, 2.1], fov: 30 }}>{(tt) => <>
  {STEPS.map((s, i) => { const x = i < 3 ? -0.46 : 0.46, z = -0.03 + (i % 3) * 0.27; return <group key={i}><Tape txt={s} p={[x - 0.06, 0.012, z]} rot={[-PI / 2, 0, 0]} w={0.5} k={K(tt, 0.2 + i * 0.3)} rev={R(tt, 0.2 + i * 0.3)} />{tt > 0.5 + i * 0.3 && <Word txt="✓" p={[x + 0.3, 0.015, z]} rot={[-PI / 2, 0, 0]} w={0.3} col="#1b6e43" k={K(tt, 0.5 + i * 0.3)} />}</group>; })}
</>}</W3>;

// 30:29 · EL PRÓXIMO: la tarjeta se clava en la pared del taller
export const HEnd: C = ({ t, h }) => <W3 t={t} h={h} mode="iris" wall="brick" floor="wood" cam={{ at: [0, 0.6, 0], az: [-0.12, 0.1], el: [0.03, 0.07], r: [1.5, 1.28], fov: 32 }}>{(tt) => <>
  <group position={[0.26, 0.62, -0.42]} rotation={[0, 0, (1 - K(tt, 0.3)) * 0.4]}><Slab s={[1, 0.6, 0.012]} col="#f3efe4" /><Foto src="img/ohf9na/p208.jpg" p={[0, 0, 0.008]} w={0.94} h={0.53} />
    {[[-0.46, 0.27], [0.46, 0.27]].map((q, i) => <mesh key={i} position={[q[0], q[1], 0.018]}><sphereGeometry args={[0.018, 14, 14]} />{M.plastic({ col: "#b3261e" })}</mesh>)}
    <Tape txt="WATCH NEXT" p={[0, -0.19, 0.016]} w={0.46} /></group>
  <Tape txt="THE COLD WALL" col="#b3261e" p={[-0.48, 0.36, -0.4]} rot={[0, 0, 0.04]} w={0.56} k={K(tt, 1.2)} rev={R(tt, 1.2)} />
</>}</W3>;
