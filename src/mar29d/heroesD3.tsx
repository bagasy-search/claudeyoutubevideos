// mar29d · reemplazos SIMPLES (cierre del EVALUADOR): un solo objeto grande, una sola acción, fondo cerrado, cámara fija o arco lento.
// Cubren los minutos que quedaron sin componente ≥7; cada uno muestra lo que la voz dice en ese segundo.
import React, { useContext } from "react";
import { H, Stage } from "./hkit";
import { Bx, Cy, Filt, PLANKS, PLASTER, Pl, Puff, R3T, S3 as S3k, Sp, To, Tube, V3, canvasTex, cl, drop, lerp, rnd, sm, win, BOLD } from "../kits/r3k/r3k";
import { Odo, RoundThermo, Thermo3 } from "./r3c";

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
const Steam: React.FC<{ p: V3; r: number; o: number; c?: string }> = ({ p, r, o, c = "#f4f6f8" }) => o > 0.02 ? <mesh position={p} scale={r}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color={c} emissive="#ffffff" emissiveIntensity={0.18} transparent opacity={o} depthWrite={false} roughness={1} /></mesh> : null;
const MET = "#b9bfc5", INS = "#e9c27a";
// furnace: gabinete gris con ventanita de llama (glow 0..1) y plenum de chapa arriba; base en p
const Furnace: React.FC<{ p: V3; s?: number; glow?: number }> = ({ p, s = 1, glow = 0.6 }) => <group position={p} scale={s}>
  <Bx s={[0.5, 0.9, 0.46]} p={[0, 0.45, 0]} c="#7e858c" m={0.35} ro={0.45} rad={0.025} />
  <Bx s={[0.42, 0.012, 0.01]} p={[0, 0.62, 0.232]} c="#4a4f55" />
  <Bx s={[0.16, 0.08, 0.01]} p={[0, 0.34, 0.232]} c="#3a1a08" e="#ff7a1a" ei={0.4 + 2.2 * glow} />
  <Bx s={[0.46, 0.22, 0.42]} p={[0, 1.01, 0]} c={MET} m={0.75} ro={0.3} rad={0.015} />
</group>;
// rejilla de piso (vista desde arriba): marco + lamas; open 0..1 gira las lamas
const Grille: React.FC<{ p: V3; w?: number; d?: number; open?: number; c?: string }> = ({ p, w = 0.36, d = 0.14, open = 1, c = "#c9ccd0" }) => <group position={p}>
  <Bx s={[w, 0.012, d]} p={[0, 0.006, 0]} c={c} m={0.6} ro={0.35} rad={0.004} />
  {Array.from({ length: 7 }, (_, k) => <Bx key={k} s={[w - 0.04, 0.004, 0.012]} p={[0, 0.014, -d / 2 + 0.02 + (k * (d - 0.04)) / 6]} r={[0.9 * open, 0, 0]} c="#3a3d40" m={0.5} ro={0.4} ns />)}
</group>;
// polilínea cortada en la fracción k (para tubos que crecen); null si es demasiado corta
const part = (pts: V3[], k: number): V3[] | null => {
  if (k <= 0.02) return null;
  const L: number[] = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]));
  const T = L[L.length - 1] * cl(k), out: V3[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (L[i] <= T) { out.push(pts[i]); continue; }
    const f = (T - L[i - 1]) / (L[i] - L[i - 1]); out.push([lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), lerp(pts[i - 1][2], pts[i][2], f)]); break;
  }
  return out.length >= 2 ? out : null;
};
const along = (pts: V3[], k: number): V3 => { const q = part(pts, Math.max(0.03, k)); return q ? q[q.length - 1] : pts[0]; };

// 0 · ¿adónde se va el calor?: casa en corte; el furnace del sótano empuja aire por el ducto y por los cortes del ducto el calor naranja se escapa al ático y al crawl
export const HHeatEscapeS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.16), att = win(u, 0.2, 0.34), crw = win(u, 0.5, 0.64);
  const leak = (x: number, y: number, n: number, o: number, sp: number, dir: number, key: string) => Array.from({ length: n }, (_, i) => { const k = (tt * sp + i / n) % 1;
    return <Puff key={key + i} p={[x + 0.05 + k * 0.45 + (rnd(i, 3) - 0.5) * 0.12 * (1 + k), y + dir * (0.02 + k * 0.12) + Math.sin(k * 4 + i) * 0.03, (rnd(i, 7) - 0.5) * 0.35 * k]} s={0.13 + k * 0.26} c={k < 0.4 ? "#ff4a08" : "#ff7a28"} o={o * Math.min(1, k * 6) * (1 - k * 0.5)} add={false} />; });
  return <S3 p={[lerp(0.2, 0.1, u), 0.95, 2.9]} l={[0.15, 0.9, 0]} fov={46} floor={null}>
    <Bx s={[8, 4, 0.05]} p={[0, 1.3, -1.2]} c="#2e2622" ro={1} ns />
    <Bx s={[8, 0.4, 3]} p={[0, -0.2, 0]} c="#4a3a2e" ro={1} ns />
    <group position={[0, 1.4 * (1 - a), 0]}>
      <Bx s={[2.0, 0.04, 0.9]} p={[0, 0.0, 0]} c="#8a7a68" ro={0.9} />
      <Bx s={[2.0, 0.06, 0.9]} p={[0, 0.42, 0]} map={PLANKS()} c="#b88a5a" ro={0.6} />
      <Bx s={[2.0, 0.04, 0.9]} p={[0, 1.12, 0]} c="#cbbba4" ro={0.9} />
      <Bx s={[2.0, 0.08, 0.86]} p={[0, 1.18, 0]} c={INS} ro={1} />
      <Bx s={[2.0, 1.54, 0.04]} p={[0, 0.77, -0.45]} map={PLASTER()} c="#e8dcc8" ro={0.95} />
      {[-1, 1].map((sd, i) => <Bx key={i} s={[0.06, 1.16, 0.9]} p={[sd * 1.0, 0.58, 0]} c="#e2d4bc" ro={0.9} />)}
      {[-1, 1].map((sd, i) => <Bx key={i} s={[1.3, 0.06, 0.96]} p={[sd * 0.55, 1.5, 0]} r={[0, 0, -sd * 0.62]} c="#7a3a2a" ro={0.8} />)}
      <Furnace p={[-0.55, 0.0, 0]} s={0.38} glow={0.5 + 0.3 * Math.sin(tt * 3)} />
      <Bx s={[0.12, 0.84, 0.12]} p={[-0.55, 0.78, 0]} c={MET} m={0.7} ro={0.3} />
      <Bx s={[1.0, 0.12, 0.14]} p={[-0.05, 1.28, 0]} c={MET} m={0.7} ro={0.3} />
      <Bx s={[0.9, 0.12, 0.14]} p={[-0.1, 0.3, 0]} c={MET} m={0.7} ro={0.3} />
      <Bx s={[0.012, 0.13, 0.15]} p={[0.455, 1.28, 0]} c="#1a0a04" e="#ff5a10" ei={2 * att} ns />
      <Bx s={[0.012, 0.13, 0.15]} p={[0.355, 0.3, 0]} c="#1a0a04" e="#ff5a10" ei={2 * crw} ns />
      <pointLight position={[0.65, 1.32, 0.15]} intensity={2.2 * att} distance={0.9} color="#ff7a2a" />
      <pointLight position={[0.55, 0.34, 0.15]} intensity={2.2 * crw} distance={0.9} color="#ff7a2a" />
      {leak(0.41, 1.3, 16, att, 0.4, 1, "a")}
      {leak(0.31, 0.3, 16, crw, 0.4, -0.3, "c")}
    </group>
  </S3>;
}}</Stage>;

