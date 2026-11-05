// sg29b · «Bury These 5 Kitchen Scraps» — el video entero en un solo reloj (los segundos son los de la locución final).
// Capas: avatar (corte seco) ⇄ fotos/Veo ⇄ componente en su escenario ⇄ el jardín 3D. Todo sale de plan.json (plan.py).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "../sg29kit/k";
import { mkAt } from "../sg29kit/k";
import { mkBase, Shot, Win } from "../sg29kit/base";
import { F0, Garden, GState, Jar, mkKeys, Pop, Ball, Cyl, Box } from "../sg29kit/world";
import { mkFx } from "./fx";
import WORDS from "./words.json";
import AVW from "./avwin.json";
import PLAN from "./plan.json";
import VEOOK from "./ltx_ok.json";
import REEL from "./reel.json";

const SLUG = "sg29b";
export const END = (PLAN as { end: number }).end;
const SH = (PLAN as { shots: Shot[] }).shots;
const { at, atEnd, wordsIn } = mkAt(WORDS as never);
const { Avatar, inAv, Photo, Veo, Stage } = mkBase(SLUG, (AVW as { win: Win[] }).win, (REEL as { ok: boolean }).ok, new Set(VEOOK as string[]));
const FX = mkFx(Stage as never, at, atEnd) as Record<string, React.FC<{ t: number; a: number; b: number }>>;

// ---------- el jardín: un encuadre por tramo 3D, elegido por lo que se está diciendo ----------
const pickF = (txt: string, i: number) => {
  const T = txt.toLowerCase();
  const by: [RegExp, string[]][] = [
    [/tomato|worm|soil|dig|trench|bury|bed/, ["tomato", "tomatoClose"]], [/neighbo|fence|garage|winter|raccoon/, ["high", "wide"]],
    [/frost|spring|persimmon|osaka|mother/, ["wide", "wideLow"]], [/bucket|lid|bran|rice|plate|bread|coffee|peel|tofu/, ["wideLow", "high"]],
  ];
  for (const [re, f] of by) if (re.test(T)) return f[i % f.length];
  return ["wideLow", "tomato", "high", "wide", "tomatoClose"][i % 5];
};
const WORLD = SH.filter((x) => x.k === "world");
// nunca el mismo encuadre dos tramos seguidos (el evaluador vio la casa en plano general una y otra vez)
const ALT = ["wideLow", "tomato", "high", "wide", "tomatoClose"];
let prevF = "";
const KEYS = mkKeys(F0, WORLD.flatMap((x, i) => {
  const txt = wordsIn(x.a, x.b).map((w) => w.text).join(" ");
  let f = pickF(txt, i); if (f === prevF) f = ALT[i % ALT.length] === f ? ALT[(i + 1) % ALT.length] : ALT[i % ALT.length]; prevF = f;
  return [[x.a, f, 0] as [number, string, number], [x.b + 0.01, f, 0.22] as [number, string, number]];
}));
const tFrost = at("and why before the frost"), tSpring = at("and what do you plant on top in spring"), tCheck = at("and how do you know the bucket");
const stAt = (t: number): GState => ({
  season: t > tSpring && t < tCheck ? 2.6 : 0, dawn: 0.25 + 0.15 * Math.sin(t / 90), frost: t > tFrost && t < tSpring ? 0.8 : 0, shade: 0, tom: t > tSpring && t < tCheck ? 1 : 0.4, ripe: 1, bedSoil: 1,
});

// utilería propia del video sobre la mesa del porche: el balde de bokashi con tapa, la bolsa de afrecho, el plato viejo, el frasquito de té
const Props: React.FC<{ t: number }> = ({ t }) => (
  <group position={[1.2, 0.985, -1.95]}>
    <group position={[-0.3, 0, -0.08]}>
      <Cyl p={[0, 0.11, 0]} r={0.085} h={0.22} c="#e9e4d6" rough={0.5} />
      <Cyl p={[0, 0.226, 0]} r={0.091} h={0.016} c="#d8d1bf" rough={0.45} />
      <Cyl p={[0, 0.07, 0]} r={0.087} h={0.012} c="#cfc6b0" rough={0.6} />
    </group>
    <Pop k={1} p={[-0.08, 0, 0.02]}><Box p={[0, 0.07, 0]} s={[0.11, 0.14, 0.07]} c="#c9a774" r={0.95} rad={0.008} /></Pop>
    <Cyl p={[0.14, 0.006, 0.06]} r={0.08} h={0.012} c="#cfc9bb" rough={0.6} />
    <group position={[0.36, 0, -0.12]}>
      <Jar fill="#6b4a26" lid="#8a8f94" h={0.12} r={0.04} level={0.45 + 0.05 * Math.sin(t / 7)} />
    </group>
  </group>
);

export const Main: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  if (inAv(t)) return <Avatar t={t} />;
  const sh = SH.find((x) => t >= x.a && t < x.b) ?? SH[SH.length - 1];
  let body: React.ReactNode = null;
  if (sh.k === "img") body = <Photo id={sh.id} t={t} a={sh.a} b={sh.b} seed={sh.seed} />;
  else if (sh.k === "veo") body = <Veo sh={sh} t={t} />;
  else if (sh.k === "fx") { const C = FX[sh.id]; body = C ? <C t={t} a={sh.a} b={sh.b} /> : null; }
  else body = <Garden t={t} keys={KEYS} st={stAt(t)}><Props t={t} /></Garden>;
  return <AbsoluteFill style={{ background: "#111" }}>{body}</AbsoluteFill>;
};
