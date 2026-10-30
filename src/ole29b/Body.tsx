// ole29b · EL VIDEO ENTERO (locución 0 → final). Base = foto/Veo del tramo (plan.segs, cada uno anclado a su frase) o el mundo 3D
// de la cocina del campamento; el avatar entra y sale con CORTE SECO; encima el CTA (chip → página real + QR → descripción),
// los dos carruseles (5 errores, repaso) y un componente ÚNICO por minuto (heroes.json). Audio fuera de Remotion (encfin).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { COL, FONT, LowerThird, Vid, e } from "./lib";
import { NextCard } from "./comps2";
import { AskCard, Chip, CoverFlow, Desc, GuidePage } from "./premium";
import { Avatar, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import HEROES from "./heroes.json";
import { H } from "./hkit";
import { HA } from "./heroes_b3";

type Seg = [number, number, string, string];
type Cta = { chip?: [number, number, string]; page?: [number, number, string, string]; desc?: [number, number] };
type Txt = { lower: [number, number]; ask: [string, string, string]; subAt: number; askAt: [number, number] };
const PL = PLAN as unknown as { segs: Seg[]; cta: Cta[]; end: number; txt: Txt };
export const END = PL.end;

const base = (t: number): React.ReactNode => {
  const g = PL.segs.find(([a, b]) => t >= a && t < b);
  if (!g) return <World t={t} />;
  const [a, , k, id] = g;
  // clip de Veo (8 s, con movimiento propio) desde su cuadro 0; si no llegó o no pasó el control, el mundo
  if (k === "V") return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : <World t={t} />;
  return <Shot k={id} t={t} a={a} />;
};
const nowAv = (t: number) => WIN.some((x) => t >= x.ms && t < x.me);
const avOn = (a: number, b: number) => WIN.some((w) => a < w.me && b > w.ms);
const Stage: React.FC<{ t: number }> = ({ t }) => (nowAv(t) ? <Avatar t={t} /> : <>{base(t)}</>);

const CTA: React.FC<{ t: number; c: Cta }> = ({ t, c }) => {
  const side = c.desc ? avOn(c.desc[0], c.desc[1]) : false;
  return <>
    {c.chip && <Chip t={t} at={c.chip[0]} out={c.chip[1]} text={c.chip[2]} />}
    {c.page && <GuidePage t={t} at={c.page[0]} out={c.page[1]} img={c.page[2]} tag={c.page[3]} />}
    {c.desc && <Desc t={t} at={c.desc[0]} out={c.desc[1]} x={side ? 440 : 960} y={side ? 880 : 640} scale={side ? 0.56 : 0.8} />}
  </>;
};

// la foto más cercana a ese segundo (fondo desenfocado de cada componente y material de las tarjetas), sin repetir dentro de la pieza
const imgNear = (t: number, used: Set<string>): string | undefined => {
  let best: string | undefined, bd = 14;
  for (const [a, b, k, id] of PL.segs) { if (k === "V" || used.has(id)) continue; const d = t < a ? (a - t) * 0.8 : t > b ? t - b : 0; if (d < bd) { bd = d; best = id; } }
  if (best) used.add(best); return best;
};
const HS: H[] = (HEROES as H[]).map((h) => {
  const u = new Set<string>(); const out: H = { ...h };
  out.bg = imgNear(h.at + 1, u);
  if (h.cards) out.imgs = (h.cards as [number, string][]).map(([x]) => imgNear(x + 1, u));
  else out.imgs = [h.at + 1.5, h.at + 4, (h.at + h.out) / 2, h.out - 1].map((x) => imgNear(x, u));
  return out;
});
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => {
  if (t < h.at - 0.1 || t > h.out + 0.9) return null;
  if (h.k === "d_five" || h.k === "d_recap") {
    const cards = (h.cards as [number, string][]).map(([at, title], j) => ({ img: h.imgs?.[j], at, n: j + 1, title }));
    return <CoverFlow key={i} t={t} at={h.at} out={h.out} hide={nowAv(t)} col={h.k === "d_five" ? "red" : undefined}
      kicker={h.k === "d_five" ? "ONE SKILLET, LITTLE MONEY" : "THE WHOLE WEEK"} title={h.k === "d_five" ? "THE 5 MISTAKES" : "7 DAYS · 21 MEALS"} cards={cards} />;
  }
  const C = HA[h.k]; return C ? <C key={i} t={t} h={h} /> : null;
})}</>;

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  const T = PL.txt;
  return <AbsoluteFill style={{ background: "#000" }}>
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    {t < 1.7 && <AbsoluteFill style={{ opacity: 1 - e(t, 0.8, 1.6) }}>{/* cuadro 0 = la miniatura sin texto, se funde a la cocina */}
      <Img src={staticFile("ole29b/mini0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.025 * t})` }} /></AbsoluteFill>}
    <LowerThird t={t} at={T.lower[0]} out={T.lower[1]} name="OLE" l2="OLE'S CAMP KITCHEN · NORTHERN MINNESOTA" l2at={T.lower[0] + 1} />
    {PL.cta.map((c, i) => <CTA key={i} t={t} c={c} />)}
    <Heroes t={t} />
    {t > T.subAt - 0.6 && t < T.askAt[0] + 0.8 && <NextCard t={t} at={T.subAt} subAt={T.subAt + 1.4} out={T.askAt[0] - 0.2}><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 54, color: COL.amber }}>MORE COOK SHACK STORIES</div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: COL.ink }}>every week from Ole's kitchen</div></NextCard>}
    {t > T.askAt[0] - 0.6 && t < T.askAt[1] + 0.8 && <AskCard t={t} at={T.askAt[0]} out={T.askAt[1]} q={T.ask} side={avOn(T.askAt[0], T.askAt[1])} />}
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};
