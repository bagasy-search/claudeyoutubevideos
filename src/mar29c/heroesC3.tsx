// mar29c · reemplazos SIMPLES (tope de 3 vueltas del EVALUADOR): un solo objeto grande, una sola acción, cámara fija con arco lento.
// Cubren los huecos que dejaron los componentes que no llegaron a 7 (toaster, tilt, recyclebin, card, twice, ring24, flight).
import React, { useContext } from "react";
import { H, Stage } from "./hkit";
import { Bx, Cy, Dot, PLANKS, PLASTER, Pl, Puff, R3T, S3 as S3k, Sp, To, Tube, V3, canvasTex, cl, drop, lerp, rnd, sm, win, BOLD } from "../kits/r3k/r3k";
import { RoundThermo, Thermo3 } from "./r3c";

// cámara que acompaña la salida (el kit aleja los objetos 0,9 m al final): el objeto no se achica
const S3: React.FC<React.ComponentProps<typeof S3k>> = ({ p, l, ...r }) => {
  const { tt, d } = useContext(R3T), x = sm((tt - (d - 0.75)) / 0.75);
  return <S3k p={[p[0], p[1] - 0.12 * x, p[2] - 0.9 * x]} l={[l[0], l[1] - 0.12 * x, l[2] - 0.9 * x]} {...r} />;
};
const U = (tt: number, h: H) => cl(tt / (h.out - h.at));
const bump = (u: number, a: number, f = 26, k = 8) => (u > a ? Math.sin((u - a) * f) * Math.exp(-(u - a) * k) : 0);
const Wall: React.FC<{ y?: number; z?: number; c?: string }> = ({ y = 1.3, z = -0.6, c = "#efe6d6" }) => <Bx s={[8, 4, 0.05]} p={[0, y, z]} map={PLASTER()} c={c} ro={0.95} ns />;
const Table: React.FC<{ c?: string }> = ({ c = "#a8784e" }) => <Bx s={[6, 0.06, 3]} p={[0, -0.03, 0]} map={PLANKS()} c={c} ro={0.6} ns />;
// sombra de contacto blanda bajo un objeto apoyado
const Shade: React.FC<{ p: V3; w: number; d: number; o?: number }> = ({ p, w, d, o = 0.45 }) =>
  <mesh position={p} rotation={[-Math.PI / 2, 0, 0]} scale={[w, d, 1]}><circleGeometry args={[0.5, 40]} /><meshBasicMaterial color="#000000" transparent opacity={o} depthWrite={false} /></mesh>;

const slotCoil = (z: number): V3[] => Array.from({ length: 15 }, (_, k) => [-0.22 + k * (0.44 / 14), 0.392, z + (k % 2 ? 0.024 : -0.024)] as V3);
// 13 · la tostadora gigante: cae desde arriba con rebote sobre la mesada; las resistencias en zigzag pasan de gris a naranja incandescente, tiñen de naranja la tostadora y la mesada
export const HToasterS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), f = drop(u, 0, 0.16), inY = 1.1 * (1 - f), heat = win(u, 0.22, 0.5), sq = 1 - 0.06 * bump(u, 0.16, 30, 9);
  return <S3 p={[lerp(0.26, 0.12, u), 0.92, 1.12]} l={[0, 0.3, 0]} fov={36} floor={null}>
    <Wall c="#39404a" z={-0.7} /><Table c="#6a4a32" />
        <pointLight position={[0, 0.5, 0.05]} intensity={4.5 * heat} distance={1.8} color="#ff5a14" />
    <Shade p={[0, 0.003, 0]} w={0.8 * (0.5 + 0.5 * f)} d={0.5 * (0.5 + 0.5 * f)} o={0.5 * f} />
    <group position={[0, inY, 0]} scale={[1, sq, 1]}>
      <Bx s={[0.62, 0.36, 0.34]} p={[0, 0.2, 0]} c="#c9cfd6" m={1} ro={0.16} rad={0.06} />
      <Bx s={[0.66, 0.03, 0.38]} p={[0, 0.015, 0]} c="#1c1c1e" ro={0.5} rad={0.01} />
      {[-0.08, 0.08].map((z, i) => <group key={i}>
        <Bx s={[0.5, 0.016, 0.07]} p={[0, 0.384, z]} c="#0b0b0d" e="#ff3a00" ei={0.9 * heat} ro={0.7} />
        <Tube pts={slotCoil(z)} rad={0.009} c={heat > 0.05 ? "#ff6a1a" : "#5a5a5a"} e="#ff3a00" ei={6 * heat} />
      </group>)}
      <Bx s={[0.04, 0.1, 0.03]} p={[0.33, 0.24 - 0.12 * win(u, 0.12, 0.22), 0]} c="#1c1c1e" ro={0.4} rad={0.01} />
    </group>
    {Array.from({ length: 14 }, (_, i) => { const k = (tt * 0.35 + i / 14) % 1, x = -0.2 + rnd(i) * 0.4, z = i % 2 ? 0.08 : -0.08;
      return <Dot key={i} p={[x + Math.sin(k * 6 + i) * 0.03, 0.42 + inY + k * 0.45, z]} r={0.012 + k * 0.01} c="#ffb070" o={0.5 * heat * Math.sin(k * Math.PI)} add />; })}
  </S3>;
}}</Stage>;

