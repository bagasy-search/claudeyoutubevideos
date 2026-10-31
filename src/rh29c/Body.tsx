// rh29c (base tdc28a) · EL VIDEO ENTERO. Mundo = el local y la cocina de Stan (fotos de lugar + Veo); componentes únicos en sh.tsx (heroes.json).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { COL, FONT, LowerThird, P, Vid, e } from "./lib";
import { NextCard, TempChart } from "./comps2";
import CARDS from "./cards.json";
import { AskCard, BigNum, CoverFlow, CheckList, Chip, DayClock, Desc, GuidePage, Headline, Mistake, StepTitle, TempGauge, TimeBars, Versus, Words, acc } from "./premium";
import FVL from "./fv.json";
const FV = new Set(FVL as string[]);
import { Avatar, Clip, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import HEROES from "./heroes.json";
import { H } from "./hkit";
import { HC, COMMENTS } from "./sh";

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
  if (id.startsWith("v")) return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : FV.has(id) ? <Shot k={"fv_" + id} t={t} a={a} /> : <World t={t} />;
  // si llegó el clip LTX de esa foto va el clip; si no, la foto
  return <Clip k={"c_" + id} t={t} a={a}><Shot k={id} t={t} a={a} /></Clip>;
};

// el avatar entra y sale con CORTE SECO (vara fe02): ni portal ni fundido
const Stage: React.FC<{ t: number }> = ({ t }) => (WIN.some((x) => t >= x.ms && t < x.me) ? <Avatar t={t} /> : <>{base(t)}</>);

// sobre el avatar, el rótulo de paso y la descripción van a la izquierda y más chicos: nunca tapan la cara
const avOn = (a: number, b: number) => WIN.some((w) => a - 0.6 < w.me && b + 0.9 > w.ms); // 30-oct: cuenta la entrada/salida de la pieza («NEVER MIX» salía sobre los ojos)

