// gary11k (desde gary06) · EL VIDEO ENTERO. Un solo mundo (la casa de Gary en corte, de noche en enero, world3d) y una sola
// cámara; el avatar entra y sale con CORTE SECO; fotos/clips por tramos (plan.json, anclados a su frase); un componente único
// por minuto (heroes.json); la CTA es la LANDING real en 3D + QR + maletín abierto (LandingCTA) en 1:00, ~55 % y el cierre.
// Cuadro 0 = la miniatura SIN texto (public/gary11k/thumb0.jpg) y funde al primer plano en 0,4 s. Audio en encfin.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { LowerThird, Vid, e } from "./lib";
import { AskCard } from "./premium";
import { Avatar, Clip, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import HEROES from "./heroes.json";
import REPL from "./repl.json";
import { H } from "./hkit";
import { SubTag } from "./lpieces";
import { HChirp, HCloud, HDeadPad, HGoodDay, HGrayCan, HHoursDay, HLastClip, HNoiseWin, HPriceBar, HQuietDark, HSdCard, HSignalPath, HSwollen, HThreeOpts, HUps } from "./k1";
import { HAfternoon, HCoffeeCan, HDowel, HEnginesOut, HFobSos, HFoamCase, HMagnetGap, HMap6, HPanelLook, HPinPull, HPirFan, HReleaseCord, HThreeCols, HWedgeForce } from "./k2";
import { HBluffSign, HClockChange, HDogHeight, HFakeCam, HGlass50, HHalfInch, HHeadlights, HMonthTest, HRecapCase, HRemoteBed, HSpareBag, HStudFinder, HSwingOut, HTapeLid, HTimerPlug, HVote, HWontDo, LandingCTA } from "./k3";
import { HBushTrim, HChainGen, HDayNight, HHallCone, HPlanWalk } from "./k4";

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
  if (id.startsWith("v")) return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : <Shot k={id.replace(/^v(p\d+).*$/, "$1")} t={t} a={a} />;  // el clip no llegó: su foto (primer cuadro)
  return <Clip k={"c_" + id} t={t} a={a}><Shot k={id} t={t} a={a} /></Clip>;
};
const nowAv = (t: number) => t >= THUMB && WIN.some((w) => t >= w.ms && t < w.me);
const avOn = (a: number, b: number) => WIN.some((w) => a < w.me && b > w.ms);
const Stage: React.FC<{ t: number }> = ({ t }) => (nowAv(t) ? <Avatar t={t} /> : <>{base(t)}</>);

// ===== un componente ÚNICO por minuto (heroes.json); cta1/cta2 = el manual sobre el banco =====
const HC: Record<string, React.FC<{ t: number; h: H }>> = {
  cta1: LandingCTA, cta2: LandingCTA, cta3: LandingCTA,
  deadpad: HDeadPad, threeopts: HThreeOpts, quietdark: HQuietDark, goodday: HGoodDay, graycan: HGrayCan, hoursday: HHoursDay, swollen: HSwollen, signalpath: HSignalPath,
  chirp: HChirp, pricebar: HPriceBar, cloud: HCloud, sdcard: HSdCard, ups: HUps, lastclip: HLastClip, noisewin: HNoiseWin,
  foamcase: HFoamCase, pirfan: HPirFan, magnetgap: HMagnetGap, fobsos: HFobSos, wedgeforce: HWedgeForce, coffeecan: HCoffeeCan, pinpull: HPinPull, threecols: HThreeCols,
  afternoon: HAfternoon, map6: HMap6, dowel: HDowel, releasecord: HReleaseCord, enginesout: HEnginesOut, panellook: HPanelLook,
  tapelid: HTapeLid, sparebag: HSpareBag, monthtest: HMonthTest, clockchange: HClockChange, headlights: HHeadlights, halfinch: HHalfInch, dogheight: HDogHeight,
  swingout: HSwingOut, remotebed: HRemoteBed, fakecam: HFakeCam, bluffsign: HBluffSign, glass50: HGlass50, studfinder: HStudFinder, timerplug: HTimerPlug,
  wontdo: HWontDo, recapcase: HRecapCase, vote: HVote, bushtrim: HBushTrim, planwalk: HPlanWalk, hallcone: HHallCone, chaingen: HChainGen, daynight: HDayNight };
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
    {t < 0.5 && <AbsoluteFill style={{ opacity: 1 - e(t, 0.06, 0.45) }}><Img src={staticFile("gary11k/thumb0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>}
  </AbsoluteFill>;
};

// sólo para revisar componentes en stills (sin el mundo 3D)
export const HeroesOnly: React.FC = () => { const t = useCurrentFrame() / 30; return <AbsoluteFill style={{ background: "#111" }}><Heroes t={t} /></AbsoluteFill>; };