// 15 · el mercurio: el tubo de vidrio grueso con aros dorados baja y se apoya en su taco con golpe, se ladea con rebote y la bola cromada de mercurio rueda de punta a punta con un brillo que la sigue
export const HMercury: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), f = drop(u, 0, 0.14), tilt = lerp(0.24, -0.24, sm(win(u, 0.18, 0.4))) + lerp(0, 0.48, sm(win(u, 0.6, 0.82))) + bump(u, 0.4, 22, 7) * 0.05 + bump(u, 0.82, 22, 7) * 0.05;
  const t0 = u < 0.18 ? 0.24 : tilt, x = cl((-t0 / 0.24) * 0.5 + 0.5) * 0.66 - 0.33, dir = t0 < 0 ? -1 : 1;
  return <S3 p={[0.04, 0.42, 1.02]} l={[0, 0.24, 0]} fov={34} floor={null}>
    <Wall c="#2c333c" /><Table c="#4a3222" />
    <pointLight position={[0.3, 0.7, 0.6]} intensity={1.4} distance={2} color="#ffffff" />
    <pointLight position={[x * Math.cos(t0), 0.3, 0.25]} intensity={0.8} distance={0.6} color="#dfe8ff" />
    <Bx s={[0.1, 0.16, 0.1]} p={[0, 0.08, 0]} c="#c9a24a" m={0.9} ro={0.25} rad={0.01} />
    <Shade p={[0, 0.003, 0.02]} w={0.9} d={0.25} o={0.4 * f} />
    <group position={[0, 0.24 + 0.7 * (1 - f), 0]} rotation={[0, 0, t0]}>
      <Cy rt={0.085} h={0.8} r={[0, 0, Math.PI / 2]} c="#d8eef8" o={0.32} ro={0.02} m={0.2} />
      {[-0.4, 0.4].map((xx, i) => <To key={i} R={0.088} t={0.012} p={[xx, 0, 0]} r={[0, Math.PI / 2, 0]} c="#c9a24a" m={1} ro={0.2} />)}
      <Bx s={[0.62, 0.008, 0.004]} p={[0, 0.07, 0.07]} c="#ffffff" e="#ffffff" ei={0.6} o={0.5} ns />
      <Sp rad={0.07} p={[x, -0.012, 0]} sc={[1.12, 0.94, 1]} c="#f2f5f8" m={1} ro={0.02} />
      <Dot p={[x - 0.02, 0.03, 0.06]} r={0.024} c="#ffffff" o={1} add />
      {[1, 2, 3, 4].map((k) => <Sp key={k} rad={0.012 - k * 0.002} p={[x + dir * k * 0.06, -0.06, 0]} c="#e8ecf0" m={1} ro={0.03} />)}
    </group>
  </S3>;
}}</Stage>;

