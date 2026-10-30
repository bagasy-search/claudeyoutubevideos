// mar29e · reemplazos SIMPLES (vuelta 3 del EVALUADOR): un solo objeto grande, una sola acción, fondo cerrado, cámara fija o arco lento.
// Cubren los minutos que quedaron sin componente ≥7 (twotaps, icehours, straw, draft, fridgeheater, weekend, checkup, dualfuel, scared).
import React, { useContext } from "react";
import { H, Stage } from "./hkit";
import { Bx, Cy, Dot, Filt, Flame, PLANKS, PLASTER, Pl, Puff, R3T, S3 as S3k, Sp, Tube, V3, canvasTex, cl, drop, lerp, rnd, sm, win, BOLD } from "../kits/r3k/r3k";
import { Odo } from "./r3c";

// cámara que acompaña la salida (el kit aleja los objetos 0,9 m al final): el objeto no se achica
const S3: React.FC<React.ComponentProps<typeof S3k>> = ({ p, l, ...r }) => {
  const { tt, d } = useContext(R3T), x = sm((tt - (d - 0.75)) / 0.75);
  return <S3k p={[p[0], p[1] - 0.12 * x, p[2] - 0.9 * x]} l={[l[0], l[1] - 0.12 * x, l[2] - 0.9 * x]} {...r} />;
};
const U = (tt: number, h: H) => cl(tt / (h.out - h.at));
const bump = (u: number, a: number, f = 26, k = 8) => (u > a ? Math.sin((u - a) * f) * Math.exp(-(u - a) * k) : 0);
const Wall: React.FC<{ y?: number; z?: number; c?: string }> = ({ y = 1.3, z = -0.6, c = "#efe6d6" }) => <Bx s={[8, 4, 0.05]} p={[0, y, z]} map={PLASTER()} c={c} ro={0.95} ns />;
const Table: React.FC<{ c?: string }> = ({ c = "#a8784e" }) => <Bx s={[6, 0.06, 3]} p={[0, -0.03, 0]} map={PLANKS()} c={c} ro={0.6} ns />;
const Shade: React.FC<{ p: V3; w: number; d: number; o?: number }> = ({ p, w, d, o = 0.45 }) =>
  <mesh position={p} rotation={[-Math.PI / 2, 0, 0]} scale={[w, d, 1]}><circleGeometry args={[0.5, 40]} /><meshBasicMaterial color="#000000" transparent opacity={o} depthWrite={false} /></mesh>;
// unidad exterior de bomba de calor: caja gris con rejilla y ventilador que gira (spin = ángulo)
const Unit: React.FC<{ p: V3; spin: number; s?: number }> = ({ p, spin, s = 1 }) => <group position={p} scale={s}>
  <Bx s={[0.56, 0.5, 0.34]} p={[0, 0.25, 0]} c="#d6d9dc" m={0.4} ro={0.35} rad={0.03} />
  <Bx s={[0.6, 0.03, 0.38]} p={[0, 0.51, 0]} c="#9aa0a6" m={0.5} ro={0.3} rad={0.01} />
  <Cy rt={0.17} h={0.02} p={[-0.06, 0.26, 0.17]} r={[Math.PI / 2, 0, 0]} c="#1c1e20" ro={0.6} seg={48} />
  <group position={[-0.06, 0.26, 0.182]} rotation={[0, 0, spin]}>{[0, 1, 2].map((k) => <group key={k} rotation={[0, 0, (k * Math.PI * 2) / 3]}><Bx s={[0.045, 0.15, 0.008]} p={[0, 0.075, 0]} r={[0.35, 0, 0]} c="#3c4044" ro={0.4} /></group>)}</group>
  {Array.from({ length: 7 }, (_, k) => <Bx key={k} s={[0.36, 0.006, 0.006]} p={[-0.06, 0.13 + k * 0.042, 0.186]} c="#8a9096" m={0.6} ro={0.3} ns />)}
  <Bx s={[0.12, 0.3, 0.012]} p={[0.2, 0.26, 0.172]} c="#c4c8cc" ro={0.4} />
</group>;
const billTx = () => canvasTex("billE3", 256, 128, (g) => {
  g.fillStyle = "#a9cc92"; g.fillRect(0, 0, 256, 128); g.strokeStyle = "#2f5a2a"; g.lineWidth = 7; g.strokeRect(7, 7, 242, 114);
  g.fillStyle = "#2f5a2a"; g.beginPath(); g.ellipse(128, 64, 30, 40, 0, 0, Math.PI * 2); g.fill();
  g.font = BOLD(44); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("1", 34, 38); g.fillText("1", 222, 92);
  g.fillStyle = "#a9cc92"; g.font = BOLD(42); g.fillText("$", 128, 66);
});
const zig = (x0: number, w: number, y: number, z: number, n = 13): V3[] => Array.from({ length: n }, (_, k) => [x0 + (k / (n - 1)) * w, y + (k % 2 ? 0.035 : -0.035), z] as V3);
const Icicle: React.FC<{ p: V3; L: number }> = ({ p, L }) => L > 0.012 ? <mesh position={[p[0], p[1] - L / 2, p[2]]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.022, L, 8]} /><meshStandardMaterial color="#eef8ff" emissive="#9fd0ff" emissiveIntensity={0.3} transparent opacity={0.92} roughness={0.05} /></mesh> : null;
// bola de vapor con volumen (la luz la modela; sin escritura de profundidad para que se mezclen)
const Steam: React.FC<{ p: V3; r: number; o: number; c?: string }> = ({ p, r, o, c = "#f4f6f8" }) => o > 0.02 ? <mesh position={p} scale={r}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color={c} emissive="#ffffff" emissiveIntensity={0.18} transparent opacity={o} depthWrite={false} roughness={1} /></mesh> : null;

