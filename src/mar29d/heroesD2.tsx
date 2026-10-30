// mar29d · componentes únicos 19-36 (ductos), vuelta 3 en 3D (kit r3k): objeto grande, fondo cerrado, la acción de la idea a la vista en +0,6 s y medio, sin rótulos 3D pegados al borde.
// Registro: D:/rtmp/mar29_COMPONENTES.md
import React from "react";
import { BOLD, Bx, Cy, HANDF, PLANKS, PLASTER, BLOCKS, Pl, Puff, S3 as S3k, Sp, To, Tube, Txt, V3, canvasTex, cl, drop, lerp, lv, rnd, win } from "../kits/r3k/r3k";
import { H, Stage } from "./hkit";

const BG = "radial-gradient(ellipse 80% 70% at 50% 45%, #2a2420, #0a0908 80%)";
// fondo cerrado: pared texturada que llena el cuadro
const Back: React.FC<{ z?: number; c?: string; map?: "p" | "b" | "w"; y?: number }> = ({ z = -0.3, c = "#cdbfa6", map = "p", y = 1 }) =>
  <Bx s={[10, 6, 0.05]} p={[0, y, z]} map={map === "p" ? PLASTER() : map === "b" ? BLOCKS() : PLANKS()} c={c} ro={0.95} ns />;

// cámara más cerca: acerca p hacia l en un factor k (por defecto 0,72; acá siempre k=1 con posiciones explícitas)
const S3: React.FC<React.ComponentProps<typeof S3k> & { k?: number }> = ({ k = 1, p, l, ...r }) =>
  <S3k p={[l[0] + (p[0] - l[0]) * k, l[1] + (p[1] - l[1]) * k, l[2] + (p[2] - l[2]) * k]} l={l} {...r} />;
const U = (tt: number, h: H) => cl(tt / (h.out - h.at));
const bump = (u: number, a: number, f = 26, k = 8) => (u > a ? Math.sin((u - a) * f) * Math.exp(-(u - a) * k) : 0);
const Duct: React.FC<{ p: V3; L: number; R?: number; r?: V3; c?: string; e?: string; ei?: number }> = ({ p, L, R = 0.12, r = [0, 0, Math.PI / 2], c = "#b9bec4", e, ei }) =>
  <Cy rt={R} h={L} p={p} r={r} c={c} m={0.85} ro={0.33} e={e} ei={ei} />;
// curva del flex: n puntos entre a y b con panza "sag" hacia abajo y un pliegue "kink" en el medio
const flex = (a: V3, b: V3, sag: number, kink = 0, n = 24): V3[] => Array.from({ length: n }, (_, i) => { const f = i / (n - 1);
  return [lerp(a[0], b[0], f), lerp(a[1], b[1], f) - Math.sin(f * Math.PI) * sag - Math.exp(-Math.pow((f - 0.5) * 9, 2)) * kink, lerp(a[2], b[2], f)] as V3; });
// ducto flexible acanalado: tubo + anillos perpendiculares a la curva
const Flex: React.FC<{ pts: V3[]; rad: number; c?: string; o?: number; ring?: string }> = ({ pts, rad, c = "#d9d3c4", o = 1, ring = "#a39d8c" }) => <>
  <Tube pts={pts} rad={rad} seg={pts.length * 3} c={c} ro={0.6} o={o} />
  {pts.map((q, i) => { if (i === 0 || i === pts.length - 1) return null; const a = pts[i + 1], b = pts[i - 1], ang = Math.atan2(a[1] - b[1], a[0] - b[0]);
    return <group key={i} position={q} rotation={[0, 0, ang]}><To R={rad} t={rad * 0.15} r={[0, Math.PI / 2, 0]} c={ring} ro={0.5} o={o} /></group>; })}
</>;
// flex translúcido con anillos opacos (se ven las partículas por dentro)
const FlexC: React.FC<{ pts: V3[]; rad: number }> = ({ pts, rad }) => <>
  <Tube pts={pts} rad={rad} seg={pts.length * 3} c="#efe8d6" ro={0.6} o={0.4} />
  {pts.map((q, i) => { if (i === 0 || i === pts.length - 1) return null; const a = pts[i + 1], b = pts[i - 1], ang = Math.atan2(a[1] - b[1], a[0] - b[0]);
    return <group key={i} position={q} rotation={[0, 0, ang]}><To R={rad} t={rad * 0.2} r={[0, Math.PI / 2, 0]} c={i % 2 ? "#8c8573" : "#a39d8c"} ro={0.5} /></group>; })}
</>;
// hélice alrededor de un eje horizontal (x)
const helix = (x0: number, x1: number, y: number, z: number, R: number, turns: number, n: number): V3[] => Array.from({ length: n }, (_, i) => { const f = i / (n - 1), a = f * turns * Math.PI * 2;
  return [lerp(x0, x1, f), y + Math.cos(a) * R, z + Math.sin(a) * R] as V3; });
// texto que se achica hasta entrar en el ancho
const fit = (g: CanvasRenderingContext2D, s: string, px: number, maxW: number, font: (n: number) => string) => { let n = px; g.font = font(n); while (g.measureText(s).width > maxW && n > 10) { n -= 2; g.font = font(n); } };

// 19 · el orden: primero se sellan las uniones (puntos verdes grandes que se encienden uno por uno) y recién después la manta aislante se enrolla en espiral gruesa sobre el ducto
export const HWrapup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), w = win(u, 0.3, 0.88), n = Math.max(2, Math.round(w * 260));
  return <S3 p={lv([0.3, 0.8, 1.5], [0.1, 0.72, 1.3], win(u, 0, 1))} l={[0, 0.55, 0]} fov={36} floor={null}>
    <Back z={-0.35} c="#b79a78" />
    <Duct p={[0, 0.45, 0]} L={2.6} R={0.15} />
    {[-0.55, 0, 0.55].map((x, i) => { const k = win(tt, 0.2 + i * 0.4, 0.5 + i * 0.4), pul = 1 + bump(tt, 0.5 + i * 0.4, 18, 5) * 0.45;
      return <group key={i}>
        <To R={0.158} t={0.035} p={[x, 0.45, 0]} r={[0, Math.PI / 2, 0]} c={k > 0.5 ? "#7a8a7a" : "#5a5d57"} ro={0.7} />
        <Cy rt={0.012} h={0.3} p={[x, 0.78, 0]} c="#9aa0a6" m={0.8} ro={0.3} />
        <Sp rad={0.105 * pul} p={[x, 0.98, 0.02]} c="#3fbf6a" e="#3fbf6a" ei={0.2 + 3.2 * k} o={0.3 + 0.7 * k} />
        <Puff p={[x, 0.98, 0.12]} s={0.55} c="#6bff9a" o={0.6 * k} />
      </group>; })}
    {w > 0.02 && <Tube pts={helix(-1.05, -1.05 + 2.1 * w, 0.45, 0, 0.19, 17 * w, n)} rad={0.05} seg={n * 2} c="#ecc096" ro={1} />}
    {w > 0.02 && <Sp rad={0.07 * (1 + bump(u, 0.3, 40, 12) * 0.2)} p={[-1.05 + 2.1 * w, 0.45 + 0.19, 0]} c="#f3d2ad" ro={1} />}
  </S3>;
}}</Stage>;

