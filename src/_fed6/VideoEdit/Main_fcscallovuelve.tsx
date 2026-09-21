import { AbsoluteFill, Sequence, OffthreadVideo, Audio, staticFile } from "remotion";
import { sec } from "./theme";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { GuardaEsto } from "./scenes/GuardaEsto";
import { LowerThird } from "./scenes/LowerThird";
import { DocNameCard } from "./scenes/DocNameCard";
import { F_INTER, THEME_MEDICO } from "./kit/premium/theme";
import { BigStatReveal, RankBars, StatGrid, GaugeDial } from "./kit/premium/stats";
import { ChecklistReveal, NumberedSteps, BulletCascade } from "./kit/premium/lists";
import { FlowSteps, CutawayCallouts, LayerStack, CycleLoop } from "./kit/premium/diagrams";
import { SplitPanel } from "./kit/premium/media";
import { PullQuote, HookCaption, KaraokePhrase, HighlightSweep } from "./kit/premium/text";
import { VsDuel, BeforeAfter, TierRanking } from "./kit/premium/compare";
import { ChapterTitle, MythTruth, StampBadge, CtaCard } from "./kit/premium/frame";
import { FedWhiteboard } from "../../FedWhiteboard";
import { FCSCALLOVUELVE_BEATS, FCSCALLOVUELVE_BROLL, FCSCALLOVUELVE_TOTAL_S } from "./fcscallovuelve_beats";

// ── CANAL "Federer Consejos Salud" · fcscallovuelve ──────────────────────────────────────────
// «¿Tu Callo Vuelve Después de Quitarlo? No es un Callo» — el callo es el SÍNTOMA.
// SIN avatar grabado: avatar 100% RunPod InfiniteTalk, sólo en ventanas discretas
// (_v3/fcscallovuelve_windows.json). Fuera de esas ventanas NO hay avatar de fondo:
// la capa raw (fotos gpt-image-2 + clips agnes i2v + Pexels) cubre a pantalla completa.
// Audio SIEMPRE del master Fish (fcscallovuelve.m4a); los clips de avatar van MUTEADOS.
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const T = THEME_MEDICO;

export const TOTAL_FRAMES_FCSCALLOVUELVE = sec(FCSCALLOVUELVE_TOTAL_S);

// PIZARRA del MECANISMO — por qué la almohadilla va DETRÁS de la cabeza del hueso.
// Es el beat obvio de pizarra del video (la presión ósea y su redistribución).
const WB_SCENE = {
  avatarSrc: staticFile("broll/fcscallovuelve_av/av01.mp4"),
  muted: true,
  cameras: [
    { time: 0.0, fx: 30, fy: 16, z: 1.1 },
    { time: 3.0, fx: 26, fy: 44, z: 1.3 },
    { time: 9.0, fx: 58, fy: 44, z: 1.25 },
    { time: 14.0, fx: 50, fy: 50, z: 1.0 },
  ],
  elements: [
    { t: "title" as const, x: 6, y: 6, text: "Por qué va DETRÁS y no encima", start: 0.4 },
    { t: "note" as const, x: 6, y: 26, w: 26, text: "La cabeza del hueso golpea el piso", start: 1.6 },
    { t: "note" as const, x: 6, y: 46, w: 26, text: "ENCIMA = le pones un escalón → aprieta MÁS", start: 3.6, fill: true },
    { t: "arrow" as const, from: [33, 52] as [number, number], to: [44, 44] as [number, number], start: 5.4, curve: -0.2 },
    { t: "note" as const, x: 46, y: 30, w: 26, text: "DETRÁS = sostiene el CUELLO del hueso", start: 6.4, highlight: true, align: "center" as const },
    { t: "lasso" as const, x: 58, y: 38, w: 28, h: 18, start: 8.0, rot: -3 },
    { t: "note" as const, x: 46, y: 56, w: 26, text: "Abre el arco de adelante", start: 9.4, box: true },
    { t: "arrow" as const, from: [60, 48] as [number, number], to: [76, 40] as [number, number], start: 10.6, curve: 0.2 },
    { t: "note" as const, x: 76, y: 30, w: 22, text: "El peso se reparte", start: 11.4, box: true },
    { t: "note" as const, x: 76, y: 54, w: 22, text: "1 cm antes del punto que duele", start: 13.0, highlight: true },
  ],
};

