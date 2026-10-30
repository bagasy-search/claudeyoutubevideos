// mar29d · componentes únicos 1-18 (ductos), vuelta 2 en 3D (kit r3k): objetos grandes, la acción a la vista, sin rótulos que repitan la voz.
// La acción se reparte en TODO el plano (u = 0..1). Registro: D:/rtmp/mar29_COMPONENTES.md
import React from "react";
import { H, Stage } from "./hkit";
import { BOLD, Bx, Cy, PLANKS, PLASTER, Pl, Puff, S3 as S3k, Sp, To, Tube, Txt, V3, canvasTex, cl, drop, lerp, lv, rnd, sm, win } from "../kits/r3k/r3k";
import { Odo, Thermo3 } from "./r3c";

// cámara más cerca: acerca p hacia l en un factor k (por defecto 0,72)
const S3: React.FC<React.ComponentProps<typeof S3k> & { k?: number }> = ({ k = 0.72, p, l, ...r }) =>
  <S3k p={[l[0] + (p[0] - l[0]) * k, l[1] + (p[1] - l[1]) * k, l[2] + (p[2] - l[2]) * k]} l={l} {...r} />;
const U = (tt: number, h: H) => cl(tt / (h.out - h.at));
const bump = (u: number, a: number, f = 26, k = 8) => (u > a ? Math.sin((u - a) * f) * Math.exp(-(u - a) * k) : 0);
// ducto de chapa galvanizada horizontal (eje X), centro en p
const Duct: React.FC<{ p: V3; L: number; R?: number; r?: V3; c?: string; o?: number; e?: string; ei?: number }> = ({ p, L, R = 0.12, r = [0, 0, Math.PI / 2], c = "#b9bec4", o, e, ei }) =>
  <Cy rt={R} h={L} p={p} r={r} c={c} m={0.85} ro={0.33} o={o} e={e} ei={ei} />;
const Ring: React.FC<{ p: V3; R?: number; r?: V3 }> = ({ p, R = 0.125, r = [0, Math.PI / 2, 0] }) => <To R={R} t={0.012} p={p} r={r} c="#9aa0a6" m={0.9} ro={0.3} />;
// rejilla de piso/pared: marco + lamas, de frente a +y
const Grille: React.FC<{ p: V3; w?: number; d?: number; r?: V3; c?: string; e?: string; ei?: number }> = ({ p, w = 0.32, d = 0.14, r = [0, 0, 0], c = "#c9ccd0", e, ei = 0 }) =>
  <group position={p} rotation={r}>
    <Bx s={[w, 0.02, d]} c={c} m={0.8} ro={0.3} e={e} ei={ei} />
    {Array.from({ length: 6 }, (_, i) => <Bx key={i} s={[w * 0.9, 0.024, 0.008]} p={[0, 0.004, -d / 2 + 0.015 + i * (d - 0.03) / 5]} r={[0.5, 0, 0]} c="#6a6e74" m={0.8} ro={0.3} />)}
  </group>;
const bill = () => canvasTex("billete20", 512, 220, (g) => { g.fillStyle = "#cfe0c0"; g.fillRect(0, 0, 512, 220); g.strokeStyle = "#3f6a3a"; g.lineWidth = 10; g.strokeRect(14, 14, 484, 192); g.fillStyle = "#3f6a3a"; g.font = BOLD(110); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("$20", 256, 116); });
// chorro de aire grueso y luminoso de a hacia b (k = cuánto llegó)
const Jet: React.FC<{ a: V3; b: V3; k: number; w?: number; c?: string; e?: string; tt: number; n?: number; sd?: number }> = ({ a, b, k, w = 1, c = "#ff9a4a", e = "#ff7a20", tt, n = 6, sd = 0 }) => {
  if (k < 0.04) return null;
  const at = (f: number): V3 => [lerp(a[0], b[0], f), lerp(a[1], b[1], f) + 0.06 * Math.sin(f * 3), lerp(a[2], b[2], f)];
  return <>
    <Tube pts={[a, at(0.5 * k), at(k)]} rad={0.03 * w} c={c} e={e} ei={1.8} o={0.85} />
    {Array.from({ length: n }, (_, i) => { const f = (tt * 0.9 + i / n + sd) % 1; return <Puff key={i} p={at(f * k)} s={(0.18 + 0.3 * f) * w} c={c} o={0.6 * k * Math.sin(f * Math.PI)} />; })}
  </>;
};
// polilínea recorrida hasta la fracción k, como tubo luminoso
const Trail: React.FC<{ pts: V3[]; k: number; rad?: number }> = ({ pts, k, rad = 0.022 }) => {
  if (k < 0.02) return null;
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1], q[2] - pts[i][2])), tot = seg.reduce((a, b) => a + b, 0);
  const out: V3[] = [pts[0]]; let run = 0; const goal = tot * k;
  for (let i = 0; i < seg.length; i++) { const a = pts[i], b = pts[i + 1]; if (run + seg[i] <= goal) { out.push(b); run += seg[i]; } else { const f = (goal - run) / seg[i]; out.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f), lerp(a[2], b[2], f)]); break; } }
  const dense: V3[] = [out[0]]; out.slice(1).forEach((q, i) => { const a = out[i]; [0.33, 0.66, 1].forEach((f) => dense.push([lerp(a[0], q[0], f), lerp(a[1], q[1], f), lerp(a[2], q[2], f)])); });
  return <Tube pts={dense} rad={rad} c="#6fe39a" e="#2fbf6a" ei={1.8} />;
};
const Sofa: React.FC<{ p?: V3; r?: V3; c?: string }> = ({ p = [0, 0, 0], r = [0, 0, 0], c = "#5e7a92" }) =>
  <group position={p} rotation={r}>
    <Bx s={[0.8, 0.14, 0.38]} p={[0, 0.13, 0]} c={c} ro={0.9} rad={0.04} />
    {[-0.15, 0.15].map((x, i) => <Bx key={i} s={[0.3, 0.08, 0.3]} p={[x, 0.22, 0.04]} c={c} ro={0.95} rad={0.035} />)}
    <Bx s={[0.8, 0.32, 0.1]} p={[0, 0.35, -0.15]} c={c} ro={0.9} rad={0.04} />
    {[-0.17, 0.17].map((x, i) => <Bx key={i} s={[0.33, 0.2, 0.08]} p={[x, 0.37, -0.08]} r={[-0.15, 0, 0]} c="#6a88a2" ro={0.95} rad={0.035} />)}
    {[-0.4, 0.4].map((x, i) => <Bx key={i} s={[0.1, 0.26, 0.38]} p={[x, 0.2, 0]} c="#4e6a80" ro={0.9} rad={0.04} />)}
    {[[-0.38, 0.15], [0.38, 0.15], [-0.38, -0.15], [0.38, -0.15]].map(([x, z], i) => <Cy key={i} rt={0.022} h={0.06} p={[x, 0.03, z]} c="#4a3322" ro={0.5} />)}
  </group>;
const Boot: React.FC<{ p: V3 }> = ({ p }) =>
  <group position={p}>
    <Bx s={[0.08, 0.03, 0.3]} p={[0, 0.015, 0]} c="#241d1a" ro={0.8} />
    <Bx s={[0.078, 0.07, 0.15]} p={[0, 0.065, 0.07]} c="#9a6532" ro={0.55} rad={0.03} />
    <Bx s={[0.074, 0.22, 0.09]} p={[0, 0.14, -0.05]} c="#9a6532" ro={0.55} rad={0.03} />
    <Cy rt={0.05} h={0.22} p={[0, 0.3, -0.05]} c="#2d3d55" ro={0.9} />
  </group>;