// 17 · al tacho de reciclaje: desde arriba se ve el tacho verde abierto; el termostato redondo viejo cae girando adentro con rebote, la tapa baja y cierra con golpe y en el frente brota la tilde verde
export const HBinS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), hang = sm(win(u, 0.02, 0.3)), f = drop(u, 0.4, 0.56), lid = drop(u, 0.6, 0.72), y = lerp(lerp(1.6, 0.98, hang), 0.5, f), ok = win(u, 0.74, 0.84);
  return <S3 p={[0.1, 1.42, 1.18]} l={[0, 0.4, 0]} fov={40} floor={null}>
    <Wall c="#c9c2b4" z={-0.8} /><Bx s={[6, 0.06, 3]} p={[0, -0.03, 0]} c="#7a7a76" ro={0.85} ns />
    <Shade p={[0, 0.003, 0]} w={0.7} d={0.7} o={0.5} />
    <Cy rt={0.26} rb={0.22} h={0.64} p={[0, 0.32, 0]} c="#2f8a4a" ro={0.45} open />
    <Cy rt={0.22} h={0.01} p={[0, 0.02, 0]} c="#173f22" ro={0.6} />
    <Cy rt={0.255} rb={0.215} h={0.62} p={[0, 0.33, 0]} c="#1c4a2a" ro={0.8} open />
    <To R={0.26} t={0.016} p={[0, 0.64, 0]} r={[Math.PI / 2, 0, 0]} c="#2a7a40" ro={0.4} />
    <Bx s={[0.22, 0.22, 0.004]} p={[0, 0.34, 0.245]} r={[0.07, 0, 0]} c="#f4f4f0" ro={0.6} />
    <Tube pts={[[-0.06, 0.35, 0.252], [-0.015, 0.3, 0.252], [0.07, 0.41, 0.252]]} rad={0.013} c="#23a04a" e="#2fd060" ei={0.4 + 0.6 * ok} />
    <Dot p={[0, 0.35, 0.3]} r={0.14} c="#5aff8a" o={0.16 * ok} add />
    {u < 0.62 && <group position={[0.02, y, 0.02]} rotation={[-0.9 + f * 1.9 + Math.sin(tt * 1.6) * 0.08 * (1 - f), f * 1.4, 0.2]}><RoundThermo deg={68} s={1.25} /></group>}
    {u > 0.58 && <group position={[0, 0.65 + 0.7 * (1 - lid), -0.26]} rotation={[bump(u, 0.72, 30, 10) * 0.1, 0, 0]}>
      <Cy rt={0.272} h={0.035} p={[0, 0, 0.26]} c="#36994f" ro={0.4} />
      <Bx s={[0.12, 0.03, 0.04]} p={[0, 0.03, 0.42]} c="#2a7a40" ro={0.4} rad={0.01} />
    </group>}
  </S3>;
}}</Stage>;

// 25 · el zumbido de la heladera: la heladera entera tiembla y de su motor salen ondas gruesas de sonido; el zumbido se corta de golpe, las ondas se apagan y la puerta se entreabre con luz cálida: silencio
export const HCardS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), hum = u < 0.56 ? 1 : 0, jx = Math.sin(tt * 70) * 0.008 * hum + bump(u, 0.56, 40, 12) * 0.01, jy = Math.abs(Math.sin(tt * 53)) * 0.005 * hum, door = win(u, 0.66, 0.84);
  return <S3 p={[lerp(0.5, 0.3, u), 0.85, 2.7]} l={[0, 0.72, 0]} fov={38} floor={null}>
    <Wall c="#56606c" /><Table c="#7a5a3e" />
    <Shade p={[0, 0.003, 0.02]} w={0.95} d={0.8} o={0.55} />
    <group position={[jx, jy, 0]}>
      <Bx s={[0.72, 1.4, 0.64]} p={[0, 0.7, 0]} c="#f2f1ec" ro={0.25} rad={0.04} />
      <Bx s={[0.5, 0.06, 0.02]} p={[0, 0.06, 0.33]} c="#2a2a2c" ro={0.6} />
      <Bx s={[0.66, 0.5, 0.58]} p={[0, 1.08, 0.04]} c="#fff1cf" e="#ffd27a" ei={1.4 * door} ro={0.6} />
      <group position={[-0.36, 0, 0.33]} rotation={[0, -door * 0.55, 0]}>
        <Bx s={[0.72, 0.84, 0.05]} p={[0.36, 1.0, 0]} c="#f6f5f0" ro={0.25} rad={0.02} />
        <Bx s={[0.03, 0.22, 0.04]} p={[0.64, 1.0, 0.04]} c="#c8ccd0" m={1} ro={0.2} rad={0.01} />
      </group>
      <Bx s={[0.72, 0.5, 0.05]} p={[0, 0.33, 0.33]} c="#f6f5f0" ro={0.25} rad={0.02} />
      <Bx s={[0.03, 0.16, 0.04]} p={[0.28, 0.45, 0.37]} c="#c8ccd0" m={1} ro={0.2} rad={0.01} />
    </group>
    <pointLight position={[0, 1.08, 0.5]} intensity={2.2 * door} distance={1.6} color="#ffd27a" />
    {[0, 1, 2, 3].map((i) => { const f = (tt * 0.9 + i / 4) % 1; return <mesh key={i} position={[0, 0.08, 0.36]}><ringGeometry args={[0.14 + f * 0.9, 0.2 + f * 0.9, 64, 1, 0, Math.PI]} /><meshBasicMaterial color="#8ad8ff" transparent opacity={0.8 * hum * (1 - f)} depthWrite={false} /></mesh>; })}
  </S3>;
}}</Stage>;

