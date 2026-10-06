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
import { F_INTER } from "./kit/premium/theme";
import { THEME_MEDICO } from "./kit/premium/theme";
import { BigStatReveal, RankBars } from "./kit/premium/stats";
import { ChecklistReveal } from "./kit/premium/lists";
import { FlowSteps, CutawayCallouts } from "./kit/premium/diagrams";
import { SplitPanel } from "./kit/premium/media";
import { PullQuote } from "./kit/premium/text";
import { FCSNERVIOS_BEATS, FCSNERVIOS_TOTAL_S } from "./fcsnervios_beats";
import { FCSNERVIOS_BROLL } from "./fcsnervios_broll";

// ── CANAL "Federer Consejos Salud" · fcsnervios · Hormigueo/ardor/adormecimiento (neuropatía) ──
// SIN avatar grabado: avatar 100% RunPod InfiniteTalk, SOLO 10 ventanas fijas (~313s, ver
// _v3/fcsnervios_windows.json) ya embebidas como beats kind:"avatar" en FCSNERVIOS_BEATS.
// Fuera de esas ventanas NO hay avatar de fondo — capa raw (b-roll denso Pexels + fotos
// gpt-image-2) cubre a pantalla completa. Audio SIEMPRE del master Fish (fcsnervios.wav);
// los clips de avatar van MUTEADOS.
const TEAL = "#12B3AE";
const BG = "#0E1D23";

export const TOTAL_FRAMES_FCSNERVIOS = sec(FCSNERVIOS_TOTAL_S);

const avatarBeats = FCSNERVIOS_BEATS.filter((b: any) => b.kind === "avatar");
const rawBeats = FCSNERVIOS_BROLL.map((b: any) => ({ ...b, kind: "raw", type: b.src.endsWith(".mp4") ? "vid" : "img" }));
const fullComps = FCSNERVIOS_BEATS.filter((b: any) => ["mitoverdad", "guardaesto", "errorstinger"].includes(b.kind));
const overlayComps = FCSNERVIOS_BEATS.filter((b: any) => ["lowerthird", "frasecinetica"].includes(b.kind));
const premiumComps = FCSNERVIOS_BEATS.filter((b: any) =>
  ["bigstat", "checklist", "flowsteps", "splitpanel", "cutaway", "rankbars", "pullquote"].includes(b.kind)
);

const CTA_AT = FCSNERVIOS_TOTAL_S - 16;

export const MainFcsnervios: React.FC = () => {
  const hookDur = 5.2;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* AUDIO MASTER — unico, continuo, ancla todo el video */}
      <Audio src={staticFile("fcsnervios.wav")} />

      {/* CAPA 1 — raw (b-roll denso Pexels), a pantalla completa, cubre TODO lo que no es avatar */}
      {rawBeats.map((b: any, i: number) => {
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

      {/* CAPA 3 — componentes FULL-SCREEN (mito / recap / error) */}
      {fullComps.map((b: any, i: number) => {
        const d = Math.max(1, sec(b.dur));
        const comp =
          b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} />
          : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} />
          : <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />;
        return (
          <Sequence key={`full_${i}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {comp}
          </Sequence>
        );
      })}

      {/* CAPA 3b — kit premium (BigStat/Checklist/FlowSteps/SplitPanel/CutawayCallouts/RankBars/PullQuote) */}
      {premiumComps.map((b: any, i: number) => {
        const d = Math.max(1, sec(b.dur));
        const comp =
          b.kind === "bigstat" ? <BigStatReveal durationInFrames={d} theme={THEME_MEDICO} eyebrow={b.eyebrow} value={b.value} prefix={b.prefix} suffix={b.suffix} support={b.support} />
          : b.kind === "checklist" ? <ChecklistReveal durationInFrames={d} theme={THEME_MEDICO} eyebrow={b.eyebrow} title={b.title} items={b.items} stamp={b.stamp} />
          : b.kind === "flowsteps" ? <FlowSteps durationInFrames={d} theme={THEME_MEDICO} title={b.title} nodes={b.nodes} />
          : b.kind === "splitpanel" ? <SplitPanel durationInFrames={d} theme={THEME_MEDICO} image={b.image} eyebrow={b.eyebrow} title={b.title} bullets={b.bullets} />
          : b.kind === "cutaway" ? <CutawayCallouts durationInFrames={d} theme={THEME_MEDICO} image={b.image} eyebrow={b.eyebrow} title={b.title} callouts={b.callouts} />
          : b.kind === "rankbars" ? <RankBars durationInFrames={d} theme={THEME_MEDICO} title={b.title} unit={b.unit} rows={b.rows} />
          : <PullQuote durationInFrames={d} theme={THEME_MEDICO} image={b.image} quote={b.quote} author={b.author} role={b.role} />;
        return (
          <Sequence key={`prem_${i}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {comp}
          </Sequence>
        );
      })}

      {/* CAPA 4 — componentes OVERLAY (alarma / frase) — encima de todo */}
      {overlayComps.map((b: any, i: number) => {
        const d = Math.max(1, sec(b.dur));
        const comp =
          b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} />
          : <FraseCinetica durationInFrames={d} words={b.words} perWord={b.perWord} tone={b.tone} />;
        return (
          <Sequence key={`ov_${i}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {comp}
          </Sequence>
        );
      })}

      {/* HOOK — texto sobre el avatar de apertura */}
      <Sequence from={sec(1.4)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)} setup="Hormigueo, ardor, adormecimiento en los pies…" impact="EL PASO 3 QUE NADIE HACE" accentColor={TEAL} font={F_INTER} fontSize={130} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, FCSNERVIOS_TOTAL_S - CTA_AT))} layout="none">
        <Endcard
          durationInFrames={sec(Math.max(2, FCSNERVIOS_TOTAL_S - CTA_AT))}
          kicker="Dr. Federer"
          title="archivos-federer.vercel.app"
          subtitle="La Guía Completa de la Salud Después de los 60 — +150 remedios caseros"
          cta="SUSCRÍBETE"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
