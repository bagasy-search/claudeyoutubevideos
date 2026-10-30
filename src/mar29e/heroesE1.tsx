// mar29e · componentes únicos 1-21 (bomba de calor), vuelta 2 en 3D (kit r3k): objetos grandes, la acción a la vista, sin rótulos que repiten la voz.
// La acción se reparte en TODO el plano (u = 0..1). Registro: D:/rtmp/mar29_COMPONENTES.md
import React from "react";
import { BOLD, Bx, Cy, D2R, HANDF, PLANKS, PLASTER, Pl, Puff, S3 as S3k, Sp, To, Tube, Txt, V3, canvasTex, cl, drop, lerp, lv, rnd, win } from "../kits/r3k/r3k";
import { H, Stage } from "./hkit";
import { Odo, RoundThermo } from "./r3c";

// cámara: por defecto k=1 (las posiciones de cada plano ya son las reales); k<1 acerca p hacia l
const S3: React.FC<React.ComponentProps<typeof S3k> & { k?: number }> = ({ k = 1, p, l, ...r }) =>
  <S3k p={[l[0] + (p[0] - l[0]) * k, l[1] + (p[1] - l[1]) * k, l[2] + (p[2] - l[2]) * k]} l={l} {...r} />;
const U = (tt: number, h: H) => cl(tt / (h.out - h.at));
const bump = (u: number, a: number, f = 26, k = 8) => (u > a ? Math.sin((u - a) * f) * Math.exp(-(u - a) * k) : 0);
// integral numérica de una velocidad f(x) entre 0 y x (para que las aspas frenen sin dar marcha atrás)
const cum = (f: (x: number) => number, x: number, n = 48) => { let s = 0; for (let i = 0; i < n; i++) s += f((x * (i + 0.5)) / n); return (s * x) / n; };
const mixc = (a: string, b: string, k: number) => { const f = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16); return "#" + [0, 1, 2].map((i) => Math.round(lerp(f(a, i), f(b, i), cl(k))).toString(16).padStart(2, "0")).join(""); };
const ICE = { c: "#cfe9ff", ro: 0.06, m: 0.1, e: "#8fc8ff", ei: 0.18 };
const Wall: React.FC<{ y?: number; w?: number; hh?: number; z?: number; c?: string }> = ({ y = 1, w = 4, hh = 2.6, z = -0.05, c = "#ffffff" }) =>
  <Bx s={[w, hh, 0.05]} p={[0, y, z]} map={PLASTER()} c={c} ro={0.95} ns />;
const Counter: React.FC<{ w?: number; d?: number; z?: number }> = ({ w = 3.4, d = 1.8, z = 0.2 }) =>
  <Bx s={[w, 0.08, d]} p={[0, -0.04, z]} map={PLANKS()} c="#ffffff" ro={0.6} />;
// nieve del suelo con montículos
const Snow: React.FC = () => <group>
  <Bx s={[7, 0.1, 5]} p={[0, -0.05, 0]} c="#eef3f8" ro={0.85} />
  {([[-1.5, 0.7, 0.55], [1.6, 0.5, 0.45], [-0.9, -0.8, 0.5], [1.1, -0.9, 0.6], [0, 1.4, 0.5], [-2.2, -0.2, 0.7]] as V3[]).map(([x, z, r], i) =>
    <Sp key={i} rad={r} p={[x, 0, z]} sc={[1, 0.26, 1]} c="#f6f9fc" ro={0.85} seg={24} ns />)}
</group>;
// mano 3D: dedos hacia +y, palma hacia +z, antebrazo hacia -y; curl = cuánto cierra
const SKIN = "#e3b08c";
const Hand: React.FC<{ p?: V3; r?: V3; s?: number; curl?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, curl = 0.5 }) =>
  <group position={p} rotation={r} scale={s}>
    <Bx s={[0.1, 0.1, 0.04]} c={SKIN} ro={0.6} rad={0.02} />
    {[-0.036, -0.012, 0.012, 0.036].map((x, i) => <group key={i} position={[x, 0.05, 0]} rotation={[curl * 1.15, 0, 0]}>
      <Bx s={[0.021, 0.07 - (i % 3 === 0 ? 0.012 : 0), 0.022]} p={[0, 0.035, 0]} c={SKIN} ro={0.6} rad={0.01} /></group>)}
    <group position={[0.055, -0.01, 0.01]} rotation={[0, 0, -0.9 - curl * 0.3]}><Bx s={[0.026, 0.065, 0.025]} p={[0, 0.03, 0]} c={SKIN} ro={0.6} rad={0.011} /></group>
    <Cy rt={0.036} rb={0.042} h={0.36} p={[0, -0.23, 0]} c={SKIN} ro={0.6} />
    <Bx s={[0.1, 0.12, 0.075]} p={[0, -0.16, 0]} c="#2b4d6e" ro={0.7} rad={0.02} />
  </group>;
// unidad exterior de la bomba: caja gris con aletas y ventilador arriba; centro de la base en p, fan = ángulo de las aspas
export const HPU: React.FC<{ p?: V3; s?: number; fan?: number; ice?: number; r?: V3 }> = ({ p = [0, 0, 0], s = 1, fan = 0, ice = 0, r = [0, 0, 0] }) =>
  <group position={p} scale={s} rotation={r}>
    <Bx s={[0.64, 0.04, 0.64]} p={[0, 0.02, 0]} c="#3a3d42" ro={0.6} />
    <Bx s={[0.6, 0.58, 0.6]} p={[0, 0.32, 0]} c="#c9ccd0" m={0.4} ro={0.4} rad={0.02} />
    {([[-1, -1], [1, -1], [-1, 1], [1, 1]] as [number, number][]).map(([a, b], i) => <Bx key={i} s={[0.04, 0.6, 0.04]} p={[a * 0.29, 0.32, b * 0.29]} c="#8d939a" m={0.6} ro={0.4} rad={0.008} />)}
    {Array.from({ length: 14 }, (_, i) => <Bx key={i} s={[0.52, 0.01, 0.006]} p={[0, 0.08 + i * 0.035, 0.302]} c="#7d8288" m={0.7} ro={0.4} ns />)}
    {Array.from({ length: 14 }, (_, i) => <Bx key={"s" + i} s={[0.006, 0.01, 0.52]} p={[0.302, 0.08 + i * 0.035, 0]} c="#7d8288" m={0.7} ro={0.4} ns />)}
    <Bx s={[0.1, 0.14, 0.02]} p={[0.2, 0.2, 0.305]} c="#8a8e94" m={0.5} ro={0.4} rad={0.006} />
    <Cy rt={0.26} h={0.03} p={[0, 0.615, 0]} c="#2a2c30" ro={0.6} />
    <To R={0.25} t={0.013} p={[0, 0.632, 0]} r={[Math.PI / 2, 0, 0]} c="#8a8e94" m={0.7} ro={0.35} />
    <To R={0.15} t={0.008} p={[0, 0.632, 0]} r={[Math.PI / 2, 0, 0]} c="#8a8e94" m={0.7} ro={0.35} />
    <group position={[0, 0.625, 0]} rotation={[0, fan, 0]}>
      <Cy rt={0.04} h={0.04} c="#1a1a1a" ro={0.4} />
      {[0, 1, 2, 3, 4].map((i) => <Bx key={i} s={[0.19, 0.005, 0.075]} p={[0.12 * Math.cos(i * 1.2566), 0, -0.12 * Math.sin(i * 1.2566)]} r={[0.32, i * 1.2566, 0]} c="#3a3d42" ro={0.5} />)}
    </group>
    {[-0.17, 0, 0.17].map((x, i) => <Bx key={i} s={[0.01, 0.012, 0.5]} p={[x, 0.64, 0]} c="#1a1a1a" ns />)}
    {ice > 0 && <Bx s={[0.62, 0.56 * ice, 0.62]} p={[0, 0.04 + 0.28 * ice, 0]} c="#dff2ff" o={0.55} ro={0.05} m={0.1} />}
  </group>;

// 1 · la columna de vapor: en la nieve, la unidad exterior echa bocanadas grandes que crecen y suben mientras el ventilador frena hasta quedar quieto
export const HPlume: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), D = h.out - h.at, ang = 16 * D * cum((x) => 1 - win(x, 0.1, 0.55), u), st = win(u, 0.1, 0.32);
  return <S3 p={lv([1.2, 1.3, 2.3], [0.8, 1.25, 1.9], win(u, 0, 1))} l={[0, 0.95, 0]} fov={38} floor={null} warm="#cfdcff">
    <Snow />
    <HPU s={1.55} fan={ang} />
    {Array.from({ length: 12 }, (_, i) => { const f = (tt * 0.26 + i / 12) % 1, sw = Math.sin(f * Math.PI);
      return <Puff key={i} p={[(rnd(i) - 0.5) * 0.35 + f * 0.35, 1.0 + f * 1.05, 0.05 + (rnd(i + 3) - 0.5) * 0.3]} s={0.45 + f * 0.95} c="#f3f7fb" o={0.62 * st * sw} add={false} r={[0, 0.45, 0]} />; })}
    {Array.from({ length: 5 }, (_, i) => { const f = (tt * 0.2 + i / 5) % 1;
      return <Puff key={"b" + i} p={[0.25 + f * 0.5, 1.15 + f * 0.7, 0.2 + rnd(i) * 0.2]} s={0.5 + f * 0.8} c="#dfe9f2" o={0.35 * st * Math.sin(f * Math.PI)} add={false} r={[0, 0.45, 0]} />; })}
  </S3>;
}}</Stage>;