const JTS: { j: V3; d: V3 }[] = [
  { j: [-0.55, 0.3, 0.12], d: [-0.5, 0.1, 0.8] },
  { j: [0.05, 0.3, 0.12], d: [0.5, 0.55, 0.75] },
  { j: [0.45, 0.8, 0.12], d: [0.95, 0.95, 0.65] },
  { j: [0.45, 1.4, 0.12], d: [0.75, 1.75, 0.6] },
];
// 1 · la casa en corte: el furnace del sótano empuja aire por el tronco y de cada unión se escapan chorros gruesos y luminosos de aire caliente hacia el ático, las paredes y el sótano
export const HCutaway: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = lerp(0.35, -0.2, win(u, 0, 1)), leak = win(u, 0.15, 0.45);
  return <S3 k={0.9} p={[2.6 * Math.sin(a), 1.1, 2.6 * Math.cos(a)]} l={[0.0, 0.78, 0]} fov={42} floor={null}>
    <pointLight position={[0.2, 0.9, 1.0]} intensity={2.6 * leak} distance={3} color="#ff9a3a" />
    <Bx s={[2.4, 1.9, 0.04]} p={[0, 0.85, -0.5]} map={PLASTER()} c="#e9e0cf" ro={0.95} ns />
    <Bx s={[2, 0.05, 1]} p={[0, 0.0, 0]} c="#6b5a48" ro={0.9} />
    <Bx s={[2, 0.05, 1]} p={[0, 0.62, 0]} map={PLANKS()} c="#c9a77a" ro={0.7} />
    <Bx s={[2, 0.05, 1]} p={[0, 1.22, 0]} c="#e9e4da" ro={0.9} />
    <Bx s={[0.05, 1.8, 1]} p={[-1.0, 0.9, 0]} map={PLASTER()} c="#f0e8da" ro={0.95} />
    <mesh position={[0, 1.55, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[1.45, 0.3, 4, 1, true]} /><meshStandardMaterial color="#8a3a2a" roughness={0.8} side={2} transparent opacity={0.3} /></mesh>
    <Bx s={[0.36, 0.5, 0.34]} p={[-0.78, 0.28, 0.05]} c="#d8d4cc" m={0.3} ro={0.4} rad={0.02} />
    <Bx s={[0.2, 0.14, 0.01]} p={[-0.78, 0.22, 0.225]} c="#ffb070" e="#ff7a20" ei={1.2} />
    <Tube pts={[[-0.6, 0.4, 0.05], [-0.2, 0.3, 0.05], [0.3, 0.3, 0.05], [0.45, 0.6, 0.05], [0.45, 1.5, 0.05]]} rad={0.08} c="#b9bec4" m={0.85} ro={0.33} />
    {JTS.map((q, i) => <group key={i}>
      <Sp rad={0.1} p={q.j} c="#ffb14a" e="#ff8a20" ei={2 * leak} o={0.6 * leak + 0.1} />
      <Jet a={q.j} b={q.d} k={leak * (0.85 + 0.15 * bump(u, 0.4, 12, 3))} w={2.2} tt={tt} n={9} sd={i * 0.17} />
    </group>)}
  </S3>;
}}</Stage>;

// 2 · los rayos X: una barra de luz fina recorre la pared y, donde pasa, el yeso se vuelve vidrio y los ductos de chapa plateada escondidos atrás se encienden en azul
export const HVeins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), x = lerp(-0.9, 0.9, win(u, 0.08, 0.78)), N = 12, W = 1.9 / N, vis = win(u, 0.05, 0.12) * (1 - win(u, 0.78, 0.86));
  const rev = (px: number) => win(x - px, 0, 0.22);
  const bx = [-0.7, -0.25, 0.2, 0.65];
  return <S3 k={0.7} p={lv([0.3, 1.0, 2.3], [-0.15, 1.0, 2.0], win(u, 0, 1))} l={[0, 1.0, 0]} fov={40} floor={null}>
    <Bx s={[3.6, 2.4, 0.04]} p={[0, 1, -0.3]} c="#171b20" ro={0.9} ns />
    {[-0.93, -0.47, -0.02, 0.43, 0.93].map((sx, i) => <Bx key={i} s={[0.05, 1.3, 0.08]} p={[sx, 1.0, -0.2]} c="#5a4a38" ro={0.8} />)}
    {Array.from({ length: 6 }, (_, i) => { const px = -0.8 + i * 0.32; return <Duct key={i} p={[px, 1.45, -0.08]} L={0.32} R={0.11} c="#cfd3d9" e="#4fd0ff" ei={1.3 * rev(px - 0.16)} />; })}
    {bx.map((b, i) => <group key={i}>
      <Tube pts={[[b, 1.42, -0.08], [b, 1.2, -0.08], [b + 0.06, 1.0, -0.08], [b, 0.85, -0.08]]} rad={0.065} c="#cfd3d9" m={0.85} ro={0.33} e="#4fd0ff" ei={1.3 * rev(b - 0.1)} />
      <To R={0.07} t={0.014} p={[b + 0.06, 1.0, -0.08]} r={[Math.PI / 2, 0, 0]} c="#9aa0a6" m={0.9} ro={0.3} />
      <Bx s={[0.26, 0.18, 0.08]} p={[b, 0.74, -0.08]} c="#dde0e4" m={0.8} ro={0.3} e="#4fd0ff" ei={1 * rev(b - 0.12)} />
      {[-0.05, 0, 0.05].map((dy, j) => <Bx key={j} s={[0.22, 0.012, 0.09]} p={[b, 0.74 + dy, -0.035]} c="#2a2e34" />)}
    </group>)}
    {Array.from({ length: N }, (_, i) => { const cx = -0.95 + (i + 0.5) * W, seen = win(x - cx, 0, 0.12);
      return <Bx key={i} s={[W - 0.003, 1.28, 0.04]} p={[cx, 1, 0.1]} map={PLASTER()} c={seen > 0.5 ? "#a8dcff" : "#e6dccb"} o={1 - 0.88 * seen} ro={0.9} ns />; })}
    <Bx s={[0.025, 1.4, 0.06]} p={[x, 1, 0.16]} c="#bff0ff" e="#4fd0ff" ei={1.6} o={0.85 * vis} ns />
    <Puff p={[x, 1, 0.2]} s={0.5} c="#4fd0ff" o={0.2 * vis} />
  </S3>;
}}</Stage>;

const HOLES = [-0.4, 0.05, 0.45];
// 3 · el colador: diez bocanadas luminosas entran en fila al ducto agujereado; en cada agujero se apaga y cae una, y al final llegan siete al contador
export const HSieve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), lost = [2, 5, 8];
  let arrived = 0;
  const balls = Array.from({ length: 10 }, (_, i) => {
    const t0 = 0.05 + i * 0.05, f = cl((u - t0) / 0.45), li = lost.indexOf(i);
    if (f <= 0) return null;
    const x0 = lerp(-1.0, 1.0, f);
    if (li >= 0) {
      const hx = HOLES[li], tf = t0 + ((hx + 1) / 2) * 0.45;
      if (u >= tf) { const ff = cl((u - tf) / 0.1); return <Sp key={i} rad={0.08} p={[hx, 0.62 - 0.56 * ff * ff, 0.04 + 0.34 * ff]} c="#8a6a5a" e="#ff5a2a" ei={1.6 * (1 - ff) + 0.1} ro={0.4} o={1 - 0.7 * ff} />; }
      return <Sp key={i} rad={0.08} p={[x0, 0.62, 0.02]} c="#9fd4ff" e="#4fb0ff" ei={2} ro={0.3} />;
    }
    if (f >= 1) { arrived++; const ff = cl((u - t0 - 0.45) / 0.09); const k = i < 5 ? i - 1 : i - 2; return <Sp key={i} rad={0.08} p={[1.0 + 0.2 * ff + 0.04 * (k % 2), 0.62 - 0.52 * ff * ff, 0.02 + (k - 3) * 0.02]} c="#9fd4ff" e="#4fb0ff" ei={2} ro={0.3} />; }
    return <Sp key={i} rad={0.08} p={[x0, 0.62, 0.02]} c="#9fd4ff" e="#4fb0ff" ei={2} ro={0.3} />;
  });
  return <S3 k={0.82} p={lv([0.45, 0.9, 1.9], [0.2, 0.8, 1.7], win(u, 0, 1))} l={[0.2, 0.4, 0]} fov={44} floor="conc">
    <Duct p={[0, 0.62, 0]} L={2.0} R={0.17} c="#bfc6cc" o={0.34} />
    {[-1.0, -0.5, 0, 0.5, 1.0].map((x, i) => <Ring key={i} p={[x, 0.62, 0]} R={0.172} />)}
    {HOLES.map((x, i) => <Cy key={i} rt={0.055} h={0.012} p={[x, 0.62, 0.17]} r={[Math.PI / 2, 0, 0]} c="#0c0c0c" />)}
    {balls}
    <Bx s={[0.5, 0.05, 0.5]} p={[1.18, 0.025, 0]} c="#3f6a3a" ro={0.8} />
    <Odo v={arrived} n={2} p={[1.18, 0.4, 0.1]} s={1.3} />
  </S3>;
}}</Stage>;