const Hand: React.FC<{ skin: string; cuff: string }> = ({ skin, cuff }) => <group>
  <Cy rt={0.06} rb={0.07} h={0.5} p={[0, -0.33, 0]} c={cuff} ro={0.8} />
  <Bx s={[0.11, 0.13, 0.05]} p={[0, -0.03, 0]} c={skin} ro={0.6} rad={0.025} />
  <Cy rt={0.017} rb={0.02} h={0.12} p={[0, 0.09, 0.005]} c={skin} ro={0.6} />
  <Sp rad={0.017} p={[0, 0.15, 0.005]} c={skin} ro={0.6} />
  {[-0.036, 0.036].map((x, i) => <Cy key={i} rt={0.016} h={0.06} p={[x, 0.03, 0.02]} r={[1.2, 0, 0]} c={skin} ro={0.6} />)}
</group>;
// 28 · enseñale a subirlo: la mano de la señora duda frente al termostato; la mano de Marcus (puño azul) la toma de la muñeca y la guía: dos toques, el número sube 68 → 69 → 70 con rebote y halo cálido
export const HTwiceS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), hes = win(u, 0.06, 0.24), g = win(u, 0.3, 0.44), p1 = Math.sin(win(u, 0.48, 0.58) * Math.PI), p2 = Math.sin(win(u, 0.64, 0.74) * Math.PI), pr = Math.max(p1, p2);
  const v = 68 + (u > 0.53 ? 1 : 0) + (u > 0.69 ? 1 : 0), wob = (1 - g) * Math.sin(tt * 6) * 0.012 * hes, sc = 1 + 0.05 * (bump(u, 0.53, 30, 10) + bump(u, 0.69, 30, 10));
  const hx = 0.11, hy = lerp(0.42, 0.63 - 0.025 * pr, hes) + wob, hz = lerp(0.3, 0.1 + (g > 0.99 ? -0.03 * pr : 0), hes);
  return <S3 p={[0.06, 0.88, 1.6]} l={[0.04, 0.8, 0]} fov={36} floor={null}>
    <Bx s={[8, 4, 0.05]} p={[0, 1.3, -0.03]} map={PLASTER()} c="#b9a688" ro={0.95} ns />
    <group scale={sc} position={[0, 0.95, 0.02]}><Thermo3 v={`${v}`} s={2.1} glow={0.12} dark /></group>
    <Dot p={[0, 0.95, 0.04]} r={0.45} c="#ffcf7a" o={0.22 * pr} add />
    <group position={[hx, hy - 0.08 - 0.8 * (1 - hes), hz]} rotation={[-0.35, 0, 0.12]}><Hand skin="#e3b896" cuff="#d98ba0" /></group>
    <group position={[lerp(0.62, hx + 0.1, g), lerp(0.2, hy - 0.2, g), hz + 0.06]} rotation={[-0.3, 0, lerp(0.9, 0.5, g)]}><Hand skin="#a8754e" cuff="#2f4f8a" /></group>
    <pointLight position={[0, 0.95, 0.4]} intensity={0.4 + 1.6 * pr} distance={1.3} color="#ffd27a" />
  </S3>;
}}</Stage>;