// 1 · las venas de la casa: del furnace sale el tronco de chapa y de él crecen, una por una, las ramas flexibles; cada una llega a su cuartito y la rejilla se enciende
export const HFlexGrowS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.14), tr = sm(win(u, 0.12, 0.3));
  const rx = (i: number) => -0.05 + i * 0.42;
  const br: V3[][] = [0, 1, 2].map((i) => { const x = rx(i); return [[x, 0.96, 0], [x + 0.03, 0.78, 0.1], [x + 0.02, 0.45, 0.28], [x + 0.02, 0.12, 0.42]] as V3[]; });
  return <S3 p={[lerp(0.3, 0.15, u), 0.9, 2.3]} l={[0.25, 0.5, 0]} fov={38} floor={null}>
    <Wall c="#6e6862" z={-0.5} /><Table c="#5a4a3a" />
    <Shade p={[-0.55, 0.003, 0]} w={0.6} d={0.5} o={0.5 * a} />
    <Furnace p={[-0.55, 1.2 * (1 - a), 0]} s={0.85} />
    <Bx s={[1.35 * tr, 0.2, 0.22]} p={[-0.35 + (1.35 * tr) / 2, 1.0, 0]} c={MET} m={0.75} ro={0.3} rad={0.01} />
    {[0, 1, 2].map((i) => { const x = rx(i) + 0.02, on = win(u, 0.5 + i * 0.14, 0.56 + i * 0.14), ap = drop(u, 0.12 + i * 0.06, 0.26 + i * 0.06);
      return <group key={i} position={[x, 0.6 * (1 - ap), 0.42]}>
        <Bx s={[0.34, 0.02, 0.3]} p={[0, 0.01, 0]} map={PLANKS()} c="#c89a68" ro={0.6} />
        <Bx s={[0.34, 0.26, 0.02]} p={[0, 0.13, -0.15]} map={PLASTER()} c={["#e8d8c0", "#cfe0d6", "#e6d2d8"][i]} ro={0.95} />
        <Bx s={[0.02, 0.26, 0.3]} p={[0.17, 0.13, 0]} c="#ddd0bc" ro={0.95} />
        <Bx s={[0.15, 0.012, 0.08]} p={[0, 0.026, 0.06]} c="#2a1a10" e="#ff7a1a" ei={0.1 + 2.2 * on} ro={0.5} />
        <pointLight position={[0, 0.12, 0.08]} intensity={1.2 * on} distance={0.45} color="#ff9a4a" />
        {Array.from({ length: 4 }, (_, j) => { const k = (tt * 0.5 + j / 4) % 1; return <Puff key={j} p={[0, 0.04 + k * 0.18, 0.06]} s={0.04 + k * 0.06} c="#ffa060" o={0.6 * on * Math.sin(k * Math.PI)} add={false} />; })}
      </group>; })}
    {br.map((pts, i) => { const g = part(pts, sm(win(u, 0.3 + i * 0.14, 0.5 + i * 0.14))); return g ? <Tube key={i} pts={g} rad={0.045} c="#d6d6d2" m={0.55} ro={0.35} /> : null; })}
  </S3>;
}}</Stage>;

// 5 · el flexible que se soltó: el ducto flexible se desliza fuera del collar de chapa, cae sobre la aislación y sopla aire caliente al ático
export const HSlippedS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), off = sm(win(u, 0.18, 0.36)), blow = win(u, 0.34, 0.46);
  const mx = lerp(0.08, 0.28, off), my = lerp(0.42, 0.14, off);
  const flex: V3[] = [[1.1, 0.16, -0.2], [0.8, 0.16, -0.05], [0.5, lerp(0.3, 0.16, off), 0.02], [mx, my, 0.02]];
  return <S3 p={[lerp(0.42, 0.3, u), 0.75, 1.7]} l={[0.3, 0.25, 0]} fov={38} floor={null}>
    <Bx s={[8, 4, 0.05]} p={[0, 1.2, -0.9]} c="#4a3a2c" ro={1} ns />
    <Bx s={[6, 0.12, 3]} p={[0, 0.0, 0]} c={INS} ro={1} ns />
    {[-0.5, 0.9].map((z, i) => <Bx key={i} s={[6, 0.14, 0.06]} p={[0, 0.07, z]} c="#a8784e" ro={0.7} />)}
    {Array.from({ length: 30 }, (_, i) => <Sp key={i} rad={0.03 + rnd(i) * 0.04} p={[-1 + rnd(i, 2) * 2.4, 0.06, -0.4 + rnd(i, 3) * 1.2]} c="#efcf8a" ro={1} ns />)}
    <Bx s={[0.5, 0.3, 0.3]} p={[-0.3, 0.42, 0.02]} c={MET} m={0.75} ro={0.3} rad={0.01} />
    <Cy rt={0.09} h={0.16} p={[0.03, 0.42, 0.02]} r={[0, 0, Math.PI / 2]} c="#d0d4d8" m={0.85} ro={0.25} />
    <To R={0.09} t={0.008} p={[0.11, 0.42, 0.02]} r={[0, Math.PI / 2, 0]} c="#9aa0a6" m={0.8} ro={0.3} />
    <Tube pts={flex} rad={0.085} c="#d8d8d4" m={0.5} ro={0.4} />
    {Array.from({ length: 10 }, (_, i) => { const k = (tt * 0.55 + i / 10) % 1; return <Puff key={i} p={[mx - 0.05 - k * 0.5, my + 0.04 + k * 0.32, 0.02 + (rnd(i) - 0.5) * 0.25 * k]} s={0.12 + k * 0.26} c="#ff6a1a" o={0.9 * blow * Math.sin(k * Math.PI)} add={false} />; })}
  </S3>;
}}</Stage>;