// 4 · la escotilla: la trampa del techo se abre hacia arriba y los billetes de $20 suben en fila, girando, por un haz de luz cálida hasta perderse en la oscuridad del ático
export const HAtticglow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), op = win(u, 0.03, 0.18), n = 9;
  return <S3 k={0.8} p={lv([0.3, 0.3, 1.9], [0.0, 0.45, 1.7], win(u, 0, 1))} l={[0, 1.2, 0]} fov={46} floor={null} exp={0.95}>
    <pointLight position={[0, 1.1, 0.4]} intensity={3.5 * op} distance={4} color="#ffc070" />
    <pointLight position={[0, 0.5, 1.0]} intensity={1.2 * op} distance={3} color="#ffd9a0" />
    <Bx s={[6, 1.0, 0.05]} p={[0, 0.5, -1.0]} map={PLASTER()} c="#cbbfa9" ro={0.95} ns />
    <Bx s={[6, 3, 0.05]} p={[0, 2.4, -1.0]} c="#120d08" ro={1} ns />
    <Bx s={[2.2, 0.08, 3.2]} p={[-1.45, 0.95, 0]} map={PLASTER()} c="#f2ede2" ro={0.95} />
    <Bx s={[2.2, 0.08, 3.2]} p={[1.45, 0.95, 0]} map={PLASTER()} c="#f2ede2" ro={0.95} />
    <Bx s={[0.7, 0.08, 1.1]} p={[0, 0.95, 1.05]} map={PLASTER()} c="#f2ede2" ro={0.95} />
    <Bx s={[0.7, 0.08, 1.1]} p={[0, 0.95, -1.05]} map={PLASTER()} c="#f2ede2" ro={0.95} />
    <group position={[0, 1.0, -0.5]} rotation={[-op * 1.7, 0, 0]}><Bx s={[0.74, 0.05, 0.84]} p={[0, 0, 0.42]} c="#f4efe2" ro={0.8} rad={0.006} /></group>
    <Cy rt={0.3} rb={0.36} h={1.8} p={[0, 1.9, 0]} c="#ffd28a" e="#ffb050" ei={1.1} o={0.2 * op} ro={1} />
    {Array.from({ length: n }, (_, i) => { const f = cl((u - 0.04 - i * 0.055) / 0.5); if (f <= 0) return null;
      return <Bx key={i} s={[0.8, 0.36, 0.012]} p={[Math.sin(f * 5 + i) * 0.08, 0.35 + f * 2.0, (rnd(i + 3) - 0.5) * 0.2]} r={[0.25 * Math.sin(i), f * 6 + i * 1.3, 0.2 * Math.sin(f * 4 + i)]} map={bill()} c="#ffffff" e="#ffcf7a" ei={0.45} o={win(f, 0, 0.06) * (1 - win(f, 0.88, 1))} ro={0.8} />; })}
  </S3>;
}}</Stage>;

// 5 · el aire del ático: sobre las vigas, un contador mecánico de rodillos sube de 70 a 130 y rebota al clavarse mientras el panel pasa de azul a rojo y el calor sube en nubes gruesas
export const HIntake: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.1, 0.72), v = lerp(70, 130, k), pop = 1 + 0.1 * bump(u, 0.72, 22, 7);
  const col = `rgb(${Math.round(lerp(90, 255, k))},${Math.round(lerp(170, 70, k))},${Math.round(lerp(255, 40, k))})`;
  return <S3 k={0.8} p={lv([0.5, 0.75, 2.0], [0.2, 0.65, 1.7], win(u, 0, 1))} l={[0, 0.5, 0]} fov={42} floor={null}>
    <pointLight position={[0, 0.8, 0.6]} intensity={2.2} distance={3} color={col} />
    <Bx s={[3.4, 1.4, 0.06]} p={[0, 0.8, -0.8]} c="#4a3322" ro={0.9} ns />
    {[-1.1, -0.55, 0, 0.55, 1.1].map((x, i) => <Bx key={i} s={[0.07, 1.3, 0.07]} p={[x, 0.85, -0.72]} r={[0, 0, (x > 0 ? -1 : 1) * 0.18]} c="#c9a77a" ro={0.7} />)}
    {[-0.9, -0.45, 0, 0.45, 0.9].map((x, i) => <Bx key={i} s={[0.09, 0.2, 2]} p={[x, 0.1, 0]} map={PLANKS()} c="#c9a77a" ro={0.7} />)}
    {[-0.67, -0.22, 0.22, 0.67].map((x, i) => <Bx key={i} s={[0.36, 0.16, 2]} p={[x, 0.08, 0]} c="#e8b8a0" ro={1} />)}
    <group scale={pop * 0.88} position={[0, 0.72, 0.1]}>
      <Bx s={[1.5, 0.62, 0.12]} p={[0, 0, -0.03]} c="#1c1a17" e={col} ei={0.35} m={0.3} ro={0.4} rad={0.03} />
      <Odo v={v} n={3} p={[-0.1, 0, 0.05]} s={2.4} />
      <Txt t="°F" w={0.3} c={col} e={0.8} p={[0.55, 0, 0.07]} />
    </group>
    {[-0.6, -0.2, 0.2, 0.6].map((x, i) => <Tube key={i} pts={Array.from({ length: 8 }, (_, j): V3 => [x + 0.08 * Math.sin(tt * 2 + j * 1.2 + i), 0.2 + j * 0.1, 0.25])} rad={0.03} c="#ff7a3a" e="#ff5a1a" ei={1.4} o={0.65 * k} />)}
    {Array.from({ length: 9 }, (_, i) => { const f = (tt * 0.5 + i / 9) % 1; return <Puff key={i} p={[(rnd(i) - 0.5) * 1.5, 0.2 + f * 0.9, 0.3]} s={0.5} c="#ff7a3a" o={0.34 * k * Math.sin(f * Math.PI)} />; })}
  </S3>;
}}</Stage>;

const tapeTex = () => canvasTex("tapegray2", 256, 128, (g) => {
  g.fillStyle = "#a2a29d"; g.fillRect(0, 0, 256, 128); g.strokeStyle = "#85857f"; g.lineWidth = 2;
  for (let i = -128; i < 256; i += 10) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 128, 128); g.stroke(); }
  g.strokeStyle = "#6f6f6a"; for (let i = 0; i < 256; i += 12) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 128); g.stroke(); }
  g.strokeStyle = "#2f2f2d"; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 40); g.lineTo(60, 72); g.lineTo(110, 50); g.lineTo(170, 92); g.lineTo(256, 60); g.stroke();
});
// 6 · la cinta que se deshace: la banda gris de tela sobre la unión se reseca, se parte en escamas curvas que caen girando y por la rendija sale aire caliente en nubes
export const HCrumble: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), cr = win(u, 0.1, 0.62), R = 0.24, CY = 0.55, M = 10, leak = win(u, 0.35, 0.6);
  return <S3 k={0.7} p={lv([0.4, 0.85, 1.4], [0.15, 0.75, 1.1], win(u, 0, 1))} l={[0, 0.5, 0]} fov={38} floor="conc">
    <pointLight position={[0, 0.8, 0.5]} intensity={2.2 * leak} distance={2.5} color="#ff8a30" />
    <Duct p={[-0.6, CY, 0]} L={1.2} R={R} />
    <Duct p={[0.6, CY, 0]} L={1.2} R={R} />
    <Cy rt={R + 0.004} h={0.3} p={[0, CY, 0]} r={[0, 0, Math.PI / 2]} c="#0c0c0c" e="#ff6a20" ei={2.4 * leak} />
    {[-1, 1].flatMap((side, c) => Array.from({ length: M }, (_, i) => {
      const a = (i / M) * Math.PI * 2, f = cl((cr - rnd(i + c * 11) * 0.65) / 0.3), fall = f * f, rr = R + 0.016 + fall * 0.05;
      return <Bx key={`${c}-${i}`} s={[0.15, 0.02, 0.17]} p={[side * 0.08 + fall * side * 0.06, CY + rr * Math.cos(a) - fall * 0.55, rr * Math.sin(a) + fall * 0.3]} r={[a + fall * 3 * side, fall * 2.4, fall * 1.4 * side]} map={tapeTex()} c="#ffffff" ro={0.85} />;
    }))}
    {Array.from({ length: 9 }, (_, i) => { const f = (tt * 0.8 + i / 9) % 1; return <Puff key={i} p={[(rnd(i) - 0.5) * 0.2, CY + R + f * 0.55, 0.05 + f * 0.3]} s={0.3 + f * 0.35} c="#ff9a4a" o={0.55 * leak * Math.sin(f * Math.PI)} />; })}
    <Jet a={[0, CY + R, 0.05]} b={[0.1, CY + R + 0.6, 0.4]} k={leak} w={2} tt={tt} n={0} />
  </S3>;
}}</Stage>;

