// ohf9na · EL VIDEO ENTERO. Avatar con corte seco; entre ventanas, fotos de Codex animadas (pNNN) y clips del presentador (vNN), anclados a su frase
// (plan.json); un componente único por minuto (heroes.json). CTA = el libro abierto + QR grande. Audio fuera de Remotion.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { LowerThird, e } from "./lib";
import { AskCard } from "./premium";
import { Avatar, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import HEROES from "./heroes.json";
import { H } from "./hkit";
import { BookCTA, SubTag } from "./bpieces";
import { F0, Frame0 } from "./frame0";
import { HTray, HStamp10, HEnvelope, HKillPlate, HSlide, HDishes, HSwatch, HDab, HTiles, HStops, HBagTrail, HFanOut, HHalo, HRoller, HPores, HCrack, HTimer, HDayClock, HJug, HGate, HDrywall, HRack } from "./heroes_m1";
import { HLamina, HPage, HFlipTag, HHumid, HCold, HChips, HSkin, HVac, HCal, HBadges, HDishAny, HPayoff, HLung, HDry, HRecap, HEnd } from "./heroes_m2";

type Seg = [number, number, string, string];
type Ov = { k: string; at: number; out: number; [x: string]: any };
type Txt = { ask: [string, string, string]; lower: [number, number] };
const PL = PLAN as unknown as { segs: Seg[]; ov: Ov[]; end: number; txt: Txt };
export const END = PL.end;

// hash entero: sentido, amplitud y foco salen sorteados por plano, nunca alternados
const hsh = (x: number) => { let h = Math.imul(x | 0, 2654435761) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return (h >>> 0) / 4294967296; };

// clip Avatarity (7,9 s): entero desde su cuadro 0; si el plano es más largo va en cámara lenta hasta llenarlo, nunca repetido. 1,11 tapa la marca de agua.
const Anim: React.FC<{ id: string; a: number; b: number; t: number }> = ({ id, a, b, t }) => {
  const n = parseInt(id.slice(1), 10) + (id[0] === "v" ? 500 : 0), dur = b - a, sale = hsh(n * 3) < 0.5, amp = Math.min(0.2, (0.006 + 0.008 * hsh(n * 5)) * dur);
  const k = Math.max(0, Math.min(1, (t - a) / dur)), z = 1.11 + (sale ? amp * (1 - k) : amp * k);
  return <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${35 + 30 * hsh(n * 7)}% ${35 + 30 * hsh(n * 11)}%` }}>
    <Sequence from={Math.round(a * 30)} layout="none"><OffthreadVideo src={staticFile("ohf9na/veo/" + id + ".mp4")} muted playbackRate={Math.min(1, 7.7 / dur)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
  </AbsoluteFill>;
};

// ===== la BASE: clip del tramo; sin clip, la foto con Ken Burns =====
const base = (t: number): React.ReactNode => {
  const g = PL.segs.find(([a, b]) => t >= a && t < b);
  if (!g) return <World t={t} />;
  const [a, b, , id] = g;
  if (id.startsWith("s:")) return <Shot k={id.slice(2)} t={t} a={a} dur={b - a} />;
  if (OK.has(id)) return <Anim id={id} a={a} b={b} t={t} />;
  return <Shot k={id} t={t} a={a} dur={b - a} />;
};
const nowAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
const avOn = (a: number, b: number) => WIN.some((w) => a < w.me && b > w.ms);
const Stage: React.FC<{ t: number }> = ({ t }) => (nowAv(t) ? <Avatar t={t} /> : <>{base(t)}</>);

// ===== un componente ÚNICO por minuto (heroes.json) =====
const HC: Record<string, React.FC<{ t: number; h: H }>> = { tray: HTray, stamp10: HStamp10, envelope: HEnvelope, killplate: HKillPlate, slide: HSlide, dishes: HDishes, swatch: HSwatch, dab: HDab, tiles: HTiles, stops: HStops, bagtrail: HBagTrail, fanout: HFanOut, halo: HHalo, roller: HRoller, pores: HPores, crack: HCrack, timer: HTimer, dayclock: HDayClock, jug: HJug, gate: HGate, drywall: HDrywall, rack: HRack, lamina: HLamina, page: HPage, fliptag: HFlipTag, humid: HHumid, cold: HCold, chips: HChips, skin: HSkin, vac: HVac, cal: HCal, badges: HBadges, dishany: HDishAny, payoff: HPayoff, lung: HLung, dry: HDry, recap: HRecap, end: HEnd };
// la foto más cercana a ese segundo: fondo desenfocado del componente
const imgNear = (t: number): string | undefined => {
  let best: string | undefined, bd = 30;
  for (const [a, b, , raw] of PL.segs) { const id = raw.replace("s:", ""); if (id.startsWith("v")) continue; const d = t < a ? a - t : t > b ? t - b : 0; if (d < bd) { bd = d; best = id; } }
  return best;
};
const HS: H[] = (HEROES as unknown as H[]).map((h) => ({ ...h, bg: imgNear(h.at + 1) }));
const CTA: React.FC<{ t: number; h: H }> = ({ t, h }) => <BookCTA t={t} at={h.at} out={h.out} v={h.k === "cta1" ? 1 : 2} />;
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => { const C = h.k.startsWith("cta") ? CTA : HC[h.k] as React.FC<{ t: number; h: H }> | undefined; return C && t > h.at - 0.1 && t < h.out + 0.9 ? <C key={i} t={t} h={h} /> : null; })}</>;

const Piece: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  if (t < o.at - 0.6 || t > o.out + 1.0) return null;
  if (o.k === "sub") return <SubTag t={t} at={o.at} out={o.out} />;
  if (o.k === "ask") return <AskCard t={t} at={o.at} out={o.out} q={PL.txt.ask} side={avOn(o.at, o.out)} />;
  return null;
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    <LowerThird t={t} at={PL.txt.lower[0]} out={PL.txt.lower[1]} name="THE OLD HOUSE FIX" l2="MOLD · MOISTURE · OLD HOUSES" l2at={PL.txt.lower[0] + 1} />
    {PL.ov.map((o, i) => <Piece key={i} t={t} o={o} />)}
    <Heroes t={t} />
    {t < F0 && <Frame0 t={t} />}
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};

// sólo para revisar componentes en stills (sin el mundo 3D)
export const HeroesOnly: React.FC = () => { const t = useCurrentFrame() / 30; return <AbsoluteFill style={{ background: "#111" }}><Heroes t={t} /></AbsoluteFill>; };