// 6 · pisá la madera: una bota camina por la viga del ático dejando huellas verdes; el último paso cae sobre la aislación, se hunde y al levantarse la huella queda roja
export const HJoistWalkS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), N = 5, f = cl((u - 0.1) / 0.58) * N, cur = Math.min(N - 1, Math.floor(f)), ph = Math.min(1, f - cur), bad = win(u, 0.66, 0.72), off = sm(win(u, 0.76, 0.88));
  const pos = (i: number): V3 => i === N - 1 ? [0.3, 0.06 - 0.03 * bad, 0.35 - i * 0.3] : [i % 2 ? 0.02 : -0.02, 0.102, 0.35 - i * 0.3];
  const q = pos(cur), lift = u < 0.1 ? 1 : cur === N - 1 && ph >= 1 ? 0 : Math.max(0, 1 - ph * 2.2);
  return <S3 p={[0.2, 0.85, 0.75]} l={[0.12, 0.05, -0.55]} fov={42} floor={null}>
    <Bx s={[6, 0.04, 4]} p={[0, -0.12, -1]} c="#bfb6a6" ro={1} ns />
    {[-0.6, 0, 0.6].map((x, i) => <Bx key={i} s={[0.09, 0.2, 3.2]} p={[x, 0.0, -0.8]} map={PLANKS()} c="#c09060" ro={0.6} />)}
    {[-0.3, 0.3].map((x, i) => <Bx key={i} s={[0.5, 0.14, 3.2]} p={[x, -0.02, -0.8]} c={INS} ro={1} />)}
    {Array.from({ length: 40 }, (_, i) => <Sp key={i} rad={0.02 + rnd(i) * 0.025} p={[(rnd(i, 2) > 0.5 ? 0.3 : -0.3) + (rnd(i, 4) - 0.5) * 0.4, 0.05, 0.4 - rnd(i, 3) * 2.6]} c="#efcf8a" ro={1} ns />)}
    {Array.from({ length: cur }, (_, i) => { const p = pos(i); return <Bx key={i} s={[0.075, 0.004, 0.18]} p={[p[0], p[1] + 0.002, p[2]]} c="#2f9a4a" e="#2aff5a" ei={0.7} ro={0.6} rad={0.002} ns />; })}
    {cur === N - 1 && ph > 0.5 && <Bx s={[0.11, 0.006, 0.24]} p={[q[0], 0.095, q[2]]} c="#c8302a" e="#ff2a1a" ei={0.6 + 1.6 * bad} ro={0.6} rad={0.003} ns />}
    <pointLight position={[0.3, 0.2, 0.35 - (N - 1) * 0.3]} intensity={1.5 * bad * off} distance={0.5} color="#ff3a2a" />
    <group position={[q[0] - 0.3 * off, q[1] + 0.2 * lift + 0.12 * off, q[2] + 0.12 * lift + 0.3 * off]} rotation={[-0.35 * lift, 0, 0]}>
      <Bx s={[0.105, 0.025, 0.24]} p={[0, 0.012, 0.01]} c="#1a1410" ro={0.85} rad={0.01} />
      <Bx s={[0.1, 0.04, 0.08]} p={[0, 0.035, -0.07]} c="#2a1e14" ro={0.8} rad={0.01} />
      <mesh position={[0, 0.06, 0.06]} scale={[0.05, 0.04, 0.07]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#7a4e2a" roughness={0.55} /></mesh>
      <Bx s={[0.095, 0.06, 0.12]} p={[0, 0.06, -0.01]} c="#7a4e2a" ro={0.55} rad={0.02} />
      <Cy rt={0.05} rb={0.052} h={0.17} p={[0, 0.17, -0.05]} c="#6a4426" ro={0.6} />
      <Cy rt={0.054} h={0.025} p={[0, 0.26, -0.05]} c="#3a2618" ro={0.6} />
      {[0, 1, 2].map((k) => <Bx key={k} s={[0.06, 0.004, 0.006]} p={[0, 0.1 + k * 0.025, 0.004 - k * 0.012]} c="#d8c8a0" ro={0.7} ns />)}
    </group>
    {Array.from({ length: 10 }, (_, i) => { const k = cl((u - 0.68) * 4 + rnd(i) * 0.2); return <Puff key={i} p={[0.3 + (rnd(i, 2) - 0.5) * 0.25 * (1 + k), 0.08 + k * 0.14, 0.35 - (N - 1) * 0.3 + (rnd(i, 5) - 0.5) * 0.18]} s={0.06 + 0.08 * k} c="#e8d0a0" o={0.6 * bad * (1 - k)} add={false} />; })}
  </S3>;
}}</Stage>;

// 7 · el olor del garaje: del caño de escape cromado sale humo espeso que se curva por el aire y la rejilla de retorno de la pared lo chupa hacia adentro de la casa
export const HExhaustPullS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), run = win(u, 0.14, 0.26), suck = win(u, 0.3, 0.45);
  const path: V3[] = [[-0.36, 0.22, 0.1], [-0.12, 0.3, 0.14], [0.12, 0.48, 0.05], [0.36, 0.6, -0.22], [0.5, 0.62, -0.55]];
  return <S3 p={[lerp(0.02, -0.05, u), 0.55, 1.45]} l={[0.05, 0.42, -0.2]} fov={40} floor={null}>
    <Bx s={[8, 4, 0.05]} p={[0, 1.3, -0.6]} map={PLASTER()} c="#b8b0a2" ro={0.95} ns />
    <Bx s={[6, 0.06, 3]} p={[0, -0.03, 0]} c="#8a8780" ro={0.9} ns />
    <group position={[0.5, 0.62, -0.57]}>
      <Bx s={[0.46, 0.34, 0.03]} c="#d8dadc" m={0.5} ro={0.4} rad={0.01} />
      <Bx s={[0.42, 0.3, 0.01]} p={[0, 0, 0.01]} c="#101214" />
      {Array.from({ length: 8 }, (_, k) => <Bx key={k} s={[0.41, 0.014, 0.025]} p={[0, -0.13 + k * 0.037, 0.02]} r={[0.5, 0, 0]} c="#c8ccd0" m={0.6} ro={0.35} ns />)}
    </group>
    <Bx s={[0.5, 0.14, 0.4]} p={[-0.95, 0.3, 0.1]} c="#2a2a2c" ro={0.5} rad={0.03} />
    <Cy rt={0.035} h={0.5} p={[-0.62, 0.22, 0.1]} r={[0, 0, Math.PI / 2]} c="#6a6e72" m={0.9} ro={0.35} />
    <Cy rt={0.058} rb={0.048} h={0.16} p={[-0.37, 0.22, 0.1]} r={[0, 0, Math.PI / 2]} c="#e8ecef" m={1} ro={0.12} />
    <To R={0.054} t={0.008} p={[-0.29, 0.22, 0.1]} r={[0, Math.PI / 2, 0]} c="#f2f4f6" m={1} ro={0.1} />
    <Cy rt={0.048} h={0.004} p={[-0.288, 0.22, 0.1]} r={[0, 0, Math.PI / 2]} c="#0a0a0a" />
    {Array.from({ length: 34 }, (_, i) => { const k = (tt * 0.28 + i / 34) % 1, q = along(path, Math.min(1, k * 1.05)), w = (rnd(i) - 0.5) * 0.08 * Math.sin(k * Math.PI);
      const sz = (0.06 + 0.17 * Math.sin(Math.min(1, k * 1.25) * Math.PI * 0.8)) * (k > 0.8 ? Math.max(0, (1 - k) / 0.2) : 1);
      return <Puff key={i} p={[q[0] + w, q[1] + w, q[2]]} s={sz} c={k < 0.3 ? "#3a3a38" : "#5a5a56"} o={0.92 * run * (k < 0.05 ? k / 0.05 : 1) * (k > 0.6 ? 0.6 + 0.4 * suck : 1)} add={false} />; })}
  </S3>;
}}</Stage>;

