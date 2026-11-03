// mar11 · utilería 3D compartida de los componentes (kit r3k): la unidad exterior, la mano, el pasto con helada, la pared de
// ladrillo de la casa de Georgia, la canaleta, la hoja seca, la mesa. Los componentes de cada video sólo arman su acción encima.
import React from "react";
import { Bx, Cy, Pl, Sp, To, V3, canvasTex, cl, lerp, rnd, env } from "../kits/r3k/r3k";
import { H } from "./hkit";
import { PhotoGround, PhotoLeaf, PhotoPl, PhotoWall } from "./tex11";

export const U = (tt: number, h: H) => cl(tt / (h.out - h.at));
export const bump = (u: number, a: number, f = 26, k = 8) => (u > a ? Math.sin((u - a) * f) * Math.exp(-(u - a) * k) : 0);
export const mixc = (a: string, b: string, k: number) => { const f = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16); return "#" + [0, 1, 2].map((i) => Math.round(lerp(f(a, i), f(b, i), cl(k))).toString(16).padStart(2, "0")).join(""); };
// integral de una velocidad (aspas que frenan sin dar marcha atrás)
export const cum = (f: (x: number) => number, x: number, n = 48) => { let s = 0; for (let i = 0; i < n; i++) s += f((x * (i + 0.5)) / n); return (s * x) / n; };

// unidad exterior de la bomba de calor: centro de la base en p; fan = ángulo de las aspas; ice = escarcha 0..1; frost = blanco en aletas
export const HPU: React.FC<{ p?: V3; s?: number; fan?: number; ice?: number; frost?: number; r?: V3; body?: string }> = ({ p = [0, 0, 0], s = 1, fan = 0, ice = 0, frost = 0, r = [0, 0, 0], body = "#c9ccd0" }) => {
  const fin = mixc("#c8cdd2", "#ffffff", frost);
  return <group position={p} scale={s} rotation={r}>
    <Bx s={[0.64, 0.04, 0.64]} p={[0, 0.02, 0]} c="#3a3d42" ro={0.6} />
    <Bx s={[0.6, 0.58, 0.6]} p={[0, 0.32, 0]} c={body} m={0.4} ro={0.4} rad={0.02} />
    {([[-1, -1], [1, -1], [-1, 1], [1, 1]] as [number, number][]).map(([a, b], i) => <Bx key={i} s={[0.04, 0.6, 0.04]} p={[a * 0.29, 0.32, b * 0.29]} c="#8d939a" m={0.6} ro={0.4} rad={0.008} />)}
    {/* aletas de foto (vuelta 1: «unidad de juguete»): blanquean con la escarcha */}
    <PhotoPl w={0.52} h={0.5} name="t_aletas.jpg" p={[0, 0.33, 0.302]} rep={[2, 2]} tint={fin} m={0.5 - 0.4 * frost} ro={0.45 + 0.4 * frost} />
    <PhotoPl w={0.52} h={0.5} name="t_aletas.jpg" p={[0.302, 0.33, 0]} r={[0, Math.PI / 2, 0]} rep={[2, 2]} tint={fin} m={0.5 - 0.4 * frost} ro={0.45 + 0.4 * frost} />
    <PhotoPl w={0.52} h={0.5} name="t_aletas.jpg" p={[-0.302, 0.33, 0]} r={[0, -Math.PI / 2, 0]} rep={[2, 2]} tint={fin} m={0.5 - 0.4 * frost} ro={0.45 + 0.4 * frost} />
    <Bx s={[0.1, 0.14, 0.02]} p={[0.2, 0.2, 0.305]} c="#8a8e94" m={0.5} ro={0.4} rad={0.006} />
    <Cy rt={0.26} h={0.03} p={[0, 0.615, 0]} c="#2a2c30" ro={0.6} />
    <To R={0.25} t={0.013} p={[0, 0.632, 0]} r={[Math.PI / 2, 0, 0]} c="#8a8e94" m={0.7} ro={0.35} />
    <To R={0.15} t={0.008} p={[0, 0.632, 0]} r={[Math.PI / 2, 0, 0]} c="#8a8e94" m={0.7} ro={0.35} />
    <group position={[0, 0.625, 0]} rotation={[0, fan, 0]}>
      <Cy rt={0.04} h={0.04} c="#1a1a1a" ro={0.4} />
      {[0, 1, 2, 3, 4].map((i) => <Bx key={i} s={[0.19, 0.005, 0.075]} p={[0.12 * Math.cos(i * 1.2566), 0, -0.12 * Math.sin(i * 1.2566)]} r={[0.32, i * 1.2566, 0]} c="#3a3d42" ro={0.5} />)}
    </group>
    {[-0.17, 0, 0.17].map((x, i) => <Bx key={i} s={[0.01, 0.012, 0.5]} p={[x, 0.64, 0]} c="#1a1a1a" ns />)}
    {ice > 0 && <Bx s={[0.63, 0.57 * ice, 0.63]} p={[0, 0.04 + 0.285 * ice, 0]} c="#dff2ff" o={0.6} ro={0.05} m={0.1} />}
  </group>;
};