// 6 · calor barato contra calor caro: la bomba de calor gira tranquila y a su lado caen apenas tres monedas; la resistencia eléctrica se pone al rojo y a su lado crece un ladrillo de billetes
export const HTapsS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.14), b = drop(u, 0.06, 0.2), hot = win(u, 0.24, 0.4), nf = lerp(0, 16, win(u, 0.3, 0.86)), nb = Math.floor(nf), fr = nf % 1;
  const coin = (i: number) => drop(u, 0.34 + i * 0.24, 0.44 + i * 0.24);
  return <S3 p={[lerp(0.06, -0.02, u), 0.74, 2.2]} l={[-0.02, 0.3, 0]} fov={36} floor={null}>
    <Wall c="#5a6068" z={-0.8} /><Table c="#6a4a32" />
    <Shade p={[-0.36, 0.003, -0.12]} w={0.7} d={0.45} o={0.5 * a} /><Shade p={[0.32, 0.003, -0.12]} w={0.6} d={0.4} o={0.5 * b} />
    <Unit p={[-0.36, 0.9 * (1 - a), -0.12]} spin={tt * 3} s={0.95} />
    {Array.from({ length: 5 }, (_, i) => { const k = (tt * 0.4 + i / 5) % 1; return <Puff key={i} p={[-0.39 + k * 0.1, 0.55 + k * 0.4, -0.05]} s={0.18 + k * 0.2} c="#ffb070" o={0.18 * Math.sin(k * Math.PI) * a} />; })}
    <group position={[0.32, 0.9 * (1 - b), -0.12]}>
      <Bx s={[0.48, 0.4, 0.22]} p={[0, 0.2, 0]} c="#2c2f33" ro={0.45} rad={0.03} />
      <Bx s={[0.4, 0.26, 0.01]} p={[0, 0.21, 0.111]} c="#0e0e10" ro={0.6} />
      {[0.14, 0.21, 0.28].map((y, i) => <Tube key={i} pts={zig(-0.17, 0.34, y, 0.12)} rad={0.008} c={hot > 0.05 ? "#ff5a1a" : "#555555"} e="#ff3a00" ei={6 * hot} />)}
    </group>
    <pointLight position={[0.32, 0.25, 0.3]} intensity={3.5 * hot} distance={1.4} color="#ff5a14" />
    <Shade p={[-0.88, 0.003, 0.1]} w={0.2} d={0.16} o={0.4 * cl(coin(0) * 2)} />
    {[0, 1, 2].map((i) => coin(i) > 0 ? <Cy key={i} rt={0.1} h={0.024} p={[-0.88 + (i - 1) * 0.01, lerp(0.8, 0.013 + i * 0.025, coin(i)), 0.1]} r={[0.12 * (1 - coin(i)), 0, 0]} c="#d8b24a" m={1} ro={0.25} seg={40} /> : null)}
    <Shade p={[0.84, 0.003, 0.1]} w={0.36} d={0.2} o={0.45 * cl(nb / 2)} />
    {Array.from({ length: nb + (u < 0.86 && u > 0.3 ? 1 : 0) }, (_, i) => <Bx key={i} s={[0.26, 0.02, 0.12]} p={[0.84 + (rnd(i) - 0.5) * 0.012, 0.012 + i * 0.021 + (i === nb ? (1 - fr) * 0.35 : 0), 0.1 + (rnd(i, 3) - 0.5) * 0.01]} r={[0, (rnd(i, 2) - 0.5) * 0.1, 0]} map={billTx()} c="#ffffff" ro={0.85} />)}
  </S3>;
}}</Stage>;

const clockTx = () => canvasTex("clockE3", 512, 512, (g) => {
  g.fillStyle = "#f7f2e6"; g.beginPath(); g.arc(256, 256, 256, 0, Math.PI * 2); g.fill(); g.fillStyle = "#1f1c18"; g.font = BOLD(64); g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 1; i <= 12; i++) { const a = (i / 12) * Math.PI * 2; g.fillText(`${i}`, 256 + 196 * Math.sin(a), 256 - 196 * Math.cos(a)); }
});
// 9 · hielo que no se va: la unidad exterior se cubre de terrones de hielo y carámbanos hasta que el ventilador queda atrapado, mientras el reloj de la pared corre tres horas y su segundero se congela; al final late la luz roja: hay que llamar
export const HFrostClockS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ice = sm(win(u, 0.06, 0.86)), hrs = lerp(6, 9, ice), al = win(u, 0.84, 0.9) * (0.6 + 0.4 * Math.sin(tt * 5)), secT = Math.min(tt, 0.86 * (h.out - h.at));
  return <S3 p={[lerp(0.14, 0.04, u), 0.72, 1.7]} l={[0.08, 0.46, 0]} fov={36} floor={null}>
    <Bx s={[8, 4, 0.05]} p={[0, 1.3, -0.5]} c="#6e7f8f" ro={0.9} ns />
    {Array.from({ length: 12 }, (_, i) => <Bx key={i} s={[8, 0.014, 0.025]} p={[0, 0.08 + i * 0.14, -0.47]} c="#56667a" ro={0.9} ns />)}
    <Bx s={[6, 0.06, 3]} p={[0, -0.03, 0]} c="#eef3f7" ro={0.8} ns />
    {Array.from({ length: 5 }, (_, i) => <Sp key={i} rad={0.12 + rnd(i) * 0.08} p={[-0.9 + i * 0.45, -0.06, 0.45 + rnd(i, 2) * 0.2]} sc={[1.6, 0.6, 1]} c="#f4f8fb" ro={0.85} />)}
    <Shade p={[-0.24, 0.003, -0.05]} w={0.85} d={0.5} o={0.35} />
    <Unit p={[-0.24, 0, -0.1]} spin={tt * 2.4 * (1 - ice)} s={1.05} />
    {ice > 0.05 && <Cy rt={0.19} h={0.03} p={[-0.303, 0.273, 0.1]} r={[Math.PI / 2, 0, 0]} c="#dff0ff" e="#9fd0ff" ei={0.15} o={0.75 * ice} ro={0.05} seg={40} />}
    {Array.from({ length: 18 }, (_, i) => {
      const k = cl(ice * 1.5 - rnd(i, 2) * 0.5); if (k < 0.04) return null;
      const top = i < 8, x = top ? -0.52 + (i / 7) * 0.56 : i < 13 ? -0.52 + ((i - 8) / 4) * 0.56 : -0.47 + ((i - 13) / 4) * 0.46;
      const y = top ? 0.545 : i < 13 ? 0.04 : 0.46, z = top ? -0.24 + rnd(i) * 0.26 : 0.08;
      return <Sp key={i} rad={0.05 + rnd(i, 4) * 0.04} p={[x, y, z]} sc={[k * 1.3, k * 0.75, k]} c="#e6f4ff" e="#9fd0ff" ei={0.12} o={0.92} ro={0.08} />;
    })}
    {Array.from({ length: 9 }, (_, i) => <Icicle key={i} p={[-0.52 + i * 0.065, 0.53, 0.09]} L={(0.08 + rnd(i) * 0.16) * ice} />)}
    <Sp rad={0.022} p={[0.0, 0.46, 0.1]} c="#ff2a1a" e="#ff2a1a" ei={0.5 + 3 * al} ro={0.3} />
    <pointLight position={[0.0, 0.46, 0.25]} intensity={1.2 * al} distance={0.7} color="#ff3a2a" />
    <group position={[0.52, 0.7, -0.42]} scale={1.15}>
      <Cy rt={0.2} h={0.04} r={[Math.PI / 2, 0, 0]} c="#3a2a1c" ro={0.5} seg={64} />
      <mesh position={[0, 0, 0.022]}><circleGeometry args={[0.18, 64]} /><meshStandardMaterial map={clockTx()} roughness={0.6} /></mesh>
      <group position={[0, 0, 0.03]} rotation={[0, 0, -(hrs / 12) * Math.PI * 2]}><Bx s={[0.018, 0.1, 0.005]} p={[0, 0.045, 0]} c="#1a1a1a" ns /></group>
      <group position={[0, 0, 0.034]} rotation={[0, 0, -hrs * Math.PI * 2]}><Bx s={[0.01, 0.15, 0.005]} p={[0, 0.065, 0]} c="#1a1a1a" ns /></group>
      <group position={[0, 0, 0.038]} rotation={[0, 0, -secT * 3]}><Bx s={[0.005, 0.16, 0.004]} p={[0, 0.06, 0]} c="#c8302a" ns /></group>
      {Array.from({ length: 7 }, (_, i) => { const k = cl(ice * 1.4 - rnd(i, 7) * 0.4), an = 0.5 + i * 0.35; return k > 0.04 ? <Sp key={i} rad={0.035} p={[Math.cos(an) * 0.2, Math.sin(an) * 0.2, 0.02]} sc={[k, k * 0.7, k]} c="#eef8ff" o={0.9} ro={0.08} /> : null; })}
    </group>
  </S3>;
}}</Stage>;