const peelSeg = (i: number, N: number, LEN: number, peel: number): React.ReactNode =>
  <group rotation={[-peel * (0.1 + 0.18 * i), 0, 0]}>
    <Bx s={[0.26, LEN, 0.012]} p={[0, -LEN / 2, 0.006]} map={tapeTex()} c="#e6e6df" ro={0.8} />
    {i < N - 1 && <group position={[0, -LEN, 0]}>{peelSeg(i + 1, N, LEN, peel)}</group>}
  </group>;
// 7 · el laboratorio: el horno de prueba con ventanilla y resistencia roja; el reloj da vueltas y la cinta común pegada a la chapa se enrosca, se despega y cae al fondo
export const HLabtest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), clock = win(u, 0.05, 0.7), heat = win(u, 0.03, 0.3), peel = win(u, 0.28, 0.54), fall = drop(u, 0.58, 0.74);
  const zig: V3[] = Array.from({ length: 12 }, (_, i): V3 => [-0.55 + i * 0.1, 1.15, i % 2 ? -0.05 : 0.1]);
  return <S3 k={0.9} p={lv([0, 0.85, 2.3], [0.15, 0.8, 2.0], win(u, 0, 1))} l={[0, 0.58, 0]} fov={38} floor={null}>
    <pointLight position={[0, 0.75, 0.0]} intensity={2.4 * heat} distance={2.2} color="#ff8a30" />
    <Bx s={[6, 3.2, 0.05]} p={[0, 1, -0.9]} map={PLASTER()} c="#3a3d44" ro={0.9} ns />
    <group scale={0.85} position={[0, 0, 0]}>
      <Bx s={[1.3, 0.9, 0.03]} p={[0, 0.75, -0.3]} c="#555a61" m={0.8} ro={0.35} e="#ff7a20" ei={0.5 * heat} />
      {[-0.65, 0.65].map((x, i) => <Bx key={i} s={[0.04, 0.9, 0.5]} p={[x, 0.75, -0.05]} c="#3a3d42" m={0.7} ro={0.4} />)}
      <Bx s={[1.34, 0.04, 0.5]} p={[0, 1.2, -0.05]} c="#3a3d42" m={0.7} ro={0.4} />
      <Bx s={[1.34, 0.04, 0.5]} p={[0, 0.3, -0.05]} c="#2f3236" m={0.7} ro={0.4} />
      <Tube pts={zig} rad={0.018} c="#ff3a20" e="#ff3a20" ei={2.8 * heat} />
      <Bx s={[1.5, 0.12, 0.12]} p={[0, 1.26, 0.2]} c="#d5d8dc" m={0.5} ro={0.35} />
      {[-0.69, 0.69].map((x, i) => <Bx key={i} s={[0.12, 0.96, 0.12]} p={[x, 0.75, 0.2]} c="#d5d8dc" m={0.5} ro={0.35} />)}
      <Bx s={[1.5, 0.3, 0.14]} p={[0, 0.15, 0.19]} c="#d5d8dc" m={0.5} ro={0.35} />
      <Cy rt={0.018} h={1.2} p={[0, 1.38, 0.3]} r={[0, 0, Math.PI / 2]} c="#e8eaee" m={0.9} ro={0.2} />
      {[-0.55, 0.55].map((x, i) => <Bx key={i} s={[0.03, 0.14, 0.14]} p={[x, 1.33, 0.26]} c="#e8eaee" m={0.9} ro={0.2} />)}
      <Pl w={1.26} h={0.9} p={[0, 0.75, 0.25]} c="#aee0ff" o={0.1} ns />
      <group position={[0, 1.0, -0.27]}>
        <group position={[0, -fall * 0.5 + (fall > 0 ? 0 : 0), fall * 0.1]} rotation={[fall * 0.9, 0, 0]}>{peelSeg(0, 7, 0.1, peel)}</group>
      </group>
      <group position={[-0.4, 0.15, 0.27]}>
        <Cy rt={0.11} h={0.03} r={[Math.PI / 2, 0, 0]} c="#f4efe2" ro={0.5} />
        <To R={0.11} t={0.016} c="#2a2a2a" m={0.7} />
        <group position={[0, 0, 0.022]} rotation={[0, 0, -clock * Math.PI * 8]}><Bx s={[0.018, 0.1, 0.006]} p={[0, 0.045, 0]} c="#c8302a" ns /></group>
      </group>
      <Cy rt={0.05} h={0.04} p={[0.45, 0.15, 0.27]} r={[Math.PI / 2, 0, 0]} c="#2a2a2a" m={0.6} ro={0.4} />
      <Bx s={[0.2, 0.07, 0.02]} p={[0.1, 0.15, 0.265]} c="#2a0a08" e="#ff3a20" ei={1.6 * heat} />
    </group>
  </S3>;
}}</Stage>;

// 8 · el betún: un pincel de cerdas da la vuelta a la unión y deja una capa gris espesa, brillante y húmeda que crece como glaseado de torta, con gotas
export const HFrosting: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.1, 0.66), a = k * Math.PI * 2, thick = win(u, 0.5, 0.8), M = 40, R = 0.24, CY = 0.55, B = 0.9;
  const rot = -a;
  return <S3 k={0.78} p={lv([0.9, 0.95, 1.1], [0.75, 0.85, 1.0], win(u, 0, 1))} l={[0, 0.55, 0]} fov={38} floor="conc">
    <group position={[0, CY, 0]} rotation={[rot, 0, 0]}>
      <Duct p={[-0.4, 0, 0]} L={0.8} R={R} />
      <Duct p={[0.4, 0, 0]} L={0.8} R={R - 0.005} c="#c7ccd1" />
      <Cy rt={R + 0.012} h={0.05} r={[0, 0, Math.PI / 2]} c="#9aa0a6" m={0.9} ro={0.3} />
      {Array.from({ length: M }, (_, i) => { const th = B + (i / M) * Math.PI * 2; if ((i / M) * Math.PI * 2 > a) return null;
        const tk = 0.05 + 0.04 * thick + 0.012 * rnd(i), rr = R + 0.008 + tk / 2;
        const drip = i % 6 === 2 ? 0.05 + 0.05 * thick : 0;
        return <group key={i}>
          <Sp rad={0.06} sc={[2.2, tk / 0.06, 1.1]} p={[(rnd(i, 5) - 0.5) * 0.03, rr * Math.cos(th), rr * Math.sin(th)]} c="#7d8174" m={0.15} ro={0.22} />
          {drip > 0 && <Sp rad={0.022} sc={[1, 1.9, 1]} p={[(rnd(i, 5) - 0.5) * 0.03, (rr + drip * 0.4) * Math.cos(th), (rr + drip * 0.4) * Math.sin(th)]} c="#7d8174" m={0.15} ro={0.22} />}
        </group>; })}
    </group>
    <group position={[0, CY + Math.cos(B) * (R + 0.075), Math.sin(B) * (R + 0.075)]} rotation={[B, 0, 0]} scale={win(u, 0.03, 0.09) + 0.001}>
      <Bx s={[0.26, 0.09, 0.07]} p={[0, 0.0, 0]} c="#d8c8a0" ro={0.95} rad={0.01} />
      <Bx s={[0.265, 0.03, 0.072]} p={[0, -0.04, 0]} c="#7d8174" m={0.15} ro={0.25} />
      <Bx s={[0.27, 0.06, 0.085]} p={[0, 0.075, 0]} c="#b0b4ba" m={0.9} ro={0.3} />
      <Cy rt={0.04} rb={0.03} h={0.45} p={[0, 0.33, 0]} c="#b0302a" ro={0.3} />
    </group>
  </S3>;
}}</Stage>;

