// swl29c · «Seven Pork Chop Suppers for One». Motor yanqui3d: base = avatar (ventanas pagadas, fijas) /
// Loretta HACIENDO lo que cuenta (Veo) / la foto del momento / la cocina 3D. Encima, UN componente único por minuto (comps.tsx,
// registro en D:/rtmp/swl29_COMPONENTES.md) anclado a su frase. Plan: D:/rtmp_swl29c/mk_plan.py → rest_beats.json. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { KitchenWorld, Scene, BOOK } from "./kitchen3d";
import { setSlug } from "../kits/yanqui3d/lib";
import { makeVideo, Beat } from "../kits/yanqui3d/engine";
import { PieTitle, ZItem, ZocaloStack } from "./ui";
import * as CP from "./comps";
import { H } from "./kit";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import RB from "./rest_beats.json";

setSlug("swl29c");
export const TEND = RB.TEND;
export const FULL_FRAMES = Math.ceil(TEND * 30);

type V3 = [number, number, number];
const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const sm = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };
const drift = (p0: V3, p1: V3, l0: V3, l1: V3, f0: number, f1: number, u: number, dur = 9) => {
  const k = sm(u / dur);
  return { p: mix(p0, p1, k), l: mix(l0, l1, k), fov: f0 + (f1 - f0) * k };
};
const PLATE: V3 = [-0.08, 0.8, -0.45], OVENWIN: V3 = [1.18, 0.4, -2.35], KNOB: V3 = [1.25, 1.02, -2.28], LIST: V3 = [-2.24, 1.0, -2.09];
const BK: V3 = [BOOK[0] - 0.02, BOOK[1] + 0.02, BOOK[2]];

const sceneOf = (name: string, u: number): Scene => {
  const [kind, arg = ""] = name.split(":");
  const n = parseInt(arg) || 0, side = n % 2 ? 1 : -1;
  if (kind === "table") {
    return arg === "warm"
      ? { cam: drift([0.75, 1.32, 0.55], [0.25, 1.14, 0.18], PLATE, PLATE, 36, 32, u), st: { plateDish: true }, kind: 0 }
      : { cam: drift([2.0, 1.5, 1.45], [1.62, 1.4, 1.0], [0.35, 0.8, -0.45], [0.3, 0.8, -0.45], 40, 37, u) };
  }
  if (kind === "book") {
    const pg = arg.slice(0, 3);
    if (pg === "001") return { cam: drift([BK[0] + 0.05, BK[1] + 0.42, BK[2] + 0.3], [BK[0] - 0.04, BK[1] + 0.3, BK[2] + 0.12], [BK[0] - 0.03, BK[1], BK[2] - 0.01], [BK[0] - 0.01, BK[1], BK[2] - 0.01], 34, 30, u, 8), book: { open: sm((u - 0.5) / 1.3), page: "003" } };
    // la página de la cena (la real del libro) se da vuelta desde la 3
    return { cam: drift([BK[0] + 0.0, BK[1] + 0.4, BK[2] + 0.16], [BK[0] + 0.02, BK[1] + 0.3, BK[2] + 0.07], [BK[0] - 0.02, BK[1], BK[2] - 0.01], [BK[0] + 0.02, BK[1], BK[2] - 0.01], 34, 30, u, 9), book: { open: 1, page: pg, from: "003", turn: sm((u - 0.3) / 1.2) } };
  }
  if (kind === "fridge") return { cam: drift([-1.95, 1.05, -1.3], [-2.08, 0.95, -1.7], [-2.17, 0.8, -2.55], [-2.16, 0.78, -2.6], 44, 38, u), st: { fridge: 1 }, fridgeFood: true };
  if (kind === "list") return { cam: drift([-2.05, 1.12, -1.4], [-2.22, 1.04, -1.68], [-2.2, 1.02, -2.09], LIST, 36, 30, u), list: true, st: { night: 1, warm: 1 } };
  if (kind === "bake") return { cam: drift([1.24 + 0.05 * side, 0.6, -1.5], [1.2, 0.48, -1.85], OVENWIN, [1.18, 0.38, -2.4], 34, 27, u, 8), kind: n };
  if (kind === "plate") return { cam: drift([0.05 + 0.32 * side, 1.18, 0.35], [-0.12 + 0.12 * side, 1.02, 0.02], PLATE, [PLATE[0], 0.79, PLATE[2]], 36, 29, u, 8), st: { plateDish: true }, kind: n };
  if (kind === "row") return { cam: drift([-1.55, 1.5, -1.95], [-1.72, 1.38, 0.4], [-2.72, 0.95, -1.3], [-2.72, 0.95, 0.9], 40, 36, u, 10), st: { row: true } };
  if (kind === "dial") return { cam: drift([1.32, 1.1, -1.88], [1.26, 1.05, -2.02], KNOB, KNOB, 30, 24, u, 5), dial: 0.67 * sm((u - 0.5) / 1.1), st: { ovenLight: sm((u - 1.4) / 0.6) } };
  return { cam: drift([2.0, 1.5, 1.45], [1.62, 1.4, 1.0], [0.35, 0.8, -0.45], [0.3, 0.8, -0.45], 40, 37, u) };
};

