// ohf30 (desde lhh29) · EL VIDEO ENTERO. Un solo mundo (la casa vieja en corte, house3d) y una sola cámara; el avatar entra y sale
// con CORTE SECO; el metraje REAL (rNN, clip-hunter) y los Veo (vNN) entran por tramos anclados a su frase (plan.json); un componente
// único por minuto (heroes.json). CTA = el Winter Manual abierto en la mesita + QR grande (cta1 ~1 min, cta2 ~55 %). Audio fuera de Remotion.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { LowerThird, Vid, e } from "./lib";
import CARDS from "./cards.json";
import { AskCard, CoverFlow } from "./premium";
import { Avatar, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import HEROES from "./heroes.json";
import { H } from "./hkit";
import { BookCTA, StepTag, SubTag } from "./bpieces";
import { F0, Frame0 } from "./frame0";
import { HCurtain, HGaps, HDepress, HIncense, HTapeMarks, HFlashlight } from "./heroes_c1";
import { HAnatomy, HBeadStop, HWeights, HMotions, HVStrip, HBronzeVinyl, HPile, HBulb } from "./heroes_c2";
import { HRopeCaulk, HPaintLayers, HNoDrySand, HDropCloth, HHepa, HSwab, HNoScrape, HMeasureCut, HVWind, HSnugTest } from "./heroes_c3";
import { HRailGap, HSashLock, HRailVStrip, HWedgeGap, HThickness, HRotSill, HRopePress, HPulleyDraft, HBrokenCord } from "./heroes_c4";
import { HPartingBead, HShrinkFilm, HEgress, HCombustAir, HCOAlarm, HStormSwap, HWeepHoles, HRecapWindow, HWeekendOrder, HAtticHatch, HWavyGlass } from "./heroes_c5";

type Seg = [number, number, string, string];
type Ov = { k: string; at: number; out: number; [x: string]: any };
type Txt = { recapTitle: string; recap: string[]; ask: [string, string, string]; lower: [number, number]; word?: string };
const PL = PLAN as unknown as { segs: Seg[]; ov: Ov[]; end: number; txt: Txt };
export const END = PL.end;

// ===== la BASE: metraje real / Veo / foto del tramo, o el mundo =====
const base = (t: number): React.ReactNode => {
  const g = PL.segs.find(([a, b]) => t >= a && t < b);
  if (!g) return <World t={t} />;
  const [a, b, , id] = g;
  // clip de Veo (8 s, ya con movimiento): entero desde su cuadro 0; si todavía no llegó, el mundo
  if (id.startsWith("v")) return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : <World t={t} />;
  // metraje real conformado (1920x1080 30 fps): corre desde su cuadro 0, con un empuje muy lento
  if (id.startsWith("r")) return <AbsoluteFill style={{ transform: `scale(${1.015 + 0.035 * e(t, a, Math.max(a + 4, b))})` }}><Vid id={"real/" + id} at={a} /></AbsoluteFill>;
  return <Shot k={id} t={t} a={a} />;
};
const nowAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
const avOn = (a: number, b: number) => WIN.some((w) => a < w.me && b > w.ms);
const Stage: React.FC<{ t: number }> = ({ t }) => (nowAv(t) ? <Avatar t={t} /> : <>{base(t)}</>);

// ===== los errores y el repaso: carrusel 3D de tarjetas con foto (sobre el avatar se esconde) =====
const CJ = CARDS as unknown as { err?: string[]; rec?: string[] };
const MIS = PL.ov.filter((o) => o.k === "mistake").sort((a, b) => a.n - b.n);
const DEAL = PL.ov.find((o) => o.k === "deal");
const REC = PL.ov.find((o) => o.k === "recap");
const Carousels: React.FC<{ t: number }> = ({ t }) => <>
  {MIS.length > 0 && <CoverFlow t={t} at={DEAL?.at ?? MIS[0].at - 1} out={MIS[MIS.length - 1].out} hide={nowAv(t)} kicker="" title="" col="red"
    cards={MIS.map((m, i) => ({ img: CJ.err?.[i], at: m.at, n: m.n, title: m.txt }))} />}
  {REC && <CoverFlow t={t} at={REC.at} out={REC.out} hide={nowAv(t)} kicker="" title=""
    cards={PL.txt.recap.map((n, i) => ({ img: CJ.rec?.[i], at: REC.rows[i] ?? REC.out, n: i + 1, title: n })).filter((c) => c.at < REC.out)} />}
</>;

// ===== un componente ÚNICO por minuto (heroes.json) =====
const HC: Record<string, React.FC<{ t: number; h: H }>> = { curtain: HCurtain, gaps: HGaps, depress: HDepress, incense: HIncense, tapemarks: HTapeMarks, flashlight: HFlashlight, anatomy: HAnatomy, beadstop: HBeadStop, weights: HWeights, motions: HMotions, vstrip: HVStrip, bronzevinyl: HBronzeVinyl, pile: HPile, bulb: HBulb, ropecaulk: HRopeCaulk, paintlayers: HPaintLayers, nodrysand: HNoDrySand, dropcloth: HDropCloth, hepa: HHepa, swab: HSwab, noscrape: HNoScrape, measurecut: HMeasureCut, vwind: HVWind, snugtest: HSnugTest, railgap: HRailGap, sashlock: HSashLock, railvstrip: HRailVStrip, wedgegap: HWedgeGap, thickness: HThickness, rotsill: HRotSill, ropepress: HRopePress, pulleydraft: HPulleyDraft, brokencord: HBrokenCord, partingbead: HPartingBead, shrinkfilm: HShrinkFilm, egress: HEgress, combustair: HCombustAir, coalarm: HCOAlarm, stormswap: HStormSwap, weepholes: HWeepHoles, recapwindow: HRecapWindow, weekendorder: HWeekendOrder, attichatch: HAtticHatch, wavyglass: HWavyGlass };
// el cuadro más cercano a ese segundo (metraje real) para el fondo desenfocado del componente
const imgNear = (t: number): string | undefined => {
  let best: string | undefined, bd = 30;
  for (const [a, b, , id] of PL.segs) { if (id.startsWith("v")) continue; const d = t < a ? a - t : t > b ? t - b : 0; if (d < bd) { bd = d; best = id; } }
  return best;
};
const HS: H[] = (HEROES as H[]).map((h) => ({ ...h, bg: imgNear(h.at + 1) }));
const CTA: React.FC<{ t: number; h: H }> = ({ t, h }) => <BookCTA t={t} at={h.at} out={h.out} v={h.k === "cta2" ? 2 : 1} />;
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => { const C = h.k.startsWith("cta") ? CTA : HC[h.k] as React.FC<{ t: number; h: H }> | undefined; return C && t > h.at - 0.1 && t < h.out + 0.9 ? <C key={i} t={t} h={h} /> : null; })}</>;
const underHero = (o: Ov) => HS.some((h) => o.at < h.out + 0.9 && o.out > h.at - 0.6);

