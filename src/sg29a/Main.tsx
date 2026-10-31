// sg29a · «5 Kitchen Scraps» — el video entero en un solo reloj (los segundos son los de la locución final).
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

const SLUG = "sg29a";
export const END = (PLAN as { end: number }).end;
const SH = (PLAN as { shots: Shot[] }).shots;
const { at, atEnd, wordsIn } = mkAt(WORDS as never);
const { Avatar, inAv, Photo, Veo, Stage } = mkBase(SLUG, (AVW as { win: Win[] }).win, (REEL as { ok: boolean }).ok, new Set(VEOOK as string[]));
const FX = mkFx(Stage as never, at, atEnd) as Record<string, React.FC<{ t: number; a: number; b: number }>>;

// ---------- el jardín: un encuadre por tramo 3D, elegido por lo que se está diciendo ----------
const pickF = (txt: string, i: number) => {
  const T = txt.toLowerCase();
  const by: [RegExp, string[]][] = [
    [/tomato|mold|jelly|pepper/, ["tomato", "tomatoClose"]], [/squash|pumpkin|vine|neighbo|fence/, ["high", "wide"]],
    [/frost|spring|cherry|lilac|garlic|straw/, ["oak", "wideLow"]], [/jar|drawer|envelope|rice|plate|label|onion|window/, ["step", "wideLow"]],
  ];
  for (const [re, f] of by) if (re.test(T)) return f[i % f.length];
  return ["wideLow", "oak", "tomato", "step", "high", "wide", "tomatoClose"][i % 7];
};
const WORLD = SH.filter((x) => x.k === "world");
// nunca el mismo encuadre dos tramos seguidos (el evaluador vio la casa en plano general una y otra vez)
const ALT = ["step", "tomato", "oak", "high", "wideLow", "tomatoClose", "wide"];
let prevF = "";
const KEYS = mkKeys(F0, WORLD.flatMap((x, i) => {
  const txt = wordsIn(x.a, x.b).map((w) => w.text).join(" ");
  let f = pickF(txt, i); if (f === prevF) f = ALT[i % ALT.length] === f ? ALT[(i + 1) % ALT.length] : ALT[i % ALT.length]; prevF = f;
  return [[x.a, f, 0] as [number, string, number], [x.b + 0.01, f, 0.22] as [number, string, number]];
}));
const tWhen = at("and when do you plant all this in the spring"), tPrize = at("and now the rice jar");
const stAt = (t: number): GState => ({
  season: t > tWhen && t < tPrize ? 2.6 : 0, dawn: 0.25 + 0.15 * Math.sin(t / 90), frost: 0, shade: 0, tom: 1, ripe: 1, bedSoil: 1,
});

// utilería propia del video sobre la mesa del porche: los frascos de semillas, los platos secando, el vaso de cebolla
const Props: React.FC<{ t: number }> = ({ t }) => (
  <group position={[1.2, 0.985, -1.95]}>
    {[[-0.32, "#f1d38a"], [-0.18, "#efe0b0"], [-0.04, "#f6e9b5"]].map(([x, c], i) => <group key={i} position={[x as number, 0, -0.12]}><Jar fill={c as string} lid="#8a8f94" h={0.15} r={0.05} level={0.6} /></group>)}
    {[0.14, 0.32].map((x, i) => <group key={i} position={[x, 0.005, 0.05]}>
      <Cyl p={[0, 0.006, 0]} r={0.085} h={0.012} c="#cfc9bb" rough={0.6} />
      {Array.from({ length: 9 }, (_, j) => <Ball key={j} p={[Math.cos(j * 2.4) * 0.04 * (j % 3 + 1) / 3, 0.016, Math.sin(j * 2.4) * 0.04 * (j % 3 + 1) / 3]} r={0.009} s={[1, 0.4, 1.6]} c={i ? "#f6e9b5" : "#f1d38a"} />)}
    </group>)}
    <group position={[0.45, 0, -0.15]}>
      <Cyl p={[0, 0.05, 0]} r={0.03} h={0.1} c="#dfeaf0" rough={0.05} op={0.35} />
      {[0, 1, 2].map((j) => <Cyl key={j} p={[(j - 1) * 0.012, 0.11 + 0.01 * Math.sin(t + j), 0]} r={0.005} h={0.16} c="#6fbe5a" />)}
    </group>
    <Pop k={1} p={[-0.45, 0, 0.1]}><Box p={[0, 0.03, 0]} s={[0.12, 0.06, 0.08]} c="#efe3c4" r={0.9} rad={0.004} /></Pop>
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
