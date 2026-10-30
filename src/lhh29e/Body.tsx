// lhh29 (desde len29) · EL VIDEO ENTERO. Un solo mundo (la cocina de Loretta en 3D, world.tsx) y una sola cámara; el avatar entra y sale
// con CORTE SECO; las fotos/clips entran por tramos (plan.json, anclados a su frase); un componente único por minuto (heroes.json).
// CTA = su House Book abierto en la mesa + QR grande (cta1 ~1 min, cta2 ~55 %), van como héroes para caer fuera del avatar. Audio fuera de Remotion (encfin).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { LowerThird, Vid, e } from "./lib";
import CARDS from "./cards.json";
import { AskCard, CoverFlow } from "./premium";
import { Avatar, Clip, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import HEROES from "./heroes.json";
import { H } from "./hkit";
import { BookCTA, HymnTag, SubTag } from "./bpieces";
import { HPennies15, HSwapBox, HRibbon79, HSplash, HPatPat, HOvernight, HNoRub, HFourPlaces, HRug41, HEggMoney } from "./heroes_e1";
import { HSlipperyLinks, HMiddleOut, HCorn51, HSprayRecipe, HSSwipe, HSettle, HGravy200, HLumps, HSlurry, HCupThick } from "./heroes_e2";
import { HBoilMinute, HHalfHalf, HPotluck, HOilCools, HParsonage120, HBoardsRub, HFreezeThaw, HChalkyBoil, HPinochle, HShakeBag } from "./heroes_e3";
import { HDeckSpoon, HPowderTin, HYeastNo, HToughBatch, HTwoCents, HOobleck, HNoScreen, HOilFur, HGloveSlide } from "./heroes_e4";
import { HBootsDry, HShelf4, HSixInRow, HPaste, HSoftStiff, HSeal, HNoWeep, HYears47, HNextVinegar } from "./heroes_e5";

type Seg = [number, number, string, string];
type Ov = { k: string; at: number; out: number; [x: string]: any };
type Txt = { recapTitle: string; recap: string[]; ask: [string, string, string]; lower: [number, number] };
const PL = PLAN as unknown as { segs: Seg[]; ov: Ov[]; end: number; txt: Txt };
export const END = PL.end;

// ===== la BASE: foto/clip del tramo (con zoom lento) o el mundo =====
const base = (t: number): React.ReactNode => {
  const g = PL.segs.find(([a, b]) => t >= a && t < b);
  if (!g) return <World t={t} />;
  const [a, , , id] = g;
  // clip de Veo (8 s, ya con movimiento): va entero desde su cuadro 0; si todavía no llegó, el mundo
  if (id.startsWith("v")) return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : <World t={t} />;
  return <Clip k={"c_" + id} t={t} a={a}><Shot k={id} t={t} a={a} /></Clip>;
};
const nowAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
const avOn = (a: number, b: number) => WIN.some((w) => a < w.me && b > w.ms);
const Stage: React.FC<{ t: number }> = ({ t }) => (nowAv(t) ? <Avatar t={t} /> : <>{base(t)}</>);

// ===== los 5 errores y el repaso: carrusel 3D de tarjetas con foto (sobre el avatar se esconde) =====
const CJ = CARDS as unknown as { err?: string[]; rec?: string[] };
const MIS = PL.ov.filter((o) => o.k === "mistake").sort((a, b) => a.n - b.n);
const DEAL = PL.ov.find((o) => o.k === "deal");
const REC = PL.ov.find((o) => o.k === "recap");
// entre error y error, si hay foto, el carrusel se va (corte seco) y la foto se ve; sin foto queda el carrusel (la cocina vacía es peor)
const misOn = (t: number) => MIS.some((m, i) => t >= (i === 0 ? DEAL?.at ?? m.at - 1 : m.at - 0.6) && t < m.out + 0.6);
const shotOn = (t: number) => (PL.segs as unknown as [number, number, string][]).some((g) => g[2] === "shot" && t >= g[0] && t < g[1]);
const Carousels: React.FC<{ t: number }> = ({ t }) => <>
  {MIS.length > 0 && <CoverFlow t={t} at={DEAL?.at ?? MIS[0].at - 1} out={MIS[MIS.length - 1].out} hide={nowAv(t) || (shotOn(t) && !misOn(t))} kicker="DON'T DO THESE" title={`THE ${MIS.length} MISTAKES`} col="red"
    cards={MIS.map((m, i) => ({ img: CJ.err?.[i], at: m.at, n: m.n, title: m.txt }))} />}
  {REC && <CoverFlow t={t} at={REC.at} out={REC.out} hide={nowAv(t)} kicker="START TO FINISH" title={PL.txt.recapTitle}
    cards={PL.txt.recap.map((n, i) => ({ img: CJ.rec?.[i], at: REC.rows[i] ?? REC.out, n: i + 1, title: n })).filter((c) => c.at < REC.out)} />}
</>;

// ===== un componente ÚNICO por minuto (heroes.json) =====
const HC: Record<string, React.FC<{ t: number; h: H }>> = { pennies15: HPennies15, swapbox: HSwapBox, ribbon79: HRibbon79, splash: HSplash, patpat: HPatPat, overnight: HOvernight, norub: HNoRub, fourplaces: HFourPlaces, rug41: HRug41, eggmoney: HEggMoney, slipperylinks: HSlipperyLinks, middleout: HMiddleOut, corn51: HCorn51, sprayrecipe: HSprayRecipe, sswipe: HSSwipe, settle: HSettle, gravy200: HGravy200, lumps: HLumps, slurry: HSlurry, cupthick: HCupThick, boilminute: HBoilMinute, halfhalf: HHalfHalf, potluck: HPotluck, oilcools: HOilCools, parsonage120: HParsonage120, boardsrub: HBoardsRub, freezethaw: HFreezeThaw, chalkyboil: HChalkyBoil, pinochle: HPinochle, shakebag: HShakeBag, deckspoon: HDeckSpoon, powdertin: HPowderTin, yeastno: HYeastNo, toughbatch: HToughBatch, twocents: HTwoCents, oobleck: HOobleck, noscreen: HNoScreen, oilfur: HOilFur, gloveslide: HGloveSlide, bootsdry: HBootsDry, shelf4: HShelf4, sixinrow: HSixInRow, paste: HPaste, softstiff: HSoftStiff, seal: HSeal, noweep: HNoWeep, years47: HYears47, nextvinegar: HNextVinegar };
// la foto más cercana a ese segundo para el fondo desenfocado del componente
const imgNear = (t: number): string | undefined => {
  let best: string | undefined, bd = 30;
  for (const [a, b, , id] of PL.segs) { if (id.startsWith("v")) continue; const d = t < a ? a - t : t > b ? t - b : 0; if (d < bd) { bd = d; best = id; } }
  return best;
};
const HS: H[] = (HEROES as H[]).map((h) => ({ ...h, bg: imgNear(h.at + 1) }));
const CTA: React.FC<{ t: number; h: H }> = ({ t, h }) => <BookCTA t={t} at={h.at} out={h.out} v={h.k === "cta2" ? 2 : 1} page={(h as unknown as { page?: string }).page} />;
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => { const C = h.k.startsWith("cta") ? CTA : HC[h.k] as React.FC<{ t: number; h: H }> | undefined; return C && t > h.at - 0.1 && t < h.out + 0.9 ? <C key={i} t={t} h={h} /> : null; })}</>;
const underHero = (o: Ov) => HS.some((h) => o.at < h.out + 0.9 && o.out > h.at - 0.6);

