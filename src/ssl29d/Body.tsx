// ssl29a (desde al28a) · EL VIDEO ENTERO (locución 0 → final). Un solo mundo (la casa de Sachiko abierta en corte, tatami, chabudai y zabuton)
// y una sola cámara; el avatar entra y sale con corte seco; las fotos/clips entran por tramos (plan.json, cada uno
// anclado a su frase); las piezas también vienen de plan.json (piezas.py → frase del ASR). Audio fuera de Remotion (encfin).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { COL, FONT, LowerThird, Vid, e } from "./lib";
import { NextCard, TempChart } from "./comps2";
import CARDS from "./cards.json";
import { AskCard, BigNum, CoverFlow, CheckList, Chip, DayClock, Desc, GuidePage, Headline, Mistake, StepTitle, TempGauge, TimeBars, Versus, Words, acc } from "./premium";
import { Avatar, Clip, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import HEROES from "./heroes.json";
import { H } from "./hkit";
import * as HS3 from "./hs3";

type Seg = [number, number, string, string];
type Ov = { k: string; at: number; out: number; [x: string]: any };
type Cta = { guide?: number; five?: number; book?: number; page?: number; desc: number; end: number; manual?: string; img?: string; pageTxt?: string };
type Txt = { recapTitle: string; recap: string[]; ask: [string, string, string]; next: [string, string]; lower: [number, number] };
const PL = PLAN as unknown as { segs: Seg[]; ov: Ov[]; cta1: Cta; cta2: Cta; cta3: Cta; end: number; txt: Txt };
export const END = PL.end;

// ===== la BASE: foto/clip del tramo (con zoom lento) o el mundo =====
const base = (t: number): React.ReactNode => {
  const g = PL.segs.find(([a, b]) => t >= a && t < b);
  if (!g) return <World t={t} />;
  const [a, , , id] = g;
  // clip de Veo (8 s, ya con movimiento): va entero desde su cuadro 0; si todavía no llegó, el mundo
  if (id.startsWith("v")) return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : <World t={t} />;
  // si llegó el clip LTX de esa foto va el clip; si no, la foto
  return <Clip k={"c_" + id} t={t} a={a}><Shot k={id} t={t} a={a} /></Clip>;
};

// el avatar entra y sale con CORTE SECO (vara fe02): ni portal ni fundido
// CUADRO 0 = la miniatura rehecha en código (ella riendo junto a la ventana con la ropa colgada y la secadora desenchufada), sin texto ni flecha
const C0H = { k: "cuadro0", at: 0, out: 3.2, ph: "", items: [] } as unknown as H;
const Stage: React.FC<{ t: number }> = ({ t }) => (t < 1 / 30 ? <HS3.G_cuadro0 t={1.6} h={C0H} /> : WIN.some((x) => t >= x.ms && t < x.me) ? <Avatar t={t} /> : <>{base(t)}</>);

// sobre el avatar, el rótulo de paso y la descripción van a la izquierda y más chicos: nunca tapan la cara
const avOn = (a: number, b: number) => WIN.some((w) => a < w.me && b > w.ms);

// ===== CTA: chip de la guía → chip del manual (con la página) → la página real + QR chico → la descripción sola =====
const CTA: React.FC<{ t: number; c: Cta; manual: string; img: string; pageTxt: string }> = ({ t, c, manual, img, pageTxt }) => {
  const pag = (pageTxt.match(/PÁG\.\s*\d+/) ?? [""])[0];
  const side = avOn(c.desc, c.end) && c.page === undefined;
  return <>
    {c.guide !== undefined && <Chip t={t} at={c.guide} out={(c.book ?? c.page ?? c.desc) - 0.15} text="THE OSAKA WAY · SACHIKO'S LITTLE BOOKS" />}
    {c.book !== undefined && <Chip t={t} at={c.book} out={(c.page ?? c.desc) - 0.15} text={manual} col="ice" />}
    {c.page !== undefined && <GuidePage t={t} at={c.page} out={c.desc - 0.2} img={img} tag={[manual.split("·")[0].trim(), pag].filter(Boolean).join(" · ")} />}
    <Desc t={t} at={c.desc} out={c.end - 0.3} x={side ? 440 : 960} y={side ? 880 : 640} scale={side ? 0.56 : 0.8} />
  </>;
};

// ===== los 5 errores y el repaso: carrusel 3D de tarjetas con foto (sobre el avatar se esconde; ahí va la tarjeta chica) =====
const CJ = CARDS as unknown as { err?: string[]; rec?: string[]; vs?: string[] };
const MIS = PL.ov.filter((o) => o.k === "mistake").sort((a, b) => a.n - b.n);
const DEAL = PL.ov.find((o) => o.k === "deal");
const REC = PL.ov.find((o) => o.k === "recap");
const nowAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
// la FOTO del momento (la que corre de base en ese segundo): material de las piezas (titular relleno, placa del punto, miniaturas)
const imgAt = (t: number): string | undefined => { const g = PL.segs.find(([a, b]) => t >= a && t < b); return g && !g[3].startsWith("v") ? g[3] : undefined; };
// la foto más cercana a ese segundo (si en ese instante va el avatar o un Veo), sin repetir las ya usadas en la misma pieza
const imgNear = (t: number, used: Set<string>): string | undefined => {
  let best: string | undefined, bd = 12;
  for (const [a, b, , id] of PL.segs) { if (id.startsWith("v") || used.has(id)) continue; const d = t < a ? (a - t) * 0.8 : t > b ? t - b : 0; if (d < bd) { bd = d; best = id; } }
  if (best) used.add(best); return best;
};
const imgsFor = (ts: number[]) => { const u = new Set<string>(); return ts.map((x) => imgNear(x, u)); };
const Carousels: React.FC<{ t: number }> = ({ t }) => <>
  {MIS.length > 0 && <CoverFlow t={t} at={DEAL?.at ?? MIS[0].at - 1} out={MIS[MIS.length - 1].out} hide={nowAv(t)} kicker="BEFORE YOU GET DOWN" title={`THE ${MIS.length} MISTAKES`} col="red"
    cards={MIS.map((m, i) => ({ img: CJ.err?.[i], at: m.at, n: m.n, title: m.txt }))} />}
  {REC && <CoverFlow t={t} at={REC.at} out={REC.out} hide={nowAv(t)} kicker="THE SHORT VERSION" title={PL.txt.recapTitle}
    cards={[...PL.txt.recap, "The 5 mistakes"].map((n, i) => ({ img: CJ.rec?.[i], at: REC.rows[i] ?? REC.out, n: i + 1, title: n })).filter((c) => c.at < REC.out)} />}
</>;

// ===== un componente ÚNICO por minuto (heroes.json): tapan todo; las piezas chicas que caen en su tramo se apagan =====
const HC: Record<string, React.FC<{ t: number; h: H }>> = { tumble: HS3.G_tumble, nodryer: HS3.G_nodryer, halfbill: HS3.G_halfbill, breathe: HS3.G_breathe, heatergap: HS3.G_heatergap, spintwice: HS3.G_spintwice, highspin: HS3.G_highspin, panpan: HS3.G_panpan, softtowel: HS3.G_softtowel, octopus: HS3.G_octopus, sockspace: HS3.G_sockspace, arch: HS3.G_arch, showerrod: HS3.G_showerrod, bamboopole: HS3.G_bamboopole, jungle: HS3.G_jungle, crowded: HS3.G_crowded, nightwash: HS3.G_nightwash, overload: HS3.G_overload, ownhanger: HS3.G_ownhanger, balcony: HS3.G_balcony, noonturn: HS3.G_noonturn, rightaway: HS3.G_rightaway, basement: HS3.G_basement, crossbreeze: HS3.G_crossbreeze, windowdrops: HS3.G_windowdrops, cloud: HS3.G_cloud, notebook: HS3.G_notebook, vinegar: HS3.G_vinegar, twochairs: HS3.G_twochairs, towelroll: HS3.G_towelroll, pockets: HS3.G_pockets, sweater: HS3.G_sweater, dayclock: HS3.G_dayclock };
const COMMENTS: { n: string; from: string; txt: string }[] = [];
const HS: H[] = (HEROES as H[]).map((h) => { const u = new Set<string>(); return { ...h, stack: COMMENTS, bg: imgNear(h.at + 1, u) }; });
const SHORT = new Set(["chip", "big", "stamp", "temp"]);
const underHero = (o: Ov) => SHORT.has(o.k) && (String(o.txt ?? "").startsWith("💬") || HS.some((h) => o.at < h.out + 0.9 && o.out > h.at - 0.6));
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => { const C = HC[h.k] as React.FC<{ t: number; h: H }> | undefined; return C && t > h.at - 0.1 && t < h.out + 0.9 ? <C key={i} t={t} h={h} /> : null; })}</>;