// 20 · el codo: las partículas de aire corren por el flex acanalado, se amontonan en el pliegue y pasa la mitad; el flex se endereza y un chorro de aire visible sale por la boca
export const HKink: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), fix = win(u, 0.45, 0.68), kink = 0.36 * (1 - fix), pts = flex([-0.72, 0.5, 0], [0.45, 0.5, 0], 0.03, kink, 40), N = 20;
  return <S3 p={lv([0.15, 0.75, 1.35], [0.2, 0.65, 1.2], win(u, 0, 1))} l={[0.12, 0.48, 0]} fov={40} floor={null}>
    <Back z={-0.4} c="#6f7a80" />
    <FlexC pts={pts} rad={0.17} />
    {[-0.76, 0.5].map((x, i) => <Bx key={i} s={[0.1, 0.5, 0.5]} p={[x, 0.5, 0]} c="#b9bec4" m={0.85} ro={0.33} />)}
    {Array.from({ length: N }, (_, i) => { const raw = (tt * 0.4 + i / N) % 1, cap = 0.42 + (i % 5) * 0.02, f = i % 2 === 0 ? raw : lerp(Math.min(raw, cap), raw, fix);
      const q = pts[Math.min(39, Math.floor(f * 39))], jit = i % 2 === 0 ? 0 : (1 - fix) * Math.sin(tt * 9 + i) * 0.04;
      return <Sp key={i} rad={0.055} p={[q[0] + jit, q[1] + (rnd(i) - 0.5) * 0.13 + jit, q[2] + (rnd(i + 5) - 0.5) * 0.1]} c="#b8e0ff" e="#4fb0ff" ei={2.2} ns />; })}
    {Array.from({ length: 5 }, (_, i) => <Tube key={i} pts={[[0.58, 0.5 + (i - 2) * 0.05, 0.02], [0.8, 0.5 + (i - 2) * 0.09, 0.02], [1.02, 0.5 + (i - 2) * 0.16, 0.02]]} rad={0.012} c="#bfe6ff" e="#6fc0ff" ei={3} o={0.05 + 0.85 * fix} />)}
    {Array.from({ length: 9 }, (_, i) => { const f = (tt * 0.7 + i / 9) % 1;
      return <Puff key={i} p={[0.6 + f * 0.5, 0.5 + (rnd(i) - 0.5) * 0.25 * f, 0.1]} s={0.3 + f * 0.35} c="#8fd0ff" o={(0.04 + 0.7 * fix) * Math.sin(f * Math.PI)} />; })}
  </S3>;
}}</Stage>;

// 21 · la panza: el flex acanalado cuelga en curva bajo una viga con aislante detrás; las correas bajan una por una con rebote de resorte y el tubo se levanta en cada una
export const HSag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), FS = [0.25, 0.5, 0.75], ks = FS.map((_, i) => drop(u, 0.12 + i * 0.18, 0.26 + i * 0.18));
  const sagAt = (f: number) => { let a = 0.42 * Math.sin(f * Math.PI); FS.forEach((q, i) => { a *= 1 - 0.78 * Math.min(1, ks[i]) * Math.exp(-Math.pow((f - q) / 0.13, 2)); }); return a; };
  const pts = Array.from({ length: 40 }, (_, i) => { const f = i / 39; return [lerp(-0.85, 0.85, f), 1.0 - sagAt(f), 0] as V3; });
  return <S3 p={lv([0.25, 0.95, 1.5], [0.05, 0.88, 1.3], win(u, 0, 1))} l={[0, 0.85, 0]} fov={38} floor={null} env={0.8}>
    <Back z={-0.4} c="#d7cdb8" />
    <Bx s={[2.8, 0.5, 0.14]} p={[0, 1.0, -0.2]} c="#f0b4bc" ro={1} />
    {[0, 1, 2, 3, 4, 5].map((i) => <Bx key={i} s={[2.8, 0.012, 0.15]} p={[0, 0.78 + i * 0.09, -0.2]} c="#d99aa4" ro={1} ns />)}
    <Bx s={[2.8, 0.14, 0.18]} p={[0, 1.33, 0]} map={PLANKS()} c="#c9a77a" ro={0.7} />
    <Flex pts={pts} rad={0.12} />
    {FS.map((f, i) => { const k = ks[i], ty = 1.0 - sagAt(f), x = lerp(-0.85, 0.85, f), top = 1.26, len = Math.max(0.001, (top - ty - 0.1) * Math.min(1.08, k));
      return k > 0.01 && <group key={i}>
        <Bx s={[0.055, len, 0.014]} p={[x, top - len / 2, 0.03]} c="#cfd3d8" m={0.9} ro={0.25} />
        <To R={0.135} t={0.022} p={[x, ty, 0]} r={[0, Math.PI / 2, 0]} c="#cfd3d8" m={0.9} ro={0.25} sc={[1, 1, Math.min(1, k * 1.5)]} />
        <Bx s={[0.11, 0.04, 0.04]} p={[x, top + 0.02, 0.03]} c="#8a8f95" m={0.9} ro={0.3} />
      </group>; })}
  </S3>;
}}</Stage>;

// 22 · el corazón y las venas: el furnace late como un corazón (se hincha con resorte y brilla rojo por dentro) y cada latido corre como una onda roja brillante por los ductos que salen de él
export const HHeart: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), beat = Math.pow(Math.max(0, Math.sin(tt * 4.2)), 4), ph = (((tt * 4.2 - Math.PI / 2) / Math.PI) % 1 + 1) % 1, S = 9;
  const run = (y: number, sgn: number, key: string) => <group key={key}>
    {Array.from({ length: S }, (_, j) => { const s = (j + 0.5) / S, d = Math.abs(s - ph), g = Math.exp(-Math.pow(d / 0.16, 2));
      return <Cy key={j} rt={0.085} h={0.17} p={[sgn * (0.47 + s * 0.55), y, 0]} r={[0, 0, Math.PI / 2]} c={g > 0.2 ? "#e0a49a" : "#b9bec4"} m={0.6} ro={0.35} e="#ff2a10" ei={g * 3.2} />; })}
    <Sp rad={0.13} p={[sgn * (0.47 + ph * 0.55), y, 0.03]} c="#ff3a2a" e="#ff2a10" ei={3.5} o={0.9} ns />
    <Puff p={[sgn * (0.47 + ph * 0.55), y, 0.14]} s={0.6} c="#ff4a30" o={0.7} />
    <Bx s={[0.08, 0.34, 0.34]} p={[sgn * 1.07, y, 0]} c="#e8e4da" m={0.4} ro={0.4} />
    {[0, 1, 2].map((i) => <Bx key={i} s={[0.012, 0.26, 0.02]} p={[sgn * 1.115, y - 0.08 + i * 0.08, 0.1]} c="#2a2c30" ns />)}
  </group>;
  return <S3 p={lv([0.2, 0.7, 1.85], [0.05, 0.65, 1.7], win(u, 0, 1))} l={[0, 0.58, 0]} fov={40} floor={null}>
    <Back z={-0.45} c="#8a5a50" map="b" />
    <pointLight position={[0, 0.7, 0.9]} intensity={1.5 + 3.5 * beat} distance={3} color="#ff4a30" />
    <Puff p={[0, 0.55, -0.2]} s={2.2} c="#ff3a20" o={0.18 + 0.4 * beat} />
    <group position={[0, 0.55, 0]} scale={[1 + beat * 0.1, 1 + beat * 0.08, 1 + beat * 0.1]}>
      <Bx s={[0.95, 1.1, 0.6]} c="#d8d4cc" m={0.3} ro={0.4} rad={0.05} e="#d22a22" ei={0.12 + beat * 0.5} />
      <Bx s={[0.7, 0.5, 0.02]} p={[0, 0.17, 0.31]} c="#1a0f0e" m={0.5} ro={0.2} />
      <Sp rad={0.17 * (1 + beat * 0.3)} p={[0, 0.17, 0.3]} c="#ff3a2a" e="#ff2a10" ei={1.6 + beat * 4} ns />
      <Puff p={[0, 0.17, 0.4]} s={0.7} c="#ff4a30" o={0.35 + 0.5 * beat} />
      {[0, 1, 2, 3, 4].map((i) => <Bx key={i} s={[0.6, 0.03, 0.014]} p={[0, -0.2 - i * 0.055, 0.31]} c="#4a4e55" m={0.6} ro={0.4} />)}
      <Bx s={[0.62, 0.2, 0.52]} p={[0, 0.65, 0]} c="#b9bec4" m={0.85} ro={0.33} />
    </group>
    {run(0.95, 1, "ra")}{run(0.95, -1, "rb")}{run(0.25, 1, "rc")}{run(0.25, -1, "rd")}
  </S3>;
}}</Stage>;