const relax = (k: number) => canvasTex(`relaxE|${Math.round(k * 20)}`, 512, 430, (g) => {
  g.fillStyle = "#fff6c4"; g.fillRect(0, 0, 512, 430); g.strokeStyle = "rgba(80,120,200,.35)"; g.lineWidth = 2; for (let y = 60; y < 430; y += 48) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
  g.save(); g.beginPath(); g.rect(0, 0, 40 + k * 440, 430); g.clip(); g.fillStyle = "#1f7a3a"; g.font = HANDF(150); g.fillText("Relax.", 40, 250); g.restore();
});
// 2 · la caja registradora: los rodillos giran rápido y frenan en $3,000 bien grande; el cajón se abre y una mano escribe «Relax.» con marcador en una nota al costado
export const HPricetag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), v = Math.round(lerp(0, 3000, Math.pow(win(u, 0.06, 0.5), 0.75))), w = win(u, 0.58, 0.92), dr = drop(u, 0.5, 0.62);
  const mx = -0.2 + 0.4 * w;
  return <S3 p={lv([0.5, 1.15, 2.2], [0.3, 0.95, 1.85], win(u, 0, 1))} l={[0.28, 0.5, 0]} fov={38} floor={null}>
    <Counter w={3.6} d={1.8} />
    <Bx s={[1.1, 0.4, 0.62]} p={[-0.2, 0.22, 0]} c="#2f5d62" m={0.45} ro={0.35} rad={0.03} />
    <Bx s={[1.0, 0.1, 0.55]} p={[-0.2, 0.06, 0.1 + 0.3 * dr]} c="#b8bcc2" m={0.8} ro={0.3} rad={0.01} />
    {[0, 1, 2, 3].map((i) => <Bx key={i} s={[0.2, 0.012, 0.09]} p={[-0.5 + i * 0.22, 0.12, 0.28 + 0.3 * dr + i * 0.01]} c="#7fa86a" ro={0.8} ns />)}
    <Bx s={[0.22, 0.34, 0.14]} p={[-0.2, 0.55, -0.17]} c="#26292e" m={0.5} ro={0.4} />
    <group position={[-0.2, 0.84, -0.14]} rotation={[-0.3, 0, 0]}>
      <Bx s={[1.05, 0.46, 0.14]} c="#26292e" m={0.5} ro={0.4} rad={0.03} />
      <Odo v={v} n={4} pre="$" p={[0, 0.0, 0.075]} s={1.25} />
    </group>
    <group position={[-0.2, 0.43, 0.21]} rotation={[0.3, 0, 0]}>
      {Array.from({ length: 15 }, (_, i) => <Bx key={i} s={[0.13, 0.04, 0.1]} p={[-0.4 + (i % 5) * 0.2, 0, -0.1 + Math.floor(i / 5) * 0.12]} c={i === 14 ? "#d8402e" : "#d8d4cc"} ro={0.45} rad={0.01} />)}
    </group>
    <group position={[1.05, 0.28, 0.5]} rotation={[-0.95, -0.1, 0.04]}>
      <Bx s={[0.62, 0.52, 0.012]} c="#fff6c4" ro={0.8} rad={0.004} />
      <Pl w={0.6} h={0.5} p={[0, 0, 0.0075]} map={relax(w)} c="#ffffff" ro={0.8} ns />
      <Cy rt={0.013} h={0.26} p={[mx + 0.05, 0.12 + 0.03 * Math.sin(w * 22), 0.04]} r={[0.5, 0, 0.55]} c="#1f7a3a" ro={0.4} />
      <Cy rt={0.006} rb={0.003} h={0.04} p={[mx - 0.0, 0.0 + 0.03 * Math.sin(w * 22), 0.02]} r={[0.5, 0, 0.55]} c="#111" />
    </group>
    <Hand p={[mx + 1.15, 0.42, 0.62]} r={[-0.6, 0, 0.55]} s={1.3} curl={0.85} />
  </S3>;
}}</Stage>;

// 3 · la cinta transportadora: bolitas de calor nacen del aire frío de afuera, caen en la cinta, la bomba las recibe con un destello y las deja en la casa
export const HConveyor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), on = win(u, 0.05, 0.16), N = 9, sp = tt * 0.1;
  return <S3 p={lv([0.25, 1.1, 2.6], [0.1, 0.95, 2.25], win(u, 0, 1))} l={[0, 0.38, 0]} fov={38} floor={null}>
    <Bx s={[2.0, 0.12, 1.9]} p={[-1.0, -0.06, 0]} c="#eef3f8" ro={0.85} />
    <Bx s={[2.0, 0.12, 1.9]} p={[1.0, -0.06, 0]} c="#8fa66a" ro={0.9} />
    {([[-1.5, -0.3, 0.3], [-0.85, -0.55, 0.26]] as V3[]).map(([x, z, r], i) => <Sp key={i} rad={r} p={[x, 0, z]} sc={[1, 0.3, 1]} c="#f6f9fc" ro={0.85} seg={24} ns />)}
    {Array.from({ length: 6 }, (_, i) => { const f = (tt * 0.22 + i / 6) % 1;
      return <Puff key={i} p={[-1.45 + f * 0.9 + (rnd(i) - 0.5) * 0.2, 0.55 + 0.25 * Math.sin(f * 6 + i), -0.2 + (rnd(i + 2) - 0.5) * 0.3]} s={0.5} c="#bfe4ff" o={0.4 * Math.sin(f * Math.PI)} />; })}
    <HPU p={[-0.05, 0, -0.35]} s={1.15} fan={tt * 10} />
    <group position={[1.05, 0, -0.3]}>
      <Bx s={[0.85, 0.62, 0.7]} p={[0, 0.31, 0]} c="#e8dcc0" ro={0.8} />
      <mesh position={[0, 0.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[0.72, 0.4, 4]} /><meshStandardMaterial color="#8a3a2a" roughness={0.7} /></mesh>
      <Pl w={0.26} h={0.26} p={[0.15, 0.33, 0.352]} c="#ffcf7a" e="#ffb14a" ei={win(u, 0.4, 0.8) * 1.6} ns />
      <Bx s={[0.2, 0.4, 0.02]} p={[-0.22, 0.2, 0.352]} c="#5a3a22" ro={0.7} />
    </group>
    <Bx s={[3.0, 0.05, 0.26]} p={[0, 0.045, 0.45]} c="#2a2c30" ro={0.5} />
    {Array.from({ length: 30 }, (_, i) => <Bx key={i} s={[0.012, 0.054, 0.26]} p={[-1.45 + (((i / 30) + sp * 0.9) % 1) * 2.9, 0.047, 0.45]} c="#4a4d54" ns />)}
    {Array.from({ length: N }, (_, i) => { const f = (sp + i / N) % 1, x = -1.3 + f * 2.6, fall = Math.max(0, 1 - drop(f, 0, 0.09)), y = 0.155 + 0.6 * fall, sz = win(f, 0, 0.025);
      const warm = win(x, -0.3, 0.3), gl = Math.exp(-(((x + 0.05) / 0.25) ** 2)), col = mixc("#bfe4ff", "#ff8a2a", warm);
      return <group key={i}>
        <Sp rad={0.085 * sz + 0.0001} p={[x, y, 0.45]} c={col} e={col} ei={on * (0.3 + warm * 1.3 + gl)} ro={0.25} />
        <Sp rad={0.085 * sz + 0.0001} p={[x, 0.075, 0.45]} sc={[1.2, 0.02, 1.2]} c="#000000" o={0.35 * (1 - fall)} ns />
        <Puff p={[x, y, 0.62]} s={0.55} c="#ff9a3a" o={0.85 * gl * on} />
      </group>; })}
  </S3>;
}}</Stage>;

const scale460 = () => canvasTex("escala460E", 512, 2048, (g) => {
  const r = g.createLinearGradient(0, 0, 0, 2048); r.addColorStop(0, "#f6efe2"); r.addColorStop(0.35, "#dfe8f2"); r.addColorStop(1, "#8ec2ee"); g.fillStyle = r; g.fillRect(0, 0, 512, 2048);
  g.fillStyle = "#1f2a36"; g.font = BOLD(74);
  for (let d = 20; d >= -460; d -= 10) { const y = ((20 - d) / 480) * 1960 + 44, big = d % 50 === 0; g.fillRect(0, y - 3, big ? 150 : 80, big ? 9 : 5); if (big) g.fillText(String(d), 170, y + 26); }
});
// 4 · la regla infinita: la cámara cae por un termómetro gigante desde los 20° de afuera hasta −460°, el cero absoluto: la bola azul brilla y todo eso todavía es calor
export const HZeroscale: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), d = win(u, 0.1, 0.8), y = lerp(4.5, 0.5, d), glow = win(u, 0.62, 0.85), cr = win(d, 0.5, 1);
  return <S3 p={[0.6, y + 0.12, 2.0]} l={[0.3, y, 0]} fov={36} floor={null}>
    <Bx s={[6, 7, 0.05]} p={[0, 2.5, -0.4]} c="#16273d" ro={0.9} ns />
    <Pl w={1.2} h={4.8} p={[0.35, 2.4, 0]} map={scale460()} c="#ffffff" ro={0.7} />
    <Cy rt={0.085} h={4.9} p={[-0.38, 2.45, 0.05]} c="#e8f0f4" o={0.28} ro={0.05} />
    <Cy rt={0.05} h={4.7} p={[-0.38, 2.4, 0.05]} c="#4f9ad8" e="#2f7ad8" ei={0.5} ro={0.25} />
    <Sp rad={0.2} p={[-0.38, 0.0, 0.05]} c="#4f9ad8" e="#3a8cff" ei={0.4 + glow * 1.6} ro={0.2} />
    <Puff p={[-0.38, 0.0, 0.3]} s={1.4} c="#6fb4ff" o={0.7 * glow} />
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[-0.38 + Math.cos(i * 1.9) * (0.2 + rnd(i) * 0.1), 0.05 + rnd(i + 1) * 0.5, 0.05 + Math.sin(i * 1.9) * 0.2]} rotation={[rnd(i) * 3, rnd(i + 1) * 3, 0]} scale={[0.025 * cr, 0.1 * cr + 0.001, 0.025 * cr]}><octahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#eef8ff" roughness={0.15} emissive="#bfe4ff" emissiveIntensity={0.4} /></mesh>)}
  </S3>;
}}</Stage>;

const gearTeeth = 9;
const Gear: React.FC<{ p: V3; R: number; a: number; c?: string }> = ({ p, R, a, c = "#c9a24a" }) =>
  <group position={p} rotation={[0, 0, a]}>
    <Cy rt={R} h={0.03} r={[Math.PI / 2, 0, 0]} c={c} m={0.85} ro={0.3} />
    {Array.from({ length: gearTeeth }, (_, i) => <group key={i} rotation={[0, 0, (i / gearTeeth) * Math.PI * 2]}><Bx s={[R * 0.4, R * 0.5, 0.03]} p={[0, R * 1.0, 0]} c={c} m={0.85} ro={0.3} rad={0.004} /></group>)}
  </group>;
