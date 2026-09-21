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
import { FCSCALLOS_BEATS, FCSCALLOS_TOTAL_S } from "./fcscallos_beats";

// ── CANAL "Federer Consejos Salud" · fcscallos · Callos y durezas (don Ramiro) ──
// SIN avatar grabado: avatar 100% RunPod InfiniteTalk, SOLO 10 ventanas (~25% del
// runtime, ver _v3/fcscallos_windows.json). Fuera de esas ventanas NO hay avatar de
// fondo — capa raw (fotos gpt-image-2 + clips Pexels) cubre a pantalla completa.
// Audio SIEMPRE del master Fish (fcscallos.wav); los clips de avatar van MUTEADOS.
const TEAL = "#12B3AE";
const BG = "#0E1D23";

export const TOTAL_FRAMES_FCSCALLOS = sec(FCSCALLOS_TOTAL_S);

const avatarBeats = FCSCALLOS_BEATS.filter((b: any) => b.kind === "avatar");
const rawBeats = FCSCALLOS_BEATS.filter((b: any) => b.kind === "raw");
const fullComps = FCSCALLOS_BEATS.filter((b: any) => ["mitoverdad", "guardaesto", "errorstinger"].includes(b.kind));
const overlayComps = FCSCALLOS_BEATS.filter((b: any) => ["lowerthird", "frasecinetica"].includes(b.kind));

const CTA_AT = FCSCALLOS_TOTAL_S - 16;

export const MainFcscallos: React.FC = () => {
  const hookDur = 5.2;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* AUDIO MASTER — unico, continuo, ancla todo el video */}
      <Audio src={staticFile("fcscallos.m4a")} />

      {/* CAPA 1 — raw (fotos + clips), a pantalla completa, cubre TODO lo que no es avatar */}
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
          : <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} />;
        return (
          <Sequence key={`full_${i}`} from={sec(b.start)} durationInFrames={d} layout="none">
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
        <AvatarScrimText durationInFrames={sec(hookDur)} setup="Callos y durezas en los pies después de los 60…" impact="EL PASO 3 QUE NADIE HACE" accentColor={TEAL} font={F_INTER} fontSize={130} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, FCSCALLOS_TOTAL_S - CTA_AT))} layout="none">
        <Endcard
          durationInFrames={sec(Math.max(2, FCSCALLOS_TOTAL_S - CTA_AT))}
          kicker="Dr. Federer"
          title="archivos-federer.vercel.app"
          subtitle="La Guía Completa de la Salud Después de los 60 — +150 remedios caseros"
          cta="SUSCRÍBETE"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