const Piece: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  if (t < o.at - 0.6 || t > o.out + 0.8 || underHero(o)) return null;
  switch (o.k) {
    case "chip": return <Chip t={t} at={o.at} out={o.out} text={o.txt} col={o.col} />;
    case "big": return <BigNum t={t} at={o.at} out={o.out} text={o.txt} sub={o.sub || undefined} col={o.col} />;
    case "words": return <Words t={t} items={o.items.map((x: any) => ({ at: x.at, txt: x.txt, col: x.col === "ink" ? undefined : acc(x.col) }))} out={o.out} />;
    case "stamp": return <Headline t={t} at={o.at} out={o.out} text={o.txt} side={avOn(o.at, o.out)} img={imgAt(o.at + 0.5)} />;
    case "step": return <StepTitle t={t} at={o.at} out={o.out} n={o.n} name={o.name} col={o.col} img={imgAt(o.out + 0.4) ?? imgAt(o.at)} {...(avOn(o.at, o.out) ? { x: 470, y: 540, sc: 0.62 } : {})} />;
    case "mistake": return nowAv(t) ? <Mistake t={t} at={o.at} out={o.out} n={o.n} txt={o.txt} /> : null;
    case "check": return <CheckList t={t} title={o.title} rows={o.rows} out={o.out} imgs={imgsFor(o.rows.map((r: any) => r.at + 0.4))} />;
    case "temp": return <TempGauge t={t} at={o.at} out={o.out} a={o.a} b={o.b} sub={o.sub} col={o.col} />;
    case "deal": return null;
    case "clock": return <DayClock t={t} at={o.at} out={o.out} marks={o.marks} />;
    case "recap": return nowAv(t) ? <Chip t={t} at={o.at} out={o.out} text={"THE SHORT VERSION · " + PL.txt.recapTitle} /> : null;
    case "bars": return <TimeBars t={t} rows={o.rows} out={o.out} y={o.y ?? 150} imgs={imgsFor(o.rows.map((r: any) => r.at + 0.4))} />;
    case "chart": return <TempChart t={t} at={o.at} pts={o.pts} nb={o.nb} out={o.out} />;
    case "versus": return <Versus t={t} at={o.at} out={o.out} L={o.L} R={o.R} title={o.title} imgs={CJ.vs ?? [imgAt(o.at), imgAt(o.out)]} />;
    case "ask": return <AskCard t={t} at={o.at} out={o.out} q={PL.txt.ask} side={avOn(o.at, o.out)} />;
    case "next": return <NextCard t={t} at={o.at} subAt={o.at + 1.6} out={o.out}><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, color: COL.amber }}>{PL.txt.next[0]}</div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: COL.ink }}>{PL.txt.next[1]}</div></NextCard>;
  }
  return null;
};