// 18 · a contraluz: dos filtros de cartón suben a su soporte frente a una lámpara que se enciende; por el limpio pasa la luz cálida, el sucio queda gris, lleno de motas, y suelta polvo
export const HLightS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.16), b = drop(u, 0.06, 0.22), on = win(u, 0.28, 0.36);
  return <S3 p={[0.04, 0.46, 1.4]} l={[0, 0.3, 0]} fov={36} floor={null}>
    <Wall c="#2a2e34" /><Table c="#4a3424" />
    <Cy rt={0.06} h={0.03} p={[0, 0.015, -0.4]} c="#2a2a2a" m={0.6} ro={0.4} />
    <Cy rt={0.008} h={0.26} p={[0, 0.15, -0.4]} c="#3a3a3a" m={0.8} ro={0.3} />
    <Sp rad={0.06} p={[0, 0.32, -0.4]} c="#fff4d8" e="#ffd27a" ei={0.2 + 2.2 * on} ro={0.2} />
    <Puff p={[0, 0.32, -0.36]} s={0.8} c="#ffcf7a" o={0.25 * on} />
    <pointLight position={[0, 0.32, -0.25]} intensity={0.2 + 1.6 * on} distance={2.2} color="#ffd8a0" />
    {[-0.3, 0.3].map((x, i) => <Bx key={i} s={[0.52, 0.04, 0.14]} p={[x, 0.02, 0.1]} map={PLANKS()} c="#8a6040" ro={0.7} />)}
    <Filt w={0.48} h={0.4} d={0.07} g={0} frame="#c9b28a" p={[-0.3, 0.24 - 0.9 * (1 - a), 0.1]} />
    <Filt w={0.48} h={0.4} d={0.07} g={0.92} frame="#c9b28a" p={[0.3, 0.24 - 0.9 * (1 - b), 0.1]} />
    <Puff p={[-0.3, 0.24, 0.16]} s={0.5} c="#ffe2a8" o={0.18 * on * a} />
    {Array.from({ length: 70 }, (_, i) => <Dot key={i} p={[0.3 + (rnd(i, 5) - 0.5) * 0.42, 0.24 - 0.9 * (1 - b) + (rnd(i, 6) - 0.5) * 0.34, 0.142]} r={0.003 + rnd(i, 7) * 0.004} c="#5a5244" o={0.8 * b} />)}
    {Array.from({ length: 12 }, (_, i) => { const k = (tt * 0.3 + rnd(i)) % 1; return <Dot key={i} p={[0.3 + (rnd(i, 2) - 0.5) * 0.4, 0.06 + 0.16 * (1 - k), 0.16]} r={0.006} c="#6b6355" o={0.9 * b * (1 - k) * on} />; })}
  </S3>;
}}</Stage>;

// 19 · el aire frío del ventilador: el serpentín de aletas se enfría de cobre a escarcha y se llena de gotitas; el ventilador sopla a través, el aire azul cruza y la llama de la vela se tumba y se apaga con una voluta de humo
export const HCandleS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.14), cool = win(u, 0.16, 0.46), blow = win(u, 0.36, 0.56), out = win(u, 0.62, 0.7), fs = (1 - 0.35 * blow) * (1 - out);
  const fin = cool > 0.5 ? "#a8c8e4" : "#c07a48";
  return <S3 p={[0.04, 0.6, 1.75]} l={[0.02, 0.32, 0]} fov={36} floor={null}>
    <Wall c="#3c4450" /><Table c="#6a4a32" />
    <group position={[-0.74, 0.32, 0.05]} rotation={[0, 0.9, 0]}>
      <Cy rt={0.2} h={0.07} r={[Math.PI / 2, 0, 0]} c="#2c2f33" ro={0.5} open seg={48} />
      <group rotation={[0, 0, -tt * 9]}>{Array.from({ length: 5 }, (_, k) => <group key={k} rotation={[0, 0, (k / 5) * 6.283]}><Bx s={[0.1, 0.16, 0.01]} p={[0, 0.1, 0]} r={[0.3, 0, 0]} c="#7a8088" m={0.6} ro={0.3} rad={0.02} /></group>)}</group>
      <Sp rad={0.035} p={[0, 0, 0.02]} c="#2a2c30" ro={0.4} />
      <Cy rt={0.022} h={0.3} p={[0, -0.16, -0.03]} c="#2c2f33" m={0.5} ro={0.4} />
      <Cy rt={0.11} h={0.03} p={[0, -0.305, -0.03]} c="#2c2f33" m={0.5} ro={0.4} />
    </group>
    <group position={[-0.08, 0.9 * (1 - a), 0]}>
      {[-1, 1].map((s, i) => <Bx key={i} s={[0.03, 0.46, 0.12]} p={[s * 0.26, 0.25, 0]} c="#6a6e74" m={0.7} ro={0.35} />)}
      {[0.035, 0.465].map((y, i) => <Bx key={i} s={[0.55, 0.03, 0.12]} p={[0, y, 0]} c="#6a6e74" m={0.7} ro={0.35} />)}
      {Array.from({ length: 22 }, (_, k) => <Bx key={k} s={[0.006, 0.4, 0.1]} p={[-0.23 + k * 0.022, 0.25, 0]} c={fin} e={cool > 0.5 ? "#5aa8ff" : "#ff6a1a"} ei={0.15 + 0.5 * Math.abs(cool - 0.5)} m={0.9} ro={0.25} ns />)}
      {[0.12, 0.21, 0.3, 0.39].map((y, k) => <Cy key={k} rt={0.012} h={0.54} p={[0, y, 0.055]} r={[0, 0, Math.PI / 2]} c="#c27a42" m={1} ro={0.25} />)}
      {cool > 0.4 && Array.from({ length: 16 }, (_, i) => <Sp key={i} rad={0.008 + rnd(i) * 0.006} p={[-0.22 + rnd(i, 2) * 0.44, 0.44 - ((tt * 0.12 + rnd(i, 3)) % 1) * 0.36, 0.064]} c="#e6f4ff" o={0.9 * win(cool, 0.4, 0.7)} ro={0.02} />)}
    </group>
    <pointLight position={[-0.08, 0.3, 0.4]} intensity={1.6 * (1 - cool)} distance={1.4} color="#ff8a3a" />
    <pointLight position={[-0.08, 0.3, 0.4]} intensity={1.6 * cool} distance={1.4} color="#5aa8ff" />
    {Array.from({ length: 9 }, (_, i) => { const k = (tt * 0.5 + i / 9) % 1; return <Puff key={i} p={[lerp(-0.5, 0.62, k), 0.28 + Math.sin(i * 2.1) * 0.06, 0.06]} s={0.12 + k * 0.1} c="#9fd2ff" o={0.3 * blow * Math.sin(k * Math.PI)} />; })}
    <group position={[0.62, 0, 0.12]}>
      <Cy rt={0.045} h={0.24} p={[0, 0.12, 0]} c="#f4efe2" ro={0.5} />
      <Cy rt={0.004} h={0.025} p={[0, 0.252, 0]} c="#1a1a1a" ro={0.6} />
      {fs > 0.05 && <group position={[0, 0.258, 0]} rotation={[0, 0, -0.75 * blow + Math.sin(tt * 5) * 0.06 * blow]} scale={fs}><Sp rad={0.022} p={[0, 0.035, 0]} sc={[1, 2.3 + 0.15 * Math.sin(tt * 11), 1]} c={blow > 0.5 ? "#bfe0ff" : "#ffd27a"} e={blow > 0.5 ? "#6ab0ff" : "#ff9a2a"} ei={4} ro={0.4} /><Sp rad={0.009} p={[0, 0.012, 0.004]} sc={[1, 1.6, 1]} c="#4a8aff" e="#4a8aff" ei={2} ro={0.4} /><Puff p={[0, 0.04, 0.02]} s={0.14} c="#ffb050" o={0.35 * (1 - blow)} /></group>}
      {Array.from({ length: 6 }, (_, i) => { const k = (tt * 0.35 + i / 6) % 1; return <Puff key={i} p={[0.02 + k * 0.12, 0.27 + k * 0.32, 0]} s={0.06 + k * 0.1} c="#8a8a8a" o={0.4 * out * Math.sin(k * Math.PI)} add={false} />; })}
    </group>
    <pointLight position={[0.62, 0.3, 0.25]} intensity={1.2 * (1 - 0.6 * blow) * (1 - out)} distance={0.9} color="#ffb060" />
  </S3>;
}}</Stage>;