const gaugeTx = () => canvasTex("gaugeD3", 512, 512, (g) => {
  g.fillStyle = "#f2eee4"; g.beginPath(); g.arc(256, 256, 250, 0, Math.PI * 2); g.fill();
  const arc = (a0: number, a1: number, c: string) => { g.strokeStyle = c; g.lineWidth = 44; g.beginPath(); g.arc(256, 256, 190, a0, a1); g.stroke(); };
  arc(Math.PI * 0.75, Math.PI * 1.5, "#3aa84a"); arc(Math.PI * 1.5, Math.PI * 1.95, "#e8b020"); arc(Math.PI * 1.95, Math.PI * 2.25, "#d8302a");
  g.fillStyle = "#222"; for (let i = 0; i <= 12; i++) { const a = Math.PI * 0.75 + (i / 12) * Math.PI * 1.5; g.fillRect(256 + 150 * Math.cos(a) - 4, 256 + 150 * Math.sin(a) - 4, 8, 8); }
});
// 8 · cerrás rejillas y sube la presión: las lamas de la rejilla se cierran una por una, la aguja del manómetro va al rojo y la unión del ducto escupe un chorro de aire
export const HPressureS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.14), sh = (k: number) => sm(win(u, 0.16 + k * 0.03, 0.24 + k * 0.03)), shut = sh(5), pr = sm(win(u, 0.34, 0.6)), spurt = win(u, 0.56, 0.64), ang = lerp(0.75, 2.15, pr) * Math.PI + Math.sin(tt * 40) * 0.02 * pr;
  return <S3 p={[lerp(0.15, 0.05, u), 0.62, 1.85]} l={[0.1, 0.48, 0]} fov={38} floor={null}>
    <Wall c="#6a7078" z={-0.5} /><Table c="#5e4a38" />
    <group position={[0, 1.2 * (1 - a), 0]}>
      <Bx s={[0.62, 0.22, 0.24]} p={[-0.45, 0.4, 0]} c={MET} m={0.75} ro={0.3} rad={0.01} />
      <Bx s={[0.5, 0.22, 0.24]} p={[0.14, 0.4, 0]} c={MET} m={0.75} ro={0.3} rad={0.01} />
      <Bx s={[0.05, 0.25, 0.27]} p={[-0.125, 0.4, 0]} c="#9aa0a6" m={0.8} ro={0.3} rad={0.006} />
      <Bx s={[0.3, 0.42, 0.3]} p={[0.55, 0.4, 0]} c={MET} m={0.75} ro={0.3} rad={0.01} />
      <Bx s={[0.4, 0.4, 0.03]} p={[0.55, 0.4, 0.16]} c="#e2e4e6" m={0.4} ro={0.4} rad={0.012} />
      <Bx s={[0.34, 0.34, 0.01]} p={[0.55, 0.4, 0.168]} c="#2a1408" e="#ff8a3a" ei={1.4 * (1 - shut)} />
      {Array.from({ length: 6 }, (_, k) => <Bx key={k} s={[0.34, 0.056, 0.008]} p={[0.55, 0.255 + k * 0.058, 0.185]} r={[1.35 * (1 - sh(k)), 0, 0]} c="#d8dce0" m={0.6} ro={0.3} />)}
      <pointLight position={[0.55, 0.4, 0.35]} intensity={1.2 * (1 - shut)} distance={0.6} color="#ff9a4a" />
      <Cy rt={0.03} h={0.1} p={[-0.2, 0.56, 0.0]} c="#9aa0a6" m={0.8} ro={0.3} />
      <group position={[-0.2, 0.78, 0.0]}>
        <Cy rt={0.17} h={0.05} r={[Math.PI / 2, 0, 0]} c="#c8ccd0" m={0.8} ro={0.25} />
        <Pl w={0.3} h={0.3} p={[0, 0, 0.027]} map={gaugeTx()} c="#ffffff" ro={0.5} ns />
        <group position={[0, 0, 0.034]} rotation={[0, 0, -(ang - Math.PI * 0.5) + Math.PI]}><Bx s={[0.012, 0.12, 0.006]} p={[0, 0.055, 0]} c="#c8201a" ro={0.4} ns /></group>
        <Cy rt={0.015} h={0.02} p={[0, 0, 0.036]} r={[Math.PI / 2, 0, 0]} c="#222" />
      </group>
    </group>
    {Array.from({ length: 28 }, (_, i) => { const k = (tt * 0.9 + i / 28) % 1, sd = i % 2 ? 1 : -1; return <Puff key={i} p={[-0.125 + (rnd(i) - 0.5) * 0.1 * (1 + k), 0.4 + sd * (0.12 + k * 0.3), 0.14 + k * 0.32]} s={0.12 + k * 0.3} c="#ffffff" o={0.95 * spurt * Math.sin(k * Math.PI)} add={false} />; })}
  </S3>;
}}</Stage>;

const rugTx = () => canvasTex("rugD3", 512, 384, (g) => {
  g.fillStyle = "#8a2a24"; g.fillRect(0, 0, 512, 384); g.strokeStyle = "#e0c08a"; g.lineWidth = 14; g.strokeRect(28, 28, 456, 328);
  g.strokeStyle = "#1e3a5a"; g.lineWidth = 10; g.strokeRect(62, 62, 388, 260);
  g.fillStyle = "#e0c08a"; g.beginPath(); g.moveTo(256, 110); g.lineTo(360, 192); g.lineTo(256, 274); g.lineTo(152, 192); g.closePath(); g.fill();
  g.fillStyle = "#1e3a5a"; g.beginPath(); g.moveTo(256, 150); g.lineTo(310, 192); g.lineTo(256, 234); g.lineTo(202, 192); g.closePath(); g.fill();
});
// 9 · la alfombra sobre la rejilla: un chorro espeso de aire tibio sube de la rejilla del piso hasta que la alfombra cae encima con peso y lo ahoga
export const HRugVentS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), fall = drop(u, 0.38, 0.52), land = win(u, 0.5, 0.56), air = 1 - win(u, 0.49, 0.56);
  return <S3 p={[lerp(0.15, 0.05, u), 1.15, 1.35]} l={[0, 0.1, -0.1]} fov={38} floor={null}>
    <Bx s={[6, 0.06, 4]} p={[0, -0.03, 0]} map={PLANKS()} c="#b07c4e" ro={0.55} ns />
    <Bx s={[8, 4, 0.05]} p={[0, 1.3, -1.1]} map={PLASTER()} c="#d8ccb8" ro={0.95} ns />
    <Grille p={[0, 0, 0]} w={0.36} d={0.16} />
    <Bx s={[0.32, 0.004, 0.12]} p={[0, 0.003, 0]} c="#2a1408" e="#ff7a2a" ei={1.6 * air} ns />
    <pointLight position={[0, 0.25, 0.05]} intensity={1.6 * air} distance={0.9} color="#ff9a4a" />
    {u > 0.36 && <group position={[0.08, 0.012 + 0.9 * (1 - fall), 0.02]} rotation={[0.18 * (1 - fall), 0.2 * (1 - fall), 0.12 * (1 - fall)]}>
      <Bx s={[1.1, 0.014, 0.8]} p={[0, 0.007, 0]} map={rugTx()} c="#ffffff" ro={0.95} rad={0.003} />
    </group>}
    {u > 0.36 && <Shade p={[0.08, 0.002, 0.02]} w={1.1 * (0.6 + 0.4 * fall)} d={0.8 * (0.6 + 0.4 * fall)} o={0.4 * fall} />}
    {Array.from({ length: 22 }, (_, i) => { const k = (tt * 0.42 + i / 22) % 1; return <Puff key={i} p={[(rnd(i) - 0.5) * 0.24 * (1 + k), 0.04 + k * 0.75, (rnd(i, 3) - 0.5) * 0.12 * (1 + k)]} s={0.1 + k * 0.24} c={k < 0.35 ? "#ff8a3a" : "#ffb070"} o={0.85 * air * Math.sin(k * Math.PI)} add={false} />; })}
    {Array.from({ length: 10 }, (_, i) => { const k = cl((u - 0.5) * 6 + rnd(i) * 0.1), an = (i / 10) * Math.PI * 2; return <Puff key={`d${i}`} p={[0.08 + Math.cos(an) * (0.55 + 0.15 * k), 0.02 + 0.06 * k, 0.02 + Math.sin(an) * (0.42 + 0.12 * k)]} s={0.04 + 0.05 * k} c="#d8ccb8" o={0.6 * land * (1 - k)} add={false} />; })}
  </S3>;
}}</Stage>;

