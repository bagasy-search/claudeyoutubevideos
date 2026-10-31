// apa30 · EL VIDEO ENTERO. Un solo mundo (la granja del almanaque en 3D, world.tsx) y una sola cámara; el avatar entra y sale
// con CORTE SECO; el metraje REAL (rNN, clip-hunter) y los Veo (vNN) entran por tramos (plan.json, anclados a su frase);
// un componente único por minuto (heroes.json). CTA = suscribirse + UNA pregunta (cta.tsx). Audio fuera de Remotion (encfin).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { LowerThird, P, Vid, e, s } from "./lib";
import CARDS from "./cards.json";
import { AskCard, CoverFlow } from "./premium";
import { Avatar, OK, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import HEROES from "./heroes.json";
import { H } from "./hkit";
import { HC, Thumb0 } from "./heroes_all";
import { SubCTA } from "./cta";

type Seg = [number, number, string, string, number?];
type Ov = { k: string; at: number; out: number; [x: string]: any };
type Txt = { recapTitle: string; recap: string[]; ask: [string, string, string]; lower: [number, number] };
const PL = PLAN as unknown as { segs: Seg[]; ov: Ov[]; end: number; txt: Txt };
export const END = PL.end;

// metraje real: corre desde su cuadro `off` con un acercamiento lento (sin filtros); se sostiene a cuadro completo
const Real: React.FC<{ id: string; t: number; a: number; b: number; off: number }> = ({ id, t, a, b, off }) => {
  const sc = 1.02 + 0.05 * e(t, a, Math.max(a + 4, b));
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>
    <Sequence from={s(a)} durationInFrames={s(b - a) + 2} layout="none">
      <OffthreadVideo src={staticFile(P + "real/" + id + ".mp4")} startFrom={s(off)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
  </AbsoluteFill>;
};

// ===== la BASE: metraje real / Veo del tramo o el mundo =====
const base = (t: number): React.ReactNode => {
  const g = PL.segs.find(([a, b]) => t >= a && t < b);
  if (!g) return <World t={t} />;
  const [a, b, , id, off] = g;
  if (id.startsWith("v")) return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : <World t={t} />;
  if (id.startsWith("r")) return <Real id={id} t={t} a={a} b={b} off={off ?? 0} />;
  return <World t={t} />;
};
const nowAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
const avOn = (a: number, b: number) => WIN.some((w) => a < w.me && b > w.ms);
const Stage: React.FC<{ t: number }> = ({ t }) => (nowAv(t) ? <Avatar t={t} /> : <>{base(t)}</>);

// ===== los 5 errores y el repaso: carrusel 3D de tarjetas con cuadro real (sobre el avatar se esconde) =====
const CJ = CARDS as unknown as { err?: string[]; rec?: string[] };
const MIS = PL.ov.filter((o) => o.k === "mistake").sort((a, b) => a.n - b.n);
const DEAL = PL.ov.find((o) => o.k === "deal");
const REC = PL.ov.find((o) => o.k === "recap");
const Carousels: React.FC<{ t: number }> = ({ t }) => <>
  {MIS.length > 0 && <CoverFlow t={t} at={DEAL?.at ?? MIS[0].at - 1} out={MIS[MIS.length - 1].out} hide={nowAv(t)} kicker="DON'T DO THESE" title={`THE ${MIS.length} MISTAKES`} col="red"
    cards={MIS.map((m, i) => ({ img: CJ.err?.[i], at: m.at, n: m.n, title: m.txt }))} />}
  {REC && <CoverFlow t={t} at={REC.at} out={REC.out} hide={nowAv(t)} kicker="START TO FINISH" title={PL.txt.recapTitle}
    cards={PL.txt.recap.map((n, i) => ({ img: CJ.rec?.[i], at: REC.rows[i] ?? REC.out, n: i + 1, title: n })).filter((c) => c.at < REC.out)} />}
</>;

// ===== un componente ÚNICO por minuto (heroes.json) =====
const imgNear = (t: number): string | undefined => {
  let best: string | undefined, bd = 30;
  for (const [a, b, , id] of PL.segs) { if (!id.startsWith("r")) continue; const d = t < a ? a - t : t > b ? t - b : 0; if (d < bd) { bd = d; best = id; } }
  return best;
};
const HS: H[] = (HEROES as H[]).map((h) => ({ ...h, bg: h.bg ?? imgNear(h.at + 1) }));
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => {
  const C = (h.k.startsWith("cta") ? SubCTA : HC[h.k]) as React.FC<{ t: number; h: H }> | undefined;
  return C && t > h.at - 0.1 && t < h.out + 0.9 ? <C key={i} t={t} h={h} /> : null;
})}</>;

const Piece: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  if (t < o.at - 0.6 || t > o.out + 1.0) return null;
  if (o.k === "ask") return <AskCard t={t} at={o.at} out={o.out} q={PL.txt.ask} side={avOn(o.at, o.out)} />;
  return null;
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    {/* cámara a mano virtual (balanceo lento, no temblor) sobre todo lo que se filma */}
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    <LowerThird t={t} at={PL.txt.lower[0]} out={PL.txt.lower[1]} name="THE PEST ALMANAC" l2="OLD FARM WAYS · NO POISON" l2at={PL.txt.lower[0] + 1} />
    <Carousels t={t} />
    {PL.ov.map((o, i) => <Piece key={i} t={t} o={o} />)}
    <Heroes t={t} />
    {/* cuadro 0 = la miniatura sin texto rehecha en código; se abre al avatar en el primer segundo */}
    {t < 1.4 && <Thumb0 t={t} />}
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};

// sólo para revisar componentes en stills (sin el mundo 3D)
export const HeroesOnly: React.FC = () => { const t = useCurrentFrame() / 30; return <AbsoluteFill style={{ background: "#111" }}><Heroes t={t} />{t < 1.4 && <Thumb0 t={t} />}</AbsoluteFill>; };