// 9 · el rollo de aluminio: el rollo rueda sobre la costura del ducto y deja una banda espejada con un brillo que corre; al final cae el sello UL 181 con golpe
export const HFoilroll: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const x0 = -0.5, u = U(tt, h), k = win(u, 0.02, 0.46), x = lerp(x0, 0.9, k), sheen = lerp(-0.6, 0.9, win(u, 0.5, 0.82)), R = 0.34, CY = 0.4, RR = 0.2;
  const st = drop(u, 0.54, 0.64), pr = bump(u, 0.62, 30, 9);
  return <S3 k={0.78} p={lv([0.3, 1.05, 1.4], [0.0, 0.95, 1.2], win(u, 0, 1))} l={[0.1, 0.5, 0]} fov={40} floor={null}>
    <Bx s={[5, 2.6, 0.05]} p={[0, 0.9, -0.8]} map={PLASTER()} c="#3c4047" ro={0.9} ns />
    <Duct p={[0, CY, 0]} L={2.6} R={R} c="#a9aeb4" />
    {[-1.1, 1.1].map((px, i) => <Ring key={i} p={[px, CY, 0]} R={R + 0.003} />)}
    <Cy rt={R + 0.004} h={Math.max(0.001, x - x0)} p={[(x0 + x) / 2, CY, 0]} r={[0, 0, Math.PI / 2]} c="#eef1f4" m={1} ro={0.1} e="#9fb0c4" ei={0.25} />
    <Cy rt={R + 0.008} h={0.14} p={[sheen, CY, 0]} r={[0, 0, Math.PI / 2]} c="#ffffff" e="#ffffff" ei={1.2} o={0.6 * win(u, 0.5, 0.56) * (1 - win(u, 0.82, 0.9))} />
    <group position={[x, CY + R + RR + 0.01, 0]} rotation={[0, 0, -(x - x0) / RR]} scale={1 - win(u, 0.46, 0.52)}>
      <Cy rt={RR} h={0.4} r={[Math.PI / 2, 0, 0]} c="#e4e8ec" m={0.9} ro={0.15} />
      <Cy rt={0.08} h={0.42} r={[Math.PI / 2, 0, 0]} c="#c9b48a" ro={0.8} />
      <Cy rt={0.205} h={0.02} p={[0, 0, 0.2]} r={[Math.PI / 2, 0, 0]} c="#9aa0a6" m={0.8} ro={0.3} />
    </group>
    <Bx s={[0.56, 0.012, 0.34]} p={[0.2, CY + R + 0.005, 0]} c="#f4f6f8" m={0.9} ro={0.2} o={st > 0.9 ? 1 : 0.001} />
    <group position={[0.2, CY + R + 0.65 - st * 0.63 + pr * 0.04, 0]}>
      <Bx s={[0.4, 0.08, 0.24]} c="#c8302a" ro={0.5} rad={0.01} />
      <Cy rt={0.04} h={0.45} p={[0, 0.26, 0]} c="#2a2a2a" ro={0.5} />
      <Sp rad={0.08} p={[0, 0.52, 0]} c="#2a2a2a" ro={0.5} />
    </group>
    <group position={[0.2, CY + R + 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={st > 0.9 ? 1 : 0.001}><Txt t="UL 181" w={0.4} c="#c8302a" /></group>
  </S3>;
}}</Stage>;

// 10 · el furnace más grande: la caja del furnace crece ×1,5 con resorte y de cada unión del ducto salen más y más nubes calientes mientras un contador de fugas se llena
export const HShredder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), g = 1 + 0.5 * drop(u, 0.2, 0.55), gk = (g - 1) / 0.5;
  const leaks: [V3, V3][] = [[[0.15, 0.62, 0.05], [0.2, 1.1, 0.5]], [[0.55, 0.62, 0.05], [0.65, 1.1, 0.5]], [[0.95, 0.62, 0.05], [1.1, 1.05, 0.45]], [[0.35, 0.62, 0.05], [0.4, 0.15, 0.55]], [[0.75, 0.62, 0.05], [0.85, 0.2, 0.5]]];
  return <S3 k={0.85} p={lv([0.9, 1.0, 2.4], [0.6, 1.1, 2.5], win(u, 0, 1))} l={[0.5, 0.65, 0]} fov={44} floor="conc">
    <pointLight position={[0.5, 0.9, 0.7]} intensity={2.4 * gk} distance={3} color="#ff8a30" />
    <group position={[-0.45, 0, 0]} scale={g}>
      <Bx s={[0.55, 0.9, 0.5]} p={[0, 0.45, 0]} c="#d8d4cc" m={0.3} ro={0.4} rad={0.02} />
      <Bx s={[0.4, 0.5, 0.02]} p={[0, 0.5, 0.255]} c="#bdb8ae" m={0.4} ro={0.4} />
      <Bx s={[0.26, 0.14, 0.012]} p={[0, 0.62, 0.27]} c="#ffb070" e="#ff7a20" ei={1.5} />
      {[0, 1, 2, 3].map((j) => <Bx key={j} s={[0.3, 0.015, 0.01]} p={[0, 0.3 - j * 0.045, 0.27]} c="#6a6e74" m={0.7} ro={0.3} />)}
      <Cy rt={0.04} h={0.04} p={[0.2, 0.62, 0.275]} r={[Math.PI / 2, 0, 0]} c="#2a2a2a" m={0.6} />
      <Cy rt={0.07} h={0.3} p={[0.1, 1.05, 0]} c="#9aa0a6" m={0.8} ro={0.35} />
      <Duct p={[0.55, 0.62, 0]} L={1.3} R={0.1} />
      {[0.15, 0.55, 0.95].map((x, i) => <Ring key={i} p={[x + 0.3, 0.62, 0]} R={0.104} />)}
    </group>
    {leaks.map(([a, b], i) => <Jet key={i} a={[-0.45 + (a[0] + 0.3 + (i > 2 ? 0.15 : 0)) * g * 0.9, a[1] * g, a[2]]} b={[-0.45 + (b[0] + 0.3) * g * 0.9, b[1] * g, b[2]]} k={cl(gk * 1.3 + 0.2 - (i > 2 ? 0.25 : 0) * (1 - gk))} w={1.4 + 1.3 * gk} tt={tt} n={8} sd={i * 0.2} />)}
    <Bx s={[0.5, 0.05, 0.4]} p={[1.55, 0.025, 0.1]} c="#2f3236" ro={0.8} />
    <Odo v={Math.round(gk * 100)} n={3} p={[1.55, 0.3, 0.2]} s={1.4} />
  </S3>;
}}</Stage>;

// 11 · la abrazadera: el flex se sale del cuello de chapa y queda colgando; vuelve a su lugar y una abrazadera cromada grande baja y lo cierra girando su tornillo
export const HClamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), off = win(u, 0.02, 0.2) * (1 - win(u, 0.36, 0.5)), cn = drop(u, 0.5, 0.66), tg = win(u, 0.66, 0.84), CY = 0.6;
  const Rc = lerp(0.23, 0.185, tg);
  return <S3 k={0.78} p={lv([0.5, 0.95, 1.5], [0.25, 0.8, 1.2], win(u, 0, 1))} l={[0.2, 0.55, 0]} fov={38}>
    <pointLight position={[0.3, 0.7, 0.5]} intensity={1.5 * off} distance={2} color="#ff8a30" />
    <Duct p={[-0.35, CY, 0]} L={0.9} R={0.15} />
    <Ring p={[-0.8, CY, 0]} R={0.152} />
    <group position={[0.9, CY, 0]} rotation={[0, 0, -off * 0.55]}>
      <group position={[off * 0.28 - 0.4, 0, 0]}>
        <Cy rt={0.175} h={0.8} r={[0, 0, Math.PI / 2]} c="#d6d1c4" ro={0.55} m={0.2} />
        {Array.from({ length: 10 }, (_, i) => <To key={i} R={0.178} t={0.014} p={[-0.36 + i * 0.08, 0, 0]} r={[0, Math.PI / 2, 0]} c="#bdb7a8" ro={0.5} />)}
      </group>
    </group>
    {Array.from({ length: 6 }, (_, k) => { const f = (tt * 0.9 + k / 6) % 1; return <Puff key={k} p={[0.15 + f * 0.25, CY - 0.05 + f * 0.25, 0.12 + f * 0.3]} s={0.12 + f * 0.22} c="#ff9a4a" o={0.55 * off * Math.sin(f * Math.PI)} />; })}
    <group position={[0.14, CY + (1 - cn) * 0.8, 0]} rotation={[0, Math.PI / 2, 0]} scale={cn > 0.01 ? 1 : 0.001}>
      <To R={Rc} t={0.04} p={[0, 0, -0.045]} c="#d8dce0" m={0.7} ro={0.3} e="#aab4c0" ei={0.3} />
      <To R={Rc} t={0.04} p={[0, 0, 0.045]} c="#d8dce0" m={0.7} ro={0.3} e="#aab4c0" ei={0.3} />
      <group position={[0, Rc + 0.04, 0]}>
        <Bx s={[0.12, 0.09, 0.2]} c="#c0c4c8" m={0.7} ro={0.3} e="#aab4c0" ei={0.3} />
        <group position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <Cy rt={0.04} h={0.1} r={[0, 0, 0]} c="#9aa0a6" m={0.7} ro={0.3} />
          <group rotation={[0, tg * 12, 0]}><Bx s={[0.012, 0.03, 0.14]} p={[0, 0.06, 0]} c="#2a2d32" /></group>
        </group>
      </group>
    </group>
  </S3>;
}}</Stage>;