const Piece: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  if (t < o.at - 0.6 || t > o.out + 1.0 || (o.k === "step" && underHero(o))) return null;
  switch (o.k) {
    case "sub": return <SubTag t={t} at={o.at} out={o.out} />;
    case "step": return <HymnTag t={t} at={o.at} out={o.out} n={o.n} name={o.name} side={avOn(o.at, o.out)} />;
    case "ask": return <AskCard t={t} at={o.at} out={o.out} q={PL.txt.ask} side={avOn(o.at, o.out)} />;
  }
  return null;
};

export const Body: React.FC = () => {
  const f = useCurrentFrame(); const t = (f === 25465 ? f + 0.5 : f) / 30; // el 25465 sale con un panel marrón sólo en el farm: medio cuadro corrido
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    {/* cámara a mano virtual (balanceo lento, no temblor) sobre todo lo que se filma */}
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    <LowerThird t={t} at={PL.txt.lower[0]} out={PL.txt.lower[1]} name="LORETTA" l2="81 · ZION UNITED METHODIST · IOWA" l2at={PL.txt.lower[0] + 1} />
    <Carousels t={t} />
    {PL.ov.map((o, i) => <Piece key={i} t={t} o={o} />)}
    <Heroes t={t} />
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};

// sólo para revisar componentes en stills (sin el mundo 3D)
export const HeroesOnly: React.FC = () => { const t = useCurrentFrame() / 30; return <AbsoluteFill style={{ background: "#111" }}><Heroes t={t} /></AbsoluteFill>; };