// 5 · la máquina multiplicadora: una ficha azul de 1 kWh baja por la ranura, la caja tiembla con sus engranajes a la vista y salen tres fichas naranjas de calor rodando una detrás de otra
export const HCoins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), cin = drop(u, 0.06, 0.26), run = win(u, 0.26, 0.38) * (1 - win(u, 0.74, 0.88)), sx = run * Math.sin(tt * 55) * 0.007, g = tt * 5 * run;
  return <S3 p={lv([0.45, 1.0, 2.3], [0.3, 0.9, 1.95], win(u, 0, 1))} l={[0.3, 0.45, 0]} fov={36} floor={null}>
    <Counter w={3.6} d={1.8} />
    <group position={[-0.55 + sx, 0, 0]}>
      <Bx s={[0.85, 0.9, 0.62]} p={[0, 0.45, 0]} c="#2b4d6e" m={0.45} ro={0.35} rad={0.035} />
      <Bx s={[0.3, 0.012, 0.06]} p={[0, 0.906, 0]} c="#07090c" />
      <Bx s={[0.5, 0.06, 0.3]} p={[0, 0.93, 0]} c="#1f3a54" m={0.5} ro={0.4} rad={0.02} />
      <Bx s={[0.62, 0.34, 0.02]} p={[0, 0.52, 0.31]} c="#0b0f14" />
      <Gear p={[-0.12, 0.52, 0.325]} R={0.08} a={g} />
      <Gear p={[0.07, 0.52, 0.325]} R={0.07} a={-g * 1.15 + 0.2} c="#e8803a" />
      <Pl w={0.6} h={0.32} p={[0, 0.52, 0.322]} c="#ffb14a" add o={0.2 * run} ns />
      <Txt t="×3" w={0.3} c="#ffcf7a" e={0.8 + run} p={[0, 0.26, 0.312]} />
      <Bx s={[0.02, 0.12, 0.22]} p={[0.426, 0.14, 0.1]} c="#07090c" />
      <group position={[0, lerp(1.2, 0.66, cin), 0]} scale={u > 0.28 ? 0.001 : 1}>
        <Cy rt={0.115} h={0.03} r={[Math.PI / 2, 0, 0]} c="#4f9ad8" m={0.6} ro={0.28} e="#3a8cff" ei={0.35} />
        <Txt t="1 kWh" w={0.15} c="#ffffff" p={[0, 0, 0.018]} />
      </group>
    </group>
    {[0, 1, 2].map((i) => { const a = 0.4 + i * 0.13, e = win(u, a, a + 0.2), x = lerp(-0.4, 0.4 + i * 0.42, 1 - (1 - e) * (1 - e));
      return <group key={i} position={[x, 0.125, 0.12]} rotation={[0, 0, -(x + 0.4) / 0.125]}>
        <Cy rt={0.125} h={0.034} r={[Math.PI / 2, 0, 0]} c="#e8803a" m={0.7} ro={0.28} e="#ff7a20" ei={0.35} />
        <To R={0.1} t={0.006} p={[0, 0, 0.018]} c="#ffd27a" m={0.7} ro={0.3} />
        <Txt t="HEAT" w={0.15} c="#fff3d6" p={[0, 0, 0.02]} />
      </group>; })}
  </S3>;
}}</Stage>;

// 6 · dos canillas: la de la bomba gotea calor barato en verde, la de las resistencias chorrea rojo caro; una mano gira la manija roja hasta dejarla en gota
export const HTwotaps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), enter = win(u, 0.3, 0.45), close = win(u, 0.45, 0.72), redFlow = 1 - close, ang = close * 3.4;
  const lvG = lerp(0.1, 0.8, win(u, 0.05, 0.95)), lvR = lerp(0.1, 0.85, win(u, 0.02, 0.45));
  const tap = (x: number, c: string, flow: number, tn: number, lvl: number, dripOnly: boolean) => {
    const top = 0.02 + 0.5 * lvl, r = 0.012 + 0.03 * flow;
    return <group position={[x, 0, 0]}>
      <Cy rt={0.05} h={0.55} p={[0, 1.0, 0.07]} r={[Math.PI / 2, 0, 0]} c="#b8bcc2" m={0.95} ro={0.2} />
      <Sp rad={0.065} p={[0, 1.0, 0.33]} c="#b8bcc2" m={0.95} ro={0.2} />
      <Cy rt={0.05} rb={0.04} h={0.2} p={[0, 0.92, 0.33]} c="#b8bcc2" m={0.95} ro={0.2} />
      <Cy rt={0.07} h={0.12} p={[0, 1.1, 0.07]} c="#9ea3aa" m={0.9} ro={0.25} />
      <group position={[0, 1.2, 0.07]} rotation={[0, tn, 0]}><Bx s={[0.3, 0.04, 0.06]} c={c} ro={0.4} rad={0.015} /><Bx s={[0.06, 0.04, 0.3]} c={c} ro={0.4} rad={0.015} /><Cy rt={0.035} h={0.05} p={[0, 0.03, 0]} c="#e8e8e8" m={0.8} ro={0.3} /></group>
      {flow > 0.03 && !dripOnly && <Cy rt={r} h={0.8 - top} p={[0, 0.8 - (0.8 - top) / 2, 0.33]} c={c} e={c} ei={0.5} o={0.85} ro={0.05} />}
      {(dripOnly || flow <= 0.03) && [0, 1].map((i) => { const f = (tt * 1.1 + i * 0.5) % 1; return <Sp key={i} rad={0.025} p={[0, 0.8 - f * (0.8 - top), 0.33]} sc={[1, 1.4, 1]} c={c} e={c} ei={0.6} />; })}
      <Cy rt={0.2} rb={0.17} h={0.55} p={[0, 0.275, 0.33]} c="#e8f0f4" o={0.22} ro={0.03} open />
      <Cy rt={0.196 - 0.02 * (1 - lvl)} rb={0.168} h={Math.max(0.01, 0.5 * lvl)} p={[0, 0.02 + 0.25 * lvl, 0.33]} c={c} e={c} ei={0.4} o={0.85} ro={0.1} />
    </group>;
  };
  return <S3 p={lv([0, 1.0, 2.3], [0, 0.9, 2.0], win(u, 0, 1))} l={[0, 0.65, 0]} fov={38} floor={null}>
    <Wall y={0.9} z={-0.2} />
    <Counter w={3.2} d={1.4} z={0.3} />
    {tap(-0.55, "#3fbf6a", 0.25, 0, lvG, true)}{tap(0.55, "#e2342a", redFlow, ang, lvR, false)}
    <Cy rt={0.19} h={0.04} p={[-1.0, 1.02, -0.15]} r={[Math.PI / 2, 0, 0]} c="#2e8f50" ro={0.4} />
    <HPU p={[-1.0, 0.86, -0.1]} s={0.3} />
    <Cy rt={0.19} h={0.04} p={[1.0, 1.02, -0.15]} r={[Math.PI / 2, 0, 0]} c="#a82a22" ro={0.4} />
    <Tube pts={[[0.88, 0.92, -0.1], [0.94, 1.14, -0.1], [0.99, 0.92, -0.1], [1.05, 1.14, -0.1], [1.12, 0.92, -0.1]]} rad={0.014} c="#ff5a3a" e="#ff3a1a" ei={0.8} />
    <group position={[0.55 + 0.11 * Math.sin(ang) + (1 - enter) * 0.7, 1.26 + (1 - enter) * 0.25, 0.07 + 0.11 * Math.cos(ang)]} rotation={[0, 0, Math.PI / 2 + 0.35 * (1 - enter)]}>
      <Hand s={1.5} curl={0.9} />
    </group>
  </S3>;
}}</Stage>;

const Dend: React.FC<{ p: V3; r?: V3; s: number }> = ({ p, r = [0, 0, 0], s }) => s < 0.02 ? null :
  <group position={p} rotation={r} scale={s}>
    <Bx s={[0.007, 0.1, 0.007]} p={[0, 0.05, 0]} c="#eef8ff" e="#bfe4ff" ei={0.35} ro={0.15} ns />
    {[0.03, 0.06, 0.085].map((y, i) => [-1, 1].map((sd) => <Bx key={i + "" + sd} s={[0.005, 0.05 - i * 0.012, 0.005]} p={[sd * 0.016, y + 0.012, 0]} r={[0, 0, -sd * 0.9]} c="#eef8ff" e="#bfe4ff" ei={0.35} ro={0.15} ns />))}
  </group>;
// 7 · la escarcha: el serpentín de la unidad; cristales ramificados crecen desde los bordes de las aletas hacia el centro y el aire que pasaba se queda del otro lado
export const HFreezer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.1, 0.72), W = 0.82 * k, gap = 0.82 - W;
  return <S3 p={lv([0.55, 0.9, 1.95], [0.25, 0.75, 1.65], win(u, 0, 1))} l={[0, 0.5, 0]} fov={36} floor={null}>
    <Bx s={[1.84, 1.06, 0.05]} p={[0, 0.5, -0.16]} c="#1e2024" ro={0.7} />
    {Array.from({ length: 4 }, (_, i) => <Bx key={i} s={i < 2 ? [1.84, 0.06, 0.3] : [0.06, 1.06, 0.3]} p={i === 0 ? [0, 1.03, 0] : i === 1 ? [0, -0.03, 0] : [i === 2 ? -0.92 : 0.92, 0.5, 0]} c="#3a3d42" m={0.6} ro={0.4} />)}
    {Array.from({ length: 44 }, (_, i) => <Bx key={i} s={[0.01, 0.98, 0.22]} p={[-0.8 + i * 0.0372, 0.5, 0]} c="#aeb4ba" m={0.85} ro={0.3} rad={0.003} ns />)}
    {Array.from({ length: 7 }, (_, i) => <Cy key={i} rt={0.026} h={1.7} p={[0, 0.12 + i * 0.126, 0.1]} r={[0, 0, Math.PI / 2]} c="#c8743a" m={0.85} ro={0.3} />)}
    {[-1, 1].map((sd) => <group key={sd}>
      <Bx s={[W + 0.001, 0.98, 0.25]} p={[sd * (0.82 - W / 2), 0.5, 0.0]} c="#e9f4fb" o={0.6} ro={0.2} />
      {Array.from({ length: 7 }, (_, i) => <Cy key={i} rt={0.03 + 0.03 * k} h={W + 0.001} p={[sd * (0.82 - W / 2), 0.12 + i * 0.126, 0.1]} r={[0, 0, Math.PI / 2]} c="#f3fbff" e="#bfe4ff" ei={0.25} ro={0.15} />)}
      {Array.from({ length: 22 }, (_, i) => <Dend key={i} p={[sd * (0.82 - W + 0.01), 0.1 + (i / 21) * 0.8, 0.14]} r={[0, 0, (sd * -Math.PI) / 2 + (rnd(i) - 0.5) * 0.7]} s={k * (1.5 + rnd(i + 5) * 3.2)} />)}
      {Array.from({ length: 16 }, (_, i) => <Dend key={"z" + i} p={[sd * (0.82 - rnd(i + 9) * W), 0.1 + rnd(i + 3) * 0.8, 0.16]} r={[0.4, (rnd(i) - 0.5) * 3, (rnd(i + 2) - 0.5) * 3]} s={k * (0.8 + rnd(i + 7) * 1.2)} />)}
    </group>)}
    {Array.from({ length: 10 }, (_, i) => { const x = -0.74 + i * 0.164, f = (tt * 0.5 + i * 0.13) % 1, blocked = Math.abs(x) > gap, zz = blocked ? lerp(1.3, 0.5, f) : lerp(1.3, -0.5, f);
      return <Bx key={i} s={[0.025, 0.025, 0.4]} p={[x, 0.2 + ((i * 7) % 10) * 0.07, zz]} c="#bfe4ff" e="#8fd0ff" ei={1.1} o={blocked ? 0.85 * Math.sin(f * Math.PI) : 0.9 * Math.min(1, Math.sin(f * Math.PI) * 2)} ns />; })}
  </S3>;
}}</Stage>;

