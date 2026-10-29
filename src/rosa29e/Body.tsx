// rosa29e · EL VIDEO ENTERO (locución 0 → final). Abuela Rosa en su cocina: el avatar con corte seco, las fotos y los Veo por tramos
// (plan.json, cada uno anclado a su frase por plan_rosa.py), un componente único por minuto (heroes.json) y la guía en 3D.
// Audio fuera de Remotion (encfin).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { LowerThird, P, Vid, e } from "./lib";
import CARDS from "./cards.json";
import { AskCard, BigNum, CoverFlow, Headline, StepTitle } from "./premium";
import { Avatar, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import HEROES from "./heroes.json";
import { H } from "./hkit";
import { GuideCTA } from "./guide";
import { HC } from "./heroes_reg";

type Seg = [number, number, string, string];
type Ov = { k: string; at: number; out: number; [x: string]: any };
type Cta = { guide?: number; page?: number; desc: number; end: number; img?: string; pageTxt?: string };
type Txt = { recapTitle: string; misKicker?: string; misTitle?: string; recap: string[]; ask: [string, string, string]; lower: [number, number] };
const PL = PLAN as unknown as { segs: Seg[]; ov: Ov[]; cta1: Cta; cta2: Cta; cta3: Cta; end: number; txt: Txt };
export const END = PL.end;

// ===== la BASE: Veo (8 s, entero desde su cuadro 0) o la foto con zoom lento; si falta, la cocina =====
const base = (t: number): React.ReactNode => {
  const g = PL.segs.find(([a, b]) => t >= a && t < b);
  if (!g) return <World t={t} />;
  const [a, , , id] = g;
  if (id.startsWith("v")) return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : <World t={t} />;
  return <Shot k={id} t={t} a={a} />;
};

// el avatar entra y sale con CORTE SECO (vara fe02): ni portal ni fundido
const Stage: React.FC<{ t: number }> = ({ t }) => (WIN.some((x) => t >= x.ms && t < x.me) ? <Avatar t={t} /> : <>{base(t)}</>);
const avOn = (a: number, b: number) => WIN.some((w) => a < w.me && b > w.ms);
const nowAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);

// la foto del momento (material de las piezas: fondo desenfocado del escenario, miniaturas)
const imgAt = (t: number): string | undefined => { const g = PL.segs.find(([a, b]) => t >= a && t < b); return g && !g[3].startsWith("v") ? g[3] : undefined; };
const imgNear = (t: number, used: Set<string>): string | undefined => {
  let best: string | undefined, bd = 14;
  for (const [a, b, , id] of PL.segs) { if (id.startsWith("v") || used.has(id)) continue; const d = t < a ? (a - t) * 0.8 : t > b ? t - b : 0; if (d < bd) { bd = d; best = id; } }
  if (best) used.add(best); return best;
};

// ===== los 5 errores y el repaso: carrusel 3D de tarjetas 9:16 con foto =====
const CJ = CARDS as unknown as { err?: string[]; rec?: string[] };
const MIS = PL.ov.filter((o) => o.k === "mistake").sort((a, b) => a.n - b.n);
const DEAL = PL.ov.find((o) => o.k === "deal");
const REC = PL.ov.find((o) => o.k === "recap");
const Carousels: React.FC<{ t: number }> = ({ t }) => <>
  {MIS.length > 0 && <CoverFlow t={t} at={DEAL?.at ?? MIS[0].at - 1} out={MIS[MIS.length - 1].out} hide={nowAv(t)} kicker={PL.txt.misKicker ?? "LO QUE HICE MAL EL PRIMER AÑO"} title={PL.txt.misTitle ?? `LOS ${MIS.length} ERRORES DEL DESAYUNO`} col="red"
    cards={MIS.map((m, i) => ({ img: CJ.err?.[i], at: m.at, n: m.n, title: m.txt }))} />}
  {REC && <CoverFlow t={t} at={REC.at} out={REC.out} hide={nowAv(t)} kicker="REPASEMOS" title={PL.txt.recapTitle}
    cards={PL.txt.recap.map((n, i) => ({ img: CJ.rec?.[i], at: REC.rows[i] ?? REC.out, n: i + 1, title: n })).filter((c) => c.at < REC.out)} />}
</>;

// ===== un componente ÚNICO por minuto (heroes.json): tapan todo; las piezas chicas de su tramo se apagan =====
const HS: H[] = (HEROES as H[]).map((h) => {
  const u = new Set<string>();
  const out: H = { ...h };
  out.img = imgNear(h.at + (h.imgOff ?? -1), u);
  out.bg = imgNear(h.at + 1, u);
  out.imgs = [0, 1, 2, 3].map((k) => imgNear(h.at - 8 + k * 6, u));
  return out;
});
const SHORT = new Set(["big", "stamp", "step"]);
const underHero = (o: Ov) => SHORT.has(o.k) && HS.some((h) => o.at < h.out + 0.9 && o.out > h.at - 0.6);
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => { const C = HC[h.k]; return t > h.at - 0.1 && t < h.out + 0.9 ? <C key={i} t={t} h={h} /> : null; })}</>;

const Piece: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  if (t < o.at - 0.6 || t > o.out + 0.8 || underHero(o)) return null;
  switch (o.k) {
    case "big": return <BigNum t={t} at={o.at} out={o.out} text={o.txt} sub={o.sub || undefined} col={o.col} {...(avOn(o.at, o.out) ? { x: 420, y: 760 } : {})} />;
    case "stamp": return <Headline t={t} at={o.at} out={o.out} text={o.txt} side={avOn(o.at, o.out)} />;
    case "step": return <StepTitle t={t} at={o.at} out={o.out} n={o.n} name={o.name} img={imgAt(o.out + 0.4) ?? imgAt(o.at)} {...(avOn(o.at, o.out) ? { x: 430, y: 560, sc: 0.6 } : {})} />;
    case "ask": return <AskCard t={t} at={o.at} out={o.out} q={PL.txt.ask} side={avOn(o.at, o.out)} />;
  }
  return null;
};

// cuadro 0 = la miniatura elegida SIN texto (rehecha en ChatGPT), idéntica en el cuadro 0; empuja apenas y se funde al primer plano de Rosa
const Cuadro0: React.FC<{ t: number }> = ({ t }) => {
  if (t > 1.9) return null;
  const k = e(t, 1.0, 1.8);
  return <AbsoluteFill style={{ opacity: 1 - k, transform: `scale(${1 + 0.03 * e(t, 0, 1.8) + 0.06 * k})` }}>
    <Img src={staticFile(P + "cuadro0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>;
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    {/* cámara a mano virtual (balanceo lento, no temblor) sobre todo lo que se filma */}
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    <LowerThird t={t} at={PL.txt.lower[0]} out={PL.txt.lower[1]} name="ABUELA ROSA" l2="81 AÑOS · SABORES DE ANTES" l2at={PL.txt.lower[0] + 1} />
    <Carousels t={t} />
    {PL.ov.map((o, i) => <Piece key={i} t={t} o={o} />)}
    <Heroes t={t} />
    {[PL.cta1, PL.cta2, PL.cta3].map((c, i) => <GuideCTA key={i} t={t} c={c} side={avOn(c.desc, c.end)} bg={imgAt((c.guide ?? c.desc) - 0.5)} />)}
    <Cuadro0 t={t} />
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};