const Piece: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  if (t < o.at - 0.6 || t > o.out + 1.0 || (o.k === "step" && underHero(o))) return null;
  switch (o.k) {
    case "sub": return <SubTag t={t} at={o.at} out={o.out} />;
    case "step": return <StepTag t={t} at={o.at} out={o.out} n={o.n} name={o.name} side={avOn(o.at, o.out)} word={PL.txt.word} />;
    case "ask": return <AskCard t={t} at={o.at} out={o.out} q={PL.txt.ask} side={avOn(o.at, o.out)} />;
  }
  return null;
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    <LowerThird t={t} at={PL.txt.lower[0]} out={PL.txt.lower[1]} name="THE OLD HOUSE FIX" l2="HEAT · DRAFTS · PIPES · OLD HOUSES" l2at={PL.txt.lower[0] + 1} />
    <Carousels t={t} />
    {PL.ov.map((o, i) => <Piece key={i} t={t} o={o} />)}
    <Heroes t={t} />
    {/* cuadro 0: la miniatura rehecha en código; a los F0 s, corte seco al avatar */}
    {t < F0 && <Frame0 t={t} />}
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};

// sólo para revisar componentes en stills (sin el mundo 3D)
export const HeroesOnly: React.FC = () => { const t = useCurrentFrame() / 30; return <AbsoluteFill style={{ background: "#111" }}><Heroes t={t} /></AbsoluteFill>; };