// 8 · el giro: el circuito de flechas gira alrededor de la unidad, se frena, se invierte, y el bloque de hielo del serpentín se derrite, gotea y arma un charco
export const HReverse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), D = h.out - h.at, rev = win(u, 0.3, 0.45), melt = win(u, 0.45, 0.88);
  const ph = cum((x) => lerp(1, -1, win(x, 0.3, 0.45)), u) * D * 0.28, S = 1.45;
  return <S3 p={lv([1.0, 1.55, 2.5], [0.7, 1.4, 2.1], win(u, 0, 1))} l={[0, 0.4, 0]} fov={38} floor={null}>
    <Bx s={[3.6, 0.1, 3]} p={[0, -0.05, 0]} c="#b9bdc2" ro={0.8} />
    <HPU s={S} fan={cum((x) => 12 * (1 - win(x, 0.25, 0.35)), u) * D} />
    <Bx s={[0.9 * S, 0.8 * S * (1 - melt * 0.85) + 0.01, 0.12 * (1 - melt * 0.6) + 0.01]} p={[0, 0.06 + 0.4 * S * (1 - melt * 0.85), 0.31 * S + 0.05]} {...ICE} o={0.62} />
    <Bx s={[0.12 * (1 - melt * 0.6) + 0.01, 0.8 * S * (1 - melt * 0.85) + 0.01, 0.9 * S]} p={[0.31 * S + 0.05, 0.06 + 0.4 * S * (1 - melt * 0.85), 0]} {...ICE} o={0.55} />
    {melt > 0.02 && <mesh position={[0.1, 0.003, 0.5]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.1 + 0.6 * melt, 40]} /><meshStandardMaterial color="#8fc0e6" transparent opacity={0.6} roughness={0.05} metalness={0.2} /></mesh>}
    {melt > 0.05 && melt < 0.97 && Array.from({ length: 7 }, (_, i) => { const f = (tt * 1.1 + i / 7) % 1; return <Sp key={i} rad={0.03} p={[-0.4 + i * 0.14, 0.9 * (1 - f) * (0.1 + 0.3 * (1 - melt)) + 0.03, 0.68]} sc={[1, 1.5, 1]} c="#cfe8ff" e="#9fd0ff" ei={0.4} ro={0.05} />; })}
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10 + ph) * Math.PI * 2, dir = rev < 0.5 ? 1 : -1, c = dir > 0 ? "#4f9ad8" : "#e8803a";
      return <mesh key={i} position={[1.05 * Math.cos(a), 0.2, 1.05 * Math.sin(a)]} rotation={[0, Math.PI / 2 - a + (dir > 0 ? 0 : Math.PI), Math.PI / 2]} castShadow><coneGeometry args={[0.08, 0.2, 16]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.9} /></mesh>; })}
    <To R={1.05} t={0.014} p={[0, 0.2, 0]} r={[Math.PI / 2, 0, 0]} c={mixc("#4f9ad8", "#e8803a", rev)} e={mixc("#2f7ad8", "#ff7a20", rev)} ei={0.7} />
  </S3>;
}}</Stage>;

const clockNums = Array.from({ length: 12 }, (_, i) => i + 1);
// 9 · el reloj helado: las agujas corren cuatro horas mientras la escarcha cierra el cristal desde el borde hasta tapar la esfera; al final suena el teléfono
export const HIcehours: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ice = win(u, 0.1, 0.8), hrs = win(u, 0.1, 0.8) * 4, ring = win(u, 0.8, 0.86), Rin = Math.max(0.02, 0.5 * (1 - ice));
  const shake = Math.sin(tt * 42) * 0.07 * ring;
  return <S3 p={lv([0.45, 0.85, 2.3], [0.3, 0.75, 1.95], win(u, 0, 1))} l={[0.1, 0.62, 0]} fov={36} floor={null} warm="#cfdcff">
    <Snow />
    <HPU p={[-0.8, 0, -0.4]} s={1.0} fan={tt * 3} ice={ice * 0.7} />
    <group position={[0.15, 0.62, 0.3]}>
      <Bx s={[0.09, 0.14, 0.2]} p={[-0.3, -0.56, 0]} c="#3a3d42" m={0.6} ro={0.4} />
      <Bx s={[0.09, 0.14, 0.2]} p={[0.3, -0.56, 0]} c="#3a3d42" m={0.6} ro={0.4} />
      <Cy rt={0.5} h={0.12} r={[Math.PI / 2, 0, 0]} c="#3a3d42" m={0.6} ro={0.35} seg={64} />
      <To R={0.5} t={0.03} p={[0, 0, 0.06]} c="#c9a24a" m={0.9} ro={0.25} />
      <mesh position={[0, 0, 0.062]}><circleGeometry args={[0.47, 64]} /><meshStandardMaterial color="#f6f1e4" roughness={0.55} /></mesh>
      {clockNums.map((n) => <Txt key={n} t={String(n)} w={n > 9 ? 0.1 : 0.06} c="#2a2520" p={[0.37 * Math.sin(n * 0.5236), 0.37 * Math.cos(n * 0.5236), 0.066]} />)}
      <group position={[0, 0, 0.075]} rotation={[0, 0, -hrs * 30 * D2R]}><Bx s={[0.04, 0.26, 0.012]} p={[0, 0.1, 0]} c="#1a1a1a" ns /></group>
      <group position={[0, 0, 0.085]} rotation={[0, 0, -hrs * Math.PI * 2]}><Bx s={[0.025, 0.4, 0.01]} p={[0, 0.17, 0]} c="#c8302a" ns /></group>
      <Sp rad={0.03} p={[0, 0, 0.09]} c="#1a1a1a" />
      <Cy rt={0.49} h={0.02} p={[0, 0, 0.1]} r={[Math.PI / 2, 0, 0]} c="#dff2ff" o={0.16} ro={0.03} seg={64} />
      <mesh position={[0, 0, 0.115]}><ringGeometry args={[Rin, 0.495, 64, 1]} /><meshStandardMaterial color="#e8f4fb" transparent opacity={0.9} roughness={0.3} emissive="#bfe4ff" emissiveIntensity={0.2} side={2} /></mesh>
      {Array.from({ length: 40 }, (_, i) => { const a = (i / 40) * Math.PI * 2 + rnd(i) * 0.1, rr = Rin + 0.01;
        return <mesh key={i} position={[rr * Math.cos(a), rr * Math.sin(a), 0.125]} rotation={[0, 0, a - Math.PI / 2]} scale={[0.02, 0.06 * (0.6 + rnd(i + 2)) * Math.min(1, ice * 5), 0.02]}><octahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#f2fbff" roughness={0.15} emissive="#bfe4ff" emissiveIntensity={0.5} /></mesh>; })}
    </group>
    <group position={[1.05, 0, 0.45]} rotation={[0, 0, shake]}>
      <Bx s={[0.42, 0.1, 0.3]} p={[0, 0.05, 0]} c="#c8302a" ro={0.4} rad={0.03} />
      <Bx s={[0.4, 0.07, 0.1]} p={[0, 0.14, 0]} c="#c8302a" ro={0.35} rad={0.03} />
      <Sp rad={0.06} p={[-0.19, 0.14, 0]} c="#c8302a" ro={0.35} /><Sp rad={0.06} p={[0.19, 0.14, 0]} c="#c8302a" ro={0.35} />
      {[0, 1, 2].map((i) => <To key={i} R={0.1 + ((tt * 0.9 + i / 3) % 1) * 0.4} t={0.006} p={[0, 0.3, 0]} r={[Math.PI / 2, 0, 0]} c="#ffd27a" e="#ffb14a" ei={0.8} o={ring * (1 - ((tt * 0.9 + i / 3) % 1))} />)}
    </group>
  </S3>;
}}</Stage>;

const Glass: React.FC<{ deg: number; lo?: number; hi?: number; p?: V3; s?: number; hot?: number }> = ({ deg, lo = 50, hi = 100, p = [0, 0, 0], s = 1, hot = 0 }) => { const top = 0.08 + cl((deg - lo) / (hi - lo)) * 0.55;
  return <group position={p} scale={s}>
    <Bx s={[0.13, 0.72, 0.02]} p={[0, 0.36, -0.02]} c="#f2eee4" ro={0.6} rad={0.01} />
    {[0, 1, 2, 3, 4, 5].map((i) => <Bx key={i} s={[i % 2 ? 0.03 : 0.045, 0.004, 0.004]} p={[0.05, 0.08 + i * 0.11, -0.008]} c="#2a2520" ns />)}
    <Cy rt={0.024} h={0.64} p={[0, 0.36, 0]} c="#e8f0f4" o={0.3} ro={0.05} />
    <Sp rad={0.04} p={[0, 0.06, 0]} c="#d22a22" ro={0.25} e="#ff2a10" ei={0.2 + hot} />
    <Cy rt={0.012} h={top - 0.06} p={[0, 0.06 + (top - 0.06) / 2, 0]} c="#d22a22" ro={0.3} e="#ff2a10" ei={0.4 + hot} />
  </group>; };
// 10 · los tres termómetros: el mercurio sube de a uno con resorte (tu mano 98.6, el aire de la rejilla 92, la casa 68) y un hilo de calor naranja corre del aire a la casa
export const HBodytemp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), flow = win(u, 0.6, 0.72);
  const T: [number, string][] = [[98.6, "#ffcf9a"], [92, "#ffb14a"], [68, "#bfe4ff"]];
  const bez = (f: number): V3 => [lerp(0.04, 0.72, f), 1.0 + 0.3 * Math.sin(f * Math.PI), 0.12];
  return <S3 p={lv([0.1, 1.0, 2.7], [0.05, 0.9, 2.35], win(u, 0, 1))} l={[0, 0.85, 0]} fov={36} floor={null}>
    <Wall y={0.8} z={-0.2} />
    <Counter w={3.4} d={1.6} z={0.3} />
    {T.map(([d, c], i) => { const k = drop(u, 0.06 + i * 0.12, 0.3 + i * 0.12), x = (i - 1) * 0.75;
      return <group key={i}>
        <Glass deg={lerp(50, d, k)} p={[x, 0.3, 0]} s={1.6} hot={i === 2 ? 0 : k * 0.3} />
        <group position={[x, 0.14, 0.5]} rotation={[-0.4, 0, 0]}><Bx s={[0.5, 0.2, 0.04]} c="#26292e" ro={0.5} rad={0.02} /><Txt t={`${d}°`} w={0.38} c={c} e={0.6 * Math.min(1, k)} p={[0, 0, 0.025]} /></group>
      </group>; })}
    <Hand p={[-0.75, 0.55, 0.16]} s={1.5} curl={0.75} />
    <Tube pts={[bez(0), bez(0.25), bez(0.5), bez(0.75), bez(1)]} rad={0.014} c="#ff9a3a" e="#ff7a20" ei={1.1} o={0.7 * flow} />
    {Array.from({ length: 5 }, (_, i) => { const f = (tt * 0.45 + i / 5) % 1; return <Sp key={i} rad={0.045} p={bez(f)} c="#ffb14a" e="#ff8a20" ei={1.6} o={flow} />; })}
    <mesh position={[0.72, 0.93, 0.12]} rotation={[0, 0, Math.PI]} scale={flow}><coneGeometry args={[0.07, 0.16, 16]} /><meshStandardMaterial color="#ffb14a" emissive="#ff8a20" emissiveIntensity={1} /></mesh>
  </S3>;
}}</Stage>;