const clockTx = () => canvasTex("clockS2", 512, 512, (g) => {
  g.fillStyle = "#f7f2e6"; g.beginPath(); g.arc(256, 256, 256, 0, Math.PI * 2); g.fill(); g.fillStyle = "#1f1c18"; g.font = BOLD(64); g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 1; i <= 12; i++) { const a = (i / 12) * Math.PI * 2; g.fillText(`${i}`, 256 + 196 * Math.sin(a), 256 - 196 * Math.cos(a)); }
  for (let i = 0; i < 60; i++) { const a = (i / 60) * Math.PI * 2, r0 = i % 5 ? 236 : 226; g.fillRect(256 + r0 * Math.sin(a) - 2, 256 - r0 * Math.cos(a) - 2, 4, i % 5 ? 4 : 10); }
});
// 29 · el horario: reloj de pared con aro de madera y el termostato al lado; un rayo de sol cruza la pared, el minutero barre de 6:30 a 7:00 con tic y el termostato despierta de 69 a 70
export const HClockS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.1, 0.62), stepK = (Math.floor(k * 30) + sm((k * 30) % 1 * 3)) / 30, hrs = 6.5 + 0.5 * cl(stepK), on = win(u, 0.62, 0.7), v = u < 0.64 ? 69 : 70, sun = win(u, 0.04, 0.9);
  return <S3 p={[0.08, 1.0, 1.65]} l={[0.06, 0.98, 0]} fov={36} floor={null}>
    <Bx s={[8, 4, 0.05]} p={[0, 1.3, -0.03]} map={PLASTER()} c="#a99880" ro={0.95} ns />
    <mesh position={[lerp(-1.1, 0.7, sun), 1.0, 0.0]} rotation={[0, 0, -0.5]}><planeGeometry args={[0.45, 2.4]} /><meshBasicMaterial color="#ffd89a" transparent opacity={0.22} depthWrite={false} blending={2} /></mesh>
    <group position={[-0.26, 1.0, 0.04]}>
      <Dot p={[0.025, -0.03, -0.035]} r={0.36} c="#000000" o={0.35} />
      <To R={0.3} t={0.035} c="#6a4426" ro={0.45} />
      <Cy rt={0.3} h={0.04} p={[0, 0, -0.02]} r={[Math.PI / 2, 0, 0]} c="#4a3020" ro={0.5} seg={64} />
      <mesh position={[0, 0, 0.002]}><circleGeometry args={[0.28, 64]} /><meshStandardMaterial map={clockTx()} roughness={0.6} /></mesh>
      <group position={[0, 0, 0.012]} rotation={[0, 0, -(hrs / 12) * Math.PI * 2]}><Bx s={[0.024, 0.15, 0.006]} p={[0, 0.065, 0]} c="#1a1a1a" ns /></group>
      <group position={[0, 0, 0.02]} rotation={[0, 0, -hrs * Math.PI * 2]}><Bx s={[0.014, 0.23, 0.006]} p={[0, 0.1, 0]} c="#b0302a" ns /></group>
      <Sp rad={0.018} p={[0, 0, 0.026]} c="#c9a24a" m={0.9} ro={0.3} />
    </group>
    <group scale={1 + 0.06 * bump(u, 0.64, 30, 10)} position={[0.36, 0.98, 0.02]}><Thermo3 v={`${v}`} s={1.5} glow={0.12} dark /></group>
    <pointLight position={[0.36, 1.0, 0.35]} intensity={0.3 + 1.6 * on} distance={1.1} color="#ffc070" />
  </S3>;
}}</Stage>;