// 20 · el calentador-heladera: una heladera de dos puertas abre y el frío cae por delante; la cámara la rodea y atrás su parrilla negra se pone al rojo y echa aire caliente: mueve calor, no lo fabrica
export const HFridgeS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.14), door = win(u, 0.14, 0.26) * (1 - win(u, 0.42, 0.52)), th = lerp(0.4, 2.55, sm(win(u, 0.3, 0.66))), hot = win(u, 0.46, 0.66), R = 2.5;
  return <S3 p={[R * Math.sin(th), 1.0, R * Math.cos(th)]} l={[0, 0.72, 0]} fov={38} floor={null}>
    <Bx s={[9, 0.06, 9]} p={[0, -0.03, 0]} map={PLANKS()} c="#7a5a3e" ro={0.6} ns />
    {[-1, 1].map((s, i) => <Bx key={i} s={[9, 3.2, 0.05]} p={[0, 1.6, s * 4]} map={PLASTER()} c="#56606c" ro={0.95} ns />)}
    {[-1, 1].map((s, i) => <Bx key={i} s={[0.05, 3.2, 9]} p={[s * 4, 1.6, 0]} map={PLASTER()} c="#56606c" ro={0.95} ns />)}
    <Shade p={[0, 0.003, 0]} w={1} d={0.9} o={0.5 * a} />
    <group position={[0, 1.2 * (1 - a), 0]}>
      <Bx s={[0.72, 1.5, 0.62]} p={[0, 0.75, 0]} c="#f2f1ec" ro={0.25} rad={0.04} />
      <Bx s={[0.62, 0.92, 0.01]} p={[0, 0.52, 0.312]} c="#e8f4ff" e="#bfe2ff" ei={0.9 * door} ro={0.5} />
      {[0.3, 0.6].map((y, i) => <Bx key={i} s={[0.6, 0.015, 0.03]} p={[0, y, 0.33]} c="#dfe8f0" o={0.8} ro={0.2} />)}
      <Bx s={[0.7, 0.44, 0.05]} p={[0, 1.26, 0.335]} c="#f6f5f0" ro={0.25} rad={0.02} />
      <Bx s={[0.03, 0.2, 0.04]} p={[0.3, 1.18, 0.375]} c="#c8ccd0" m={1} ro={0.2} rad={0.01} />
      <Bx s={[0.7, 0.012, 0.01]} p={[0, 1.035, 0.36]} c="#3a3a3a" ro={0.6} />
      <group position={[-0.35, 0, 0.335]} rotation={[0, -door * 1.3, 0]}>
        <Bx s={[0.7, 1.0, 0.05]} p={[0.35, 0.52, 0]} c="#f6f5f0" ro={0.25} rad={0.02} />
        <Bx s={[0.03, 0.32, 0.04]} p={[0.65, 0.8, 0.045]} c="#c8ccd0" m={1} ro={0.2} rad={0.01} />
        <Bx s={[0.08, 0.06, 0.012]} p={[0.22, 0.78, 0.03]} c="#d8402a" ro={0.5} rad={0.01} />
        <Cy rt={0.03} h={0.012} p={[0.4, 0.64, 0.03]} r={[Math.PI / 2, 0, 0]} c="#3a8ad8" ro={0.5} />
      </group>
      <group position={[0, 0.75, -0.33]}>
        {Array.from({ length: 10 }, (_, k) => <Bx key={k} s={[0.6, 0.014, 0.014]} p={[0, -0.56 + k * 0.125, 0]} c="#2a2a2a" e="#ff4a10" ei={3 * hot} ro={0.5} />)}
        {[-0.25, 0, 0.25].map((x, k) => <Bx key={k} s={[0.014, 1.16, 0.014]} p={[x, 0, -0.012]} c="#2a2a2a" e="#ff4a10" ei={2 * hot} ro={0.5} />)}
      </group>
      <Cy rt={0.09} h={0.16} p={[0.15, 0.1, -0.24]} c="#1c1c1c" ro={0.4} m={0.4} />
    </group>
    <pointLight position={[0, 0.8, -0.8]} intensity={3 * hot} distance={1.8} color="#ff6a2a" />
    <pointLight position={[0, 0.6, 0.8]} intensity={1.4 * door} distance={1.4} color="#9fd0ff" />
    {Array.from({ length: 7 }, (_, i) => { const k = (tt * 0.35 + i / 7) % 1; return <Puff key={i} p={[Math.sin(i) * 0.15, 0.6 + k * 0.9, -0.48]} s={0.25 + k * 0.3} c="#ff9a4a" o={0.3 * hot * Math.sin(k * Math.PI)} />; })}
    {Array.from({ length: 7 }, (_, i) => { const k = (tt * 0.3 + i / 7) % 1; return <Puff key={i} p={[Math.sin(i * 1.7) * 0.2, 0.9 - k * 0.85, 0.55]} s={0.22 + k * 0.25} c="#bfe2ff" o={0.35 * door * Math.sin(k * Math.PI)} />; })}
  </S3>;
}}</Stage>;