// banco de revisión (no va al video): cuadro f = componente f/5 en el momento f%5
export const HeroLab: React.FC = () => { const f = useCurrentFrame(), h = HS[Math.floor(f / 5) % HS.length], m = f % 5, d = h.out - h.at;
  const t = h.at + [0.3, 0.25 * d, 0.5 * d, 0.75 * d, d - 0.4][m]; const C = HC[h.k]; return <AbsoluteFill style={{ background: "#d9cdb8" }}>{C && <C t={t} h={h} />}</AbsoluteFill>; };

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#d9cdb8" }}>
    {/* cámara a mano virtual (balanceo lento, no temblor) sobre todo lo que se filma: mundo, fotos, clips y avatar */}
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    <LowerThird t={t} at={PL.txt.lower[0]} out={PL.txt.lower[1]} name="SACHIKO" l2="OSAKA · A SIMPLE LIFE" l2at={PL.txt.lower[0] + 1} />
    <CTA t={t} c={PL.cta1} manual={PL.cta1.manual ?? ""} img={PL.cta1.img ?? ""} pageTxt={PL.cta1.pageTxt ?? ""} />
    <CTA t={t} c={PL.cta2} manual={PL.cta2.manual ?? ""} img={PL.cta2.img ?? ""} pageTxt={PL.cta2.pageTxt ?? ""} />
    {/* CTA3 no va en pantalla: el cierre lo hacen la pregunta (AskCard) y el encuadre «subscribe» del mundo */}
    <Carousels t={t} />
    {PL.ov.map((o, i) => <Piece key={i} t={t} o={o} />)}
    <Heroes t={t} />
    <AbsoluteFill style={{ background: "#d9cdb8", opacity: fade }} />
  </AbsoluteFill>;
};
