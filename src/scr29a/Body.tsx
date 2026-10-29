// scr29a · EL VIDEO ENTERO (locución 0 → final). Un solo mundo (el garage con la estufa de aceite usado) y una sola cámara;
// el avatar entra con CORTE SECO; fotos/Veo por tramos (plan.json, ancladas a su frase); un componente ÚNICO por minuto
// (heroes.json → scrA1/scrA2). CTA = suscribirse (HSubscribe) + pregunta (HShadow). Sin guía. Audio fuera de Remotion (encfin).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { LowerThird, Vid, e } from "./lib";
import CARDS from "./cards.json";
import { CoverFlow } from "./premium";
import { Avatar, Clip, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import HEROES from "./heroes.json";
import { H } from "./hkit";
import { HCalendar, HDrill, HLineup, HLoupe, HManifold, HMatch, HMetronome, HMoney, HPadlock, HPriceTag, HSection, HSettle, HSubscribe, HTape, HWrench, HXray } from "./scrA1";
import { HBalance, HBalloon, HBinder, HConveyor, HCork, HDayCycle, HDial, HFloorPlan, HFrost, HHourglass, HLoop, HMeter, HPaintFan, HPipeRace, HPortholes, HRegister, HScope, HShadow, HStopwatch, HThermal, HToolbox } from "./scrA2";

type Seg = [number, number, string, string];
type Ov = { k: string; at: number; out: number; [x: string]: any };
type Txt = { recapTitle: string; recap: string[]; ask: [string, string, string]; next: [string, string]; lower: [number, number] };
const PL = PLAN as unknown as { segs: Seg[]; ov: Ov[]; end: number; txt: Txt };
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
const Stage: React.FC<{ t: number }> = ({ t }) => (WIN.some((x) => t >= x.ms && t < x.me) ? <Avatar t={t} /> : <>{base(t)}</>);


// ===== los 5 errores y el repaso: carrusel 3D de tarjetas con foto (sobre el avatar se esconde; ahí va la tarjeta chica) =====
const CJ = CARDS as unknown as { err?: string[]; rec?: string[]; vs?: string[] };
const MIS = PL.ov.filter((o) => o.k === "mistake").sort((a, b) => a.n - b.n);
const nowAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
// la foto más cercana a ese segundo (si en ese instante va el avatar o un Veo), sin repetir las ya usadas en la misma pieza
const imgNear = (t: number, used: Set<string>): string | undefined => {
  let best: string | undefined, bd = 12;
  for (const [a, b, , id] of PL.segs) { if (id.startsWith("v") || used.has(id)) continue; const d = t < a ? (a - t) * 0.8 : t > b ? t - b : 0; if (d < bd) { bd = d; best = id; } }
  if (best) used.add(best); return best;
};
const Carousels: React.FC<{ t: number }> = ({ t }) => <>
  {MIS.length > 0 && <CoverFlow t={t} at={MIS[0].at - 1} out={MIS[MIS.length - 1].out} hide={nowAv(t)} kicker="BEFORE YOU LIGHT IT" title={`${MIS.length} MISTAKES`} col="red"
    cards={MIS.map((m, i) => ({ img: CJ.err?.[i], at: m.at, n: m.n, title: m.txt }))} />}
</>;

// ===== un componente ÚNICO por minuto (heroes.json): tapan todo; las piezas chicas que caen en su tramo se apagan =====
const HC: Record<string, React.FC<{ t: number; h: H }>> = { manifold: HManifold, padlock: HPadlock, lineup: HLineup, pricetag: HPriceTag, xray: HXray, wrench: HWrench, subscribe: HSubscribe,
  tape: HTape, section: HSection, calendar: HCalendar, drill: HDrill, money: HMoney, loupe: HLoupe, metronome: HMetronome, settle: HSettle, match: HMatch,
  stopwatch: HStopwatch, portholes: HPortholes, floorplan: HFloorPlan, piperace: HPipeRace, frost: HFrost, thermal: HThermal, dial: HDial, balloon: HBalloon,
  toolbox: HToolbox, daycycle: HDayCycle, balance: HBalance, binder: HBinder, hourglass: HHourglass, cork: HCork, register: HRegister, conveyor: HConveyor,
  shadow: HShadow, paintfan: HPaintFan, scope: HScope, meter: HMeter, loop: HLoop };
const HS: H[] = (HEROES as H[]).map((h) => {
  const u = new Set<string>();
  const out: H = { ...h };
  out.img = h.img ?? imgNear(h.imgAt ?? h.at + 1, u);
  out.bg = out.img;
  if (h.imgsAt) out.imgs = (h.imgsAt as number[]).map((x) => imgNear(x, u));
  if (h.items) out.items = (h.items as any[]).map((it) => ({ ...it, img: it.img ?? imgNear(h.at + it.at, u) }));
  if (!out.imgs && h.items) out.imgs = (out.items as any[]).map((it) => it.img);
  return out;
});
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => { const C = HC[h.k] as React.FC<{ t: number; h: H }> | undefined; return C && t > h.at - 0.1 && t < h.out + 0.9 ? <C key={i} t={t} h={h} /> : null; })}</>;

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    {/* cámara a mano virtual (balanceo lento, no temblor) sobre todo lo que se filma: mundo, fotos, clips y avatar */}
    {/* con un componente a pantalla llena no se dibuja el mundo de abajo (ahorra WebGL en el farm y en los stills) */}
    {!HS.some((h) => t > h.at + 1.2 && t < h.out - 0.3) && <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>}
    <LowerThird t={t} at={PL.txt.lower[0]} out={PL.txt.lower[1]} name="THE SCRAP WORKSHOP" l2="BUILT FROM SCRAP" l2at={PL.txt.lower[0] + 1} />
    <Carousels t={t} />
    <Heroes t={t} />
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};