// 22 · un fin de semana de trabajo: la casa en corte pierde frío por la puerta y el techo; tres rollos de aislante ruedan por el entretecho, el burlete de la puerta se ilumina, el frío deja de entrar y la factura baja de $240 a $150
export const HCalS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), r = [0, 1, 2].map((i) => sm(win(u, 0.12 + i * 0.14, 0.26 + i * 0.14))), strip = win(u, 0.58, 0.68), fix = (r[2] + strip) / 2, bill = Math.round(lerp(240, 150, win(u, 0.6, 0.85)));
  return <S3 p={[0.3, 0.85, 2.5]} l={[0.1, 0.56, 0]} fov={38} floor={null}>
    <Bx s={[8, 4, 0.05]} p={[0, 1.3, -1]} c="#2a3440" ro={0.9} ns />
    <Bx s={[6, 0.06, 3]} p={[0, -0.03, 0]} c="#eef3f7" ro={0.8} ns />
    <Bx s={[1.3, 0.04, 0.8]} p={[0, 0.02, 0]} map={PLANKS()} c="#a8784e" ro={0.6} />
    <Bx s={[1.3, 0.72, 0.04]} p={[0, 0.38, -0.4]} c="#e8dcc6" ro={0.9} />
    <Bx s={[0.04, 0.72, 0.8]} p={[0.63, 0.38, 0]} c="#d8ccb6" ro={0.9} />
    <Bx s={[0.04, 0.72, 0.8]} p={[-0.63, 0.38, 0]} c="#d8ccb6" ro={0.9} />
    <Bx s={[1.3, 0.04, 0.8]} p={[0, 0.76, 0]} c="#c9bca4" ro={0.9} />
    {[-1, 1].map((s, i) => <Bx key={i} s={[0.8, 0.04, 0.84]} p={[s * 0.36, 0.98, 0]} r={[0, 0, -s * 0.55]} c="#7a4a34" ro={0.8} />)}
    <Bx s={[0.02, 0.5, 0.26]} p={[-0.61, 0.27, 0.1]} c="#6a4426" ro={0.7} />
    <Bx s={[0.012, 0.52, 0.28]} p={[-0.6, 0.27, 0.1]} c="#d8a03a" e="#ffb040" ei={1.6 * strip} ro={0.5} o={0.3 + 0.7 * strip} />
    {r.map((k, i) => { const x0 = -0.6 + i * 0.4; return <group key={i}>
      {k > 0.02 && <Bx s={[0.4 * k, 0.05, 0.7]} p={[x0 + 0.4 - 0.2 * k, 0.805, 0]} c="#f2a8b8" ro={0.95} />}
      <Cy rt={lerp(0.07, 0.035, k)} h={0.7} p={[lerp(0.9, x0, k), lerp(0.85, 0.84, k), 0]} r={[Math.PI / 2, 0, 0]} c="#f29aae" ro={0.95} />
    </group>; })}
    {Array.from({ length: 6 }, (_, i) => { const k = (tt * 0.45 + i / 6) % 1, door = i % 2 === 0; return <Puff key={i} p={door ? [-0.7 + k * 0.5, 0.25 + Math.sin(i) * 0.05, 0.12] : [-0.2 + i * 0.1, 0.95 - k * 0.35, 0.05]} s={0.16 + k * 0.12} c="#8ac8ff" o={0.4 * (1 - fix) * Math.sin(k * Math.PI)} />; })}
    <group position={[0.98, 0.62, 0.1]} scale={1 + 0.06 * bump(u, 0.86, 30, 10)}><Odo v={bill} n={3} pre="$" s={1.3} /></group>
  </S3>;
}}</Stage>;

const ticketTx = (k: number) => canvasTex(`ticketE3|${k}`, 256, 512, (g) => {
  g.fillStyle = "#fbfaf5"; g.fillRect(0, 0, 256, 512); g.fillStyle = "#222"; g.textAlign = "center";
  g.font = BOLD(34); g.fillText("CHECK-UP", 128, 56); g.fillRect(30, 80, 196, 4);
  if (k >= 1) { g.font = BOLD(96); g.fillText("$100", 128, 190); }
  if (k >= 2) { g.font = BOLD(72); g.fillText("–$150", 128, 290); }
  for (let i = 0; i < Math.min(4, k * 2); i++) g.fillRect(40, 350 + i * 30, 120 + (i * 37) % 60, 8);
});
// 25 · el boleto: la impresora saca renglón por renglón el ticket de la revisión de $100-$150 y al lado cae billete por billete la torre del arreglo hasta que el contador marca $1500
export const HTicketS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), L = 0.46 * sm(win(u, 0.04, 0.34)), tk = u < 0.14 ? 0 : u < 0.24 ? 1 : 2, nf = lerp(0, 15, win(u, 0.4, 0.8)), nb = Math.floor(nf), fr = nf % 1, od = drop(u, 0.36, 0.44);
  const total = nb * 100, falling = u > 0.4 && u < 0.8;
  return <S3 p={[lerp(0.12, 0.04, u), 0.5, 1.55]} l={[0.06, 0.36, 0]} fov={36} floor={null}>
    <Wall c="#4a525c" /><Table c="#6a4a32" />
    <Shade p={[-0.3, 0.003, 0]} w={0.55} d={0.4} o={0.45} /><Shade p={[0.4, 0.003, 0]} w={0.42} d={0.26} o={0.45 * cl(nb / 3)} />
    <Bx s={[0.4, 0.18, 0.3]} p={[-0.3, 0.09, 0]} c="#2c2f33" ro={0.45} rad={0.03} />
    <Bx s={[0.26, 0.01, 0.02]} p={[-0.3, 0.18, 0.05]} c="#0a0a0a" />
    <Pl w={0.22} h={0.46} p={[-0.3, 0.18 - 0.23 + L, 0.05]} r={[-0.06, 0, 0]} map={ticketTx(tk)} c="#ffffff" ro={0.9} />
    <Dot p={[-0.16, 0.15, 0.152]} r={0.008} c="#5aff7a" o={0.9} add />
    {Array.from({ length: nb + (falling ? 1 : 0) }, (_, i) => <Bx key={i} s={[0.3, 0.022, 0.15]} p={[0.4 + (rnd(i) - 0.5) * 0.012, 0.012 + i * 0.024 + (i === nb ? (1 - fr) * 0.3 : 0), (rnd(i + 5) - 0.5) * 0.01]} r={[0, (rnd(i + 2) - 0.5) * 0.08, 0]} map={billTx()} c="#ffffff" ro={0.85} />)}
    {u > 0.36 && <group position={[0.42, 0.64 + 0.5 * (1 - od), 0]} scale={0.72 * (1 + 0.08 * bump(u, 0.8, 30, 10))}><Odo v={total} n={4} pre="$" nz /></group>}
  </S3>;
}}</Stage>;