const bootAt = (s: number, k: number) => {
  let z = k ? -1.0 : -1.1, x = k ? 0.04 : -0.04, y = 0;
  for (let j = 0; j < 5; j++) {
    if (j % 2 !== k) continue;
    const tz = -0.75 + j * 0.33, tx = j === 4 ? 0.25 : (k ? 0.04 : -0.04);
    if (s >= j + 1) { z = tz; x = tx; } else if (s > j) { const f = s - j, e = sm(f); y = 0.16 * Math.sin(Math.PI * f); return { z: lerp(z, tz, e), x: lerp(x, tx, e), y }; }
  }
  return { z, x, y };
};
// 12 · las vigas: unas botas caminan por la viga del ático; la última pisa la lana entre vigas, se hunde, brilla en rojo y el techo de yeso se raja y suelta polvo
export const HFootsteps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), s = Math.min(5, Math.max(0, ((u - 0.04) / 0.46) * 5)), bad = win(u, 0.5, 0.58), crack = win(u, 0.56, 0.76);
  const b0 = bootAt(s, 0), b1 = bootAt(s, 1);
  const crk = (x: number, y0: number): V3[] => [[x, y0, 1.21], [x + 0.04, y0 - 0.07 * crack - 0.001, 1.21], [x - 0.03, y0 - 0.15 * crack - 0.002, 1.21], [x + 0.04, y0 - 0.25 * crack - 0.003, 1.21]];
  return <S3 k={0.8} p={lv([0.7, 0.6, 2.3], [0.55, 0.4, 2.0], win(u, 0, 1))} l={[0.2, 0.1, 0.6]} fov={44} floor={null}>
    <pointLight position={[0.25, 0.3, 0.55]} intensity={2.5 * bad} distance={1.5} color="#ff3a20" />
    <Bx s={[3.6, 1.8, 0.06]} p={[0, 0.5, -1.3]} c="#4a3322" ro={0.9} ns />
    <Bx s={[2.4, 0.3, 2.4]} p={[0, -0.15, 0]} map={PLASTER()} c="#efe9dc" ro={0.95} />
    {[-0.5, 0, 0.5].map((x, i) => <Bx key={i} s={[0.14, 0.22, 2.4]} p={[x, 0.11, 0]} map={PLANKS()} c="#c9a77a" ro={0.7} />)}
    {[-0.25, 0.25].map((x, i) => <Bx key={i} s={[0.36, 0.17, 2.4]} p={[x, 0.085, 0]} c="#e8b8a0" ro={1} />)}
    <Bx s={[0.36, 0.04, 0.4]} p={[0.25, 0.165 - 0.09 * bad, 0.55]} c="#f0a0a0" e="#ff3a20" ei={1.1 * bad} ro={1} />
    <Boot p={[b0.x, 0.22 + b0.y - 0.1 * bad * (s >= 5 ? 1 : 0), b0.z]} />
    <Boot p={[b1.x, 0.22 + b1.y, b1.z]} />
    {[0.25, 0.1, 0.4].map((cx, i) => <Tube key={i} pts={crk(cx, -0.02)} rad={0.016} c="#e0482e" e="#ff3a20" ei={1.8} o={crack} />)}
    <Bx s={[0.05 * crack + 0.001, 0.22 * crack + 0.001, 0.01]} p={[0.25, -0.14, 1.205]} c="#1a1210" ro={1} />
    {Array.from({ length: 8 }, (_, i) => { const f = (tt * 0.6 + i / 8) % 1; return <Puff key={i} p={[0.25 + (rnd(i) - 0.5) * 0.3, -0.12 - f * 0.4, 1.3]} s={0.26} c="#e8e0d0" o={0.5 * crack * Math.sin(f * Math.PI)} add={false} />; })}
    <Bx s={[0.09, 0.07, 0.08]} p={[0.2, -0.25 - drop(u, 0.74, 0.86) * 0.2, 1.26]} r={[0.5, 0.3, 0.2]} c="#e9e3d6" ro={0.9} o={crack > 0.6 ? 1 : 0} />
  </S3>;
}}</Stage>;

const BigGrille: React.FC<{ p: V3; w: number; d: number; e: string; ei: number }> = ({ p, w, d, e, ei }) =>
  <group position={p}>
    <Bx s={[w, 0.03, d]} p={[0, -0.012, 0]} c="#0a0a0c" ro={1} />
    {[-1, 1].map((sgn) => <Bx key={"z" + sgn} s={[w, 0.04, 0.05]} p={[0, 0.01, sgn * (d / 2 - 0.025)]} c="#d8dce0" m={0.7} ro={0.3} e={e} ei={ei * 0.6} />)}
    {[-1, 1].map((sgn) => <Bx key={"x" + sgn} s={[0.05, 0.04, d]} p={[sgn * (w / 2 - 0.025), 0.01, 0]} c="#d8dce0" m={0.7} ro={0.3} e={e} ei={ei * 0.6} />)}
    {Array.from({ length: 9 }, (_, i) => <Bx key={i} s={[w * 0.9, 0.02, 0.04]} p={[0, 0.015, -d / 2 + 0.07 + i * (d - 0.14) / 8]} r={[0.55, 0, 0]} c="#c9ccd0" m={0.8} ro={0.3} e={e} ei={ei} />)}
  </group>;
// 13 · los pulmones: dos rejillas de piso grandes lado a lado; la de salida exhala aire cálido hacia vos y la de retorno lo aspira, con el ritmo lento de una respiración
export const HBreathe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), br = 0.5 + 0.5 * Math.sin(tt * 1.6), N = 14;
  return <S3 k={0.78} p={lv([0, 1.25, 1.65], [0, 1.1, 1.45], win(u, 0, 1))} l={[0, 0.3, 0.05]} fov={40} floor="wood">
    <pointLight position={[-0.45, 0.5, 0.3]} intensity={2.8 * br} distance={2} color="#ff9a3a" />
    <pointLight position={[0.45, 0.5, 0.3]} intensity={1.8 * (1 - br)} distance={2} color="#7fc8ff" />
    <Bx s={[4, 2, 0.05]} p={[0, 0.9, -0.55]} map={PLASTER()} c="#e9e0cf" ro={0.95} ns />
    <BigGrille p={[-0.45, 0.02, 0.05]} w={0.7} d={0.46} e="#ff7a20" ei={0.4 + 1.2 * br} />
    <BigGrille p={[0.45, 0.02, 0.05]} w={0.7} d={0.46} e="#4fb0ff" ei={0.4 + 1.2 * (1 - br)} />
    {Array.from({ length: N }, (_, i) => { const f = (tt * 0.4 + i / N) % 1, a = rnd(i) * 6.28;
      return <Sp key={"o" + i} rad={0.05 * (0.7 + 0.8 * f) * (0.8 + 0.5 * br)} p={[-0.45 + Math.cos(a) * 0.25 * (0.4 + f), 0.06 + f * 0.75, 0.05 + Math.sin(a) * 0.12 + f * 0.2]} c="#ffb070" e="#ff8a30" ei={2} o={0.9 * Math.sin(f * Math.PI)} ns />; })}
    {Array.from({ length: N }, (_, i) => { const f = 1 - ((tt * 0.4 + i / N) % 1), a = rnd(i + 9) * 6.28;
      return <Sp key={"i" + i} rad={0.05 * (0.7 + 0.5 * f)} p={[0.45 + Math.cos(a) * 0.3 * (0.3 + f), 0.06 + f * 0.75, 0.05 + Math.sin(a) * 0.15 * f + f * 0.15]} c="#bfe4ff" e="#4fb0ff" ei={2} o={0.9 * Math.sin(f * Math.PI)} ns />; })}
    {Array.from({ length: 6 }, (_, i) => { const f = (tt * 0.4 + i / 6) % 1; return <Puff key={"p" + i} p={[-0.45, 0.12 + f * 0.7, 0.1 + f * 0.2]} s={0.35 + 0.3 * f} c="#ff9a4a" o={0.4 * br * Math.sin(f * Math.PI)} />; })}
  </S3>;
}}</Stage>;