const OVERLAY = new Set(["lowerthird", "frasecinetica", "stampbadge", "nametag"]);
const avatarBeats = FCSCALLOVUELVE_BEATS.filter((b: any) => b.kind === "avatar");
const compBeats = FCSCALLOVUELVE_BEATS.filter((b: any) => b.kind !== "avatar");
const fullComps = compBeats.filter((b: any) => !OVERLAY.has(b.kind));
const overlayComps = compBeats.filter((b: any) => OVERLAY.has(b.kind));

const renderComp = (b: any, d: number): React.ReactNode => {
  switch (b.kind) {
    case "hookcaption":
      return <HookCaption durationInFrames={d} theme={T} words={(b.tokens || []).map((x: any) => ({ text: x.t, boxed: !!x.hl }))} sub={b.eyebrow} />;
    case "chaptertitle":
      return <ChapterTitle durationInFrames={d} theme={T} number={b.number} title={b.title} sub={b.sub} />;
    case "mythtruth":
      return <MythTruth durationInFrames={d} theme={T} myth={b.myth} truth={b.truth} />;
    case "mitoverdad":
      return <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} />;
    case "bigstat":
      return <BigStatReveal durationInFrames={d} theme={T} eyebrow={b.eyebrow} value={b.value} prefix={b.prefix} suffix={b.suffix} support={b.support} />;
    case "statgrid":
      return <StatGrid durationInFrames={d} theme={T} title={b.title} stats={b.stats} />;
    case "rankbars":
      return <RankBars durationInFrames={d} theme={T} title={b.title} unit={b.unit} rows={b.rows} />;
    case "gaugedial":
      return <GaugeDial durationInFrames={d} theme={T} eyebrow={b.eyebrow} label={b.label} value={b.value} suffix={b.suffix} zones={b.zones} />;
    case "checklist":
      return <ChecklistReveal durationInFrames={d} theme={T} eyebrow={b.eyebrow} title={b.title} items={b.items} stamp={b.stamp} />;
    case "numbered":
      return <NumberedSteps durationInFrames={d} theme={T} eyebrow={b.eyebrow} title={b.title} steps={b.steps} />;
    case "bullets":
      return <BulletCascade durationInFrames={d} theme={T} eyebrow={b.eyebrow} bullets={b.bullets} />;
    case "flowsteps":
      return <FlowSteps durationInFrames={d} theme={T} title={b.title} nodes={b.nodes} />;
    case "layerstack":
      return <LayerStack durationInFrames={d} theme={T} title={b.title} layers={b.layers} />;
    case "cycleloop":
      return <CycleLoop durationInFrames={d} theme={T} title={b.title} center={b.center} nodes={b.nodes} />;
    case "cutaway":
      return <CutawayCallouts durationInFrames={d} theme={T} eyebrow={b.eyebrow} title={b.title} image={b.image ? staticFile(b.image) : undefined} callouts={b.callouts} />;
    case "splitpanel":
      return <SplitPanel durationInFrames={d} theme={T} eyebrow={b.eyebrow} title={b.title} bullets={b.bullets} />;
    case "pullquote":
      return <PullQuote durationInFrames={d} theme={T} quote={b.quote} author={b.author} role={b.role} />;
    case "karaoke":
      return <KaraokePhrase durationInFrames={d} theme={T} eyebrow={b.eyebrow} phrase={b.phrase} />;
    case "highlightsweep":
      return <HighlightSweep durationInFrames={d} theme={T} pre={b.pre} highlight={b.highlight} post={b.post} note={b.note} />;
    case "vsduel":
      return <VsDuel durationInFrames={d} theme={T} eyebrow={b.eyebrow} title={b.title} left={b.left} right={b.right} />;
    case "beforeafter":
      return <BeforeAfter durationInFrames={d} theme={T} eyebrow={b.eyebrow} beforeLabel={b.beforeLabel} afterLabel={b.afterLabel} caption={b.caption} />;
    case "tierranking":
      return <TierRanking durationInFrames={d} theme={T} title={b.title} rows={b.rows} />;
    case "guardaesto":
      return <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} />;
    case "errorstinger":
      return <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} />;
    case "ctacard":
      return <CtaCard durationInFrames={d} theme={T} eyebrow={b.eyebrow} title={b.title} bullet={b.bullet} price={b.price} cta={b.cta} />;
    case "fedwhiteboard":
      return <FedWhiteboard scene={WB_SCENE} theme="white" />;
    // overlays
    case "lowerthird":
      return <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} />;
    case "frasecinetica":
      return <FraseCinetica durationInFrames={d} words={b.words} perWord={b.perWord} tone={b.tone} />;
    case "stampbadge":
      return <StampBadge durationInFrames={d} theme={T} text={b.text} sub={b.sub} x={0.74} y={0.24} />;
    case "nametag":
      return <DocNameCard durationInFrames={d} image="img/fcscallovuelve_docface.png" name="Dr. Federer" role="Medicina general · salud después de los 60" />;
    default:
      return null;
  }
};