// 23 · la pared es el ducto: corte frontal de la pared con montantes; el retorno no tiene caño y chupa aire (naranja del ático arriba, gris del crawl space abajo) por los agujeros de las placas hacia la rejilla
export const HCavity: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), k = Math.max(0.3, win(u, 0.05, 0.25)), HX = [-0.28, 0.28], N = 7, smu = win(u, 0.2, 0.8);
  return <S3 p={lv([0.3, 0.72, 1.45], [0.05, 0.7, 1.25], win(u, 0, 1))} l={[0, 0.7, 0]} fov={40} floor={null}>
    <Back z={-0.2} c="#4a3a2a" map="w" />
    <Bx s={[2.8, 0.9, 0.03]} p={[0, 0.7, -0.1]} c="#c9a46a" ro={0.9} />
    {[-1.1, -0.55, 0.55, 1.1].map((x, i) => <Bx key={i} s={[0.1, 1.0, 0.1]} p={[x, 0.7, 0]} map={PLANKS()} c="#d8b88a" ro={0.7} />)}
    <Bx s={[2.8, 0.08, 0.12]} p={[0, 1.2, 0]} map={PLANKS()} c="#d8b88a" ro={0.7} />
    <Bx s={[2.8, 0.08, 0.12]} p={[0, 0.2, 0]} map={PLANKS()} c="#d8b88a" ro={0.7} />
    {[-1, 1].map((s, i) => <Bx key={i} s={[0.8, 0.92, 0.05]} p={[s * 1.1, 0.7, 0.08]} map={PLASTER()} c="#f2ede2" ro={0.95} />)}
    {HX.map((x, i) => <React.Fragment key={i}>
      <Cy rt={0.05} h={0.1} p={[x, 1.2, 0.0]} c="#0a0806" ro={1} />
      <Cy rt={0.05} h={0.1} p={[x, 0.2, 0.0]} c="#0a0806" ro={1} />
    </React.Fragment>)}
    <Puff p={[0, 1.1, 0.12]} s={1.5} c="#ff8a30" o={0.5 * k} />
    <Puff p={[0, 0.3, 0.12]} s={1.5} c="#b8bcc4" o={0.5 * k} />
    <Bx s={[0.9, 0.38, 0.06]} p={[0, 0.7, 0.07]} c="#e8e4da" m={0.4} ro={0.35} />
    {[0, 1, 2, 3, 4].map((i) => <Bx key={i} s={[0.8, 0.03, 0.034]} p={[0, 0.58 + i * 0.065, 0.1]} c="#2a2c30" m={0.5} ro={0.4} />)}
    <Puff p={[0, 0.42, 0.14]} s={0.5 + 0.5 * smu} c="#3a3832" o={0.6 * smu} add={false} />
    {HX.map((x, hi) => [0, 1].map((top) => Array.from({ length: N }, (_, i) => { const f = (tt * 0.45 + i / N + hi * 0.3) % 1, y0 = top ? 1.2 : 0.2, y1 = top ? 0.88 : 0.52, o = k * Math.sin(Math.min(1, f * 1.2) * Math.PI) * 0.9 + 0.05;
      return [0, 1, 2].map((tl) => { const ff = Math.max(0, f - tl * 0.05), ee = ff * ff * (3 - 2 * ff);
        return <Sp key={`${hi}${top}${i}${tl}`} rad={0.055 - tl * 0.014} p={[lerp(x, x * 0.45 + (rnd(i) - 0.5) * 0.1, ee), lerp(y0, y1, ff), 0.03]} c={top ? "#ffb070" : "#c8ccd4"} e={top ? "#ff7a20" : "#9aa0ac"} ei={1.8} o={o * (1 - tl * 0.3)} ns />; }); })))}
  </S3>;
}}</Stage>;

// 24 · el humo dice: tres varitas de incienso con brasa junto al ducto; el humo denso a contraluz sube derecho (sana), se tuerce hacia la unión (retorno) o sale soplado hacia afuera (salida)
export const HSmoke3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), CASES = [0, -1, 1], N = 22, HC = ["#5a3a22", "#2a5a8a", "#8a3a3a"];
  return <S3 p={lv([0.1, 0.7, 1.6], [0.0, 0.65, 1.4], win(u, 0, 1))} l={[0, 0.55, 0]} fov={40} floor={null}>
    <Back z={-0.5} c="#6a7478" />
    <Duct p={[0, 0.2, -0.22]} L={3} R={0.2} />
    <Bx s={[0.04, 0.3, 0.1]} p={[-0.55, 0.2, -0.02]} c="#050403" ro={1} ns />
    {CASES.map((dir, i) => { const x = (i - 1) * 0.55, on = Math.max(0.35, win(u, 0.02 + i * 0.08, 0.16 + i * 0.08));
      return <group key={i} position={[x, 0, 0]}>
        <To R={0.215} t={0.035} p={[0, 0.2, -0.22]} r={[0, Math.PI / 2, 0]} c="#6a6e66" ro={0.7} />
        <Cy rt={0.075} rb={0.09} h={0.07} p={[0, 0.04, 0.1]} c={HC[i]} ro={0.6} />
        <Cy rt={0.022} h={0.55} p={[0, 0.34, 0.1]} c="#7a4a32" ro={0.8} />
        <Sp rad={0.05} p={[0, 0.63, 0.1]} c="#ff6a2a" e="#ff5a10" ei={5} ns />
        <Puff p={[0, 0.63, 0.14]} s={0.3} c="#ff7a30" o={0.8} />
        {Array.from({ length: N }, (_, k) => { const f = (tt * 0.28 + k / N) % 1, sw = Math.sin(f * 9 + k) * 0.02 * (1 + f * 3);
          const px = dir === 0 ? sw : dir < 0 ? -Math.pow(f, 1.5) * 0.4 + sw : f * 0.4 + sw, py = dir === 0 ? 0.66 + f * 0.55 : dir < 0 ? 0.66 + f * 0.4 - f * f * 0.5 : 0.66 + f * 0.3;
          return <Puff key={k} p={[px, py, 0.14]} s={0.16 + f * 0.34} c="#e6efff" o={0.75 * on * Math.pow(1 - f, 0.8)} />; })}
      </group>; })}
  </S3>;
}}</Stage>;

