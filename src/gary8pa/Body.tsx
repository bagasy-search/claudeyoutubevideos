// gary06 · EL VIDEO ENTERO. Un solo mundo (la casa de Gary en corte, de noche en enero, world3d) y una sola
// cámara; el avatar entra y sale con CORTE SECO; fotos/clips por tramos (plan.json, anclados a su frase); un componente único
// por minuto (heroes.json); la CTA es el MANUAL en 3D sobre el banco (book3d) en los dos lugares donde Gary lo nombra.
// Cuadro 0 = la miniatura rehecha en el mundo (Gary frente a su casa en corte). Audio en encfin.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { LowerThird, Vid, e } from "./lib";
import { AskCard } from "./premium";
import { Avatar, Clip, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import HEROES from "./heroes.json";
import REPL from "./repl.json";
import { H } from "./hkit";
import { SubTag } from "./lpieces";
import { ManualCTA } from "./book3d";
import { HClosetGas, HCycle, HLockHalf, HMeter24, HMoon, HPeel, HPunch, HRuler7, HSocketFuse, HSpeedo, HStack77, HSticker, HTank600, HToll } from "./gh8a";
import { HConsole, HOneAm, HPockets, HQuart } from "./gh8c";
import { HBoss, HFrost, HHose, HLadder, HMagnets, HPodium, HSandrun, HSeesaw, HSip, HTape, HThreeChecks, HTide, HTomb } from "./gh8b";

type Seg = [number, number, string, string];
type Ov = { k: string; at: number; out: number; [x: string]: any };
type Txt = { ask: [string, string, string]; lower: [number, number] };
const PL = PLAN as unknown as { segs: Seg[]; ov: Ov[]; end: number; txt: Txt };
export const END = PL.end;
const THUMB = 0.9;  // cuadro 0: la miniatura en el mundo, antes del primer corte al avatar

// ===== la BASE: foto/clip del tramo (con zoom lento) o el mundo =====
const base = (t: number): React.ReactNode => {
  const g = PL.segs.find(([a, b]) => t >= a && t < b);
  if (!g) return <World t={t} />;
  const [a, , , id] = g;
  if (id.startsWith("v")) return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : <World t={t} />;
  return <Clip k={"c_" + id} t={t} a={a}><Shot k={id} t={t} a={a} /></Clip>;
};
const nowAv = (t: number) => t >= THUMB && WIN.some((w) => t >= w.ms && t < w.me);
const avOn = (a: number, b: number) => WIN.some((w) => a < w.me && b > w.ms);
const Stage: React.FC<{ t: number }> = ({ t }) => (nowAv(t) ? <Avatar t={t} /> : <>{base(t)}</>);

// ===== un componente ÚNICO por minuto (heroes.json); cta1/cta2 = el manual sobre el banco =====
const Cta: React.FC<{ t: number; h: H }> = ({ t, h }) => <ManualCTA t={t} h={h} page={h.page} under={h.under} />;
const HC: Record<string, React.FC<{ t: number; h: H }>> = {
  oneam: HOneAm, pockets: HPockets, quart: HQuart, console: HConsole, cta1: Cta, cta2: Cta, sticker: HSticker, tank600: HTank600, speedo: HSpeedo, lockhalf: HLockHalf, toll: HToll, peel: HPeel, cycle: HCycle, meter24: HMeter24,
  stack77: HStack77, moon: HMoon, punch: HPunch, socketfuse: HSocketFuse, ruler7: HRuler7, closetgas: HClosetGas, tide: HTide, boss: HBoss, frost: HFrost, tomb: HTomb,
  sandrun: HSandrun, sip: HSip, ladder: HLadder, tape: HTape, threechecks: HThreeChecks, seesaw: HSeesaw, hose: HHose, podium: HPodium, magnets: HMagnets };
const HS: H[] = HEROES as H[];
// componentes que el evaluador dejó <6: los reemplaza su clip Veo (repl.json); si el clip no llegó, queda el componente
const RP = REPL as Record<string, string>;
const VeoHero: React.FC<{ t: number; h: H; id: string }> = ({ t, h, id }) => <AbsoluteFill style={{ opacity: e(t, h.at - 0.1, h.at + 0.4) * (1 - e(t, h.out - 0.4, h.out + 0.2)) }}><Vid id={"veo/" + id} at={h.at - 0.1} /></AbsoluteFill>;
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => { const v = RP[h.k]; if (v && OK.has(v)) return t > h.at - 0.1 && t < h.out + 0.2 ? <VeoHero key={i} t={t} h={h} id={v} /> : null; const C = HC[h.k]; return C && t > h.at - 0.1 && t < h.out + 0.9 ? <C key={i} t={t} h={h} /> : null; })}</>;

const Piece: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  if (t < o.at - 0.6 || t > o.out + 1.0) return null;
  switch (o.k) {
    case "sub": return <SubTag t={t} at={o.at} out={o.out} />;
    case "ask": return <AskCard t={t} at={o.at} out={o.out} q={PL.txt.ask} side={avOn(o.at, o.out)} />;
  }
  return null;
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    <LowerThird t={t} at={PL.txt.lower[0]} out={PL.txt.lower[1]} name="GARY" l2="OHIO ELECTRICIAN · 40 YEARS" l2at={PL.txt.lower[0] + 1} />
    {PL.ov.map((o, i) => <Piece key={i} t={t} o={o} />)}
    <Heroes t={t} />
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};

// sólo para revisar componentes en stills (sin el mundo 3D)
export const HeroesOnly: React.FC = () => { const t = useCurrentFrame() / 30; return <AbsoluteFill style={{ background: "#111" }}><Heroes t={t} /></AbsoluteFill>; };