const Tumbler: React.FC<{ x: number; lvl: number; c: string; mark?: boolean }> = ({ x, lvl, c, mark }) => { const Hh = Math.max(0.01, 0.96 * lvl), rr = 0.2 + 0.08 * Hh;
  return <group position={[x, 0, 0]}>
    <Cy rt={0.3} rb={0.22} h={1.0} p={[0, 0.5, 0]} c="#e8f0f4" o={0.2} ro={0.03} open />
    <To R={0.3} t={0.012} p={[0, 1.0, 0]} r={[Math.PI / 2, 0, 0]} c="#f4fbff" o={0.6} ro={0.05} />
    <Cy rt={rr} rb={0.205} h={Hh} p={[0, 0.02 + Hh / 2, 0]} c={c} e={c} ei={0.4} o={0.88} ro={0.1} />
    <Cy rt={rr} h={0.004} p={[0, 0.02 + Hh, 0]} c="#ffffff" o={0.25} ro={0.05} />
    {mark && <To R={0.2 + 0.08 * 0.7} t={0.008} p={[0, 0.72, 0]} r={[Math.PI / 2, 0, 0]} c="#7dff9a" e="#7dff9a" ei={1.2} />}
  </group>; };
// 11 · los dos vasos: el furnace llena a chorros que salpican y se vacía entre golpes; la bomba llena a hilo parejo y su vaso queda siempre arriba de la marca verde
export const HTortoise: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), cyc = (tt * 0.42) % 1, burst = cyc < 0.3;
  const lvA = burst ? lerp(0.12, 0.95, cyc / 0.3) : lerp(0.95, 0.12, (cyc - 0.3) / 0.7), lvB = lerp(0.35, 0.84, win(u, 0.05, 0.45));
  const jet = burst ? 0.055 * Math.min(1, cyc / 0.03, (0.3 - cyc) / 0.03) : 0, topA = 0.02 + 0.96 * lvA, topB = 0.02 + 0.96 * lvB;
  return <S3 p={lv([0, 0.9, 2.5], [0, 0.82, 2.2], win(u, 0, 1))} l={[0, 0.65, 0]} fov={38} floor={null}>
    <Wall y={0.9} z={-0.35} />
    <Counter w={3.2} d={1.6} z={0.2} />
    <Bx s={[2.0, 0.09, 0.09]} p={[0, 1.42, -0.1]} c="#9ea3aa" m={0.9} ro={0.25} />
    {[-0.55, 0.55].map((x) => <Cy key={x} rt={0.06} rb={0.04} h={0.22} p={[x, 1.28, -0.1]} c="#9ea3aa" m={0.9} ro={0.25} />)}
    <Tumbler x={-0.55} lvl={lvA} c="#e8603a" mark />
    <Tumbler x={0.55} lvl={lvB} c="#e8a03a" mark />
    {jet > 0.01 && <Cy rt={jet} h={1.17 - topA} p={[-0.55, 1.17 - (1.17 - topA) / 2, -0.1]} c="#e8603a" e="#e8603a" ei={0.6} o={0.9} ro={0.05} />}
    <Cy rt={0.014} h={1.17 - topB} p={[0.55, 1.17 - (1.17 - topB) / 2, -0.1]} c="#e8a03a" e="#e8a03a" ei={0.6} o={0.9} ro={0.05} />
    {jet > 0.02 && Array.from({ length: 10 }, (_, i) => { const f = (tt * 3.2 + i / 10) % 1, a = rnd(i) * 6.28;
      return <Sp key={i} rad={0.028} p={[-0.55 + Math.cos(a) * 0.18 * f, topA + 0.32 * Math.sin(f * Math.PI) * (0.5 + rnd(i + 3)), -0.1 + Math.sin(a) * 0.18 * f]} c="#e8603a" e="#ff7a40" ei={0.8} ro={0.1} />; })}
    {!burst && lvA > 0.1 && <Cy rt={0.012} h={0.2} p={[-0.82, 0.06, 0.15]} c="#e8603a" e="#e8603a" ei={0.6} o={0.85} />}
    <Cy rt={0.03} h={0.1} p={[-0.84, 0.2, 0.0]} r={[0, 0, Math.PI / 2]} c="#9ea3aa" m={0.9} ro={0.25} />
  </S3>;
}}</Stage>;

// 12 · las dos palabras: en el termostato las letras A-U-X se encienden de a una con su clic y una luz verde de «normal»; al lado EM HEAT parpadea en rojo con una sirena
export const HTwowords: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), on = [0.08, 0.18, 0.28], blink = u > 0.4 ? (Math.sin(tt * 9) > 0 ? 1 : 0.1) : 0, siren = win(u, 0.4, 0.5);
  const press = (a: number) => win(u, a, a + 0.02) * (1 - win(u, a + 0.04, a + 0.07));
  return <S3 p={lv([0.1, 1.15, 2.0], [0.0, 1.05, 1.7], win(u, 0, 1))} l={[0.05, 1.03, 0]} fov={34} floor={null}>
    <Wall y={1} z={-0.1} />
    <Bx s={[0.9, 0.66, 0.08]} p={[-0.42, 1.0, 0]} c="#efece4" ro={0.42} rad={0.04} />
    <Bx s={[0.72, 0.3, 0.016]} p={[-0.42, 1.08, 0.042]} c="#0f1610" rad={0.01} />
    {"AUX".split("").map((ch, i) => <Txt key={i} t={ch} w={0.16} c={u > on[i] ? "#9fff9a" : "#1f2a1f"} e={u > on[i] ? 1.3 : 0} p={[-0.6 + i * 0.18, 1.08, 0.052]} />)}
    {[0, 1, 2].map((i) => <Bx key={i} s={[0.16, 0.06, 0.03]} p={[-0.6 + i * 0.18, 0.84, 0.045 - 0.014 * press(on[i])]} c="#d6d2c8" ro={0.4} rad={0.012} />)}
    <Sp rad={0.028} p={[-0.1, 1.24, 0.045]} c="#3fbf6a" e="#3fff7a" ei={1.8 * win(u, 0.08, 0.16)} />
    <Bx s={[0.6, 0.66, 0.08]} p={[0.52, 1.0, 0]} c="#b82a22" ro={0.4} rad={0.04} />
    <Bx s={[0.5, 0.26, 0.016]} p={[0.52, 1.0, 0.042]} c="#1a0f0f" rad={0.01} />
    <Txt t="EM HEAT" w={0.44} c={blink > 0.5 ? "#ff4a3a" : "#3a1a1a"} e={blink * 1.8} p={[0.52, 1.0, 0.052]} />
    <Sp rad={0.03} p={[0.52, 0.8, 0.045]} c="#ff3a2a" e="#ff3a2a" ei={blink * 2} />
    <group position={[0.52, 1.33, 0.0]}>
      <Cy rt={0.11} rb={0.13} h={0.05} p={[0, 0.025, 0]} c="#2a2c30" m={0.5} ro={0.4} />
      <Cy rt={0.09} h={0.1} p={[0, 0.1, 0]} c="#ff3a2a" o={0.55} e="#ff2a1a" ei={blink * 1.6} ro={0.1} />
      <Sp rad={0.09} p={[0, 0.15, 0]} sc={[1, 0.8, 1]} c="#ff3a2a" o={0.55} e="#ff2a1a" ei={blink * 1.6} ro={0.1} />
      <group rotation={[0, tt * 8, 0]}><Bx s={[0.15, 0.015, 0.04]} p={[0.07, 0.1, 0]} c="#ffd0c0" e="#ff6a4a" ei={2 * siren} ns /></group>
    </group>
    <pointLight position={[0.52, 1.5, 0.5]} color="#ff3a2a" intensity={1.8 * blink * siren} distance={2} />
  </S3>;
}}</Stage>;

