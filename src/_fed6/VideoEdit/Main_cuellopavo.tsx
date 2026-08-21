import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { sec } from "./theme";
import { FedOilCarousel } from "../../FedererKit";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { AvatarPizarra } from "./scenes/AvatarPizarra";
import { AvatarKeyword } from "./scenes/AvatarKeyword";
import { LowerThird } from "./scenes/LowerThird";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { GuardaEsto } from "./scenes/GuardaEsto";
import { FreezeZoom } from "./scenes/FreezeZoom";
import { FedGuideCTA } from "./scenes/FedGuideCTA";
import { PriceWar } from "./scenes/PriceWar";
import { BenefitLockReveal } from "./scenes/BenefitLockReveal";
import { HighlightData, CitationCard } from "./scenes/RecalRich";
import { DocNameCard } from "./scenes/DocNameCard";
import { CP_BEATS } from "./cuellopavo_beats";
import { CP_BROLL } from "./cuellopavo_broll";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Federer - Más Salud, Más Vida" · EL COLLAR DE RICINO (cuello de pavo) ──
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const AVATAR = "cuellopavo_opt.mp4";

const NEWFULL = new Set([
  "avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom",
  "guidecta", "carousel", "pricewar", "benefitlock", "highlightdata", "citationcard",
]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra", "avatarkeyword"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 4.2;
const capOf = (b: any): number => {
  if (b.kind === "freezezoom") return /lamina/.test(b.image || "") ? Math.max(2, b.dur) : 4.5;
  const k = b.kind;
  return k === "guidecta" ? 12 : k === "diagram" ? 10 : k === "board" ? 16 : k === "quote" ? 8 : k === "rule" ? 5
    : k === "errorstinger" ? 2.4 : k === "guardaesto" ? 9 : k === "mitoverdad" ? 6.5
    : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5 : k === "process" || k === "checklist" ? 9
    : k === "pricewar" ? 7 : k === "benefitlock" ? 6 : k === "highlightdata" ? 7 : k === "citationcard" ? 7.5
    : k === "carousel" ? 7 : k === "bars" ? 7.5 : k === "stat" ? 6 : k === "splitlist" ? 8 : 6;
};

const compBeats = CP_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = CP_BEATS.filter((b: any) => b.kind === "raw" && /^(img|vid)\//.test(b.src || ""));
const VIDEO_END = Math.max(
  ...CP_BEATS.map((b: any) => b.start + b.dur),
  CP_BROLL.length ? CP_BROLL[CP_BROLL.length - 1].start + CP_BROLL[CP_BROLL.length - 1].dur : 0,
  1401.96,
) + 1.0;
export const TOTAL_FRAMES_CP = Math.round(VIDEO_END * 30);

const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b), room));
};

function buildWindows(): AvatarWindow[] {
  type Iv = { s: number; e: number; mode: AvatarWindow["mode"] };
  const compIv: Iv[] = [];
  for (const b of compBeats) { if (OVERLAY.has(b.kind)) continue; compIv.push({ s: b.start, e: b.start + compDur(b), mode: "hidden" }); }
  // ANTI-HUECO: cada contenido cubre SOLO su cobertura real (ya viene calculada en `dur`
  // contra la duración REAL del mp4). Fuera de eso el avatar vuelve a FULL: es el fondo garantizado.
  const contentIv: Iv[] = [
    ...CP_BROLL.map((b: any) => ({ s: b.start, e: b.start + b.dur, mode: "hidden" as const })),
    ...rawTop.map((b: any) => ({ s: b.start, e: b.start + Math.min(b.dur, b.hold ? 6.5 : HERO_CAP), mode: "hidden" as const })),
  ].sort((a, b) => a.s - b.s);
  const inIv = (ivs: Iv[], s: number) => ivs.find((x) => s >= x.s - 0.02 && s < x.e - 0.02);

  const w: AvatarWindow[] = [];
  let last: AvatarWindow["mode"] | null = null;
  for (let s = 0; s <= VIDEO_END + 0.001; s += 0.1) {
    const comp = inIv(compIv, s);
    const cont = inIv(contentIv, s);
    const mode: AvatarWindow["mode"] = comp ? "hidden" : cont ? cont.mode : "full";
    if (mode !== last) { w.push({ start: +s.toFixed(2), mode }); last = mode; }
  }
  if (!w.length || w[0].start > 0) w.unshift({ start: 0, mode: "full" });
  return w;
}
const AVATAR_WINDOWS = buildWindows();

const ctaBeat = [...compBeats].reverse().find((b: any) => b.kind === "nametag");
const CTA_AT = ctaBeat ? ctaBeat.start : VIDEO_END - 12;

const renderComp = (b: any, d: number) =>
  b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar={AVATAR} avatarFrom={Math.round(b.start * 30)} />
  : b.kind === "avatarkeyword" ? <AvatarKeyword durationInFrames={d} items={b.items} avatar={AVATAR} avatarFrom={Math.round(b.start * 30)} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} mythLabel="EL MITO" truthLabel="LA VERDAD" />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} />
  : b.kind === "guidecta" ? <FedGuideCTA durationInFrames={d} cover={b.cover} qr={b.qr} title={b.title} kicker={b.kicker} desc={b.desc} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : b.kind === "pricewar" ? <PriceWar durationInFrames={d} leftImage={b.leftImage} rightImage={b.rightImage} leftPrice={b.leftPrice} rightPrice={b.rightPrice} leftLabel={b.leftLabel} rightLabel={b.rightLabel} subtitle={b.subtitle} verdict={b.verdict} />
  : b.kind === "benefitlock" ? <BenefitLockReveal durationInFrames={d} index={b.index} cards={b.cards} />
  : b.kind === "highlightdata" ? <HighlightData durationInFrames={d} pre={b.pre} highlight={b.highlight} post={b.post} source={b.source} />
  : b.kind === "citationcard" ? <CitationCard durationInFrames={d} journal={b.journal} finding={b.finding} stat={b.stat} statPrefix={b.statPrefix} statSuffix={b.statSuffix} statLabel={b.statLabel} />
  : b.kind === "nametag" ? <DocNameCard durationInFrames={d} name={b.name} role={b.role} image={b.image} />
  : b.kind === "carousel" ? <FedOilCarousel cards={(b.cards || []).map((c: any) => ({ ...c, image: staticFile(c.image) }))} focus={typeof b.focus === "number" ? b.focus : -1} intro={b.intro === true} accent={TEAL} kicker={b.kicker} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainCuellopavo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO continuo (clips agnes + fotos) */}
      {CP_BROLL.map((b: any) => {
        const dd = Math.max(1, sec(b.dur));
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            <RawShot durationInFrames={dd} src={b.src} hue="cold" />
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS del presentador (gpt-image-2 con su cara) */}
      {rawTop.map((b: any) => {
        const d = Math.max(1, sec(Math.min(b.dur, b.hold ? 6.5 : HERO_CAP)));
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR (full / hidden, cero recuadro) */}
      <AvatarLayer src={AVATAR} windows={AVATAR_WINDOWS} accent={TEAL} avatarFocus={{ x: 0.5, splitZoom: 1.12 }} />

      {/* CAPA 4 — COMPONENTES, topeados por beat */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} kicker="Dr. Federer" title="Suscríbete" subtitle="Más Salud, Más Vida — remedios caseros, naturales y baratos para después de los 60" cta="SUSCRÍBETE" />
      </Sequence>
    </AbsoluteFill>
  );
};