// 10 · el metal es un radiador: el calor naranja avanza bloque por bloque por el ducto largo y se va enfriando a azul; el termostato del final marca cada vez menos
export const HDuctFadeS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), N = 10, run = cl((u - 0.14) / 0.56) * N, deg = Math.round(lerp(120, 85, cl((run - 1) / (N - 1))));
  const col = (k: number) => { const r = Math.round(lerp(255, 60, k)), g = Math.round(lerp(100, 150, k)), b = Math.round(lerp(20, 255, k)); return `rgb(${r},${g},${b})`; };
  return <S3 p={[-0.15, 0.72, 2.05]} l={[-0.15, 0.5, 0]} fov={40} floor={null}>
    <Wall c="#5a5650" z={-0.6} /><Table c="#5a4632" />
    <Furnace p={[-1.2, 0, -0.05]} s={0.55} glow={0.8} />
    {Array.from({ length: N }, (_, i) => { const k = i / (N - 1), on = cl(run - i), pop = bump(run / N, (i + 0.02) / N, 60, 30); return <Bx key={i} s={[0.17, 0.18 * (1 + 0.15 * pop), 0.2 * (1 + 0.15 * pop)]} p={[-0.92 + i * 0.17, 0.45, -0.05]} c={MET} m={0.6} ro={0.35} e={col(k)} ei={1.8 * sm(on)} />; })}
    {Array.from({ length: N - 1 }, (_, i) => <Bx key={i} s={[0.012, 0.19, 0.21]} p={[-0.835 + i * 0.17, 0.45, -0.05]} c="#8a9096" m={0.8} ro={0.3} ns />)}
    {Array.from({ length: 12 }, (_, i) => { const k = (tt * 0.3 + i / 12) % 1, bi = Math.floor(rnd(i) * N), lit = cl(run - bi), kk = bi / (N - 1); return <Puff key={i} p={[-0.92 + bi * 0.17, 0.56 + k * 0.35, -0.05]} s={0.05 + k * 0.08} c={col(kk)} o={0.45 * lit * (1 - 0.7 * kk) * Math.sin(k * Math.PI)} add={false} />; })}
    <Bx s={[0.08, 0.18, 0.2]} p={[0.65, 0.45, -0.05]} c={MET} m={0.6} ro={0.35} />
    <Thermo3 v={`${deg}°`} p={[0.92, 0.62, -0.05]} s={1.05} glow={0.4} />
  </S3>;
}}</Stage>;

// 13 · un corazón con las venas cortadas: el furnace late y empuja el aire por el ducto, pero en el corte el aire se derrama afuera
export const HDuctGapS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.14), cut = sm(win(u, 0.22, 0.36)), beat = Math.max(0, Math.sin(tt * 5.5)) ** 4, spill = win(u, 0.34, 0.44);
  return <S3 p={[lerp(0.1, 0.25, u), 0.8, 2.1]} l={[0.2, 0.5, 0]} fov={38} floor={null}>
    <Wall c="#5e5852" z={-0.6} /><Table c="#5a4632" />
    <Shade p={[-0.7, 0.003, 0]} w={0.6} d={0.5} o={0.5 * a} />
    <group position={[-0.7, 1.2 * (1 - a), 0]} scale={1 + 0.03 * beat}><Furnace p={[0, 0, 0]} s={0.75} glow={0.4 + 0.6 * beat} />
      <group position={[0, 0.5, 0.2]} scale={0.9 + 0.25 * beat}><Sp rad={0.07} p={[-0.05, 0.03, 0]} c="#c8201a" e="#ff2a1a" ei={0.3 + 0.9 * beat} ro={0.35} /><Sp rad={0.07} p={[0.05, 0.03, 0]} c="#c8201a" e="#ff2a1a" ei={0.3 + 0.9 * beat} ro={0.35} /><mesh position={[0, -0.05, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.105, 0.14, 24]} /><meshStandardMaterial color="#c8201a" emissive="#ff2a1a" emissiveIntensity={0.3 + 0.9 * beat} roughness={0.35} /></mesh></group></group>
    <Bx s={[0.62, 0.2, 0.22]} p={[-0.14, 0.8, 0]} c={MET} m={0.75} ro={0.3} rad={0.01} />
    <Bx s={[0.6, 0.2, 0.22]} p={[0.48 + 0.1 * cut, 0.8 - 0.03 * cut, 0]} r={[0, 0, -0.05 * cut]} c={MET} m={0.75} ro={0.3} rad={0.01} />
    <pointLight position={[0.22, 0.8, 0.3]} intensity={1.6 * spill * (0.6 + 0.4 * beat)} distance={1.0} color="#ff8a3a" />
    
    {Array.from({ length: 12 }, (_, i) => { const k = (tt * 0.45 + i / 12) % 1; return <Puff key={i} p={[0.2 + (rnd(i) - 0.5) * 0.25 * (1 + k), 0.8 - k * 0.55 + Math.sin(k * 3) * 0.15, 0.1 + k * 0.2]} s={0.1 + k * 0.2} c="#ff7a2a" o={0.85 * spill * Math.sin(k * Math.PI) * (0.6 + 0.4 * beat)} add={false} />; })}
  </S3>;
}}</Stage>;

// 17 · el hueco alrededor de la bota: la rejilla se levanta, el anillo de hueco entre la bota y el piso brilla de aire frío y un rollo de cinta de aluminio corre alrededor sellándolo lado por lado
export const HBootSealS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), lift = sm(win(u, 0.08, 0.24)) * (1 - sm(win(u, 0.84, 0.96))), tape = (i: number) => sm(win(u, 0.46 + i * 0.08, 0.54 + i * 0.08)), gap = win(u, 0.18, 0.26) * (1 - win(u, 0.8, 0.86));
  const W = 0.36, D = 0.18, gw = 0.05, rl = win(u, 0.4, 0.46) * (1 - win(u, 0.78, 0.82));
  // recorrido del rollo: frente (izq→der), derecha (adelante→atrás), fondo (der→izq), izquierda (atrás→adelante)
  const X = W / 2 + gw / 2, Z = D / 2 + gw / 2;
  const seg = Math.min(3, Math.floor(cl((u - 0.46) / 0.32) * 4)), sp = tape(seg);
  const roll: V3 = seg === 0 ? [lerp(-X, X, sp), 0.05, Z] : seg === 1 ? [X, 0.05, lerp(Z, -Z, sp)] : seg === 2 ? [lerp(X, -X, sp), 0.05, -Z] : [-X, 0.05, lerp(-Z, Z, sp)];
  const strips: [number, number, number, number, boolean, number][] = [[0, Z, W + 2 * gw + 0.04, gw + 0.05, true, 1], [X, 0, gw + 0.05, D + 2 * gw, false, 1], [0, -Z, W + 2 * gw + 0.04, gw + 0.05, true, -1], [-X, 0, gw + 0.05, D + 2 * gw, false, -1]];
  return <S3 p={[lerp(0.08, 0.02, u), 0.85, 0.72]} l={[0, 0.0, -0.04]} fov={38} floor={null}>
    <Bx s={[8, 4, 0.05]} p={[0, 1.3, -1.0]} map={PLASTER()} c="#d8ccb8" ro={0.95} ns />
    {[[0, -D / 2 - gw - 0.6, 3, 1.2], [0, D / 2 + gw + 0.6, 3, 1.2], [-W / 2 - gw - 0.6, 0, 1.2, D + 2 * gw], [W / 2 + gw + 0.6, 0, 1.2, D + 2 * gw]].map(([x, z, w, d], i) =>
      <Bx key={i} s={[w, 0.05, d]} p={[x, -0.025, z]} map={PLANKS()} c="#b07c4e" ro={0.55} ns />)}
    <Bx s={[W, 0.2, D]} p={[0, -0.13, 0]} c="#8a9096" m={0.7} ro={0.35} />
    <Bx s={[W - 0.04, 0.01, D - 0.04]} p={[0, -0.04, 0]} c="#1a1c1e" />
    {[[0, Z, W + 2 * gw, gw], [X, 0, gw, D], [0, -Z, W + 2 * gw, gw], [-X, 0, gw, D]].map(([x, z, w, d], i) =>
      <Bx key={i} s={[w, 0.01, d]} p={[x, -0.002, z]} c="#0a2a6a" e="#1a6aff" ei={1.6 * gap * (1 - tape(i))} ns />)}
    {strips.map(([x, z, w, d, hz, dir], i) => { const k = tape(i); if (k < 0.02) return null;
      return <Bx key={i} s={[hz ? w * k : w, 0.008, hz ? d : d * k]} p={[hz ? x - dir * (w * (1 - k)) / 2 : x, 0.008 + i * 0.0006, hz ? z : z + dir * (d * (1 - k)) / 2]} c="#f4f6f8" e="#c8d0d8" ei={0.25} m={1} ro={0.08} ns />; })}
    {rl > 0.02 && <group position={roll} scale={rl} rotation={[0, seg % 2 ? Math.PI / 2 : 0, 0]}>
      <To R={0.05} t={0.022} r={[0, Math.PI / 2, 0]} c="#e8ecef" m={1} ro={0.12} />
      <Cy rt={0.03} h={0.044} r={[0, 0, Math.PI / 2]} c="#c8a878" ro={0.8} />
    </group>}
    {Array.from({ length: 10 }, (_, i) => { const k = (tt * 0.6 + i / 10) % 1, sd = i % 4; const x = sd === 3 ? -X : sd === 1 ? X : (rnd(i) - 0.5) * W, z = sd === 2 ? -Z : sd === 0 ? Z : (rnd(i) - 0.5) * D;
      return <Puff key={i} p={[x, 0.02 + k * 0.25, z]} s={0.05 + k * 0.08} c="#9fd4ff" o={0.8 * gap * (1 - tape(sd)) * Math.sin(k * Math.PI)} add={false} />; })}
    <pointLight position={[0, 0.12, 0]} intensity={0.8 * gap * (1 - tape(3))} distance={0.6} color="#3a8aff" />
    <group position={[0, 0.006 + 0.32 * lift, 0.06 * lift]} rotation={[-0.5 * lift, 0, 0]}><Grille p={[0, 0, 0]} w={W + 0.08} d={D + 0.08} /></group>
  </S3>;
}}</Stage>;