// mano con guante de trabajo de cuero (vuelta 1: «mano de maniquí»): palma ovalada, dedos-cápsula con nudillos, puño elástico y la manga del polo
const GL = "#c9a26a", GLD = "#a8814c";
const Fing: React.FC<{ x: number; l: number; curl: number }> = ({ x, l, curl }) => <group position={[x, 0.045, 0]} rotation={[curl * 1.1, 0, 0]}>
  <Cy rt={0.0115} h={l * 0.5} p={[0, l * 0.25, 0]} c={GL} ro={0.85} seg={16} />
  <group position={[0, l * 0.5, 0]} rotation={[curl * 0.9, 0, 0]}><Sp rad={0.0125} c={GLD} ro={0.85} seg={14} /><Cy rt={0.011} rb={0.0115} h={l * 0.45} p={[0, l * 0.22, 0]} c={GL} ro={0.85} seg={16} /><Sp rad={0.011} p={[0, l * 0.45, 0]} c={GL} ro={0.85} seg={14} /></group>
</group>;
export const Hand: React.FC<{ p?: V3; r?: V3; s?: number; curl?: number; sleeve?: string }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, curl = 0.5, sleeve = "#9cc3e6" }) =>
  <group position={p} rotation={r} scale={s}>
    <Sp rad={0.05} sc={[1.05, 1.0, 0.45]} c={GL} ro={0.85} seg={24} />
    {[-0.034, -0.012, 0.011, 0.033].map((x, i) => <Fing key={i} x={x} l={[0.07, 0.082, 0.078, 0.062][i]} curl={curl} />)}
    <group position={[0.048, -0.005, 0.012]} rotation={[0.3, 0, -0.85 - curl * 0.3]}><Cy rt={0.013} h={0.05} p={[0, 0.025, 0]} c={GL} ro={0.85} seg={16} /><Sp rad={0.013} p={[0, 0.05, 0]} c={GL} ro={0.85} seg={14} /></group>
    <Cy rt={0.045} rb={0.047} h={0.05} p={[0, -0.065, 0]} c="#7d6a50" ro={0.95} seg={24} />
    <Cy rt={0.04} rb={0.046} h={0.3} p={[0, -0.24, 0]} c="#5b3a26" ro={0.6} seg={24} />
    <Cy rt={0.06} rb={0.07} h={0.12} p={[0, -0.36, 0]} c={sleeve} ro={0.85} seg={24} />
  </group>;

// pasto con helada (textura) + matas
const GRASS = () => canvasTex("grass11", 512, 512, (g) => {
  g.fillStyle = "#4f6a3c"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 5200; i++) { const x = rnd(i) * 512, y = rnd(i, 2) * 512, w = rnd(i, 3); g.strokeStyle = w > 0.55 ? `rgba(235,244,250,${0.35 + 0.4 * rnd(i, 4)})` : `rgba(${60 + 40 * w},${90 + 50 * w},50,.8)`; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd(i, 5) - 0.5) * 6, y - 6 - 8 * rnd(i, 6)); g.stroke(); }
});
// vuelta 3 (EVALUADOR v2: «el pasto parece papel picado»): losa de hormigón bajo la unidad, pasto oscuro y apagado alrededor con la mata grande
export const FrostGround: React.FC<{ w?: number; d?: number; pad?: boolean }> = ({ w = 7, d = 5, pad = true }) => <group>
  <PhotoGround w={w} d={d} name="t_tierra.jpg" rep={1.1} tint="#857a70" />
  {pad && <group position={[0, 0.004, 0.05]}><PhotoGround w={1.5} d={1.4} name="t_concreto.jpg" rep={1.6} tint="#b9b4aa" /></group>}
  {pad && <Bx s={[1.5, 0.05, 1.4]} p={[0, -0.022, 0.05]} c="#8d8880" ro={0.9} rad={0.01} />}