const BEDS: V3[] = [[0.8, 0, -0.5], [0.8, 0, 0], [0.8, 0, 0.5]];
// 14 · el rastro: la planta de la casa en maqueta con paredes; un hilo verde de neón sale del auto del garage, entra por la rejilla de retorno y se bifurca a cada dormitorio
export const HScenttrail: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = win(u, 0.08, 0.42), b = win(u, 0.42, 0.82);
  const W = (p: V3, s: V3, i: number) => <Bx key={i} s={s} p={p} c="#f0e8da" ro={0.9} rad={0.005} />;
  const walls: [V3, V3][] = [[[0, 0.11, -0.75], [2.03, 0.22, 0.03]], [[0, 0.11, 0.75], [2.03, 0.22, 0.03]], [[-1, 0.11, 0], [0.03, 0.22, 1.5]], [[1, 0.11, 0], [0.03, 0.22, 1.5]],
    [[-0.35, 0.11, -0.3], [0.03, 0.22, 0.9]], [[-0.35, 0.11, 0.6], [0.03, 0.22, 0.3]],
    [[0.3, 0.11, -0.665], [0.03, 0.22, 0.17]], [[0.3, 0.11, -0.25], [0.03, 0.22, 0.34]], [[0.3, 0.11, 0.25], [0.03, 0.22, 0.34]], [[0.3, 0.11, 0.665], [0.03, 0.22, 0.17]],
    [[0.65, 0.11, -0.25], [0.7, 0.22, 0.03]], [[0.65, 0.11, 0.25], [0.7, 0.22, 0.03]]];
  return <S3 k={0.95} p={lv([0.1, 2.0, 1.45], [0.0, 1.9, 1.3], win(u, 0, 1))} l={[0, 0, 0.05]} fov={44} floor="wood">
    <pointLight position={[0, 0.6, 0.2]} intensity={2.2 * a} distance={2.5} color="#6fe39a" />
    <Bx s={[2.05, 0.03, 1.55]} p={[0, 0.0, 0]} c="#c9b898" ro={0.9} />
    <Bx s={[0.65, 0.01, 1.45]} p={[-0.68, 0.02, 0]} c="#8a8a86" ro={0.9} />
    {walls.map(([p, s], i) => W(p, s, i))}
    <group position={[-0.7, 0.04, -0.15]}>
      <Bx s={[0.22, 0.07, 0.4]} p={[0, 0.06, 0]} c="#c8302a" m={0.5} ro={0.3} rad={0.02} /><Bx s={[0.2, 0.06, 0.22]} p={[0, 0.115, 0.02]} c="#9fc4de" m={0.5} ro={0.2} rad={0.02} />
      {[[-0.11, 0.14], [0.11, 0.14], [-0.11, -0.14], [0.11, -0.14]].map(([x, z], i) => <Cy key={i} rt={0.04} h={0.04} p={[x, 0.04, z]} r={[0, 0, Math.PI / 2]} c="#1a1a1a" />)}
    </group>
    <Grille p={[0, 0.03, 0]} w={0.22} d={0.14} c="#d8d4cc" e="#6fe39a" ei={0.9 * a} />
    <Bx s={[0.5, 0.05, 0.3]} p={[-0.1, 0.03, -0.45]} c="#8a6a4a" ro={0.8} /><Bx s={[0.5, 0.18, 0.1]} p={[-0.1, 0.1, -0.55]} c="#7a5a3a" ro={0.8} />
    {BEDS.map((bd, i) => <group key={i} position={[bd[0], 0.04, bd[2]]}>
      <Bx s={[0.4, 0.06, 0.3]} p={[0, 0.03, 0]} c="#7a5a3a" ro={0.8} /><Bx s={[0.38, 0.05, 0.28]} p={[0.01, 0.085, 0]} c="#bcd6e8" ro={0.95} rad={0.02} /><Bx s={[0.08, 0.04, 0.2]} p={[0.15, 0.13, 0]} c="#ffffff" ro={0.95} rad={0.02} />
    </group>)}
    <Trail pts={[[-0.7, 0.14, -0.15], [-0.5, 0.1, 0.2], [-0.2, 0.1, 0.12], [0, 0.1, 0.03]]} k={a} rad={0.045} />
    {BEDS.map((bd, i) => <Trail key={i} pts={[[0, 0.1, 0.03], [0.15, 0.1, bd[2] * 0.8], [0.3, 0.1, bd[2]], [0.62, 0.1, bd[2]]]} k={b} rad={0.045} />)}
  </S3>;
}}</Stage>;

// 15 · el globo de presión: un globo rojo se infla dentro del ducto sellado hasta que la presión escupe un chorro de aire por la unión
export const HBalloon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), P = win(u, 0.06, 0.56), burst = win(u, 0.56, 0.7), CY = 0.5, wob = 1 + 0.05 * Math.sin(tt * 9) * P, rad = (0.06 + 0.22 * P) * (1 - 0.2 * burst);
  return <S3 k={0.72} p={lv([0.3, 0.8, 2.0], [0.0, 0.7, 1.8], win(u, 0, 1))} l={[0, 0.55, 0]} fov={38} floor={null}>
    <pointLight position={[0.6, 0.9, 0.7]} intensity={2.2 * burst} distance={2.5} color="#ff8a30" />
    <pointLight position={[0, CY, 0.6]} intensity={1.5 * P} distance={1.5} color="#ff4a3a" />
    <Bx s={[5, 2.6, 0.05]} p={[0, 0.9, -0.7]} map={PLASTER()} c="#cfc6b4" ro={0.95} ns />
    {[-0.8, 0.8].map((x, i) => <Bx key={i} s={[0.1, 0.3, 0.3]} p={[x, 0.15, 0]} c="#6b5a48" ro={0.8} />)}
    <Duct p={[0, CY, 0]} L={2.4} R={0.3} c="#bfc6cc" o={0.28} e="#ff3a20" ei={0.4 * P} />
    {[-1.2, 1.2].map((x, i) => <Cy key={i} rt={0.3} h={0.03} p={[x, CY, 0]} r={[0, 0, Math.PI / 2]} c="#9aa0a6" m={0.8} ro={0.3} />)}
    {[-0.6, 0.6].map((x, i) => <Ring key={i} p={[x, CY, 0]} R={0.305} />)}
    <Sp rad={rad} p={[-0.05, CY, 0]} sc={[1.5 * wob, 1, 1]} c="#e2342a" m={0.1} ro={0.18} e="#ff2a20" ei={0.35 + 0.5 * P} />
    <Sp rad={rad * 0.25} p={[-0.05 - rad * 0.5, CY + rad * 0.45, rad * 0.8]} c="#ffd0c8" ro={0.1} o={0.7} ns />
    <Sp rad={0.03 + 0.02 * P} p={[-0.05 - rad * 1.5 - 0.02, CY, 0]} c="#b01e18" ro={0.3} />
    <Bx s={[0.2, 0.02, 0.05]} p={[0.6, CY + 0.31, 0.0]} c="#0c0c0c" />
    <Jet a={[0.6, CY + 0.32, 0.02]} b={[0.85, CY + 1.0, 0.5]} k={burst} w={2.4} tt={tt} n={9} />
  </S3>;
}}</Stage>;