// 18 · el arreglo de $4: caen el rollo de cinta de aluminio, el pomo de sellador y el tachito de masilla; el contador marca $4
export const HFourDollarS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), d1 = drop(u, 0.06, 0.2), d2 = drop(u, 0.2, 0.34), d3 = drop(u, 0.34, 0.48), od = drop(u, 0.52, 0.64);
  return <S3 p={[lerp(0.06, -0.02, u), 0.5, 1.2]} l={[0, 0.28, 0]} fov={36} floor={null}>
    <Wall c="#4a5258" z={-0.7} /><Table c="#7a5a3e" />
    <Shade p={[-0.42, 0.003, 0.05]} w={0.3} d={0.22} o={0.5 * d1} /><Shade p={[0, 0.003, 0.05]} w={0.36} d={0.16} o={0.5 * d2} /><Shade p={[0.42, 0.003, 0.05]} w={0.3} d={0.26} o={0.5 * d3} />
    <group position={[-0.42, 0.1 + 0.9 * (1 - d1), 0.05]} rotation={[0, 0.3, 0]}>
      <To R={0.085} t={0.04} c="#dfe3e6" m={0.95} ro={0.2} /><Cy rt={0.05} h={0.075} r={[Math.PI / 2, 0, 0]} c="#c8a878" ro={0.8} />
    </group>
    <group position={[0, 0.05 + 0.9 * (1 - d2), 0.05]} rotation={[0, 0.2, Math.PI / 2]}>
      <Cy rt={0.045} h={0.26} c="#f2f0ea" ro={0.5} /><Cy rt={0.045} h={0.02} p={[0, 0.13, 0]} c="#c8302a" ro={0.4} />
      <mesh position={[0, 0.2, 0]}><coneGeometry args={[0.022, 0.12, 16]} /><meshStandardMaterial color="#f2f0ea" roughness={0.5} /></mesh>
      <Cy rt={0.047} h={0.012} p={[0, -0.13, 0]} c="#6a6e72" m={0.8} ro={0.3} />
    </group>
    <group position={[0.42, 0.9 * (1 - d3), 0.05]}>
      <Cy rt={0.1} rb={0.09} h={0.16} p={[0, 0.08, 0]} c="#7a8088" m={0.3} ro={0.5} /><Cy rt={0.105} h={0.02} p={[0, 0.17, 0]} c="#4a5058" ro={0.5} />
      <Bx s={[0.12, 0.06, 0.005]} p={[0, 0.09, 0.097]} c="#e8b020" ro={0.6} ns />
    </group>
    {u > 0.5 && <group position={[0, 0.46 + 0.5 * (1 - od), 0]} scale={1.2 * (1 + 0.1 * bump(u, 0.64, 30, 10))}><Odo v={4} n={1} pre="$" /></group>}
  </S3>;
}}</Stage>;

// 19 · el hueco del filtro: una nube de polvo entra por la ranura del filtro mal puesto; el filtro se empuja hasta el fondo, la ranura se cierra en verde y el polvo queda afuera
export const HFilterSlotS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.14), push = sm(win(u, 0.46, 0.6)), dust = win(u, 0.14, 0.24), ok = win(u, 0.6, 0.66), gapX = 0.165;
  return <S3 p={[lerp(0.85, 0.72, u), 0.72, 1.4]} l={[0.25, 0.42, 0]} fov={38} floor={null}>
    <Wall c="#6a6460" z={-0.6} /><Table c="#5a4632" />
    <Shade p={[-0.15, 0.003, 0]} w={0.7} d={0.6} o={0.5 * a} />
    <group position={[-0.15, 1.2 * (1 - a), 0]}>
      <Bx s={[0.6, 1.0, 0.5]} p={[0, 0.5, 0]} c="#7e858c" m={0.35} ro={0.45} rad={0.025} />
      <Bx s={[0.62, 0.05, 0.52]} p={[0, 0.36, 0]} c="#5a6066" m={0.4} ro={0.4} />
      <Bx s={[0.012, 0.06, 0.46]} p={[0.312, 0.36, 0]} c="#0a0a0a" e="#2aff5a" ei={1.6 * ok} />
    </group>
    <pointLight position={[0.4, 0.4, 0.1]} intensity={0.9 * ok} distance={0.5} color="#3aff6a" />
    <Filt w={0.44} h={0.44} d={0.045} g={0.4} frame="#c8a050" p={[lerp(0.42, 0.0, push) - 0.15, 0.36, 0]} r={[-Math.PI / 2, 0, 0]} />
    {Array.from({ length: 36 }, (_, i) => { const k = (tt * 0.45 + rnd(i)) % 1, open = push < 0.92, x = lerp(1.0, open ? 0.05 : gapX + 0.25, k), y = 0.36 + (rnd(i, 5) - 0.5) * 0.18 * (open ? 1 - 0.7 * k : 1) - (!open ? 0.25 * k * k : 0), z = (rnd(i, 3) - 0.5) * 0.36;
      const fade = open && x < gapX + 0.02 ? 0 : 1;
      return <Puff key={i} p={[x, y, z]} s={0.07 + 0.06 * rnd(i, 9)} c="#cdbb98" o={0.95 * dust * fade * Math.sin(Math.min(1, k * 1.2) * Math.PI * 0.9 + 0.3)} add={false} />; })}
  </S3>;
}}</Stage>;