</group>;
export const GRASS_OLD = GRASS;
export const PINE = () => canvasTex("pine11", 512, 512, (g) => {
  g.fillStyle = "#6b4a2b"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 1400; i++) { const x = rnd(i, 7) * 512, y = rnd(i, 8) * 512, a = rnd(i, 9) * Math.PI; g.strokeStyle = `rgba(${150 + 60 * rnd(i)},${95 + 40 * rnd(i, 2)},45,.9)`; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 26, y + Math.sin(a) * 26); g.stroke(); }
});
export const BRICK = () => canvasTex("brick11", 512, 512, (g) => {
  g.fillStyle = "#cfc3b2"; g.fillRect(0, 0, 512, 512);
  for (let r = 0; r < 16; r++) for (let c = -1; c < 5; c++) { const x = c * 128 + (r % 2) * 64, y = r * 32, k = rnd(r * 13 + c, 3); g.fillStyle = `rgb(${150 + 40 * k},${66 + 22 * k},${50 + 14 * k})`; g.fillRect(x + 3, y + 3, 122, 26); }
}, );
export const BrickWall: React.FC<{ w?: number; h?: number; z?: number; x?: number }> = ({ w = 6, h = 3, z = -0.6, x = 0 }) => <PhotoWall w={Math.max(w, 10)} h={Math.max(h, 4.6)} z={z} x={x} tint="#d8c8bc" />;
// canaleta de aluminio con su borde (a lo largo de x), centro en p
export const Gutter: React.FC<{ p: V3; w?: number; sag?: number }> = ({ p, w = 2.4, sag = 0 }) => <group position={p}>
  <Bx s={[w, 0.012, 0.13]} p={[0, -0.06 - sag, 0]} c="#e6e8ea" m={0.6} ro={0.35} />
  <Bx s={[w, 0.12, 0.012]} p={[0, 0, 0.065]} c="#f0f1f2" m={0.6} ro={0.3} />
  <Bx s={[w, 0.12, 0.012]} p={[0, 0, -0.065]} c="#d8dadc" m={0.6} ro={0.35} />
  <Bx s={[w + 0.3, 0.05, 0.5]} p={[0, 0.1, -0.25]} c="#3b3a3c" ro={0.8} />
</group>;
// hoja seca de verdad (foto con alfa): arce o roble según el color pedido
export const Leaf: React.FC<{ p: V3; r?: V3; s?: number; c?: string }> = ({ p, r = [0, 0, 0], s = 1, c = "#9a5a28" }) => <PhotoLeaf p={p} r={r} s={s * 0.8} kind={Math.max(0, LEAFC.indexOf(c))} />;
export const LEAFC = ["#9a5a28", "#b07a30", "#7d4a22", "#c08a3a", "#6e3f1e"];
export const Mug: React.FC<{ p: V3; c?: string }> = ({ p, c = "#ffffff" }) => <group position={p}>
  <Cy rt={0.045} rb={0.04} h={0.11} p={[0, 0.055, 0]} c={c} ro={0.3} />
  <Cy rt={0.04} h={0.005} p={[0, 0.105, 0]} c="#2a160b" ro={0.15} />
  <To R={0.025} t={0.007} p={[0.05, 0.06, 0]} r={[0, 0, Math.PI / 2]} arc={Math.PI} c={c} ro={0.3} />
</group>;
export const Bench: React.FC<{ w?: number; d?: number }> = ({ w = 3.4, d = 1.8 }) => <group><Bx s={[w, 0.08, d]} p={[0, -0.041, 0.2]} c="#6a4426" ro={0.6} /><group position={[0, 0.001, 0.2]}><PhotoGround w={w} d={d} name="t_madera.jpg" rep={1.4} /></group></group>;
export const Ball: React.FC<{ p: V3; r: number; c: string; e?: number; o?: number }> = ({ p, r, c, e = 0, o }) => <Sp rad={r} p={p} c={c} e={e ? c : undefined} ei={e} o={o} ro={0.4} ns />;
// decorado quieto: no cae con la llegada escalonada de S3
env(FrostGround); env(BrickWall); env(Bench);