// ===== CTA: chip de la guía → chip del manual (con la página) → la página real + QR chico → la descripción sola =====
const CTA: React.FC<{ t: number; c: Cta; manual: string; img: string; pageTxt: string }> = ({ t, c, manual, img, pageTxt }) => {
  const pag = (pageTxt.match(/PAGE\s*\d+/) ?? [""])[0];
  const side = avOn(c.desc, c.end); // 30-oct: sobre el avatar la descripción va abajo a la izquierda SIEMPRE (tapaba la boca en 8:40)
  return <>
    {c.guide !== undefined && <Chip t={t} at={c.guide} out={(c.book ?? c.page ?? c.desc) - 0.15} text="📕 RHONDA'S BROWN BOTTLE BOOK" />}
    {c.book !== undefined && <Chip t={t} at={c.book} out={(c.page ?? c.desc) - 0.15} text={manual} col="ice" />}
    {c.page !== undefined && <GuidePage t={t} at={c.page} out={c.desc - 0.2} img={img} tag={[manual.split("·")[0].trim(), pag].filter(Boolean).join(" · ")} />}
    <Desc t={t} at={c.desc} out={c.end - 0.3} x={side ? 560 : 960} y={side ? 890 : 640} scale={side ? 0.82 : 0.8} />
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
  {MIS.length > 0 && <CoverFlow t={t} at={DEAL?.at ?? MIS[0].at - 1} out={MIS[MIS.length - 1].out} hide={nowAv(t) || heroCover(t) > 0} kicker="BEFORE YOU SCRUB" title={`THE ${MIS.length} MISTAKES`} col="red"
    cards={MIS.map((m, i) => ({ img: CJ.err?.[i], at: m.at, n: m.n, title: m.txt }))} />}
  {REC && <CoverFlow t={t} at={REC.at} out={REC.out} hide={nowAv(t) || heroCover(t) > 0} kicker="ONE MORE TIME" title={PL.txt.recapTitle}
    cards={[...PL.txt.recap, "The 5 mistakes"].map((n, i) => ({ img: CJ.rec?.[i], at: REC.rows[i] ?? REC.out, n: i + 1, title: n })).filter((c) => c.at < REC.out)} />}
</>;

// 30-oct (ojo del MP4 a/b): el CTA es dueño de la pantalla (nada encima: «NUMBER 10» bajo la guía); UNA pieza simple por vez
// (la que entra despide a la anterior: carteles apilados/pegados 40 s); frases largas en tandas de ≤6 s
const SIMPLE = new Set(["chip", "big", "words", "stamp", "step", "temp"]), WIDE = new Set(["check", "clock", "bars", "chart", "versus", "ask"]);
// el título «NUMBER n» manda: si cae en la cola del CTA, la descripción se va antes (en b se perdía el NUMBER 8)
const STEPS = PL.ov.filter((o) => o.k === "step");
const CTAS: Cta[] = [PL.cta1, PL.cta2].filter((c) => c && c.desc !== undefined).map((c) => { const st = STEPS.find((o) => o.at > c.desc && o.at < c.end + 0.3); return st ? { ...c, end: Math.max(c.desc + 1.0, st.at - 0.35) } : c; });
const CTAW = CTAS.map((c) => [(c.guide ?? c.page ?? c.desc) - 0.4, c.end + 0.3]);
const splitW = (o: Ov): Ov[] => {
  if (o.k !== "words") return [{ ...o }];
  const g: any[][] = []; for (const it of o.items) { const cur = g[g.length - 1]; if (cur && it.at - cur[0].at < 6) cur.push(it); else g.push([it]); }
  return g.map((items, i) => ({ ...o, at: items[0].at, items, out: Math.min(items[items.length - 1].at + 4.5, i < g.length - 1 ? g[i + 1][0].at - 0.35 : o.out) })); // cada tanda vive ≤4,5 s tras su última palabra («NO PUMICE STONE» 19 s en d)
};
const OV: Ov[] = PL.ov.flatMap(splitW).map((o) => {
  if (!SIMPLE.has(o.k) || o.k === "step") return o;
  for (const [x, y] of CTAW) { if (o.at < y && o.out > x) { if (o.at >= x) { if (o.out < y + 1.6) return null; o.at = y; } else o.out = Math.min(o.out, x); } }
  if (o.k === "words") { o.items = o.items.filter((w: any) => w.at >= o.at - 0.01 && w.at < o.out - 0.4); if (!o.items.length) return null; o.at = o.items[0].at; }
  return o.out - o.at < 0.9 ? null : o;
}).filter(Boolean).sort((a: any, b: any) => a.at - b.at) as Ov[];
for (let i = 0; i < OV.length; i++) {
  const o = OV[i]; if (!SIMPLE.has(o.k) && !WIDE.has(o.k)) continue;
  const nx = OV.slice(i + 1).find((p) => SIMPLE.has(p.k) || WIDE.has(p.k)); if (!nx || nx.at >= o.out + 0.6) continue;
  if (SIMPLE.has(o.k)) o.out = Math.max(o.at + 1.2, nx.at - 0.6); else if (SIMPLE.has(nx.k)) (nx as any).drop = true;
}

// ===== un componente ÚNICO por minuto (heroes.json): tapan todo; las piezas chicas que caen en su tramo se apagan =====
const HS: H[] = (HEROES as H[]).map((h) => {
  const u = new Set<string>();
  const out: H = { ...h, stack: COMMENTS, cutIn: nowAv(h.at - 0.05), cutOut: nowAv(h.out + 0.05) } as H;
  if (h.imgAt !== undefined) out.img = imgNear(h.imgAt, u);
  out.bg = imgNear(h.at + 1, u);
  if (h.imgsAt) out.imgs = (h.imgsAt as number[]).map((x) => imgNear(x, u));
  if (h.items) out.items = (h.items as any[]).map((it) => ({ ...it, img: it.img ?? imgNear(it.at, u) }));
  return out;
});
const SHORT = new Set(["chip", "big", "stamp", "temp"]);
const underHero = (o: Ov) => SHORT.has(o.k) && (String(o.txt ?? "").startsWith("💬") || HS.some((h) => o.at < h.out + 0.9 && o.out > h.at - 0.6));
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => { const C = HC[h.k] as React.FC<{ t: number; h: H }> | undefined; return C && t > h.at - 0.1 && t < h.out + 0.9 ? <C key={i} t={t} h={h} /> : null; })}</>;