// 21 · ¿lo puedo hacer yo?: la caja de herramientas se abre y saltan, una por una, el destornillador, la cinta de aluminio, la cinta métrica y la linterna
export const HToolboxS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.14), lid = sm(win(u, 0.16, 0.3)), up = (i: number) => drop(u, 0.3 + i * 0.1, 0.42 + i * 0.1);
  const slot = (i: number): V3 => [(-0.27 + i * 0.18), 0.3 + 0.28 * up(i), 0.02];
  return <S3 p={[lerp(0.1, 0.0, u), 0.7, 1.6]} l={[0, 0.4, 0]} fov={38} floor={null}>
    <Wall c="#4e5a64" z={-0.6} /><Table c="#7a5a3e" />
    <Shade p={[0, 0.003, 0]} w={0.8} d={0.4} o={0.5 * a} />
    <group position={[0, 1.2 * (1 - a), 0]}>
      <Bx s={[0.7, 0.26, 0.3]} p={[0, 0.13, 0]} c="#c8241e" m={0.3} ro={0.35} rad={0.02} />
      <Bx s={[0.66, 0.02, 0.26]} p={[0, 0.25, 0]} c="#1a1a1a" ro={0.8} />
      <group position={[0, 0.26, -0.15]} rotation={[-1.9 * lid, 0, 0]}>
        <Bx s={[0.7, 0.04, 0.3]} p={[0, 0.02, 0.15]} c="#c8241e" m={0.3} ro={0.35} rad={0.02} />
        <Bx s={[0.22, 0.03, 0.03]} p={[0, 0.05, 0.15]} c="#2a2a2a" ro={0.4} />
      </group>
      {[-0.32, 0.32].map((x, i) => <Bx key={i} s={[0.02, 0.06, 0.04]} p={[x, 0.2, 0.152]} c="#d8dadc" m={0.9} ro={0.2} />)}
    </group>
    {up(0) > 0.02 && <group position={slot(0)} rotation={[0, 0, 0.25]}><Cy rt={0.022} h={0.12} p={[0, -0.04, 0]} c="#e8c020" ro={0.4} /><Cy rt={0.007} h={0.16} p={[0, 0.1, 0]} c="#c8ccd0" m={1} ro={0.2} /></group>}
    {up(1) > 0.02 && <group position={slot(1)} rotation={[0.2, 0, 0]}><To R={0.06} t={0.028} c="#dfe3e6" m={0.95} ro={0.2} /></group>}
    {up(2) > 0.02 && <group position={slot(2)}><Cy rt={0.06} h={0.05} r={[Math.PI / 2, 0, 0]} c="#f0c020" ro={0.4} /><Bx s={[0.08, 0.012, 0.015]} p={[0.05, -0.05, 0.02]} c="#e8e0a0" ro={0.5} /></group>}
    {up(3) > 0.02 && <group position={slot(3)} rotation={[0, 0, -0.3]}><Cy rt={0.022} h={0.15} c="#2a2a2a" ro={0.4} /><Cy rt={0.03} rb={0.022} h={0.04} p={[0, 0.09, 0]} c="#3a3a3a" ro={0.4} /><Cy rt={0.027} h={0.005} p={[0, 0.112, 0]} c="#fff6c0" e="#fff0a0" ei={1.5} /></group>}
  </S3>;
}}</Stage>;

const checkTx = () => canvasTex("checkD3", 512, 224, (g) => {
  g.fillStyle = "#e6f0e2"; g.fillRect(0, 0, 512, 224); g.strokeStyle = "#7a9a7a"; g.lineWidth = 6; g.strokeRect(6, 6, 500, 212);
  g.fillStyle = "#2a4a2a"; g.font = BOLD(56); g.textAlign = "left"; g.fillText("REBATE", 30, 66);
  g.fillStyle = "#ffffff"; g.fillRect(320, 84, 160, 52); g.strokeStyle = "#2a4a2a"; g.lineWidth = 3; g.strokeRect(320, 84, 160, 52);
  g.fillStyle = "#2a4a2a"; g.font = BOLD(36); g.fillText("$", 332, 124);
  for (let i = 0; i < 2; i++) g.fillRect(30, 120 + i * 46, 240 - i * 60, 5);
  g.fillRect(320, 180, 160, 4);
});
// 22 · el reembolso de la compañía: llega el sobre, se abre la solapa y sube el cheque del reembolso
export const HUtilityCheckS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.16), flap = sm(win(u, 0.2, 0.34)), rise = sm(win(u, 0.4, 0.66)), tilt = sm(win(u, 0.56, 0.76));
  return <S3 p={[lerp(0.05, -0.02, u), 0.6, 1.05]} l={[0, 0.24, 0]} fov={38} floor={null}>
    <Wall c="#4a5058" z={-0.6} /><Table c="#7a5a3e" />
    <Shade p={[0, 0.003, 0.05]} w={0.6} d={0.36} o={0.5 * a} />
    <group position={[0, 0.01 + 0.8 * (1 - a), 0.05]}>
      <Bx s={[0.52, 0.03, 0.3]} p={[0, 0.015, 0]} c="#f2ead8" ro={0.85} rad={0.006} />
      <group position={[0, 0.032, -0.15]} rotation={[-2.6 * flap, 0, 0]}><Bx s={[0.52, 0.004, 0.16]} p={[0, 0, 0.08]} c="#e6dcc6" ro={0.85} /></group>
    </group>
    <group position={[0, 0.03 + 0.28 * rise, 0.05 - 0.1 * rise + 0.1 * tilt]} rotation={[-Math.PI / 2 + (Math.PI / 2 - 0.15) * tilt, 0, 0]} scale={(0.95 + 0.05 * bump(u, 0.76, 30, 10)) * (0.6 + 0.4 * rise)}>
      <Pl w={0.5} h={0.22} map={checkTx()} c="#ffffff" ro={0.7} />
    </group>
  </S3>;
}}</Stage>;

// 24 · cómo huele y se siente la casa: en el crawl space la humedad sube de la tierra hasta que el plástico se desenrolla y la tapa
export const HCrawlPlasticS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), roll = sm(win(u, 0.3, 0.72)), edge = lerp(-0.95, 0.95, roll);
  return <S3 p={[lerp(0.1, 0.0, u), 0.62, 1.7]} l={[0, 0.22, -0.2]} fov={40} floor={null}>
    <Bx s={[6, 0.06, 4]} p={[0, -0.03, 0]} c="#5a4430" ro={1} ns />
    {Array.from({ length: 30 }, (_, i) => <Sp key={i} rad={0.02 + rnd(i) * 0.03} p={[-1.2 + rnd(i, 2) * 2.4, 0.0, -0.6 + rnd(i, 3) * 1.2]} c="#4a3624" ro={1} ns />)}
    <Bx s={[8, 1.2, 0.05]} p={[0, 0.5, -0.8]} c="#8a8a84" ro={0.95} ns />
    {Array.from({ length: 6 }, (_, i) => <Bx key={i} s={[0.07, 0.16, 2.2]} p={[-1.0 + i * 0.4, 0.78, -0.2]} c="#a8784e" ro={0.7} />)}
    <Bx s={[3, 0.03, 2.2]} p={[0, 0.88, -0.2]} c="#7a5a3e" ro={0.8} ns />
    {roll > 0.01 && <Pl w={edge + 1.0} h={1.3} p={[(edge - 1.0) / 2 + 0.0, 0.012, -0.05]} r={[-Math.PI / 2, 0, 0]} c="#eef4f6" o={0.85} ro={0.08} m={0.25} />}
    {roll > 0.01 && roll < 0.99 && <Cy rt={0.05} h={1.3} p={[edge, 0.05, -0.05]} r={[Math.PI / 2, 0, 0]} c="#dfe6ea" ro={0.2} />}
    {Array.from({ length: 22 }, (_, i) => { const x = -1.0 + rnd(i) * 2.0, k = (tt * 0.22 + rnd(i, 2)) % 1, cov = x < edge ? 0 : 1; return <Steam key={i} p={[x, 0.05 + k * 0.55, -0.55 + rnd(i, 4) * 0.9]} r={0.08 + k * 0.14} c="#dfeaf0" o={0.45 * cov * Math.sin(k * Math.PI)} />; })}
  </S3>;
}}</Stage>;