// 25 · la bota (el premio): la rejilla baja y deja el hueco negro con polvo entre la bota y el yeso, una regla amarilla mide 1/4" y cuatro tiras de aluminio cierran el hueco de a una
export const HBootring: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), off = drop(tt, 0.0, 1.0), rule = win(tt, 0.4, 0.9) * (1 - win(u, 0.5, 0.56)), tapes = [0, 1, 2, 3].map((i) => drop(u, 0.5 + i * 0.1, 0.6 + i * 0.1)), seal = win(u, 0.5, 0.92);
  const T: [number, number, number, number, number, number][] = [[0, 0.46, 1.62, 0.15, 0, 1], [0.7, 0, 0.15, 1.12, 1, 0], [0, -0.46, 1.62, 0.15, 0, -1], [-0.7, 0, 0.15, 1.12, -1, 0]];
  return <S3 p={lv([0.1, 0.05, 1.85], [0.0, 0.0, 1.65], win(u, 0, 1))} l={[0, 0, 0]} fov={38} floor={null} env={0.7}>
    <Bx s={[7, 4, 0.05]} p={[0, 0, -0.025]} map={PLASTER()} c="#f2ede2" ro={0.95} ns />
    <Bx s={[1.52, 1.02, 0.03]} p={[0, 0, 0.005]} c="#030202" ro={1} ns />
    {Array.from({ length: 16 }, (_, i) => { const f = (tt * 0.3 + i / 16) % 1, side = i % 4, a = rnd(i) * 2 - 1;
      const px = side === 0 ? a * 0.7 : side === 2 ? a * 0.7 : side === 1 ? 0.7 : -0.7, py = side === 1 || side === 3 ? a * 0.45 : side === 0 ? 0.46 : -0.46;
      return <Puff key={i} p={[px + (side === 1 ? f * 0.12 : side === 3 ? -f * 0.12 : 0), py + (side === 0 ? f * 0.12 : side === 2 ? -f * 0.12 : 0), 0.05]} s={0.2 + f * 0.2} c="#a09a8e" o={0.8 * (1 - seal) * Math.sin(f * Math.PI)} />; })}
    <group position={[0.4 * (1 - off), 0.3 * (1 - off), 0.07 + 0.6 * (1 - off)]} rotation={[0.5 * (1 - off), -0.4 * (1 - off), 0]}>
      <Bx s={[1.3, 0.82, 0.07]} c="#c8ccd0" m={0.85} ro={0.33} rad={0.012} />
      <Bx s={[1.12, 0.64, 0.02]} p={[0, 0, 0.04]} c="#23262a" ro={0.6} />
      {Array.from({ length: 8 }, (_, i) => <Bx key={i} s={[1.1, 0.03, 0.03]} p={[0, -0.27 + i * 0.077, 0.06]} r={[0.5, 0, 0]} c="#d6dade" m={0.9} ro={0.25} />)}
    </group>
    <group position={[-0.7, 0.12 + (1 - rule) * 0.5, 0.14]} scale={rule > 0.01 ? 1 : 0.001}>
      <Bx s={[0.6, 0.11, 0.015]} p={[0.12, 0, 0]} c="#f2c230" ro={0.4} />
      {Array.from({ length: 12 }, (_, i) => <Bx key={i} s={[0.006, i % 4 === 0 ? 0.06 : 0.035, 0.004]} p={[-0.14 + i * 0.05, 0.025, 0.01]} c="#1a1a1a" ns />)}
      <Txt t={'1/4"'} w={0.17} c="#1a1a1a" p={[0.12, -0.025, 0.012]} />
    </group>
    {T.map(([x, y, w, hh, dx, dy], i) => <Bx key={i} s={[w, hh, 0.012]} p={[x + dx * (1 - tapes[i]) * 0.7, y + dy * (1 - tapes[i]) * 0.7, 0.1 + i * 0.002]} c="#e9edf1" m={1} ro={0.12} e="#cfe6ff" ei={0.2 + 0.4 * (1 - tapes[i])} o={tapes[i] > 0.02 ? 1 : 0.01} ns />)}
  </S3>;
}}</Stage>;

// 26 · la aureola: la rejilla vista de cerca desde abajo; el yeso blanco a su alrededor se va ensuciando en manchas irregulares de polvo gris que crecen en capas mientras el polvo se cuela por las rendijas
export const HSmudge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), k = 0.08 + 0.92 * win(u, 0.04, 0.8), L = 24;
  return <S3 p={lv([0.15, 0.1, 1.15], [-0.05, 0.0, 1.0], win(u, 0, 1))} l={[0, 0, 0]} fov={38} floor={null} env={0.8}>
    <Bx s={[7, 4, 0.05]} p={[0, 0, -0.025]} map={PLASTER()} c="#f6f2ea" ro={0.95} ns />
    {[0, 1, 2, 3].map((layer) => Array.from({ length: L }, (_, i) => { const a = (i / L) * 4, side = Math.floor(a), s = a - side, kk = cl(k * 4 - layer * 0.8), e = 0.03 + layer * 0.07 * (0.4 + rnd(i + layer * 40) * 1.2);
      const px = side === 0 ? lerp(-0.45, 0.45, s) : side === 1 ? 0.45 + e : side === 2 ? lerp(0.45, -0.45, s) : -0.45 - e, py = side === 0 ? -0.28 - e * (i % 3 === 0 ? 1.8 : 1) : side === 1 ? lerp(-0.28, 0.28, s) : side === 2 ? 0.28 + e : lerp(0.28, -0.28, s);
      return <Puff key={`${layer}-${i}`} p={[px, py, 0.003 + layer * 0.0006]} s={(0.22 + rnd(i + layer) * 0.18) * (0.6 + layer * 0.3) * kk} c={layer > 1 ? "#3e3a34" : "#5e5a52"} o={0.5 * kk} add={false} />; }))}
    <Bx s={[0.96, 0.6, 0.06]} p={[0, 0, 0.03]} c="#e8e4da" m={0.3} ro={0.4} rad={0.01} />
    <Bx s={[0.86, 0.5, 0.02]} p={[0, 0, 0.06]} c="#1c1c1e" ro={0.7} />
    {Array.from({ length: 8 }, (_, i) => <Bx key={i} s={[0.84, 0.026, 0.03]} p={[0, -0.22 + i * 0.063, 0.075]} r={[0.5, 0, 0]} c="#cfcabc" m={0.2} ro={0.5} />)}
    {Array.from({ length: 26 }, (_, i) => { const f = (tt * 0.35 + rnd(i, 3)) % 1, sx = (rnd(i) - 0.5) * 0.8, sy = -0.22 + (i % 8) * 0.063, sd = rnd(i, 5) - 0.5;
      return <Sp key={i} rad={0.016 + rnd(i, 7) * 0.012} p={[sx + sd * f * 0.5, sy - f * 0.12 + (sy > 0 ? f * 0.1 : 0), 0.09 + f * 0.25]} c="#8a857a" ro={1} o={Math.sin(f * Math.PI) * 0.95 * (0.3 + 0.7 * k)} ns />; })}
  </S3>;
}}</Stage>;

// 27 · la serpentina: una capa gris espesa de polvo baja sobre las aletas del serpentín de arriba abajo y los chorros azules de aire que suben por él se achican hasta casi desaparecer
export const HCoilgrey: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), k = 0.1 + 0.9 * win(u, 0.04, 0.85), N = 30, top = 0.75, bot = 0.05, dy = top - k * (top - bot);
  return <S3 p={lv([0.25, 0.65, 1.65], [0.05, 0.62, 1.45], win(u, 0, 1))} l={[0, 0.58, 0]} fov={38} floor={null}>
    <Back z={-0.2} c="#4a4e56" map="b" />
    <Bx s={[1.3, 0.8, 0.08]} p={[0, 0.4, -0.08]} c="#2c2f35" m={0.6} ro={0.4} />
    {Array.from({ length: N }, (_, i) => { const y = bot + 0.02 + (i / (N - 1)) * (top - bot - 0.04);
      return <Bx key={i} s={[1.2, 0.012, 0.1]} p={[0, y, 0]} c="#e09a58" m={0.85} ro={0.3} ns />; })}
    {[-0.45, -0.15, 0.15, 0.45].map((x, i) => <Cy key={i} rt={0.025} h={0.78} p={[x, 0.4, 0.07]} c="#b87333" m={0.9} ro={0.3} />)}
    {k > 0.02 && <Bx s={[1.22, top - dy, 0.14]} p={[0, (top + dy) / 2, 0.01]} c="#8f8a80" ro={1} o={0.96} rad={0.02} />}
    {k > 0.02 && Array.from({ length: 11 }, (_, i) => <Puff key={i} p={[-0.55 + i * 0.11, dy - 0.02 + Math.sin(i * 2.1 + tt) * 0.02, 0.1]} s={0.28} c="#9a958a" o={0.9} add={false} />)}
    {Array.from({ length: 16 }, (_, i) => { const f = (tt * 0.6 + i / 16) % 1;
      return <Puff key={i} p={[(rnd(i) - 0.5) * 1.1, dy - f * 0.16, 0.12]} s={0.16 + f * 0.14} c="#a39e92" o={0.7 * (1 - f)} add={false} />; })}
    {[-0.5, -0.25, 0, 0.25, 0.5].map((x, i) => { const len = Math.max(0.06, 0.42 * (1 - 0.85 * k)), y0 = top + 0.05;
      return <group key={i}><Tube pts={[[x, y0, 0.08], [x + 0.015, y0 + len / 2, 0.08], [x, y0 + len, 0.08]]} rad={0.03 * (1 - 0.4 * k)} c="#9fd4ff" e="#4fb0ff" ei={2.2} o={0.95 - 0.35 * k} />
        <Cy rt={0.0} rb={0.07 * (1 - 0.3 * k)} h={0.1} p={[x, y0 + len + 0.04, 0.08]} c="#9fd4ff" e="#4fb0ff" ei={2.2} /></group>; })}
  </S3>;
}}</Stage>;