// 26 · el relé de dos combustibles: baja la columna del termómetro y al cruzar la raya del frío la palanca salta con un clic de la bomba de calor (que se apaga) al horno a gas, que enciende su llama azul
export const HRelayS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.14), col = lerp(0.3, 0.07, sm(win(u, 0.1, 0.62))), sw = drop(u, 0.56, 0.64), ang = lerp(0.55, -0.55, sw) + bump(u, 0.64, 30, 9) * 0.05, gas = win(u, 0.62, 0.7);
  return <S3 p={[0.04, 0.62, 1.8]} l={[0, 0.4, 0]} fov={36} floor={null}>
    <Wall c="#3c4450" /><Table c="#6a4a32" />
    <group position={[0, 0.9 * (1 - a), 0]}>
      <Bx s={[0.34, 0.04, 0.2]} p={[0, 0.02, 0.1]} c="#2a2a2c" ro={0.5} rad={0.01} />
      <Sp rad={0.03} p={[0, 0.06, 0.1]} c="#c9a24a" m={1} ro={0.3} />
      <group position={[0, 0.06, 0.1]} rotation={[0, 0, ang]}><Bx s={[0.025, 0.34, 0.025]} p={[0, 0.17, 0]} c="#b8652e" m={1} ro={0.25} rad={0.008} /><Sp rad={0.03} p={[0, 0.35, 0]} c="#b0302a" ro={0.4} /></group>
      {[-1, 1].map((s, i) => <Bx key={i} s={[0.05, 0.05, 0.05]} p={[s * 0.15, 0.06, 0.1]} c="#c9a24a" m={1} ro={0.3} rad={0.01} />)}
      <Unit p={[-0.62, 0, -0.1]} spin={tt * 4 * (1 - sw)} s={0.8} />
      <Dot p={[-0.62, 0.48, 0.05]} r={0.025} c="#5aff7a" o={1 - sw} add />
      <group position={[0.62, 0, -0.1]}>
        <Bx s={[0.42, 0.62, 0.34]} p={[0, 0.31, 0]} c="#c9cdd2" m={0.4} ro={0.35} rad={0.02} />
        <Bx s={[0.22, 0.12, 0.01]} p={[0, 0.2, 0.172]} c="#0e0e10" ro={0.4} />
        {gas > 0.05 && [-0.06, 0, 0.06].map((x, i) => <Flame key={i} p={[x, 0.15, 0.18]} s={0.55 * gas} u={tt} i={i} />)}
      </group>
      <pointLight position={[0.62, 0.25, 0.4]} intensity={1.8 * gas} distance={1} color="#5a8aff" />
      <group position={[0, 0.44, -0.2]}>
        <Cy rt={0.03} h={0.42} p={[0, 0.21, 0]} c="#e8f4ff" o={0.35} ro={0.05} />
        <Sp rad={0.045} p={[0, 0, 0]} c="#d8302a" ro={0.3} />
        <Cy rt={0.014} h={col} p={[0, col / 2 + 0.02, 0.005]} c="#d8302a" ro={0.3} />
        <Bx s={[0.12, 0.008, 0.01]} p={[0, 0.17, 0.03]} c="#5aa8ff" e="#5aa8ff" ei={0.8} />
      </group>
    </group>
  </S3>;
}}</Stage>;

// 28 · la nube del susto: por la ventana de la cocina, en la nieve de la mañana, la unidad exterior suelta una nube enorme de vapor que sube y se deshace; queda tranquila con su luz verde: es el descongelado, no una explosión
export const HDoorS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), puff = win(u, 0.1, 0.28) * (1 - win(u, 0.62, 0.84)), ok = win(u, 0.72, 0.8);
  return <S3 p={[lerp(0.1, -0.02, u), 0.86, 1.0]} l={[0.3, 0.66, -1.4]} fov={40} floor={null}>
    <Bx s={[4, 0.6, 0.06]} p={[0, 0.2, -0.2]} map={PLASTER()} c="#d9cbb3" ro={0.95} ns />
    <Bx s={[4, 1.2, 0.06]} p={[0, 1.9, -0.2]} map={PLASTER()} c="#d9cbb3" ro={0.95} ns />
    {[-1, 1].map((s, i) => <Bx key={i} s={[1.4, 0.8, 0.06]} p={[s * 1.3, 0.9, -0.2]} map={PLASTER()} c="#d9cbb3" ro={0.95} ns />)}
    {[-1, 1].map((s, i) => <Bx key={i} s={[0.06, 0.8, 0.3]} p={[s * 0.63, 0.9, -0.33]} c="#cdbfa6" ro={0.9} />)}
    <Bx s={[1.26, 0.06, 0.3]} p={[0, 1.3, -0.33]} c="#cdbfa6" ro={0.9} />
    <Bx s={[1.26, 0.05, 0.1]} p={[0, 0.505, -0.4]} c="#5a3a24" ro={0.6} /><Bx s={[1.26, 0.05, 0.1]} p={[0, 1.27, -0.4]} c="#5a3a24" ro={0.6} />
    {[-0.6, 0, 0.6].map((x, i) => <Bx key={i} s={[0.05, 0.8, 0.1]} p={[x, 0.9, -0.4]} c="#5a3a24" ro={0.6} />)}
    <Bx s={[1.4, 0.04, 0.42]} p={[0, 0.49, -0.12]} c="#e8e0d0" ro={0.6} />
    <Bx s={[8, 0.06, 6]} p={[0, -0.03, -3]} c="#f2f6fa" ro={0.8} ns />
    <Bx s={[8, 3, 0.05]} p={[0, 1.2, -4]} c="#4a5f7a" ro={1} ns />
    {Array.from({ length: 14 }, (_, i) => <Bx key={i} s={[0.04, 0.5, 0.04]} p={[-1.6 + i * 0.25, 0.25, -3]} c="#5a4a3a" ro={1} />)}
    <Bx s={[3.6, 0.04, 0.03]} p={[0, 0.42, -3]} c="#5a4a3a" ro={1} />
    <Shade p={[0.5, 0.003, -1.36]} w={0.9} d={0.55} o={0.3} />
    <Unit p={[0.5, 0, -1.4]} spin={tt * 2 * (1 - puff)} s={1.2} />
    <Dot p={[0.77, 0.52, -1.18]} r={0.025} c="#5aff7a" o={ok} add />
    {Array.from({ length: 22 }, (_, i) => { const k = (tt * 0.2 + i / 22) % 1; return <Steam key={i} p={[0.45 + Math.sin(i * 2.3) * 0.2 * (1 + k), 0.62 + k * 1.1, -1.45 + Math.cos(i) * 0.12]} r={0.12 + k * 0.22} o={0.5 * puff * Math.sin(k * Math.PI)} />; })}
    <directionalLight position={[-3, 2, -2]} intensity={1.2} color="#ffd8a8" />
  </S3>;
}}</Stage>;