// 13 · la vitrina de emergencia: una rama cae sobre la unidad de afuera (recuadro lateral), una mano levanta la tapa de vidrio de la caja roja y baja la palanca EM HEAT
export const HGlasscase: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), br = drop(u, 0.08, 0.28), open = win(u, 0.45, 0.72), flip = drop(u, 0.76, 0.9), th = -open * 1.1, lamp = win(u, 0.8, 0.9);
  const hy = 1.4 - 0.8 * Math.cos(th), hz = 0.1 - 0.8 * Math.sin(th);
  return <S3 p={lv([0.7, 1.1, 2.1], [0.55, 1.05, 1.9], win(u, 0, 1))} l={[0.5, 1.0, 0]} fov={36} floor={null}>
    <Wall y={1} z={-0.1} />
    <Bx s={[0.82, 0.92, 0.14]} p={[0, 1.0, 0.0]} c="#c8302a" ro={0.4} rad={0.025} />
    <Bx s={[0.64, 0.74, 0.02]} p={[0, 1.0, 0.075]} c="#efece4" ro={0.4} rad={0.01} />
    <Txt t="EM HEAT" w={0.4} c="#8a1a14" p={[0, 1.27, 0.09]} />
    <Cy rt={0.07} h={0.04} p={[0, 0.98, 0.09]} r={[Math.PI / 2, 0, 0]} c="#9ea3aa" m={0.9} ro={0.25} />
    <group position={[0, 0.98, 0.1]} rotation={[0.7 - flip * 1.4, 0, 0]}><Cy rt={0.022} h={0.26} p={[0, 0.13, 0]} c="#2a2a2a" m={0.7} ro={0.3} /><Sp rad={0.05} p={[0, 0.27, 0]} c="#c8302a" ro={0.3} /></group>
    <Sp rad={0.04} p={[0.22, 0.8, 0.09]} c="#ff3a2a" e="#ff2a10" ei={2 * lamp} />
    <group position={[0, 1.42, 0.1]} rotation={[th, 0, 0]}>
      <Bx s={[0.76, 0.8, 0.01]} p={[0, -0.4, 0]} c="#eaf6ff" o={0.22} ro={0.02} m={0.1} />
      <Bx s={[0.78, 0.03, 0.03]} p={[0, -0.8, 0]} c="#c8302a" ro={0.4} /><Bx s={[0.78, 0.03, 0.03]} p={[0, 0, 0]} c="#c8302a" ro={0.4} />
      <Bx s={[0.03, 0.8, 0.03]} p={[-0.38, -0.4, 0]} c="#c8302a" ro={0.4} /><Bx s={[0.03, 0.8, 0.03]} p={[0.38, -0.4, 0]} c="#c8302a" ro={0.4} />
    </group>
    <Hand p={[0.0, hy - 0.2, hz + 0.1]} s={1.7} curl={0.7} r={[0.15, 0, 0]} />
    <group position={[1.1, 1.0, 0]}>
      <Bx s={[0.8, 0.7, 0.05]} c="#26292e" ro={0.5} rad={0.02} />
      <Bx s={[0.7, 0.6, 0.02]} p={[0, 0, 0.03]} c="#0e1a28" ro={0.6} />
      <HPU p={[0, -0.24, 0.08]} s={0.62} fan={tt * 8 * (1 - br)} r={[0, 0.3, br * 0.22]} />
      <Cy rt={0.035} h={0.62} p={[0.05, lerp(0.7, 0.26, br), 0.12]} r={[0, 0, 1.0]} c="#5a3a22" ro={0.9} />
      {br > 0.9 && <Sp rad={0.04} p={[0.08, 0.12, 0.2]} c="#ffcf7a" e="#ffb14a" ei={1.5} o={1 - win(u, 0.3, 0.42)} />}
    </group>
  </S3>;
}}</Stage>;

const billLong = (step: number) => canvasTex(`billE|${step}`, 512, 400 + step * 30, (g) => {
  const Ht = 400 + step * 30, v = Math.round(160 + (step / 13) * 150);
  g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 512, Ht); g.fillStyle = "#2b4d6e"; g.fillRect(0, 0, 512, 80); g.fillStyle = "#fff"; g.font = BOLD(40); g.fillText("ELECTRIC BILL", 24, 56);
  g.fillStyle = "#3a3d42"; g.font = BOLD(30); const items = ["Base charge", "Heat pump", "Strip heat", "Strip heat", "Fuel adj.", "Strip heat", "Taxes", "Strip heat", "Strip heat", "Demand", "Strip heat", "Strip heat", "Strip heat"];
  for (let i = 0; i < step; i++) { g.fillStyle = i % 4 === 2 || i > 2 ? "#c8302a" : "#3a3d42"; g.fillText(items[i], 24, 130 + i * 30); g.fillRect(380, 118 + i * 30, 100 - (i % 3) * 20, 8); }
  g.fillStyle = v > 200 ? "#c8302a" : "#2a2520"; g.font = BOLD(110); g.textAlign = "center"; g.fillText("$" + v, 256, Ht - 40);
});
// 14 · la factura que se estira: sale de una caja del medidor y cae renglón por renglón (los rojos son las resistencias) mientras el contador de tambores rueda de $160 a $310
export const HDoublebill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), kk = win(u, 0.1, 0.72), step = Math.round(kk * 13), L = (400 + step * 30) * (0.6 / 512), v = lerp(160, 310, kk);
  return <S3 p={lv([0.2, 0.95, 2.4], [0.1, 0.85, 2.1], win(u, 0, 1))} l={[0, 0.82, 0]} fov={36} floor={null}>
    <Wall y={0.9} z={-0.1} />
    <Bx s={[1.05, 0.4, 0.4]} p={[0, 1.3, 0.0]} c="#9aa0a6" m={0.6} ro={0.35} rad={0.03} />
    <Odo v={v} n={3} pre="$" p={[0, 1.3, 0.21]} s={1.25} />
    <Bx s={[0.66, 0.025, 0.1]} p={[0, 1.095, 0.05]} c="#26292e" />
    <group position={[0, 1.1, 0.05]} rotation={[Math.sin(tt * 2.1) * 0.012 + bump(u, 0.7, 20, 6) * 0.04, 0, 0]}>
      <Pl w={0.6} h={L} p={[0, -L / 2, 0]} map={billLong(step)} c="#ffffff" ro={0.8} />
    </group>
  </S3>;
}}</Stage>;

const helix = (L: number): V3[] => Array.from({ length: 140 }, (_, i) => { const f = i / 139; return [f * L, 0.07 * Math.sin(f * Math.PI * 2 * 12), 0.07 * Math.cos(f * Math.PI * 2 * 12)]; });
// 15 · el elástico: un resorte se estira sobre una regla 60-68; pasado cierto largo se pone al rojo y se enciende una bombilla grande en el centro; el termostato redondo sube a la par
export const HSpring: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.12, 0.65), deg = lerp(1, 8, k), L = 0.12 + deg * 0.15, alarm = win(u, 0.5, 0.58);
  const c = mixc("#b8bcc2", "#e8402a", alarm);
  return <S3 p={lv([0.35, 0.95, 2.4], [0.25, 0.85, 2.1], win(u, 0, 1))} l={[0.28, 0.5, 0]} fov={38} floor={null}>
    <Wall y={0.8} z={-0.25} />
    <Counter w={3.4} d={1.4} z={0.2} />
    <Bx s={[1.5, 0.05, 0.2]} p={[0.6, 0.06, 0.25]} c="#f2c230" ro={0.4} />
    {Array.from({ length: 9 }, (_, i) => <group key={i}><Bx s={[0.01, 0.06, 0.01]} p={[0.12 + i * 0.15, 0.095, 0.3]} c="#1a1a1a" ns /><Txt t={`${60 + i}`} w={0.08} c="#1a1a1a" p={[0.12 + i * 0.15, 0.06, 0.352]} r={[-0.6, 0, 0]} /></group>)}
    <Bx s={[0.12, 0.34, 0.24]} p={[0, 0.42, 0]} c="#3a3d42" m={0.6} ro={0.4} rad={0.02} />
    <group position={[0.06, 0.42, 0]}><Tube pts={helix(L)} rad={0.014} seg={420} c={c} m={0.9} ro={0.25} e={alarm > 0.1 ? "#ff3010" : undefined} ei={alarm * 1.2} /></group>
    <Bx s={[0.1, 0.26, 0.22]} p={[L + 0.1, 0.42, 0]} c="#2b4d6e" ro={0.4} rad={0.02} />
    <mesh position={[L + 0.1, 0.22, 0.0]} rotation={[0, 0, Math.PI]} castShadow><coneGeometry args={[0.04, 0.12, 12]} /><meshStandardMaterial color="#c8302a" /></mesh>
    <group position={[0.7, 1.05, -0.1]}>
      <Cy rt={0.06} h={0.1} p={[0, -0.1, 0]} c="#9ea3aa" m={0.8} ro={0.3} />
      <Sp rad={0.2} p={[0, 0.1, 0]} c="#fff6d6" o={0.4 + 0.2 * alarm} e="#ffd27a" ei={alarm * 2.2} ro={0.05} />
      <Tube pts={[[-0.05, -0.04, 0], [-0.04, 0.1, 0], [0, 0.04, 0], [0.04, 0.1, 0], [0.05, -0.04, 0]]} rad={0.006} c="#ff9a3a" e="#ffb14a" ei={0.3 + alarm * 3} />
      <Puff p={[0, 0.1, 0.1]} s={1.6} c="#ffd27a" o={0.55 * alarm} />
    </group>
    <RoundThermo deg={lerp(60, 68, k)} p={[-0.72, 0.62, 0.05]} s={2.0} ring={alarm > 0.5 ? "#d8402e" : "#b8a37a"} />
  </S3>;
}}</Stage>;