const COMP: Record<string, React.FC<{ t: number; h: H }>> = {
  P01: CP.K01, P02: CP.K02, P03: CP.K03, P04: CP.K04, P05: CP.K05, P06: CP.K06, P07: CP.K07, P08: CP.K08, P09: CP.K09, P10: CP.K10, P11: CP.K11, P12: CP.K12, P13: CP.K13, P14: CP.K14, P15: CP.K15, P16: CP.K16, P17: CP.K17, P18: CP.K18, P19: CP.K19, P20: CP.K20, P21: CP.K21, P22: CP.K22, P23: CP.K23, P24: CP.K24, P25: CP.K25, P26: CP.K26, P27: CP.K27, P28: CP.K28, P29: CP.K29, P30: CP.K30,
};
const COMPS = RB.comps as unknown as H[];
const busy = (a: number, b: number) => COMPS.some((c) => a < c.out + 0.6 && b > c.at - 0.3);

const V = makeVideo({
  caps: CAPS as [string, number][], avwin: (AVW.win as { ms: number; me: number; off: number }[]).map((w) => [w.ms, w.me, w.off]),
  avail: AVAIL as { clips: string[]; imgs: string[] }, T0: 0, TEND, flashAtStart: false,
  beats: ({ AV, CL }) => (RB.beats as { a: number; kind: string; k?: string | null; scene?: string; tr: Beat["tr"] }[]).map((b) =>
    b.kind === "AV" ? AV(b.a, b.tr)
      : b.kind === "CL" ? CL(b.a, b.k as string, b.tr, undefined, [1.0, 1.07])
        : ({ a: b.a, tr: b.tr, p: [960, 540], r: (t: number) => <KitchenWorld t={t} sc={sceneOf(b.scene as string, t - b.a)} /> } as Beat)),
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    const A = (ph: string, after = 0) => { try { return at(ph, after); } catch { return -1; } };
    // el componente del minuto (sólo se monta cerca de su tramo)
    for (const c of COMPS) if (t > c.at - 0.2 && t < c.out + 1) { const Cm = COMP[c.k]; if (Cm) L.push(<Cm key={c.k} t={t} h={c} />); }
    // título de cada cena (si no pisa un componente)
    const SUP: [string, number, string][] = [["smothered pork chop with onion gravy", 150, "SMOTHERED CHOP · ONION GRAVY"], ["pork chop baked on a little bed of stuffing", 250, "CHOP ON A BED OF STUFFING"], ["skillet pork chop with mustard gravy", 350, "SKILLET CHOP · MUSTARD GRAVY"], ["pork chop and potatoes on one little sheet pan", 560, "ONE SHEET PAN CHOP & POTATOES"], ["pork chop and rice bake in a loaf pan", 650, "CHOP & RICE IN A LOAF PAN"], ["pork chop with sauerkraut and potato", 880, "THE AMANA CHOP · SAUERKRAUT"], ["ruth's pork chop with apples", 1040, "RUTH'S CHOP WITH APPLES"]];
    SUP.forEach(([ph, aft, name], i) => {
      const a = A(ph, aft); if (a < 0) return;
      if (!busy(a - 0.6, a + 3.8)) L.push(<PieTitle key={"st" + i} t={t} at={a - 0.6} n={i + 1} name={name} out={a + 3.8} />);
    });
    // zócalo del libro (nunca una URL): sólo nombre + «link en la 1ª línea de la descripción»
    const ZS: ZItem[] = [];
    const cta = (key: string, ph: string, d: number, sub: string, aft = 0) => { const a = A(ph, aft); if (a >= 0) ZS.push({ key, a, out: a + d, tone: "book", label: "MY COOKBOOK", txt: "Supper for One", sub }); };
    cta("cta0", "133 more", 4.5, "140 LITTLE SUPPERS FOR ONE", 1300);
    cta("cta1", "the book is called supper for one", 5, "140 SUPPERS · A DOLLAR OR TWO EACH");
    cta("cta2", "first line of the description", 5.5, "LINK IN THE 1ST LINE OF THE DESCRIPTION", 780);
    cta("cta3", "first line of the description", 5.5, "LINK IN THE 1ST LINE OF THE DESCRIPTION", 1300);
    const nw = A("use the good plate", 1390);
    if (nw >= 0) ZS.push({ key: "lt", a: nw - 0.4, out: TEND - 0.5, tone: "name", label: "SUPPER FOR ONE", txt: "Loretta", sub: "USE THE GOOD PLATE" });
    L.push(<ZocaloStack key="zs" t={t} items={ZS.filter((z) => !busy(z.a, z.out))} />);
    return L;
  },
});

export const Full: React.FC = () => <AbsoluteFill><V.Body /></AbsoluteFill>;
export const clipPlan = V.clipPlan;
export const beatTable = V.beatTable;