// reemplazos de cierre (vuelta 3 sin llegar): frostclock → callnow, fridges → fridgeback, doors → steamunit
const phoneTx = (k: number) => canvasTex(`phoneE4|${k}`, 256, 512, (g) => {
  g.fillStyle = k ? "#123a22" : "#0b0c0e"; g.fillRect(0, 0, 256, 512);
  if (k) {
    g.fillStyle = "#2fd25a"; g.beginPath(); g.arc(128, 256, 92, 0, Math.PI * 2); g.fill();
    g.save(); g.translate(128, 256); g.rotate(-0.6); g.fillStyle = "#ffffff";
    g.beginPath(); g.ellipse(-36, 0, 18, 26, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(36, 0, 18, 26, 0, 0, Math.PI * 2); g.fill();
    g.fillRect(-36, -26, 72, 18); g.restore();
  }
});
// 4 · hora de llamar: el celular grande sobre la mesa se enciende en verde con el tubo del teléfono, vibra y suelta ondas: después de horas con hielo, se llama
export const HCallNowS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), b = drop(u, 0, 0.16), ring = win(u, 0.3, 0.36), buzz = ring * (Math.sin(tt * 6) > 0 ? 1 : 0), jit = buzz * Math.sin(tt * 70) * 0.004;
  return <S3 p={[lerp(0.04, 0.0, u), 0.62, 0.42]} l={[0, 0.0, 0]} fov={36} floor={null}>
    <Wall c="#3c4450" z={-0.9} /><Table c="#6a4a32" />
    <Shade p={[0, 0.003, 0]} w={0.3} d={0.5} o={0.5 * b} />
    <group position={[jit, 0.5 * (1 - b), 0]} rotation={[0, 0.06 + jit * 4, 0]}>
      <Bx s={[0.22, 0.014, 0.42]} p={[0, 0.007, 0]} c="#1a1c20" m={0.5} ro={0.3} rad={0.02} />
      <Pl w={0.2} h={0.39} p={[0, 0.0145, 0]} r={[-Math.PI / 2, 0, 0]} map={phoneTx(u > 0.3 ? 1 : 0)} c="#ffffff" ro={0.6} />
    </group>
    {[0, 1, 2].map((i) => { const k = (tt * 0.9 + i / 3) % 1; return ring > 0.05 ? <mesh key={i} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.26 + k * 0.3}><ringGeometry args={[0.95, 1, 64]} /><meshBasicMaterial color="#4aff8a" transparent opacity={0.6 * ring * (1 - k)} depthWrite={false} /></mesh> : null; })}
    <pointLight position={[0.25, 0.15, 0.05]} intensity={0.5 * ring} distance={0.6} color="#4aff8a" />
  </S3>;
}}</Stage>;

// 16 · el «calentador-heladera»: una heladera de dos puertas con manijas e imanes; detrás de ella la parrilla negra que asoma por los costados pasa a rojo vivo y suben ondas de aire caliente: la heladera calienta
export const HFridgeBackS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.14), hot = sm(win(u, 0.2, 0.58));
  const coil = hot > 0.02 ? "#3a1a10" : "#161616";
  return <S3 p={[lerp(0.75, 0.5, u), 1.0, 2.3]} l={[0, 0.78, 0]} fov={38} floor={null}>
    <Wall c="#8a8070" z={-1.2} /><Table c="#7a5a3e" />
    <Shade p={[0, 0.003, 0]} w={1} d={0.9} o={0.5 * a} />
    <group position={[0, 1.2 * (1 - a), 0]} rotation={[0, -0.35, 0]}>
      <Bx s={[0.72, 1.5, 0.62]} p={[0, 0.75, 0]} c="#f2f1ec" ro={0.25} rad={0.04} />
      <Bx s={[0.7, 0.44, 0.05]} p={[0, 1.26, 0.335]} c="#f6f5f0" ro={0.25} rad={0.02} />
      <Bx s={[0.7, 1.0, 0.05]} p={[0, 0.52, 0.335]} c="#f6f5f0" ro={0.25} rad={0.02} />
      <Bx s={[0.7, 0.012, 0.01]} p={[0, 1.035, 0.362]} c="#3a3a3a" ro={0.6} />
      <Bx s={[0.03, 0.2, 0.04]} p={[0.3, 1.18, 0.375]} c="#c8ccd0" m={1} ro={0.2} rad={0.01} />
      <Bx s={[0.03, 0.32, 0.04]} p={[0.3, 0.8, 0.375]} c="#c8ccd0" m={1} ro={0.2} rad={0.01} />
      <Bx s={[0.08, 0.06, 0.012]} p={[-0.12, 0.78, 0.366]} c="#d8402a" ro={0.5} rad={0.01} />
      <Cy rt={0.03} h={0.012} p={[0.05, 0.64, 0.366]} r={[Math.PI / 2, 0, 0]} c="#3a8ad8" ro={0.5} />
      <group position={[0, 0.82, -0.36]} scale={[1.35, 1.12, 1]}>
        {Array.from({ length: 12 }, (_, k) => <Cy key={k} rt={0.012} h={0.98} p={[0, -0.66 + k * 0.12, 0]} r={[0, 0, Math.PI / 2]} c={coil} e="#ff3a08" ei={5 * hot} ro={0.45} m={0.5} />)}
        {[-0.46, -0.3, 0.3, 0.46].map((x, k) => <Cy key={k} rt={0.005} h={1.36} p={[x, 0, -0.014]} c={coil} e="#ff3a08" ei={1.8 * hot} ro={0.45} m={0.5} />)}
      </group>
    </group>
    <pointLight position={[0, 0.9, -0.85]} intensity={5 * hot} distance={1.6} color="#ff4a10" />
    {Array.from({ length: 12 }, (_, i) => { const k = (tt * 0.35 + i / 12) % 1, sd = i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : -1; return <Puff key={i} p={[sd * (0.5 + k * 0.08), (sd === 0 ? 1.55 : 0.5) + k * 0.9, -0.5]} s={0.22 + k * 0.32} c="#ff7a2a" o={0.45 * hot * Math.sin(k * Math.PI)} />; })}
  </S3>;
}}</Stage>;