// 16 · la perilla: una perilla metálica con aguja gira por un arco verde chico (2-3°); al pasarse, el arco se enciende rojo con un clic y un sacudón
export const HDimmer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = u < 0.5 ? Math.sin(win(u, 0.1, 0.5) * Math.PI * 2) * 0.12 : lerp(0, 1.6, win(u, 0.55, 0.78)), over = Math.max(0, a - 0.18), kick = bump(u, 0.62, 40, 10) * 0.012;
  return <S3 p={lv([0.15, 1.05, 1.75], [0.0, 1.0, 1.45], win(u, 0, 1))} l={[0, 1.0, 0]} fov={32} floor={null}>
    <Wall y={1} z={-0.05} />
    <group position={[kick, 1.0 + kick * 0.6, 0]}>
      <Cy rt={0.42} h={0.05} r={[Math.PI / 2, 0, 0]} c="#efece4" ro={0.4} seg={64} />
      <To R={0.42} t={0.012} p={[0, 0, 0.022]} c="#c9a24a" m={0.9} ro={0.25} />
      <To R={0.31} t={0.016} p={[0, 0, 0.03]} c="#3a3d42" ro={0.5} />
      <group position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 2 - 0.18]}><To R={0.31} t={0.024} arc={0.36} c="#3fbf6a" e="#3fff7a" ei={1.4} /></group>
      {over > 0 && <group position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 2 - 0.18 - over]}><To R={0.31} t={0.024} arc={over} c="#e2342a" e="#ff2a1a" ei={1.8} /></group>}
      {Array.from({ length: 5 }, (_, i) => { const th = Math.PI / 2 - 0.18 - i * 0.4; return <Bx key={i} s={[0.012, 0.05, 0.01]} p={[0.37 * Math.cos(th), 0.37 * Math.sin(th), 0.03]} r={[0, 0, th - Math.PI / 2]} c="#2a2520" ns />; })}
      <group position={[0, 0, 0.04]} rotation={[0, 0, -a]}>
        <Cy rt={0.2} rb={0.22} h={0.1} r={[Math.PI / 2, 0, 0]} p={[0, 0, 0.05]} c="#c9ccd0" m={0.95} ro={0.22} seg={48} />
        {Array.from({ length: 24 }, (_, i) => <Bx key={i} s={[0.014, 0.02, 0.1]} p={[0.21 * Math.cos((i / 24) * 6.283), 0.21 * Math.sin((i / 24) * 6.283), 0.05]} r={[0, 0, (i / 24) * 6.283]} c="#b4b8be" m={0.9} ro={0.3} ns />)}
        <Cy rt={0.15} h={0.02} r={[Math.PI / 2, 0, 0]} p={[0, 0, 0.105]} c="#dfe2e6" m={0.95} ro={0.18} seg={48} />
        <Bx s={[0.03, 0.14, 0.02]} p={[0, 0.1, 0.12]} c="#c8302a" e="#c8302a" ei={0.4} ns />
      </group>
    </group>
  </S3>;
}}</Stage>;

// 17 · la respiración de la unidad vista de arriba: estelas de aire entran por los cuatro lados y salen en espiral por el ventilador, que se acelera
export const HLungs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), D = h.out - h.at, on = win(u, 0.05, 0.16), S = 1.7, breath = 1 + 0.012 * Math.sin(tt * 3);
  const fan = cum((x) => 8 + 18 * win(x, 0.2, 0.6), u) * D;
  const inflow = (i: number, f: number): V3 => { const side = i % 4, j = Math.floor(i / 4), a = (side * Math.PI) / 2, off = (j - 2.5) * 0.13, rr = lerp(1.3, 0.36, f), ys = lerp(0.12, 0.34, f);
    return [Math.cos(a) * rr - Math.sin(a) * off * (rr / 1.3), ys, Math.sin(a) * rr + Math.cos(a) * off * (rr / 1.3)]; };
  const outflow = (i: number, f: number): V3 => { const a = (i / 12) * 6.283 + f * 3.4, rr = 0.1 + f * 0.6; return [Math.cos(a) * rr, 1.05 * 1.0 + f * 1.0, Math.sin(a) * rr]; };
  return <S3 p={lv([0.45, 2.4, 1.15], [0.25, 2.15, 0.9], win(u, 0, 1))} l={[0, 0.4, 0]} fov={38} floor={null}>
    <Bx s={[3.6, 0.06, 3.2]} p={[0, -0.03, 0]} c="#6f8a4a" ro={1} />
    <Bx s={[1.5, 0.06, 1.5]} p={[0, 0.0, 0]} c="#9a9a94" ro={0.9} />
    <group scale={breath}><HPU s={S} fan={fan} /></group>
    {Array.from({ length: 24 }, (_, i) => { const f0 = (tt * 0.42 + Math.floor(i / 4) / 6) % 1;
      return [0, 1, 2, 3].map((k) => <Sp key={i + "_" + k} rad={0.034 - k * 0.006} p={inflow(i, Math.max(0, f0 - k * 0.028))} c="#cfeeff" e="#7fd4ff" ei={1.2} o={on * Math.sin(f0 * Math.PI) * (1 - k * 0.22)} ns />); })}
    {Array.from({ length: 12 }, (_, i) => { const f0 = (tt * 0.5 + i / 12) % 1;
      return [0, 1, 2, 3].map((k) => <Sp key={i + "o" + k} rad={0.04 - k * 0.007} p={outflow(i, Math.max(0, f0 - k * 0.03))} c="#e8f6ff" e="#9fe0ff" ei={1.2} o={on * Math.sin(f0 * Math.PI) * (1 - k * 0.22)} ns />); })}
  </S3>;
}}</Stage>;

const WireBox: React.FC<{ s: V3; p: V3 }> = ({ s, p }) => <mesh position={p}><boxGeometry args={s} /><meshBasicMaterial color="#eaf4ff" wireframe /></mesh>;
// flecha de cota plana: de a hasta b sobre el suelo (eje x o z), con topes y número en el medio
const Dim: React.FC<{ a: V3; b: V3; k: number; num: string; yaw: number; off: V3 }> = ({ a, b, k, num, yaw, off }) => {
  if (k < 0.02) return null;
  const m: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], len = Math.sqrt(dx * dx + dy * dy + dz * dz) * k;
  const dir: V3 = [dx / Math.sqrt(dx * dx + dy * dy + dz * dz), dy / Math.sqrt(dx * dx + dy * dy + dz * dz), dz / Math.sqrt(dx * dx + dy * dy + dz * dz)];
  const q = (s: number): V3 => [a[0] + dir[0] * s, a[1] + dir[1] * s, a[2] + dir[2] * s];
  const vert = Math.abs(dy) > 0.5, flat = !vert;
  const ar = (s: number): V3 => vert ? [s > 0 ? 0 : Math.PI, 0, 0] : dx !== 0 ? [0, 0, -Math.sign(dx) * s * Math.PI / 2] : [Math.sign(dz) * s * Math.PI / 2, 0, 0];
  return <group>
    <Tube pts={[q(0), q(len)]} rad={0.012} c="#ffffff" e="#ffffff" ei={0.8} />
    <mesh position={q(len)} rotation={ar(1)}><coneGeometry args={[0.06, 0.16, 12]} /><meshBasicMaterial color="#ffffff" /></mesh>
    <mesh position={q(0)} rotation={ar(-1)}><coneGeometry args={[0.06, 0.16, 12]} /><meshBasicMaterial color="#ffffff" /></mesh>
    <group position={[m[0] + off[0], m[1] + off[1], m[2] + off[2]]} rotation={[0, yaw, 0]} scale={win(k, 0.8, 1)}>
      <group rotation={[flat ? -Math.PI / 2 : 0, 0, 0]}><Txt t={num} w={0.46} c="#ffffff" bg="rgba(31,74,138,0.85)" px={150} /></group>
    </group>
  </group>;
};
// 18 · el plano técnico: fondo azul de plano, la unidad dibujada en línea blanca, el cuadrado de 2 ft se traza alrededor, la cota de 5 ft sube hasta un alero y la cámara pasa de planta a vista 3/4
export const HCylinder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = win(u, 0.12, 0.4), b = win(u, 0.45, 0.72), cam = win(u, 0.05, 0.9), yaw = lerp(0.0, 0.7, cam), el = lerp(1.3, 0.75, cam), R = 3.6, lk: V3 = [0, 0.85, 0];
  const O = 0.9, Ux = 0.35;
  return <S3 p={[Math.sin(yaw) * Math.cos(el) * R, lk[1] + Math.sin(el) * R, Math.cos(yaw) * Math.cos(el) * R]} l={lk} fov={42} floor={null}>
    <Bx s={[4.4, 0.02, 4.4]} p={[0, -0.01, 0]} c="#1f4a8a" ro={0.9} />
    {Array.from({ length: 17 }, (_, i) => <group key={i}><Bx s={[4.4, 0.003, 0.005]} p={[0, 0.002, -2.2 + i * 0.275]} c="#5a86c8" ns /><Bx s={[0.005, 0.003, 4.4]} p={[-2.2 + i * 0.275, 0.002, 0]} c="#5a86c8" ns /></group>)}
    <Bx s={[0.7, 0.7, 0.7]} p={[0, 0.35, 0]} c="#3a6fc0" o={0.5} e="#3a6fc0" ei={0.3} ns />
    <WireBox s={[0.7, 0.7, 0.7]} p={[0, 0.35, 0]} />
    {Array.from({ length: 8 }, (_, i) => <Bx key={i} s={[0.6, 0.006, 0.004]} p={[0, 0.1 + i * 0.07, 0.352]} c="#eaf4ff" e="#eaf4ff" ei={1} ns />)}
    <To R={0.26} t={0.01} p={[0, 0.702, 0]} r={[Math.PI / 2, 0, 0]} c="#eaf4ff" e="#eaf4ff" ei={1} />
    {[0, 1, 2].map((i) => <Bx key={i} s={[0.5, 0.004, 0.012]} p={[0, 0.704, 0]} r={[0, i * 1.047, 0]} c="#eaf4ff" e="#eaf4ff" ei={1} ns />)}
    {a > 0.01 && [[0, -O, O * 2 * a, 0.014, 0], [0, O, O * 2 * a, 0.014, 0], [-O, 0, 0.014, O * 2 * a, 0], [O, 0, 0.014, O * 2 * a, 0]].map(([x, z, w, d], i) =>
      <Bx key={i} s={[w as number, 0.01, d as number]} p={[(x as number) * 1, 0.006, (z as number) * 1]} c="#ffffff" e="#ffffff" ei={0.9} ns />)}
    <Dim a={[Ux, 0.012, 0]} b={[O, 0.012, 0]} k={a} num="2 FT" yaw={yaw} off={[0, 0.02, 0.2]} />
    <Dim a={[-Ux, 0.012, 0]} b={[-O, 0.012, 0]} k={a} num="2 FT" yaw={yaw} off={[0, 0.02, 0.2]} />
    <Dim a={[0, 0.012, Ux]} b={[0, 0.012, O]} k={a} num="2 FT" yaw={yaw} off={[0.3, 0.02, 0]} />
    <Dim a={[0, 0.012, -Ux]} b={[0, 0.012, -O]} k={a} num="2 FT" yaw={yaw} off={[0.3, 0.02, 0]} />
    <Bx s={[2.0, 0.025 * b + 0.001, 2.0]} p={[0, 2.1, 0]} c="#9fc4f0" o={0.3 * b} e="#9fc4f0" ei={0.3} ns />
    <Dim a={[0.75, 0.7, 0.75]} b={[0.75, 2.1, 0.75]} k={b} num="5 FT" yaw={yaw} off={[0.35, 0, 0]} />
  </S3>;
}}</Stage>;

