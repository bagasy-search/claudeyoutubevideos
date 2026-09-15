import { AbsoluteFill, Audio, Sequence, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { sec } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { Endcard } from "./scenes/Endcard";
import { LowerThird } from "./scenes/LowerThird";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { PizarraExplica } from "./scenes/PizarraExplica";
import { F_INTER } from "./kit/premium/theme";
import { FCSCUELLO_BROLL, FCSCUELLO_AVWINS, FCSCUELLO_COMP, VIDEO_END } from "./fcscuello_beats";

// ── CANAL "Federer Consejos Salud" · SI VES ESTO EN EL CUELLO ──────────────────
// Arquitectura AVATAR DISCRETO: 13 ventanas de avatar (RunPod InfiniteTalk) full-frame y MUTEADAS
// sobre una capa base de b-roll (fotos Pexels + clips) que cubre el 100%. Audio = master Fish.
const TEAL = "#12B3AE";
const BG = "#0E1D23";
export const TOTAL_FRAMES_FCSCUELLO = Math.round(VIDEO_END * 30);

// push lento subpíxel para el avatar full-frame (regla 2: nunca estático)
const AvatarClip: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const z = interpolate(f, [0, Math.max(2, durationInFrames)], [1.02, 1.07], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)})`, transformOrigin: "50% 32%" }} />
    </AbsoluteFill>
  );
};

// clip de b-roll de stock (video): OffthreadVideo full-frame, muteado, push leve subpíxel.
const VideoShot: React.FC<{ src: string; seed: number }> = ({ src, seed }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inZ = (seed % 2) === 0;
  const z = interpolate(f, [0, Math.max(2, durationInFrames)], inZ ? [1.02, 1.06] : [1.06, 1.02], { extrapolateRight: "clamp" });
  const ori = ["50% 45%", "42% 40%", "58% 42%", "50% 55%"][(seed >> 2) % 4];
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)})`, transformOrigin: ori }} />
    </AbsoluteFill>
  );
};
const seedOf = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

const renderComp = (b: any, d: number) =>
  b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag ?? "DR. FEDERER"} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "pizarraexplica" ? <PizarraExplica durationInFrames={d} eyebrow={b.eyebrow} title={b.title} items={b.items} />
  : null;

const CTA_AT = VIDEO_END - 10;

export const MainFcscuello: React.FC = () => {
  const hookDur = 5.2;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* AUDIO MASTER — voz Fish (avatar muteado) */}
      <Audio src={staticFile("fcscuello.m4a")} />

      {/* CAPA 1 — BASE b-roll (fotos con Ken-Burns + clips), 100% cobertura */}
      {FCSCUELLO_BROLL.map((b: any) => {
        const d = Math.max(1, sec(b.dur + 0.5));
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            {b.kind === "video"
              ? <VideoShot src={b.src} seed={seedOf(b.id)} />
              : <RawShot durationInFrames={d} src={b.src} hue="cold" />}
          </Sequence>
        );
      })}

      {/* CAPA 2 — AVATAR (13 ventanas full-frame, muteadas, sobre la base) */}
      {FCSCUELLO_AVWINS.map((w: any) => {
        const d = Math.max(1, sec(w.dur + 0.15));
        return (
          <Sequence key={`av_${w.i}`} from={sec(w.start)} durationInFrames={d} premountFor={30}>
            <AvatarClip src={w.src} />
          </Sequence>
        );
      })}

      {/* CAPA 3 — COMPONENTES clínicos (overlay) */}
      {FCSCUELLO_COMP.map((b: any) => {
        const d = Math.max(1, sec(b.dur));
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* HOOK — texto sobre el avatar (primeros segundos) */}
      <Sequence from={sec(1.2)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)}
          setup="¿Ves algo raro en tu cuello? Un médico te dice lo que le está avisando a tu corazón…"
          impact="SI VES ESTO EN EL CUELLO, TU CORAZÓN YA ESTÁ EN PROBLEMAS"
          accentColor={TEAL} font={F_INTER} fontSize={78} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} />
      </Sequence>
    </AbsoluteFill>
  );
};