// 23 · la nube de cada mañana: la unidad en la nieve para el ventilador y suelta una nube de vapor iluminada por el sol que sube y se deshace; se prende la luz verde: es el descongelado
export const HSteamUnitS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.14), puff = win(u, 0.14, 0.3) * (1 - win(u, 0.6, 0.8)), ok = win(u, 0.72, 0.8);
  return <S3 p={[lerp(0.12, 0.03, u), 0.6, 1.55]} l={[0, 0.5, 0]} fov={40} floor={null}>
    <Bx s={[8, 4, 0.05]} p={[0, 1.6, -0.6]} c="#7d8b99" ro={0.9} ns />
    {Array.from({ length: 16 }, (_, i) => <Bx key={i} s={[8, 0.014, 0.025]} p={[0, 0.08 + i * 0.16, -0.57]} c="#66737f" ro={0.9} ns />)}
    <Bx s={[8, 0.06, 4]} p={[0, -0.03, 0]} c="#f2f6fa" ro={0.8} ns />
    {Array.from({ length: 6 }, (_, i) => <Sp key={i} rad={0.14 + rnd(i) * 0.1} p={[-1.4 + i * 0.56, -0.07, 0.3 + rnd(i, 2) * 0.4]} sc={[1.8, 0.6, 1.1]} c="#f4f8fb" ro={0.85} />)}
    <Shade p={[0, 0.003, 0.02]} w={0.9} d={0.55} o={0.35 * a} />
    <Unit p={[0, 0.9 * (1 - a), -0.05]} spin={tt * 2.4 * (1 - puff)} s={1.3} />
    <Sp rad={0.03} p={[0.26, 0.6, 0.18]} c={ok > 0.1 ? "#2fd25a" : "#1c2a20"} e="#2fd25a" ei={2.5 * ok} ro={0.3} />
    {Array.from({ length: 20 }, (_, i) => { const k = (tt * 0.22 + i / 20) % 1; return <Steam key={i} p={[Math.sin(i * 2.3) * 0.16 * (1 + k), 0.66 + k * 0.6, -0.05 + Math.cos(i) * 0.12]} r={0.08 + k * 0.15} o={0.6 * puff * Math.sin(k * Math.PI)} />; })}
    <directionalLight position={[-3, 2.5, 2]} intensity={1.4} color="#ffd8a8" />
  </S3>;
}}</Stage>;

const thermoTx = () => canvasTex("thermoE8", 256, 1024, (g) => {
  g.fillStyle = "#f6f2ea"; g.fillRect(0, 0, 256, 1024); g.fillStyle = "#1e1e1e"; g.textAlign = "left"; g.textBaseline = "middle";
  [40, 50, 60, 70, 80, 90].forEach((v, k) => { const y = 930 - k * 168; g.fillRect(10, y - 7, 60, 14); g.font = BOLD(v % 20 === 0 || v === 90 ? 124 : 92); g.fillText(String(v), 82, y); });
  for (let k = 0; k < 25; k++) g.fillRect(14, 930 - k * 33.6 - 2, 34, 4);
});
// 16 · el calentador-heladera («refrigerator heaters»): primer plano de un termómetro de vidrio gigante delante de una heladera abierta con luz cálida; el mercurio sube de 40 a 90 y arriba revienta un géiser de vapor
export const HBigThermoS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.14), col = cl(sm(win(u, 0.3, 0.76)) + 0.06 * bump(u, 0.76, 34, 9)), top = win(u, 0.74, 0.8), jit = top * Math.sin(tt * 55) * 0.006, glow = 0.7 + 0.3 * Math.sin(tt * 5);
  return <S3 p={[lerp(0.08, -0.02, u), 0.78, 2.0]} l={[0, 0.8, 0]} fov={46} floor={null}>
    <Wall c="#4e4842" z={-1.2} /><Table c="#6a4c34" />
    <group position={[-0.6, 0, -0.6]}>
      <Bx s={[0.72, 1.5, 0.04]} p={[0, 0.75, -0.29]} c="#e8e6e0" ro={0.3} />
      {[-0.34, 0.34].map((x, i) => <Bx key={i} s={[0.04, 1.5, 0.62]} p={[x, 0.75, 0]} c="#e8e6e0" ro={0.3} />)}
      <Bx s={[0.72, 0.52, 0.62]} p={[0, 1.24, 0]} c="#e8e6e0" ro={0.3} /><Bx s={[0.72, 0.07, 0.62]} p={[0, 0.035, 0]} c="#e8e6e0" ro={0.3} />
      <Bx s={[0.62, 0.92, 0.01]} p={[0, 0.52, -0.27]} c="#f4d2a8" e="#ff8a3a" ei={1.1 * glow} ro={0.8} />
      {[0.36, 0.66].map((y, i) => <Bx key={i} s={[0.58, 0.012, 0.52]} p={[0, y, 0]} c="#ffffff" o={0.55} ro={0.05} />)}
      <pointLight position={[0, 0.55, 0.3]} intensity={1.4 * glow} distance={1.8} color="#ff9a4a" />
      <group position={[-0.35, 0, 0.32]} rotation={[0, -1.35, 0]}><Bx s={[0.7, 1.0, 0.07]} p={[0.35, 0.52, 0.02]} c="#f0eee8" ro={0.3} rad={0.025} /></group>
    </group>
    <mesh position={[-0.3, 0.004, 0.0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.6, 1.1, 1]}><circleGeometry args={[0.5, 40]} /><meshBasicMaterial color="#ff8a3a" transparent opacity={0.55 * glow} depthWrite={false} blending={2} /></mesh>
    <Shade p={[0.12, 0.003, 0.3]} w={0.42} d={0.26} o={0.55 * a} />
    <Cy rt={0.16} rb={0.18} h={0.12} p={[0.12, 0.06 + 1.4 * (1 - a), 0.3]} c="#3a3634" m={0.5} ro={0.35} />
    <group position={[0.12 + jit, 0.12 + 1.4 * (1 - a), 0.3]} scale={0.95}>
      <Bx s={[0.38, 1.12, 0.04]} p={[0.03, 0.62, -0.07]} map={thermoTx()} c="#ffffff" ro={0.7} rad={0.025} />
      <Cy rt={0.06} h={1.02} p={[-0.07, 0.63, 0.01]} c="#eef6fa" o={0.28} ro={0.03} m={0.1} />
      <Sp rad={0.1} p={[-0.07, 0.1, 0.01]} c="#d8302a" e="#ff2a1a" ei={0.5 + 1.0 * top} ro={0.2} />
      <Cy rt={0.036} h={0.08 + 0.92 * col} p={[-0.07, 0.14 + (0.08 + 0.92 * col) / 2, 0.01]} c="#d8302a" e="#ff2a1a" ei={0.3 + 0.6 * col} ro={0.25} />
      <Bx s={[0.012, 1.0, 0.004]} p={[-0.045, 0.63, 0.06]} c="#ffffff" o={0.6} ro={0.05} ns />
    </group>
    {Array.from({ length: 30 }, (_, i) => { const k = (tt * 1.0 + i / 30) % 1; return <Steam key={i} p={[0.066 + Math.sin(i * 2.3) * 0.035 * (1 + 3 * k), 1.26 + k * 0.24, 0.31]} r={0.035 + k * 0.08} c="#ffffff" o={0.9 * top * (1 - k * 0.8)} />; })}
  </S3>;
}}</Stage>;