const CTA_AT = FCSCALLOVUELVE_TOTAL_S - 16;

export const MainFcscallovuelve: React.FC = () => {
  const hookDur = 5.4;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* AUDIO MASTER — único, continuo, ancla todo el video */}
      <Audio src={staticFile("fcscallovuelve.m4a")} />

      {/* CAPA 1 — raw (clips agnes/Pexels + fotos), a pantalla completa */}
      {FCSCALLOVUELVE_BROLL.map((b: any, i: number) => {
        const d = Math.max(1, sec(b.dur));
        return (
          <Sequence key={`raw_${i}`} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            <RawShot durationInFrames={d} src={b.src} hue="cold" />
          </Sequence>
        );
      })}

      {/* CAPA 2 — AVATAR por ventanas discretas (clips cortados del reel de RunPod) */}
      {avatarBeats.map((b: any, i: number) => {
        const d = Math.max(1, sec(b.dur));
        return (
          <Sequence key={`av_${i}`} from={sec(b.start)} durationInFrames={d} premountFor={30}>
            <AbsoluteFill style={{ backgroundColor: "#000" }}>
              <OffthreadVideo src={staticFile(b.src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* CAPA 3 — componentes a PANTALLA COMPLETA */}
      {fullComps.map((b: any, i: number) => {
        const d = Math.max(1, sec(b.dur));
        return (
          <Sequence key={`full_${i}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* CAPA 4 — componentes OVERLAY (alarma / frase / sello / tarjeta) */}
      {overlayComps.map((b: any, i: number) => {
        const d = Math.max(1, sec(b.dur));
        return (
          <Sequence key={`ov_${i}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* HOOK — texto sobre el avatar de apertura */}
      <Sequence from={sec(1.4)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)} setup="Te lo quitaste… y volvió en el mismo punto." impact="NO ES UN CALLO" accentColor={TEAL} font={F_INTER} fontSize={130} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, FCSCALLOVUELVE_TOTAL_S - CTA_AT))} layout="none">
        <Endcard
          durationInFrames={sec(Math.max(2, FCSCALLOVUELVE_TOTAL_S - CTA_AT))}
          kicker="Dr. Federer"
          title="archivos-federer.vercel.app"
          subtitle="La Guía Completa de la Salud Después de los 60 — +150 remedios caseros"
          cta="SUSCRÍBETE"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
