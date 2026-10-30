// len29 (desde tdc28a) · EL VIDEO ENTERO. Un solo mundo (la pileta de Lenny en corte, sink3d) y una sola cámara; el avatar entra y sale
// con CORTE SECO; las fotos/clips entran por tramos (plan.json, anclados a su frase); un componente único por minuto (heroes.json).
// Sin guía: el CTA es la etiqueta de suscribirse colgada y la pregunta al final. Audio fuera de Remotion (encfin).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { LowerThird, Vid, e } from "./lib";
import CARDS from "./cards.json";
import { AskCard, CoverFlow } from "./premium";
import { Avatar, Clip, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import HEROES from "./heroes.json";
import REPL from "./repl.json";
import REPLF from "./repl_foto.json";
import { H } from "./hkit";
import { StepTag, SubTag } from "./lpieces";
import { HGlug, HJarLid, HJugs, HPegboard, HRelay, HSnakeOut, HTree, HTreeRings, HXray } from "./heroes3d_b2";
import { HCeiling, HFountain, HGeyser, HPhoneWall, HSandwich, HThieves } from "./heroes3d_b1";
import { HBlueprint, HClockPins, HCorkscrew, HDial, HDinnerTable, HPanWipe, HPins10, HRebar, HRoofVent, HSeismo, HStanCan, HThreeReasons, HTransit, HTwinVortex } from "./heroes3d_b3";

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
const Carousels: React.FC<{ t: number }> = ({ t }) => <>
  {MIS.length > 0 && <CoverFlow t={t} at={DEAL?.at ?? MIS[0].at - 1} out={MIS[MIS.length - 1].out} hide={nowAv(t)} kicker="STOP DOING THESE" title={`THE ${MIS.length} MISTAKES`} col="red"
    cards={MIS.map((m, i) => ({ img: CJ.err?.[i], at: m.at, n: m.n, title: m.txt }))} />}
  {REC && <CoverFlow t={t} at={REC.at} out={REC.out} hide={nowAv(t)} kicker="START TO FINISH" title={PL.txt.recapTitle}
    cards={PL.txt.recap.map((n, i) => ({ img: CJ.rec?.[i], at: REC.rows[i] ?? REC.out, n: i + 1, title: n })).filter((c) => c.at < REC.out)} />}
</>;

// ===== un componente ÚNICO por minuto (heroes.json) =====
const HC: Record<string, React.FC<{ t: number; h: H }>> = { phonewall: HPhoneWall, thieves: HThieves, fountain: HFountain, ceiling: HCeiling, sandwich: HSandwich, geyser: HGeyser,
  jugs: HJugs, tree: HTree, glug: HGlug, pegboard: HPegboard, jarlid: HJarLid, xray: HXray, treerings: HTreeRings, relay: HRelay, snakeout: HSnakeOut,
  blueprint: HBlueprint, corkscrew: HCorkscrew, seismo: HSeismo, dial: HDial, twinvortex: HTwinVortex, transit: HTransit, dinnertable: HDinnerTable,
  clockpins: HClockPins, rebar: HRebar, stancan: HStanCan, pins10: HPins10, roofvent: HRoofVent, threereasons: HThreeReasons, panwipe: HPanWipe };
// la foto más cercana a ese segundo para el fondo desenfocado del componente
const imgNear = (t: number): string | undefined => {
  let best: string | undefined, bd = 30;
  for (const [a, b, , id] of PL.segs) { if (id.startsWith("v")) continue; const d = t < a ? a - t : t > b ? t - b : 0; if (d < bd) { bd = d; best = id; } }
  return best;
};
const HS: H[] = (HEROES as H[]).map((h) => ({ ...h, bg: imgNear(h.at + 1) }));
// componentes que el evaluador dejó <6: los reemplaza su clip Veo (repl.json); si el clip no llegó, queda el componente
const RP = REPL as Record<string, string>;
const RF = new Set(REPLF as string[]);  // plan B: foto agnes de Lenny haciendo la acción, con zoom lento
const FotoHero: React.FC<{ t: number; h: H; id: string }> = ({ t, h, id }) => <AbsoluteFill style={{ opacity: e(t, h.at - 0.1, h.at + 0.4) * (1 - e(t, h.out - 0.4, h.out + 0.2)), transform: `scale(${1.03 + 0.06 * e(t, h.at, h.out + 0.2)})` }}><Vid id={"img_r" + id} /></AbsoluteFill>;
const VeoHero: React.FC<{ t: number; h: H; id: string }> = ({ t, h, id }) => <AbsoluteFill style={{ opacity: e(t, h.at - 0.1, h.at + 0.4) * (1 - e(t, h.out - 0.4, h.out + 0.2)) }}><Vid id={"veo/" + id} at={h.at - 0.1} /></AbsoluteFill>;
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => { const v = RP[h.k]; if (v && OK.has(v)) return t > h.at - 0.1 && t < h.out + 0.2 ? <VeoHero key={i} t={t} h={h} id={v} /> : null; if (v && RF.has(v)) return t > h.at - 0.1 && t < h.out + 0.2 ? <FotoHero key={i} t={t} h={h} id={v} /> : null; const C = HC[h.k] as React.FC<{ t: number; h: H }> | undefined; return C && t > h.at - 0.1 && t < h.out + 0.9 ? <C key={i} t={t} h={h} /> : null; })}</>;
const underHero = (o: Ov) => HS.some((h) => o.at < h.out + 0.9 && o.out > h.at - 0.6);

const Piece: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  if (t < o.at - 0.6 || t > o.out + 1.0 || (o.k === "step" && underHero(o))) return null;
  switch (o.k) {
    case "sub": return <SubTag t={t} at={o.at} out={o.out} />;
    case "step": return <StepTag t={t} at={o.at} out={o.out} n={o.n} name={o.name} side={avOn(o.at, o.out)} />;
    case "ask": return <AskCard t={t} at={o.at} out={o.out} q={PL.txt.ask} side={avOn(o.at, o.out)} />;
  }
  return null;
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    {/* cámara a mano virtual (balanceo lento, no temblor) sobre todo lo que se filma */}
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    <LowerThird t={t} at={PL.txt.lower[0]} out={PL.txt.lower[1]} name="LENNY" l2="CHICAGO PLUMBER · 45 YEARS" l2at={PL.txt.lower[0] + 1} />
    <Carousels t={t} />
    {PL.ov.map((o, i) => <Piece key={i} t={t} o={o} />)}
    <Heroes t={t} />
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};

// sólo para revisar componentes en stills (sin el mundo 3D)
export const HeroesOnly: React.FC = () => { const t = useCurrentFrame() / 30; return <AbsoluteFill style={{ background: "#111" }}><Heroes t={t} /></AbsoluteFill>; };