// 28 · la máquina y el palito: el soplador de presión de los profesionales (cuerpo rojo, ventilador a la vista y manómetro enorme) con la aguja subiendo, y al lado la varita de incienso de $1 con su humo denso
export const HBlaster: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), st = drop(tt, 0.4, 1.4), needle = lerp(0.9, -1.1, win(tt, 0.1, 2.6)) + Math.sin(tt * 5) * 0.03, ht = 0.85 * st;
  return <S3 p={lv([0.2, 0.7, 2.1], [0.05, 0.62, 1.9], win(u, 0, 1))} l={[0.1, 0.6, 0]} fov={38} floor={null}>
    <Back z={-0.5} c="#7a7468" map="b" />
    <Bx s={[7, 0.1, 3]} p={[0, -0.05, 0.3]} map={PLANKS()} c="#9a7a54" ro={0.7} />
    <group position={[-0.55, 0, 0]} scale={1.1}>
      <Bx s={[0.95, 0.62, 0.58]} p={[0, 0.38, 0]} c="#c93a2a" m={0.3} ro={0.35} rad={0.05} />
      <Cy rt={0.26} h={0.08} p={[-0.12, 0.38, 0.3]} r={[Math.PI / 2, 0, 0]} c="#1c1e22" m={0.6} ro={0.4} />
      <group position={[-0.12, 0.38, 0.35]} rotation={[0, 0, tt * 10]}>{[0, 1, 2, 3, 4, 5].map((i) => <Bx key={i} s={[0.21, 0.07, 0.012]} p={[0.12 * Math.cos(i * 1.047), 0.12 * Math.sin(i * 1.047), 0]} r={[0.4, 0, i * 1.047]} c="#c0c4c8" m={0.9} ro={0.25} />)}<Cy rt={0.04} h={0.03} r={[Math.PI / 2, 0, 0]} c="#e8e8e8" m={1} ro={0.2} /></group>
      <To R={0.26} t={0.018} p={[-0.12, 0.38, 0.345]} c="#d0d4d8" m={1} ro={0.15} />
      <group position={[0.3, 0.76, 0.12]} rotation={[-0.5, 0, 0]} scale={1.25}>
        <Cy rt={0.2} h={0.06} r={[Math.PI / 2, 0, 0]} c="#2a2c30" m={0.7} ro={0.3} />
        <Cy rt={0.17} h={0.012} p={[0, 0, 0.034]} r={[Math.PI / 2, 0, 0]} c="#f4efe2" ro={0.5} />
        {Array.from({ length: 9 }, (_, i) => <Bx key={i} s={[0.014, 0.04, 0.004]} p={[Math.sin((i - 4) * 0.5) * 0.14, Math.cos((i - 4) * 0.5) * 0.14, 0.042]} r={[0, 0, -(i - 4) * 0.5]} c="#2a2520" ns />)}
        <group position={[0, 0, 0.05]} rotation={[0, 0, needle]}><Bx s={[0.018, 0.15, 0.006]} p={[0, 0.07, 0]} c="#e0302a" e="#e0302a" ei={0.6} ns /></group>
        <Sp rad={0.022} p={[0, 0, 0.055]} c="#2a2c30" />
      </group>
      <Tube pts={[[0.45, 0.2, 0.15], [0.7, 0.12, 0.35], [0.85, 0.05, 0.6]]} rad={0.05} c="#1c1e22" ro={0.6} />
      {[-0.35, 0.35].map((x, i) => <Cy key={i} rt={0.05} h={0.06} p={[x, 0.03, 0.15]} c="#2a2c30" ro={0.7} />)}
    </group>
    <group position={[0.85, 0, 0.15]} scale={st > 0.01 ? 1 : 0.001}>
      <Cy rt={0.2} rb={0.24} h={0.1} p={[0, 0.05, 0]} c="#8a5a32" ro={0.6} />
      <Cy rt={0.03} h={ht} p={[0, 0.1 + ht / 2, 0]} c="#6a3a2a" ro={0.8} />
      <Sp rad={0.07} p={[0, 0.1 + ht, 0]} c="#ff6a2a" e="#ff5a10" ei={5} ns />
      <Puff p={[0, 0.1 + ht, 0.04]} s={0.4} c="#ff7a30" o={0.8 * st} />
      {Array.from({ length: 16 }, (_, k) => { const f = (tt * 0.3 + k / 16) % 1; return <Puff key={k} p={[Math.sin(f * 8 + k) * 0.08, 0.1 + ht + f * 0.5, 0.05]} s={0.22 + f * 0.4} c="#e8eeff" o={0.75 * (1 - f) * st} />; })}
    </group>
  </S3>;
}}</Stage>;

const TASKS: [string, string, number][] = [["TAPE THE", "BOOTS", 0], ["CALL FOR", "NEW FURNACE", 1], ["OPEN THE", "VENTS", 0], ["ATTIC", "CRAWL SPACE", 1]];
// 29 · la clasificadora: las tareas caen como fichas grandes desde arriba, chocan con una paleta desviadora y cada una se desliza sola a su cajón: YOU CAN DO IT o CALL A PRO
export const HDiysplit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), per = 0.22, cur = Math.min(3, Math.floor(cl(u / per))), flap = TASKS[cur][2] ? 0.45 : -0.45;
  return <S3 p={lv([0, 1.0, 2.05], [0, 0.9, 1.85], win(u, 0, 1))} l={[0, 0.7, 0]} fov={40} floor={null}>
    <Back z={-0.5} c="#5a4a3a" map="w" />
    <Bx s={[7, 0.1, 3]} p={[0, -0.05, 0.3]} map={PLANKS()} c="#9a7a54" ro={0.7} />
    {[-0.75, 0.75].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <Bx s={[1.2, 0.1, 0.6]} p={[0, 0.05, 0]} c={i ? "#2a3a6a" : "#2a6a3a"} ro={0.6} />
      <Bx s={[1.2, 0.4, 0.04]} p={[0, 0.2, 0.28]} c={i ? "#3a4a8a" : "#3a8a4a"} ro={0.5} rad={0.02} />
      <Bx s={[1.2, 0.8, 0.04]} p={[0, 0.4, -0.28]} c={i ? "#2a3a6a" : "#2a6a3a"} ro={0.6} />
      {[-1, 1].map((s) => <Bx key={s} s={[0.04, 0.5, 0.6]} p={[s * 0.58, 0.25, 0]} c={i ? "#2a3a6a" : "#2a6a3a"} ro={0.6} />)}
      <Txt t={i ? "CALL A PRO" : "YOU CAN DO IT"} w={1.0} c="#ffffff" p={[0, 0.2, 0.305]} />
      <pointLight position={[0, 0.9, 0.7]} intensity={TASKS[cur][2] === i ? 1.4 : 0.3} distance={2} color="#ffd9a0" />
    </group>)}
    <group position={[0, 1.0, 0.15]} rotation={[0, 0, flap]}><Bx s={[0.8, 0.07, 0.4]} c="#cfd3d8" m={0.8} ro={0.3} /></group>
    {TASKS.map(([a, b, side], i) => { const f = cl((u - i * per) / per), nIn = TASKS.slice(0, i).filter((q) => q[2] === side).length, X = side ? 0.75 : -0.75, sg = side ? 1 : -1;
      const A = drop(f, 0, 0.42), B = win(f, 0.42, 0.7), C = win(f, 0.7, 0.95);
      const x = lerp(0, X * 0.35, B) + (X - X * 0.35) * C, y = lerp(1.9, 1.2, A) - 0.3 * B - 0.45 * C + (nIn * 0.05) * C;
      return f > 0 && <group key={i} position={[x, y, 0.25 - 0.04 * i * C]} rotation={[0, 0, sg * -0.5 * B * (1 - C) + (1 - A) * 0.15]}>
        <Bx s={[0.95, 0.5, 0.04]} c="#f5efdc" ro={0.85} rad={0.02} /><Bx s={[0.95, 0.08, 0.042]} p={[0, 0.21, 0]} c={side ? "#4a6aaa" : "#4aaa6a"} ro={0.6} />
        <Txt t={a} w={0.62} c="#2a2520" p={[0, 0.04, 0.025]} /><Txt t={b} w={0.78} c="#2a2520" p={[0, -0.11, 0.025]} />
      </group>; })}
  </S3>;
}}</Stage>;