// 30-oct: la foto héroe es dueña de la pantalla: cualquier tarjeta que siga viva se apaga en 0,25 s al entrar el héroe (fantasmas del evaluador)
const heroCover = (t: number) => HS.reduce((m, h) => (t >= h.at && t <= h.out ? Math.max(m, Math.min(1, (t - h.at) / 0.12)) : m), 0);
const Piece: React.FC<{ t: number; o: Ov }> = ({ t, o }) => { const c = heroCover(t); if (c >= 1) return null; const el = <Piece0 t={t} o={o} />; return c > 0 ? <AbsoluteFill style={{ opacity: 1 - c }}>{el}</AbsoluteFill> : el; };
const Piece0: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  if ((o as any).drop || t < o.at - 0.6 || t > o.out + 0.8 || underHero(o)) return null;
  switch (o.k) {
    case "chip": return <Chip t={t} at={o.at} out={o.out} text={o.txt} col={o.col} />;
    case "big": return <BigNum t={t} at={o.at} out={o.out} text={o.txt} sub={o.sub || undefined} col={o.col} />;
    case "words": return <Words t={t} items={o.items.map((x: any) => ({ at: x.at, txt: x.txt, col: x.col === "ink" ? undefined : acc(x.col) }))} out={o.out} {...(avOn(o.at, o.out) ? { y: 740, size: 80 } : {})} />;
    case "stamp": return <Headline t={t} at={o.at} out={o.out} text={o.txt} side={avOn(o.at, o.out)} img={imgAt(o.at + 0.5)} />;
    case "step": return <StepTitle t={t} at={o.at} out={o.out} n={o.n} name={o.name} col={o.col} img={imgAt(o.out + 0.4) ?? imgAt(o.at)} {...(avOn(o.at, o.out) ? { x: 470, y: 540, sc: 0.62 } : {})} />;
    case "mistake": return nowAv(t) ? <Mistake t={t} at={o.at} out={o.out} n={o.n} txt={o.txt} /> : null;
    case "check": return <CheckList t={t} title={o.title} rows={o.rows} out={o.out} imgs={imgsFor(o.rows.map((r: any) => r.at + 0.4))} />;
    case "temp": return <TempGauge t={t} at={o.at} out={o.out} a={o.a} b={o.b} sub={o.sub} col={o.col} />;
    case "deal": return null;
    case "clock": return <DayClock t={t} at={o.at} out={o.out} marks={o.marks} />;
    case "recap": return nowAv(t) ? <Chip t={t} at={o.at} out={o.out} text={"ONE MORE TIME · " + PL.txt.recapTitle} /> : null;
    case "bars": return <TimeBars t={t} rows={o.rows} out={o.out} y={o.y ?? 150} imgs={imgsFor(o.rows.map((r: any) => r.at + 0.4))} />;
    case "chart": return <TempChart t={t} at={o.at} pts={o.pts} nb={o.nb} out={o.out} />;
    case "versus": return <Versus t={t} at={o.at} out={o.out} L={o.L} R={o.R} title={o.title} imgs={CJ.vs ?? imgsFor([o.at, o.out])} />;
    case "ask": return <AskCard t={t} at={o.at} out={o.out} q={PL.txt.ask} side={avOn(o.at, o.out)} />;
    case "next": return <NextCard t={t} at={o.at} subAt={o.at + 1.6} out={o.out}><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, color: COL.amber }}>{PL.txt.next[0]}</div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: COL.ink }}>{PL.txt.next[1]}</div></NextCard>;
  }
  return null;
};

// 30-oct: el rótulo con su nombre va SOBRE ella (salía sobre un baúl / una casa): primera ventana de avatar de ≥5 s desde el momento planeado
const LT: [number, number] = (() => { const a0 = PL.txt.lower[0]; const w = WIN.find((x) => x.me - Math.max(x.ms, a0) >= 5); if (!w) return [a0, PL.txt.lower[1]]; const a = Math.max(w.ms + 0.5, a0); return [a, Math.min(a + 6, w.me - 0.3)]; })();
export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    {/* cámara a mano virtual (balanceo lento, no temblor) sobre todo lo que se filma: mundo, fotos, clips y avatar */}
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    <LowerThird t={t} at={LT[0]} out={LT[1]} name="RHONDA" l2="34 YEARS CLEANING HOUSES · OHIO" l2at={LT[0] + 1} />
    <Carousels t={t} />
    {CTAS.map((c, i) => c ? <CTA key={i} t={t} c={c} manual={c.manual ?? "92 FIXES · $1-2 EACH"} img={c.img ?? "page"} pageTxt={c.pageTxt ?? ""} /> : null)}
    {OV.map((o, i) => <Piece key={i} t={t} o={o} />)}
    <Heroes t={t} />
    {/* CUADRO 0 = la miniatura elegida sin texto ni flecha: el que hizo clic ve «la miniatura que se mueve»; corte seco al avatar */}
    {t < 0.8 && <AbsoluteFill><Img src={staticFile(P + "c0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.05 * t})` }} /></AbsoluteFill>}
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};