// 34 · nunca apagado en invierno: cristales de hielo gruesos cubren el caño de cobre de izquierda a derecha y se abre una grieta que gotea; el termostato en 55 se enciende cálido y el hielo se derrite
export const HPipeS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), grow = sm(win(u, 0.04, 0.38)), crack = win(u, 0.4, 0.48), melt = sm(win(u, 0.62, 0.9)), on = win(u, 0.54, 0.62), xr = lerp(-0.85, 0.85, grow), xl = lerp(-0.85, 0.85, melt), len = xr - xl;
  return <S3 p={[0.08, 0.6, 1.5]} l={[0, 0.48, 0]} fov={38} floor={null}>
    <Bx s={[8, 4, 0.05]} p={[0, 1.3, -0.3]} map={PLASTER()} c="#8a96a4" ro={0.95} ns />
    <Cy rt={0.065} h={2.6} p={[0, 0.3, 0]} r={[0, 0, Math.PI / 2]} c="#c8763e" m={0.95} ro={0.25} />
    {[-0.55, 0.55].map((x, i) => <To key={i} R={0.07} t={0.013} p={[x, 0.3, 0]} r={[0, Math.PI / 2, 0]} c="#b8652e" m={0.95} ro={0.3} />)}
    {len > 0.03 && <Cy rt={0.085} h={len} p={[(xl + xr) / 2, 0.3, 0]} r={[0, 0, Math.PI / 2]} c="#e6f4ff" e="#9fd0ff" ei={0.3} o={0.55} ro={0.1} />}
    {len > 0.03 && <Cy rt={0.105} h={len} seg={7} p={[(xl + xr) / 2, 0.3, 0]} r={[0.3, 0, Math.PI / 2]} c="#f4fbff" e="#bfe2ff" ei={0.25} o={0.42} m={0.1} ro={0.04} />}
    {Array.from({ length: 9 }, (_, i) => { const x = -0.76 + i * 0.19, L = (0.07 + rnd(i) * 0.09) * cl((xr - x) * 4) * (1 - cl((xl - x + 0.1) * 4)); return L > 0.012 ? <mesh key={i} position={[x, 0.2 - L / 2, 0.02]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.018, L, 8]} /><meshStandardMaterial color="#eef8ff" emissive="#9fd0ff" emissiveIntensity={0.3} transparent opacity={0.85} roughness={0.05} /></mesh> : null; })}
    {crack > 0 && melt < 0.3 && <Tube pts={[[-0.12, 0.392, 0.02], [-0.06, 0.37, 0.05], [0, 0.39, 0.06], [0.05, 0.365, 0.07], [0.12, 0.385, 0.05]].map((q) => [lerp(0, q[0], crack), q[1], q[2]] as V3)} rad={0.005} c="#1a2a3a" />}
    {Array.from({ length: 5 }, (_, i) => { const f = ((u - 0.46) * 3 + i * 0.2) % 1; return u > 0.46 && u < 0.7 ? <Sp key={i} rad={0.012} p={[-0.04 + i * 0.02, 0.2 - f * 0.25, 0.04]} sc={[1, 1.5, 1]} c="#cfe8ff" m={0.1} ro={0.02} o={0.9 * (1 - f)} /> : null; })}
    <group scale={1 + 0.06 * bump(u, 0.56, 30, 10)} position={[0, 0.72, -0.27]}><Thermo3 v="55" s={1.6} glow={0.12} dark /></group>
    <pointLight position={[0, 0.6, 0.4]} intensity={2.6 * on} distance={1.8} color="#ffb070" />
  </S3>;
}}</Stage>;