// 30 · la torre de presupuestos: se apilan $6,000 / $8,000 / $10,000 de "furnace nuevo", la torre se tambalea con física y cae en pedazos; queda en pie una etiqueta de $50 con luz cálida
export const HWalkfirst: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), fall = win(u, 0.5, 0.72), wob = Math.sin(u * 55) * 0.05 * win(u, 0.36, 0.5) * (1 - fall), tag = drop(u, 0.7, 0.86), BH = 0.4;
  const FIN: [number, number, number][] = [[-1.0, 0.3, 0.6], [-0.4, 0.2, -0.5], [-0.85, 0.28, 1.0]];
  return <S3 p={lv([0.1, 1.0, 2.3], [0.1, 0.75, 2.0], win(u, 0, 1))} l={[0, 0.6, 0]} fov={40} floor={null}>
    <Back z={-0.6} c="#b8a888" y={1.2} />
    <Bx s={[7, 0.1, 3]} p={[0, -0.05, 0.3]} map={PLANKS()} c="#9a7a54" ro={0.7} />
    {["$6,000", "$8,000", "$10,000"].map((s, i) => { const d = drop(tt, 0.1 + i * 0.35, 0.5 + i * 0.35), fx = Math.pow(fall, 1.5), by = BH / 2 + i * (BH + 0.01), fin = FIN[i];
      const y = lerp(by + (1 - d) * 1.3, fin[1], fx), x = lerp(-0.55 + wob * (i + 1), fin[0], fx);
      return <group key={i} position={[x, y, fx * 0.12 * i]} rotation={[0, 0, fx * fin[2] - wob * i]} scale={d > 0.01 ? 1 : 0.001}>
        <Bx s={[0.8, BH, 0.5]} c="#e8e4da" ro={0.6} rad={0.03} /><Txt t={s} w={0.6} c="#c8302a" p={[0, 0.06, 0.255]} /><Txt t="NEW FURNACE QUOTE" w={0.55} c="#3a332a" p={[0, -0.12, 0.255]} />
      </group>; })}
    <pointLight position={[0.65, 1.0, 1.0]} intensity={1.0 + 3.2 * tag} distance={2.5} color="#ffcf8a" />
    <group position={[0.65, 0.42 + (1 - tag) * 1.3, 0.35]} rotation={[-0.08, -0.12, 0]} scale={tag > 0.01 ? 1 : 0.001}>
      <Bx s={[0.95, 0.62, 0.04]} c="#f5efdc" ro={0.85} rad={0.03} /><Bx s={[0.95, 0.08, 0.042]} p={[0, 0.27, 0]} c="#1f7a3a" ro={0.6} />
      <Txt t="$50" w={0.55} c="#1f7a3a" p={[0, 0.03, 0.025]} /><Txt t="+ ONE AFTERNOON" w={0.78} c="#3a332a" p={[0, -0.2, 0.025]} />
    </group>
  </S3>;
}}</Stage>;

const flyer = () => canvasTex("flyer99v2", 400, 520, (g) => { g.fillStyle = "#fff6c8"; g.fillRect(0, 0, 400, 520); g.strokeStyle = "#c8302a"; g.lineWidth = 10; g.strokeRect(14, 14, 372, 492); g.fillStyle = "#c8302a"; g.textAlign = "center"; fit(g, "$99", 170, 330, BOLD); g.fillText("$99", 200, 230);
  g.fillStyle = "#2a2520"; fit(g, "WHOLE HOUSE", 46, 320, BOLD); g.fillText("WHOLE HOUSE", 200, 320); fit(g, "DUCT CLEANING", 46, 320, BOLD); g.fillText("DUCT CLEANING", 200, 385); });
// 31 · el anzuelo: el volante de "$99 duct cleaning" cuelga de un anzuelo grande y se balancea como péndulo; el hilo tira hacia arriba y al lado cae con peso el cartel enorme del upsell de $800-1,200
export const HHook: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), sw = Math.sin(tt * 2.1) * 0.26 * (1 - win(u, 0.5, 0.65)), pull = win(u, 0.5, 0.72), rev = drop(u, 0.42, 0.58);
  return <S3 p={lv([0.0, 0.9, 2.25], [0.0, 0.85, 2.05], win(u, 0, 1))} l={[0, 0.85, 0]} fov={38} floor={null}>
    <Back z={-0.5} c="#b8a888" y={1.2} />
    <Bx s={[1.5, 0.06, 0.5]} p={[0.5, 0.39, 0.15]} map={PLANKS()} c="#9a7a54" ro={0.7} />
    <group position={[0.5, 0.78 + (1 - rev) * 1.3, 0.15]} rotation={[0, -0.08, 0]} scale={rev > 0.01 ? 1 : 0.001}>
      <Bx s={[1.15, 0.78, 0.06]} c="#2a2c30" ro={0.5} rad={0.03} /><Bx s={[1.15, 0.09, 0.062]} p={[0, 0.34, 0]} c="#c8302a" ro={0.5} />
      <Txt t="THEN THE UPSELL" w={0.86} c="#fff3d6" p={[0, 0.17, 0.034]} /><Txt t="$800 – $1,200" w={1.0} c="#ff7a5a" p={[0, -0.1, 0.034]} />
    </group>
    <group position={[-0.7, 2.1 + pull * 0.3, 0.1]} rotation={[0, 0, sw]}>
      <Cy rt={0.008} h={0.8} p={[0, -0.4, 0]} c="#dddddd" ro={0.4} />
      <To R={0.1} t={0.02} arc={Math.PI * 1.35} p={[0.02, -0.96, 0]} r={[0, 0, Math.PI * 0.95]} c="#b5b9bf" m={1} ro={0.2} />
      <Cy rt={0.02} h={0.2} p={[-0.08, -0.84, 0]} c="#b5b9bf" m={1} ro={0.2} />
      <Pl w={0.78} h={1.0} p={[0, -1.5, 0.01]} map={flyer()} c="#ffffff" ro={0.8} />
    </group>
  </S3>;
}}</Stage>;