// 19 · el goteo del alero: gotas gordas caen del borde del techo sobre la tapa de la unidad y arman un bulto de hielo azul; llega una canaleta bajo el alero y desvía el agua por un caño
export const HDrift: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), gut = drop(u, 0.52, 0.68), crust = win(u, 0.08, 0.5), S = 1.5, gx = lerp(2.4, 0, gut), top = 0.04 + 0.65 * S;
  return <S3 p={lv([1.3, 1.0, 2.9], [0.9, 1.0, 2.5], win(u, 0, 1))} l={[0.1, 0.95, 0]} fov={40} floor={null} warm="#cfdcff">
    <Snow />
    <Bx s={[4, 2.4, 0.06]} p={[0, 1.2, -0.7]} c="#d8cfbf" ro={0.9} />
    {Array.from({ length: 10 }, (_, i) => <Bx key={i} s={[4, 0.012, 0.01]} p={[0, 0.2 + i * 0.24, -0.66]} c="#c4baa8" ro={0.9} ns />)}
    <Bx s={[4, 0.12, 1.1]} p={[0, 1.96, -0.15]} r={[0.14, 0, 0]} c="#4a3d38" ro={0.8} />
    <Bx s={[4, 0.14, 0.05]} p={[0, 1.88, 0.38]} c="#e8e4da" ro={0.6} />
    <group position={[0, 0, 0.1]}>
      <HPU s={S} fan={tt * 6} />
      <Sp rad={0.4 * S * 0.8} p={[0, top + 0.02, 0]} sc={[1, 0.15 + 0.7 * crust, 1]} c="#bfe0ff" o={0.88 * Math.min(1, crust * 8)} ro={0.05} m={0.1} e="#7fb8ff" ei={0.25} />
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[(rnd(i) - 0.5) * 0.55, top + 0.12 * crust, (rnd(i + 3) - 0.5) * 0.5]} rotation={[0, 0, (rnd(i + 5) - 0.5) * 0.6]} scale={[0.03, 0.14 * crust * (0.6 + rnd(i + 7)) + 0.001, 0.03]}><octahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#eaf6ff" roughness={0.12} emissive="#9fd0ff" emissiveIntensity={0.4} /></mesh>)}
    </group>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-1.0 + i * 0.33, 1.78 - rnd(i) * 0.1, 0.34]} rotation={[Math.PI, 0, 0]} scale={[0.04, 0.2 + 0.1 * rnd(i + 2), 0.04]}><coneGeometry args={[1, 1, 8]} /><meshStandardMaterial color="#d8efff" transparent opacity={0.8} roughness={0.08} /></mesh>)}
    {Array.from({ length: 9 }, (_, i) => { const f = (tt * 0.8 + i / 9) % 1, x = (rnd(i) - 0.5) * 0.6, caught = gut > 0.6;
      return <Sp key={i} rad={0.04} p={caught ? [lerp(x, 1.1, f) + gx * 0, 1.7 - f * 0.05, 0.36] : [x, lerp(1.78, top + 0.05, f * f), 0.36 - rnd(i + 3) * 0.2]} sc={caught ? [1.8, 0.7, 1] : [1, 1.5, 1]} c="#cfe8ff" e="#9fd0ff" ei={0.5} o={0.9} ro={0.05} />; })}
    <group position={[gx, 1.7, 0.38]}>
      <Bx s={[2.4, 0.04, 0.2]} p={[0, -0.08, 0]} c="#e8e4da" m={0.4} ro={0.4} />
      <Bx s={[2.4, 0.12, 0.03]} p={[0, -0.02, 0.1]} c="#e8e4da" m={0.4} ro={0.4} />
      <Bx s={[2.4, 0.12, 0.03]} p={[0, -0.02, -0.1]} c="#e8e4da" m={0.4} ro={0.4} />
    </group>
    <Cy rt={0.06} h={1.7} p={[1.2 + gx * 0.0 + (gx > 0.05 ? 0 : 0), 0.86, 0.34]} c="#e8e4da" m={0.4} ro={0.4} />
    {gut > 0.7 && Array.from({ length: 6 }, (_, i) => { const f = (tt * 1.1 + i / 6) % 1; return <Sp key={i} rad={0.035} p={[1.2, 1.7 - f * 1.6, 0.4]} sc={[1, 1.6, 1]} c="#cfe8ff" e="#9fd0ff" ei={0.6} />; })}
  </S3>;
}}</Stage>;

// 20 · las patas: el hielo crece pegado al piso bajo la unidad; después la unidad sube sobre sus soportes, el hielo se derrite y el agua escurre por debajo
export const HRiser: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), grow = win(u, 0.06, 0.38), melt = win(u, 0.55, 0.88), up = drop(u, 0.42, 0.6) * 0.4, S = 1.4, iceH = 0.14 * grow * (1 - melt * 0.9);
  return <S3 p={lv([1.1, 0.75, 2.5], [0.75, 0.65, 2.1], win(u, 0, 1))} l={[0, 0.55, 0]} fov={38} floor={null} warm="#cfdcff">
    <Bx s={[3.6, 0.1, 2.6]} p={[0, -0.05, 0]} c="#9a9a94" ro={0.9} />
    <Bx s={[3.6, 0.04, 1.0]} p={[0, 0.0, 1.5]} c="#eef3f8" ro={0.85} />
    <Bx s={[0.95 * grow + 0.01, iceH + 0.002, 0.95 * grow + 0.01]} p={[0, iceH / 2, 0]} {...ICE} o={0.82} />
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[(rnd(i) - 0.5) * 0.9 * grow, iceH, (rnd(i + 4) - 0.5) * 0.9 * grow]} rotation={[0, rnd(i) * 3, (rnd(i + 1) - 0.5) * 0.5]} scale={[0.04, 0.16 * grow * (1 - melt) * (0.5 + rnd(i + 2)) + 0.001, 0.04]}><octahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#eaf6ff" roughness={0.12} emissive="#9fd0ff" emissiveIntensity={0.4} /></mesh>)}
    {[[-0.36, -0.36], [0.36, -0.36], [-0.36, 0.36], [0.36, 0.36]].map(([x, z], i) => <group key={i}>
      <Bx s={[0.1, 0.015, 0.1]} p={[x, 0.008, z]} c="#2a2c30" m={0.5} ro={0.4} />
      <Bx s={[0.06, Math.max(0.001, up), 0.06]} p={[x, 0.01 + up / 2, z]} c="#8d939a" m={0.8} ro={0.3} />
    </group>)}
    <HPU p={[0, Math.max(up + 0.02, iceH), 0]} s={S} fan={tt * 10} />
    {melt > 0.05 && <mesh position={[0, 0.004, 0.2]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.2 + 0.8 * melt, 40]} /><meshStandardMaterial color="#8fc0e6" transparent opacity={0.6} roughness={0.05} metalness={0.2} /></mesh>}
    {up > 0.1 && Array.from({ length: 10 }, (_, i) => { const f = (tt * 1.2 + i / 10) % 1; return <Sp key={i} rad={0.03} p={[(rnd(i) - 0.5) * 0.8, up * (1 - f * f) + 0.02, (rnd(i + 2) - 0.5) * 0.6]} sc={[1, 1.6, 1]} c="#cfe8ff" e="#9fd0ff" ei={0.5} ro={0.05} o={1 - melt * 0.4} />; })}
  </S3>;
}}</Stage>;

const stripes = () => canvasTex("stripesE", 512, 64, (g) => { for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? "#f6f6f2" : "#d22a22"; g.fillRect(i * 51.2, 0, 52, 64); } });
// 21 · el portero: los bloques rojos de las resistencias hacen fila bajo una barrera floja, apenas levantada; la barrera ni se mueve y pasan todos
export const HGatekeeper: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), wob = Math.sin(tt * 2.6) * 0.03, blink = Math.sin(tt * 6) > 0 ? 1 : 0.2;
  return <S3 p={lv([1.2, 0.95, 2.6], [0.85, 0.85, 2.2], win(u, 0, 1))} l={[0, 0.4, 0.2]} fov={36} floor={null}>
    <Bx s={[4, 0.04, 6]} p={[0, -0.02, -1.0]} c="#7d8570" ro={0.95} />
    <Bx s={[1.5, 0.03, 6]} p={[0, 0.01, -1.0]} c="#3a3d42" ro={0.7} />
    {Array.from({ length: 8 }, (_, i) => <Bx key={i} s={[0.05, 0.005, 0.3]} p={[0, 0.03, 1.1 - i * 0.8]} c="#f2c230" ns />)}
    <Bx s={[0.08, 0.04, 6]} p={[-0.78, 0.03, -1.0]} c="#c9c6bd" ro={0.8} /><Bx s={[0.08, 0.04, 6]} p={[0.78, 0.03, -1.0]} c="#c9c6bd" ro={0.8} />
    <Bx s={[0.16, 0.62, 0.16]} p={[-0.9, 0.31, -0.4]} c="#f2c230" ro={0.4} rad={0.02} />
    <Bx s={[0.26, 0.16, 0.26]} p={[-0.9, 0.7, -0.4]} c="#26292e" ro={0.4} rad={0.03} />
    <Bx s={[0.1, 0.4, 0.1]} p={[0.92, 0.2, -0.4]} c="#6b6e74" m={0.5} ro={0.4} />
    <Bx s={[0.2, 0.05, 0.2]} p={[0.92, 0.42, -0.4]} c="#6b6e74" m={0.5} ro={0.4} />
    <group position={[-0.9, 0.66, -0.4]} rotation={[0, 0, 0.3 + wob]}>
      <Bx s={[1.9, 0.1, 0.07]} p={[0.95, 0, 0]} map={stripes()} c="#ffffff" ro={0.45} rad={0.01} />
      <Bx s={[0.22, 0.16, 0.12]} p={[-0.14, 0, 0]} c="#26292e" m={0.5} ro={0.4} />
      <Sp rad={0.05} p={[1.85, 0.09, 0]} c="#ff3a2a" e="#ff2a1a" ei={2 * blink} />
    </group>
    {Array.from({ length: 6 }, (_, i) => { const z = lerp(-2.2, 1.45 - i * 0.27, cl(u * 1.7 - i * 0.1)); return <group key={i} position={[0, 0.11, z]}>
      <Bx s={[0.22, 0.2, 0.22]} c="#d22a22" e="#ff3a10" ei={0.5} ro={0.4} rad={0.02} />
      <Txt t="STRIP" w={0.17} c="#fff3d6" p={[0, 0, 0.113]} />
      <Bx s={[0.26, 0.004, 0.26]} p={[0, -0.1, 0]} c="#000000" o={0.3} ns />
    </group>; })}
  </S3>;
}}</Stage>;