const Icicle: React.FC<{ p: V3; L: number }> = ({ p, L }) => L > 0.012 ? <mesh position={[p[0], p[1] - L / 2, p[2]]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.022, L, 8]} /><meshStandardMaterial color="#eef8ff" emissive="#9fd0ff" emissiveIntensity={0.3} transparent opacity={0.92} roughness={0.05} /></mesh> : null;
// reemplazos de cierre (tres vueltas sin llegar): bins → dropbox, cards → quiet, pipes → frostpipe
const recycleTx = () => canvasTex("recycleC4", 512, 512, (g) => {
  g.fillStyle = "#1f6a3a"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "#ffffff"; g.fillStyle = "#ffffff"; g.lineWidth = 26; g.lineCap = "round";
  for (let i = 0; i < 3; i++) {
    const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / 3 + 0.35, a1 = a0 + (2 * Math.PI) / 3 - 0.7;
    g.beginPath(); g.arc(256, 230, 120, a0, a1); g.stroke();
    const x = 256 + 120 * Math.cos(a1), y = 230 + 120 * Math.sin(a1), d = a1 + Math.PI / 2;
    g.beginPath(); g.moveTo(x + 40 * Math.cos(d), y + 40 * Math.sin(d)); g.lineTo(x + 34 * Math.cos(d - 2.3), y + 34 * Math.sin(d - 2.3)); g.lineTo(x + 34 * Math.cos(d + 2.3), y + 34 * Math.sin(d + 2.3)); g.closePath(); g.fill();
  }
  g.font = BOLD(64); g.textAlign = "center"; g.fillText("FREE", 256, 450);
});
// 8 · el punto limpio: una caja verde de reciclaje con su símbolo cae en la mesa; el termostato viejo de mercurio entra solito por la ranura con un clic y la caja se sacude: gratis
export const HDropBoxS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0.04, 0.22), go = sm(win(u, 0.5, 0.82)), dz = drop(u, 0.2, 0.36), hit = u > 0.8 ? Math.abs(Math.sin((u - 0.8) * 34)) * Math.exp(-(u - 0.8) * 8) : 0;
  return <S3 p={[lerp(0.24, 0.1, u), 0.9, 1.8]} l={[0, 0.56, 0]} fov={36} floor={null}>
    <Wall c="#4a525c" z={-0.8} /><Table c="#6a4a32" />
    <Shade p={[0, 0.003, 0]} w={0.75 * (0.6 + 0.4 * a)} d={0.55 * (0.6 + 0.4 * a)} o={0.5 * a} />
    <group position={[0, 1.2 * (1 - a) + 0.04 * hit, 0]}>
      <Bx s={[0.56, 0.7, 0.42]} p={[0, 0.35, 0]} c="#2a7a46" ro={0.5} rad={0.03} />
      <Bx s={[0.6, 0.04, 0.46]} p={[0, 0.72, 0]} c="#1f5a34" ro={0.5} rad={0.015} />
      <Bx s={[0.3, 0.02, 0.05]} p={[0, 0.745, 0.08]} c="#0b0c0c" ro={0.6} />
      <Pl w={0.4} h={0.4} p={[0, 0.36, 0.212]} map={recycleTx()} c="#ffffff" ro={0.6} />
    </group>
    {u > 0.2 && go < 0.98 && <group position={[0, u < 0.5 ? lerp(1.5, 0.92, dz) + Math.sin(tt * 2) * 0.01 : lerp(0.92, 0.5, go), 0.08]} rotation={[0, 0, 0.35 * (1 - dz) * (u < 0.5 ? 1 : 0)]} scale={1.3}>
      <Bx s={[0.19, 0.24, 0.035]} c="#8a8f96" m={0.5} ro={0.35} rad={0.015} />
      <Bx s={[0.15, 0.2, 0.004]} p={[0, 0, 0.019]} c="#c9ccd0" ro={0.4} rad={0.008} />
      <Cy rt={0.014} h={0.12} p={[0, 0.03, 0.03]} r={[0, 0, Math.PI / 2]} c="#e8f4ff" o={0.5} ro={0.03} />
      <Sp rad={0.012} p={[0.04 * Math.sin(tt * 3), 0.03, 0.03]} c="#dfe4ea" m={1} ro={0.06} />
      <Bx s={[0.1, 0.012, 0.01]} p={[0, -0.06, 0.024]} c="#3a3a3a" />
    </group>}
    {Array.from({ length: 6 }, (_, i) => { const k = cl((u - 0.82) / 0.16); return u > 0.82 ? <Puff key={i} p={[(i - 2.5) * 0.12, 0.04 + k * 0.08, 0.25]} s={0.08 + k * 0.12} c="#d8cdb8" o={0.35 * (1 - k)} add={false} /> : null; })}
  </S3>;
}}</Stage>;

const vuTx = () => canvasTex("vuC4", 512, 320, (g) => {
  g.fillStyle = "#f3ead2"; g.fillRect(0, 0, 512, 320);
  const arc = (a0: number, a1: number, c: string) => { g.strokeStyle = c; g.lineWidth = 26; g.beginPath(); g.arc(256, 300, 220, a0, a1); g.stroke(); };
  arc(-Math.PI * 0.85, -Math.PI * 0.55, "#3aa04a"); arc(-Math.PI * 0.55, -Math.PI * 0.35, "#e0b02a"); arc(-Math.PI * 0.35, -Math.PI * 0.15, "#d0302a");
  g.fillStyle = "#222"; g.font = BOLD(48); g.textAlign = "center"; g.fillText("QUIET", 120, 290); g.fillText("LOUD", 400, 290);
});
// 13 · la casa en silencio: el medidor de ruido tiembla con la aguja clavada en rojo por el zumbido; se apaga el ventilador y la aguja cae despacio hasta la zona verde: silencio por primera vez
export const HQuietS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.08), calm = sm(win(u, 0.4, 0.78)), shake = (1 - calm) * Math.sin(tt * 47) * 0.05;
  const ang = lerp(-0.85, 0.95, calm) + shake;
  return <S3 p={[lerp(0.1, 0.02, u), 0.52, 1.3]} l={[-0.04, 0.34, 0]} fov={36} floor={null}>
    <Wall c="#3c4450" z={-0.7} /><Table c="#6a4a32" />
    <group position={[-0.5, 0.42, -0.35]} rotation={[0, 0.5, 0]}>
      <Cy rt={0.2} h={0.07} r={[Math.PI / 2, 0, 0]} c="#2c2f33" ro={0.5} open seg={48} />
      <group rotation={[0, 0, -tt * 12 * (1 - calm)]}>{Array.from({ length: 5 }, (_, k) => <group key={k} rotation={[0, 0, (k / 5) * 6.283]}><Bx s={[0.1, 0.16, 0.01]} p={[0, 0.1, 0]} r={[0.3, 0, 0]} c="#7a8088" m={0.6} ro={0.3} rad={0.02} /></group>)}</group>
      <Cy rt={0.022} h={0.4} p={[0, -0.22, -0.03]} c="#2c2f33" m={0.5} ro={0.4} />
      <Cy rt={0.12} h={0.03} p={[0, -0.41, -0.03]} c="#2c2f33" m={0.5} ro={0.4} />
    </group>
    <Shade p={[0, 0.003, 0]} w={0.95} d={0.4} o={0.5} />
    <group position={[(1 - calm) * Math.sin(tt * 61) * 0.002, 0.25 * (1 - a), 0]} scale={1.1}>
      <Bx s={[0.62, 0.46, 0.22]} p={[0, 0.25, 0]} c="#3a2a1c" ro={0.4} rad={0.03} />
      <Pl w={0.52} h={0.32} p={[0, 0.27, 0.111]} map={vuTx()} c="#ffffff" ro={0.5} />
      <group position={[0, 0.13, 0.118]} rotation={[0, 0, ang]}><Bx s={[0.008, 0.27, 0.004]} p={[0, 0.135, 0]} c="#1a1a1a" ns /></group>
      <Sp rad={0.018} p={[0, 0.13, 0.12]} c="#1a1a1a" ro={0.4} />
      <Bx s={[0.5, 0.02, 0.01]} p={[0, 0.455, 0.11]} c="#c9a24a" m={1} ro={0.3} />
      <Sp rad={0.016} p={[0.25, 0.07, 0.115]} c={calm > 0.9 ? "#3aff6a" : "#d0302a"} e={calm > 0.9 ? "#3aff6a" : "#d0302a"} ei={1.6} ro={0.3} />
    </group>
  </S3>;
}}</Stage>;