// 32 · el sello: un sello oficial de la EPA, grande, gira en el aire y cae con golpe sobre la hoja dejando la huella azul; la frase aparece palabra por palabra y un subrayado rojo se dibuja debajo
export const HGavel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), d = drop(tt, 0.0, 1.1), sp = (1 - win(tt, 0.0, 1.0)) * 10, lift = win(u, 0.4, 0.55), ink = win(tt, 1.0, 1.15), dust = Math.max(0, bump(tt, 1.0, 9, 3));
  const LINES = [["NEVER", "BEEN", "SHOWN", "TO"], ["ACTUALLY", "PREVENT"], ["HEALTH", "PROBLEMS"]], n = Math.ceil(win(u, 0.2, 0.7) * 8), ul = win(u, 0.7, 0.88);
  let off = 0;
  return <S3 p={lv([0.1, 1.0, 1.0], [0.0, 1.05, 0.8], win(u, 0, 1))} l={[0.05, 0.02, 0.05]} fov={42} floor={null}>
    <Bx s={[7, 0.1, 5]} p={[0, -0.06, 0]} map={PLANKS()} c="#8a6a48" ro={0.7} />
    <Bx s={[2.1, 0.012, 1.3]} p={[0, 0.006, 0]} c="#f8f5ee" ro={0.9} />
    {LINES.map((ws, li) => { const wl = Math.max(0, Math.min(ws.length, n - off)); off += ws.length; if (wl === 0) return null;
      const full = ws.join(" "), part = ws.slice(0, wl).join(" "), cw = 0.062, fw = full.length * cw, pw = part.length * cw;
      return <Txt key={li} t={part} w={pw} c="#24304a" p={[0.3 - fw / 2 + pw / 2, 0.014, -0.28 + li * 0.24]} r={[-Math.PI / 2, 0, 0]} />; })}
    <Bx s={[1.0 * ul, 0.004, 0.02]} p={[0.3 - 0.5 + 0.5 * ul, 0.012, 0.52]} c="#c8302a" />
    <mesh position={[-0.65, 0.013, 0.1]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.22, 0.28, 48]} /><meshStandardMaterial color="#2b4d6e" transparent opacity={0.92 * ink} roughness={0.7} depthWrite={false} /></mesh>
    <Txt t="EPA" w={0.3} c="#2b4d6e" p={[-0.65, 0.014, 0.1]} r={[-Math.PI / 2, 0, 0]} o={ink} />
    <Puff p={[-0.65, 0.08, 0.1]} s={0.9 + dust} c="#e0e6ee" o={0.7 * dust} r={[-Math.PI / 2, 0, 0]} />
    <group position={[-0.65 - lift * 0.1, 0.06 + (1 - d) * 1.1 + lift * 0.6, 0.1]} rotation={[lift * 0.4, sp, lift * 0.2]}>
      <Cy rt={0.3} h={0.06} c="#2b4d6e" m={0.6} ro={0.3} seg={48} />
      <To R={0.285} t={0.015} p={[0, 0.032, 0]} r={[Math.PI / 2, 0, 0]} c="#d9b25a" m={0.9} ro={0.25} />
      <Cy rt={0.08} rb={0.12} h={0.36} p={[0, 0.21, 0]} c="#5a3a22" ro={0.55} />
      <Sp rad={0.14} p={[0, 0.43, 0]} c="#7a4a2a" ro={0.5} />
      <Txt t="EPA" w={0.34} c="#f4e3b0" p={[0, 0.033, 0]} r={[-Math.PI / 2, 0, 0]} />
    </group>
  </S3>;
}}</Stage>;

// 33 · el estetoscopio: la campana grande se apoya en el ducto y tres anillos luminosos de sonido viajan por el caño hasta la fuga, que sopla aire por una rendija
export const HBingo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), on = drop(tt, 0.0, 0.9), pulse = 0.5 + 0.5 * Math.sin(tt * 7), BX = -0.55, LX = 0.6;
  const earL: V3[] = [[BX, 0.05, 0.45], [BX, 0.3, 0.7], [BX - 0.12, 0.5, 0.55], [BX - 0.35, 0.7, 0.4]];
  const earR: V3[] = [[BX, 0.05, 0.45], [BX, 0.3, 0.7], [BX + 0.18, 0.5, 0.55], [BX + 0.1, 0.72, 0.4]];
  return <S3 p={lv([0.2, 0.4, 1.95], [0.05, 0.3, 1.75], win(u, 0, 1))} l={[0.05, 0.25, 0]} fov={38} floor={null}>
    <Back z={-0.5} c="#6f6a60" map="b" />
    <Duct p={[0, 0, 0]} L={3} R={0.28} />
    {[-1.0, 1.0].map((x, i) => <To key={i} R={0.285} t={0.025} p={[x, 0, 0]} r={[0, Math.PI / 2, 0]} c="#8a8f95" m={0.9} ro={0.3} />)}
    <Bx s={[0.34, 0.025, 0.12]} p={[LX, 0.285, 0.0]} c="#050403" ro={1} ns />
    {Array.from({ length: 10 }, (_, i) => { const f = (tt * 0.9 + i / 10) % 1;
      return <Puff key={i} p={[LX + (rnd(i) - 0.5) * 0.15 + f * 0.1, 0.3 + f * 0.5, 0.02 * i]} s={0.2 + f * 0.4} c="#cfe8ff" o={0.85 * (1 - f)} />; })}
    <Sp rad={0.05} p={[LX, 0.3, 0.02]} c="#ff7a5a" e="#ff4a30" ei={1.5 + 2.5 * pulse} ns />
    <group position={[BX, 0, 0.3 + (1 - on) * 0.5]} rotation={[Math.PI / 2, 0, 0]}>
      <Cy rt={0.2} h={0.1} c="#d0d4d8" m={1} ro={0.15} />
      <To R={0.2} t={0.03} p={[0, -0.05, 0]} r={[Math.PI / 2, 0, 0]} c="#1e1e20" ro={0.5} />
      <Cy rt={0.15} h={0.02} p={[0, 0.06, 0]} c="#6a6e76" m={0.6} ro={0.3} />
      <Cy rt={0.045} h={0.16} p={[0, 0.12, 0]} c="#d0d4d8" m={1} ro={0.15} />
    </group>
    <Tube pts={earL} rad={0.022} c="#1e1e20" ro={0.5} /><Tube pts={earR} rad={0.022} c="#1e1e20" ro={0.5} />
    {[earL[3], earR[3]].map((q, i) => <Sp key={i} rad={0.05} p={q} c="#d0d4d8" m={1} ro={0.15} />)}
    {[0, 1, 2].map((i) => { const f = (tt * 0.45 + i / 3) % 1, x = lerp(BX, LX, f);
      return <group key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}><To R={0.31 + 0.04 * f} t={0.028} r={[Math.PI / 2, 0, 0]} c="#9fd4ff" e="#4fb0ff" ei={3} o={on * Math.sin(Math.min(1, f * 1.1) * Math.PI) * 0.95} /></group>; })}
  </S3>;
}}</Stage>;

const cheque = (k: number) => canvasTex(`chequev3|${Math.round(k * 24)}`, 1024, 440, (g) => {
  g.fillStyle = "#e9f2ea"; g.fillRect(0, 0, 1024, 440); g.strokeStyle = "#7a9a80"; g.lineWidth = 8; g.strokeRect(10, 10, 1004, 420);
  g.fillStyle = "#2a3a2e"; g.font = BOLD(52); g.fillText("YOUR GAS & ELECTRIC CO.", 40, 80); g.font = BOLD(36); g.fillText("PAY TO THE ORDER OF", 40, 160);
  g.fillRect(40, 255, 900, 4); g.fillRect(40, 355, 900, 4); g.font = HANDF(84); g.fillStyle = "#24304a";
  const a = "You · the homeowner", b = "duct sealing rebate"; g.fillText(a.slice(0, Math.ceil(a.length * cl(k * 2))), 60, 245); g.fillText(b.slice(0, Math.ceil(b.length * cl(k * 2 - 1))), 60, 345);
});
// 34 · el cheque: un cheque 3D de la compañía de luz se escribe a tu nombre con una pluma por el sellado de ductos y un sello de goma gigante baja con golpe y deja la marca REBATE roja sobre el cheque
export const HRebate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), k = win(tt, 0.2, Math.max(3, (h.out - h.at) * 0.45)), st = drop(u, 0.58, 0.7), lift = win(u, 0.82, 0.95), mark = win(u, 0.66, 0.7);
  const line = k < 0.5 ? 0 : 1, frac = line ? cl(k * 2 - 1) : cl(k * 2), penX = -0.47 + frac * (line ? 0.55 : 0.72), penZ = line ? 0.128 : 0.021, writing = k > 0.01 && k < 0.99 ? 1 : 0;
  const sx = 0.32, sz = 0.04;
  return <S3 p={lv([0.1, 0.95, 0.85], [0.0, 0.85, 0.7], win(u, 0, 1))} l={[0.05, 0.0, 0.0]} fov={40} floor={null}>
    <Bx s={[7, 0.1, 4]} p={[0, -0.05, 0]} map={PLANKS()} c="#8a6a48" ro={0.6} />
    <group rotation={[0, 0.05 * Math.sin(u * 5), 0]}>
      <Bx s={[1.12, 0.02, 0.48]} p={[0, 0.01, 0]} c="#e9f2ea" ro={0.85} rad={0.004} />
      <Pl w={1.1} h={0.47} p={[0, 0.0215, 0]} r={[-Math.PI / 2, 0, 0]} map={cheque(k)} c="#ffffff" ro={0.85} ns />
      <group position={[penX + 0.12 * (1 - writing), 0.1 + 0.2 * (1 - writing) * lift, penZ - 0.04]} rotation={[0.9, 0, 0.5]}>
        <Cy rt={0.016} h={0.3} p={[0, 0.15, 0]} c="#1c1e22" m={0.4} ro={0.3} />
        <Cy rt={0.002} rb={0.016} h={0.07} p={[0, -0.02, 0]} c="#d9b25a" m={1} ro={0.2} />
      </group>
      <group position={[sx, 0.023, sz]} rotation={[0, 0.1, 0]} scale={mark > 0.01 ? 1 : 0.001}>
        <Bx s={[0.46, 0.003, 0.012]} p={[0, 0, 0.1]} c="#c8302a" ns /><Bx s={[0.46, 0.003, 0.012]} p={[0, 0, -0.1]} c="#c8302a" ns />
        <Bx s={[0.012, 0.003, 0.2]} p={[0.23, 0, 0]} c="#c8302a" ns /><Bx s={[0.012, 0.003, 0.2]} p={[-0.23, 0, 0]} c="#c8302a" ns />
        <Txt t="REBATE" w={0.38} c="#c8302a" p={[0, 0.002, 0]} r={[-Math.PI / 2, 0, 0]} o={0.95} />
      </group>
      <group position={[sx + lift * 0.45, 0.03 + (1 - st) * 0.9 + lift * 0.5, sz]} rotation={[lift * 0.5, 0.1, 0]}>
        <Bx s={[0.5, 0.06, 0.24]} p={[0, 0.03, 0]} c="#7a2a22" ro={0.5} rad={0.02} />
        <Cy rt={0.05} rb={0.07} h={0.26} p={[0, 0.19, 0]} c="#5a3a22" ro={0.55} />
        <Sp rad={0.1} p={[0, 0.36, 0]} c="#7a4a2a" ro={0.5} />
      </group>
    </group>
  </S3>;
}}</Stage>;