// 16 · el living en maqueta: el sillón, la biblioteca y la alfombra se deslizan hasta tapar cada rejilla grande del piso, y la que queda tapada pulsa en rojo
export const HRoomplan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), VP: V3[] = [[-0.55, 0.01, 0.4], [0.6, 0.01, -0.4], [0.35, 0.01, 0.45]];
  const k0 = drop(u, 0.1, 0.32), k1 = drop(u, 0.28, 0.5), k2 = drop(u, 0.46, 0.66);
  const red = (k: number) => win(k, 0.7, 1) * (0.7 + 0.3 * Math.sin(tt * 5));
  return <S3 k={0.88} p={lv([0.5, 1.5, 1.9], [0.3, 1.4, 1.7], win(u, 0, 1))} l={[0, 0.3, 0]} fov={44} floor="wood">
    <Bx s={[3.4, 1.6, 0.05]} p={[0, 0.8, -0.85]} map={PLASTER()} c="#e9e0cf" ro={0.95} ns />
    {VP.map((v, i) => { const r = red([k0, k1, k2][i]);
      return <group key={i}>
        <Grille p={v} w={0.7} d={0.4} e={r > 0.1 ? "#d8402e" : "#ffb070"} ei={0.3 + r * 1.4} />
        <Puff p={[v[0], 0.03, v[2]]} s={1.5} c="#ff2a1a" o={0.7 * r} r={[-Math.PI / 2, 0, 0]} />
        <pointLight position={[v[0], 0.25, v[2]]} intensity={2.4 * r} distance={1.2} color="#ff3a20" />
      </group>; })}
    <Sofa p={[-0.55 - (1 - k0) * 1.5, 0, 0.4]} />
    <group position={[0.6 + (1 - k1) * 1.4, 0, -0.55]}>
      <Bx s={[0.03, 0.7, 0.2]} p={[-0.25, 0.35, 0]} c="#6b4a2e" ro={0.6} /><Bx s={[0.03, 0.7, 0.2]} p={[0.25, 0.35, 0]} c="#6b4a2e" ro={0.6} />
      <Bx s={[0.53, 0.03, 0.2]} p={[0, 0.715, 0]} c="#6b4a2e" ro={0.6} /><Bx s={[0.5, 0.02, 0.02]} p={[0, 0.02, 0.09]} c="#6b4a2e" ro={0.6} /><Bx s={[0.5, 0.7, 0.02]} p={[0, 0.35, -0.09]} c="#5a3d26" ro={0.7} />
      {[0.15, 0.35, 0.55].map((y, j) => <group key={j}><Bx s={[0.5, 0.02, 0.18]} p={[0, y, 0]} c="#6b4a2e" ro={0.6} />
        {Array.from({ length: 7 }, (_, b) => <Bx key={b} s={[0.03, 0.1 + 0.05 * rnd(b + j * 9), 0.1]} p={[-0.2 + b * 0.065, y + 0.06 + 0.025 * rnd(b + j * 9), 0]} c={["#b0302a", "#2f5a8a", "#d6b24a", "#3f6a3a", "#e8e0d0"][(b + j) % 5]} ro={0.7} />)}</group>)}
    </group>
    <group position={[0.35, 0.012 + (1 - k2) * 0.9, 0.45]}>
      <Bx s={[0.9, 0.014, 0.5]} c="#a84a3a" ro={0.95} />
      <Bx s={[0.76, 0.016, 0.36]} p={[0, 0.002, 0]} c="#d6b24a" ro={0.95} /><Bx s={[0.62, 0.018, 0.24]} p={[0, 0.004, 0]} c="#a84a3a" ro={0.95} />
    </group>
  </S3>;
}}</Stage>;

// 17 · el deflector: el aire de la rejilla de pared choca contra el sillón y rebota; entra con resorte la pieza curva naranja y el aire se dobla, sube y sale al cuarto
export const HDeflect: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), dfl = drop(u, 0.4, 0.56), post = win(dfl, 0.4, 0.8), N = 18, x0 = -0.82, y0 = 0.14, RR = 0.4;
  return <S3 k={0.72} p={lv([1.1, 0.85, 1.7], [0.9, 0.7, 1.45], win(u, 0, 1))} l={[-0.3, 0.34, 0]} fov={44}>
    <Bx s={[0.05, 1.4, 3]} p={[-0.9, 0.7, 0]} map={PLASTER()} c="#e9e0cf" ro={0.95} ns />
    <Grille p={[-0.86, 0.14, 0]} w={0.3} d={0.5} r={[0, 0, Math.PI / 2]} e="#4fb0ff" ei={0.8} />
    <Sofa p={[-0.1, 0, 0]} r={[0, -Math.PI / 2, 0]} />
    {dfl > 0.01 && <group position={[0, (1 - dfl) * 0.9, 0]}>
      {Array.from({ length: 12 }, (_, i) => { const th = ((i + 0.5) / 12) * (Math.PI / 2);
        return <Bx key={i} s={[0.08, 0.02, 0.55]} p={[x0 + RR * Math.sin(th), y0 + 0.02 + RR * (1 - Math.cos(th)), 0]} r={[0, 0, th]} c="#ffb02a" e="#ff8a10" ei={0.35} m={0.5} ro={0.35} />; })}
    </group>}
    {Array.from({ length: N }, (_, i) => { const f = (tt * 0.7 + i / N) % 1, z = (rnd(i) - 0.5) * 0.3;
      const p1: V3 = f < 0.55 ? [x0 + 0.05 + f / 0.55 * 0.42, y0 + 0.04 + z * 0.2, z] : [x0 + 0.47 - (f - 0.55) * 0.9, y0 + 0.04 + (f - 0.55) * 0.9, z * (1 + (f - 0.55) * 3)];
      const th = Math.min(1, f / 0.5) * (Math.PI / 2), p2: V3 = f < 0.5 ? [x0 + RR * Math.sin(th), y0 + 0.06 + RR * (1 - Math.cos(th)), z * 0.6] : [x0 + RR + (f - 0.5) * 1.0, y0 + RR + 0.06 + (f - 0.5) * 0.9, z * (1 + (f - 0.5) * 3)];
      return <group key={i}>
        <Sp rad={0.06} p={p1} c="#8fdcff" e="#4fb0ff" ei={2} o={0.95 * Math.sin(f * Math.PI) * (1 - post)} ns />
        <Sp rad={0.06} p={p2} c="#8fdcff" e="#4fd0ff" ei={2} o={0.95 * Math.sin(f * Math.PI) * post} ns />
      </group>; })}
    {Array.from({ length: 6 }, (_, i) => { const f = (tt * 0.7 + i / 6) % 1; return <Puff key={i} p={[x0 + 0.25 + f * 0.25, y0 + 0.05, 0]} s={0.4} c="#7fd0ff" o={0.45 * (1 - post) * Math.sin(f * Math.PI)} />; })}
  </S3>;
}}</Stage>;

// 18 · el caño radiador: el ducto desnudo cruza el ático; el resplandor viaja por él y se va apagando de naranja a azul, con termómetros grandes: 120, 105, 90 grados
export const HFadepipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.1, 0.68), N = 14, camx = lerp(-0.45, 0.45, win(u, 0, 1));
  const hc = (q: number) => q > 0.5 ? `rgb(255,${Math.round(lerp(190, 110, (q - 0.5) * 2))},${Math.round(lerp(110, 30, (q - 0.5) * 2))})` : `rgb(${Math.round(lerp(40, 255, q * 2))},${Math.round(lerp(130, 190, q * 2))},${Math.round(lerp(255, 110, q * 2))})`;
  return <S3 k={0.8} p={[camx, 0.9, 1.6]} l={[camx, 0.55, 0]} fov={44} floor={null}>
    <pointLight position={[-0.4, 0.7, 0.6]} intensity={2.4 * k} distance={2.5} color="#ff7a30" />
    <Bx s={[3.4, 1.8, 0.06]} p={[0, 0.9, -0.9]} c="#4a3322" ro={0.9} ns />
    {[-1.2, -0.6, 0, 0.6, 1.2].map((x, i) => <Bx key={i} s={[0.07, 1.5, 0.07]} p={[x, 0.95, -0.82]} r={[0, 0, (x > 0 ? -1 : 1) * 0.2]} c="#c9a77a" ro={0.7} />)}
    {[-0.7, -0.35, 0, 0.35, 0.7].map((z, i) => <Bx key={i} s={[3.4, 0.14, 0.09]} p={[0, 0.07, z]} map={PLANKS()} c="#c9a77a" ro={0.7} />)}
    {Array.from({ length: N }, (_, i) => { const x = -1.0 + (i + 0.5) * (2 / N), f = i / N, lit = f < k ? 1 : 0, heat = lerp(1, 0.0, f);
      return <Cy key={i} rt={0.17} h={2 / N + 0.002} p={[x, 0.4, 0]} r={[0, 0, Math.PI / 2]} c="#b9bec4" m={0.85} ro={0.33} e={hc(heat)} ei={lit * (0.8 + heat * 0.8)} />; })}
    {[-0.72, -0.3, 0.12, 0.54, 0.96].map((x, i) => <Ring key={i} p={[x, 0.4, 0]} R={0.173} />)}
    {Array.from({ length: 10 }, (_, i) => { const f = (tt * 0.6 + i / 10) % 1, x = -1 + rnd(i) * 2 * k; return <Puff key={i} p={[x, 0.62 + f * 0.5, (rnd(i + 3) - 0.5) * 0.2]} s={0.34} c={hc(lerp(1, 0, (x + 1) / 2))} o={0.38 * Math.sin(f * Math.PI)} />; })}
    {[["120", -0.7], ["105", 0.0], ["90", 0.7]].map(([d, x], i) => { const e = win(u, 0.15 + i * 0.2, 0.28 + i * 0.2); return <group key={i} position={[x as number, 0.95 + 0.03 * bump(u, 0.15 + i * 0.2, 14, 6), 0.1]} scale={e + 0.001}><Thermo3 v={d as string} s={1.3} glow={0.9 - i * 0.3} dark /></group>; })}
  </S3>;
}}</Stage>;