// 19 · nunca apagado en invierno: el caño de cobre está cubierto de escarcha y carámbanos; el termostato de la pared sube a 55, la escarcha se retira y queda una sola gota
export const HFrostPipeS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.12), grow = sm(win(u, 0.02, 0.26)), heat = sm(win(u, 0.36, 0.8)), v = Math.round(lerp(40, 55, win(u, 0.3, 0.5))), ice = 1 - heat;
  return <S3 p={[lerp(0.14, 0.04, u), 0.62, 1.45]} l={[0, 0.5, 0]} fov={36} floor={null}>
    <Wall c="#5a6068" z={-0.4} />
    <Thermo3 v={`${v}`} p={[0.45, 0.84, -0.35]} s={1.8} glow={0.12} dark />
    <pointLight position={[0.42, 0.82, 0]} intensity={0.8} distance={1} color="#ffffff" />
    <group position={[0, 0.9 * (1 - a), 0]}>
      <Cy rt={0.05} h={1.6} p={[-0.1, 0.36, -0.2]} r={[0, 0, Math.PI / 2]} c="#c27a42" m={1} ro={0.25} />
      {[-0.55, 0.35].map((x, i) => <Bx key={i} s={[0.05, 0.14, 0.06]} p={[x, 0.43, -0.25]} c="#8a8f94" m={0.7} ro={0.35} />)}
      {ice * grow > 0.04 && <Cy rt={0.075} h={1.0 * grow} p={[-0.6 + 0.5 * grow, 0.36, -0.2]} r={[0, 0, Math.PI / 2]} c="#eef8ff" e="#9fd0ff" ei={0.2} o={0.85 * ice} ro={0.05} seg={7} />}
      {Array.from({ length: 8 }, (_, i) => { const me = win(heat, i / 9, i / 9 + 0.18), g = win(grow, i / 9, i / 9 + 0.2); return <Icicle key={i} p={[-0.55 + i * 0.12, 0.29, -0.2]} L={(0.06 + rnd(i) * 0.1) * g * (1 - me)} />; })}
      {Array.from({ length: 8 }, (_, i) => { const k = cl((heat - (i / 9 + 0.12)) * 6); return k > 0 && k < 1 ? <Sp key={i} rad={0.012} p={[-0.55 + i * 0.12, 0.27 - k * 0.27, -0.2]} sc={[1, 1.4, 1]} c="#dff0ff" e="#bfe2ff" ei={0.6} o={0.9} ro={0.05} /> : null; })}
    </group>
  </S3>;
}}</Stage>;