const MONTHS = ["OCT", "NOV", "DEC", "JAN", "FEB", "MAR"];
// 35 · las facturas del señor Russo: barras 3D mes a mes por encima de $300; un sello FIXED cae con rebote al costado de la barra clave y las barras de después se hunden bajo $200
export const HBillbars: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), fixed = drop(u, 0.4, 0.54), sink = win(u, 0.56, 0.82), y = (v: number) => v / 450;
  const val = (i: number) => i < 3 ? 310 + i * 25 : lerp(340 + (i - 3) * 10, 170 + (i - 3) * 8, sink);
  return <S3 p={lv([0.3, 0.7, 1.75], [0.1, 0.62, 1.55], win(u, 0, 1))} l={[0.1, 0.38, 0]} fov={40} floor={null}>
    <Back z={-0.4} c="#46506a" y={1} />
    <Bx s={[7, 0.1, 3]} p={[0, -0.05, 0.3]} map={PLANKS()} c="#8a6a48" ro={0.6} />
    {[200, 300].map((v) => <group key={v}>
      <Bx s={[1.7, 0.014, 0.014]} p={[0.0, y(v), -0.18]} c={v === 300 ? "#ff9a7a" : "#9ff0b0"} e={v === 300 ? "#ff7a5a" : "#5fd08a"} ei={1.2} ns />
      <Txt t={`$${v}`} w={v === 300 ? 0.34 : 0.28} c={v === 300 ? "#ffb09a" : "#b8ffd0"} p={[-0.86, y(v) + 0.07, -0.16]} /></group>)}
    {MONTHS.map((m, i) => { const g = win(tt, i * 0.1, 0.7 + i * 0.1) * 0.85 + 0.15 * win(u, 0, 0.1), v = val(i), hh = Math.max(0.001, y(v) * g);
      return <group key={m} position={[-0.5 + i * 0.2, 0, 0]}>
        <Bx s={[0.15, hh, 0.15]} p={[0, hh / 2, 0]} c={i < 3 || sink < 0.5 ? "#d8603a" : "#3fbf6a"} ro={0.45} rad={0.012} e={i < 3 || sink < 0.5 ? undefined : "#3fbf6a"} ei={0.25} />
        <Txt t={m} w={0.15} c="#fff3d6" p={[0, 0.07, 0.08]} />
      </group>; })}
    <group position={[0.82, 0.55 + (1 - fixed) * 1.1, 0.15]} rotation={[0, 0, -0.1]} scale={fixed > 0.01 ? 1 : 0.001}>
      <Bx s={[0.5, 0.2, 0.05]} c="#f2ead6" ro={0.9} rad={0.015} /><Bx s={[0.43, 0.13, 0.052]} c="#1f7a3a" ro={0.6} /><Txt t="FIXED" w={0.34} c="#f2ead6" p={[0, 0, 0.03]} />
    </group>
  </S3>;
}}</Stage>;

// 36 · el crawl space: la humedad sube del barro mojado en gotas luminosas hacia los ductos; una lámina de plástico translúcido se desliza sobre la tierra y las gotas rebotan contra ella y dejan de subir
export const HVapor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3" bg={BG}>{(tt) => {
  const u = U(tt, h), sheet = win(u, 0.25, 0.7), xe = lerp(-1.1, 1.1, sheet);
  return <S3 p={lv([0.3, 0.6, 1.55], [0.1, 0.55, 1.4], win(u, 0, 1))} l={[0, 0.3, 0]} fov={42} floor={null}>
    <Bx s={[7, 0.3, 3]} p={[0, -0.15, 0.2]} c="#3a2a1a" m={0.15} ro={0.22} />
    {Array.from({ length: 9 }, (_, i) => <Sp key={i} rad={0.14 + rnd(i) * 0.08} p={[-1.0 + i * 0.26, -0.03, 0.4 - rnd(i, 2) * 0.8]} sc={[1.3, 0.28, 1]} c="#4a3622" m={0.15} ro={0.2} ns />)}
    <Bx s={[7, 1.4, 0.06]} p={[0, 0.5, -0.7]} map={BLOCKS()} c="#a8a49c" ro={0.9} />
    <Bx s={[7, 0.14, 0.24]} p={[0, 1.0, -0.15]} map={PLANKS()} c="#a8875e" ro={0.7} />
    <Duct p={[0, 0.78, 0]} L={3} R={0.13} />
    {[-0.7, 0.7].map((x, i) => <Bx key={i} s={[0.03, 0.18, 0.01]} p={[x, 0.9, 0]} c="#c0c4c8" m={0.9} ro={0.3} />)}
    {Array.from({ length: 5 }, (_, i) => <Puff key={`m${i}`} p={[-0.8 + i * 0.4, 0.3, 0.2]} s={0.6} c="#b8c8a0" o={0.2 * (1 - win(u, 0.55, 0.8) * (i / 5 < sheet ? 1 : 0))} />)}
    {Array.from({ length: 36 }, (_, i) => { const x = (rnd(i) - 0.5) * 2.0, f = (tt * 0.4 + rnd(i + 30)) % 1, blocked = x < xe + 0.04 && sheet > 0.02, z = (rnd(i + 2) - 0.5) * 0.9;
      const y = blocked ? 0.06 + Math.abs(Math.sin(f * 14)) * 0.1 * (1 - f) : 0.05 + f * 0.62;
      return <Sp key={i} rad={0.05} p={[x, y, z]} c="#bfe0ff" e="#5fc0ff" ei={2.2} o={(blocked ? 0.6 : 0.95) * Math.min(1, Math.sin(f * Math.PI) * 2)} ro={0.05} ns />; })}
    {sheet > 0.01 && <Bx s={[xe + 1.1, 0.03, 1.4]} p={[(xe - 1.1) / 2, 0.05, 0.2]} c="#dfeef6" o={0.5} ro={0.08} m={0.2} rad={0.01} e="#cfe6ff" ei={0.2} />}
    {sheet > 0.01 && <Bx s={[0.1, 0.1, 1.4]} p={[xe, 0.09, 0.2]} c="#eef6fa" o={0.8} ro={0.1} />}
  </S3>;
}}</Stage>;