// 25 · se sacó el gorro: el gorro de lana sale de la cabeza del maniquí y cae sobre la mesa; el termostato de la pared marca 70
export const HKnitHatS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.14), off = sm(win(u, 0.3, 0.5)), land = drop(u, 0.48, 0.62), th = Math.round(lerp(58, 70, win(u, 0.1, 0.4)));
  const hx = lerp(-0.25, 0.22, off), hy = u < 0.48 ? lerp(0.52, 0.9, Math.sin(off * Math.PI)) + (u > 0.3 ? 0.23 * win(u, 0.4, 0.48) : 0) : lerp(0.75, 0.0, land), rz = lerp(0, -0.5, off) * (1 - land) + 0.3 * land;
  return <S3 p={[lerp(0.08, -0.02, u), 0.6, 1.7]} l={[0, 0.42, 0]} fov={36} floor={null}>
    <Wall c="#c8b8a0" z={-0.5} /><Table c="#8a6440" />
    <RoundThermo deg={th} p={[0.4, 0.62, -0.45]} s={1.6} />
    <Shade p={[-0.25, 0.003, 0]} w={0.3} d={0.25} o={0.5 * a} />
    <group position={[-0.25, 1.0 * (1 - a), 0]}>
      <Cy rt={0.05} rb={0.09} h={0.3} p={[0, 0.15, 0]} c="#3a3a3a" ro={0.5} />
      <Sp rad={0.13} p={[0, 0.48, 0]} sc={[1, 1.15, 1]} c="#efe4d4" ro={0.6} />
    </group>
    <group position={[hx, hy + (u < 0.3 ? 1.0 * (1 - a) : 0), 0]} rotation={[0, 0, rz]}>
      <mesh position={[0, 0.0, 0]}><sphereGeometry args={[0.15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#c8302a" roughness={0.95} side={2} /></mesh>
      {[0.02, 0.05].map((y, i) => <To key={i} R={0.148} t={0.018} p={[0, y, 0]} r={[Math.PI / 2, 0, 0]} c="#a82420" ro={1} />)}
      {Array.from({ length: 12 }, (_, i) => <Bx key={i} s={[0.01, 0.07, 0.008]} p={[Math.sin((i / 12) * Math.PI * 2) * 0.152, 0.11, Math.cos((i / 12) * Math.PI * 2) * 0.152]} r={[0, (i / 12) * Math.PI * 2, 0]} c="#e8e0d0" ro={1} ns />)}
      <Sp rad={0.05} p={[0, 0.16, 0]} c="#f2ece2" ro={1} />
    </group>
  </S3>;
}}</Stage>;

const clipTx = (k: number) => canvasTex(`clipD3|${k}`, 384, 512, (g) => {
  g.fillStyle = "#fbfaf5"; g.fillRect(0, 0, 384, 512);
  for (let i = 0; i < 12; i++) { const cx = i < 6 ? 20 : 200, y = 30 + (i % 6) * 80; g.strokeStyle = "#2a2a2a"; g.lineWidth = 6; g.strokeRect(cx, y, 50, 50); g.fillStyle = "#9a9a9a"; g.fillRect(cx + 62, y + 20, 70 + ((i * 37) % 40), 10);
    if (i < k) { g.strokeStyle = "#1e9a3a"; g.lineWidth = 13; g.beginPath(); g.moveTo(cx + 4, y + 24); g.lineTo(cx + 22, y + 46); g.lineTo(cx + 60, y - 10); g.stroke(); } }
});
// 26 · la lista de doce: en el portapapeles se van tildando en verde los doce pasos, uno por uno
export const HChecklistS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0, 0.12), k = Math.floor(lerp(0, 12.99, win(u, 0.14, 0.9)));
  return <S3 p={[lerp(0.04, -0.02, u), 0.66, 0.5]} l={[0, 0.0, -0.02]} fov={38} floor={null}>
    <Wall c="#4a5258" z={-0.8} /><Table c="#7a5a3e" />
    <Shade p={[0, 0.003, 0]} w={0.5} d={0.6} o={0.5 * a} />
    <group position={[0, 0.012 + 0.8 * (1 - a), 0]} rotation={[0, 0.05, 0]}>
      <Bx s={[0.42, 0.012, 0.58]} p={[0, 0, 0]} c="#a87a4a" ro={0.6} rad={0.01} />
      <Pl w={0.36} h={0.48} p={[0, 0.0075, 0.02]} r={[-Math.PI / 2, 0, 0]} map={clipTx(k)} c="#ffffff" ro={0.85} />
      <Bx s={[0.16, 0.03, 0.06]} p={[0, 0.018, -0.25]} c="#c8ccd0" m={1} ro={0.2} rad={0.008} />
    </group>
  </S3>;
}}</Stage>;

const signTx = (s: string) => canvasTex(`signD3|${s}`, 512, 160, (g) => {
  g.fillStyle = "#c89a5a"; g.fillRect(0, 0, 512, 160); g.strokeStyle = "#7a5a32"; g.lineWidth = 10; g.strokeRect(5, 5, 502, 150);
  g.fillStyle = "#2a1e12"; g.font = BOLD(s.length > 8 ? 52 : 74); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 256, 84);
});
// 27 · ¿por dónde corren tus ductos?: caen tres carteles de madera — ÁTICO, SÓTANO, CRAWL SPACE — y aparece un globo de comentario
export const HCommentSignsS: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), d = (i: number) => drop(u, 0.06 + i * 0.12, 0.2 + i * 0.12), bub = sm(win(u, 0.56, 0.66)), dots = (i: number) => 0.5 + 0.5 * Math.sin(tt * 6 - i * 1.1);
  const SG = ["ATTIC", "BASEMENT", "CRAWL SPACE"];
  return <S3 p={[lerp(0.06, -0.02, u), 0.58, 1.55]} l={[0, 0.5, 0]} fov={38} floor={null}>
    <Wall c="#5a6a78" z={-0.7} /><Table c="#6a5038" />
    {SG.map((s, i) => { const x = -0.6 + i * 0.6; return <React.Fragment key={i}>
      <Shade p={[x, 0.003, 0]} w={0.3} d={0.18} o={0.5 * d(i)} />
      <group position={[x, 1.2 * (1 - d(i)), 0]} rotation={[0, 0, 0.03 * bump(u, 0.2 + i * 0.12, 30, 8)]}>
        <Cy rt={0.02} h={0.42} p={[0, 0.21, -0.02]} c="#7a5a32" ro={0.8} />
        <Bx s={[0.52, 0.17, 0.03]} p={[0, 0.42, 0]} map={signTx(s)} c="#ffffff" ro={0.8} rad={0.01} />
      </group></React.Fragment>; })}
    {bub > 0.01 && <group position={[0.0, 0.88, 0.1]} scale={1.5 * bub * (1 + 0.1 * bump(u, 0.66, 30, 9))}>
      <Bx s={[0.42, 0.2, 0.05]} c="#ffffff" ro={0.5} rad={0.06} />
      <mesh position={[-0.1, -0.13, 0]} rotation={[0, 0, 0.5]}><coneGeometry args={[0.04, 0.1, 3]} /><meshStandardMaterial color="#ffffff" roughness={0.5} /></mesh>
      {[0, 1, 2].map((i) => <Sp key={i} rad={0.025} p={[-0.09 + i * 0.09, 0.0 + 0.012 * dots(i), 0.03]} c="#3a7ad8" ro={0.4} />)}
    </group>}
  </S3>;
}}</Stage>;
