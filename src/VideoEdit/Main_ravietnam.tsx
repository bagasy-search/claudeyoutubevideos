import { AbsoluteFill, Sequence, Audio, staticFile, useVideoConfig } from "remotion";
import { sec, COLORS } from "./theme_ben";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionStinger } from "./components/SectionFx";
import { SfxCue, SFX } from "./components/Sfx";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { CUES } from "./cues_ravietnam.gen";

// ── CANAL "RETIRE ABROAD" · "I Retired on $1,300 a Month in Vietnam" ──
// Look theme_ben SESGADO CÁLIDO: negro premium + ORO/ámbar + verde; ROJO solo en avisos.
// Avatar (ravietnam_opt.mp4 provee el audio) + b-roll Da Nang (gpt-image-2) + KeyPhrase/
// journeys/components. Sonido ambiental de océano SUAVE (pedido del creador). ~26 min.
// SIN grade de color y SIN handheld (regla dura cross-nicho: el avatar no tiembla, cero filtros).

const VIDEO_END = Math.max(...CUES.map((c) => c.start + c.dur)) + 1.5;
export const TOTAL_FRAMES_RAV = Math.round(VIDEO_END * 30);

// ── Ventanas del avatar (variedad de posiciones) ──
// componentes full-screen OCULTAN al avatar; raw/chips/callout llevan el PiP sobre el b-roll;
// statpills va con el avatar FULL detrás; el hook abre FULL.
const HIDE = new Set([
  "keyphrase", "diorama", "journey", "diagram", "bars", "vsmed", "checklist",
  "annotated", "mistake", "rule", "odometer", "signature", "goldvault", "infzoom",
]);
const VIS = new Set(["raw", "quote", "chips", "callout"]);
const FULLK = new Set(["statpills"]); // avatar full detrás
const FULL_SECS = new Set(["cta"]);   // sección de cierre: habla a cámara
const sectionOf = (key: string) => key.replace(/_\d+$/, "");

function buildWindows(): AvatarWindow[] {
  const w: AvatarWindow[] = [{ start: 0, mode: "full" }]; // abre full ≥1s
  let last: AvatarWindow["mode"] = "full";
  let visIdx = 0;
  const rotation: AvatarWindow["mode"][] = ["cornerTR", "cornerBR", "cornerTL", "cornerBL"];
  for (const c of CUES) {
    let mode: AvatarWindow["mode"];
    if (c.kind === "half") mode = "halfL";
    else if (FULLK.has(c.kind)) mode = "full";
    else if (HIDE.has(c.kind)) mode = "hidden";
    else if (VIS.has(c.kind)) {
      mode = FULL_SECS.has(sectionOf(c.key)) ? "full" : rotation[visIdx % rotation.length];
      visIdx++;
    } else mode = "hidden";
    if (mode !== last) { w.push({ start: c.start, mode }); last = mode; }
  }
  return w;
}
const AVATAR_WINDOWS = buildWindows();

// stingers/swells suaves en cada frontera de sección (rule = marca de sección)
const SECTION_KEYS = new Set(CUES.filter((c) => c.kind === "rule").map((c) => c.key));

const OceanBed: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const loopLen = Math.round(40 * fps);
  const n = Math.ceil(durationInFrames / loopLen);
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <Sequence key={"ocean" + i} from={i * loopLen} durationInFrames={loopLen}>
          <Audio src={staticFile("sfx/ra_ambient_ocean.mp3")} volume={0.06} />
        </Sequence>
      ))}
    </>
  );
};

export const MainRavietnam: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          {/* fondo: resplandor cálido sutil (oro tenue en vez de brasa roja) */}
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${COLORS.bg1} 0%, ${COLORS.bg0} 72%)` }} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {/* AVATAR encima del b-roll — provee el audio de toda la narración */}
          <AvatarLayer src="ravietnam_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.amber} />
          {/* HOOK: texto sobre el avatar vivo oscurecido */}
          {(() => {
            const hookEnd = CUES[0].start - 0.3;
            const from = 1.4;
            const dur = Math.max(2, hookEnd - from);
            return (
              <Sequence from={sec(from)} durationInFrames={sec(dur)} layout="none">
                <AvatarScrimText durationInFrames={sec(dur)} setup="I retired on $1,300 a month…" impact="in VIETNAM" impactAccent="amber" fontSize={128} />
              </Sequence>
            );
          })()}
          {[...SECTION_KEYS].map((k) => {
            const c = CUES.find((x) => x.key === k)!;
            return (
              <Sequence key={"stg" + k} from={Math.max(0, sec(c.start) - sec(0.25))} durationInFrames={sec(0.7)} layout="none">
                <SectionStinger />
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </CinematicWrap>
      {/* ── AUDIO (fuera del wrap) ── */}
      <OceanBed />
      {[...SECTION_KEYS].map((k) => {
        const c = CUES.find((x) => x.key === k)!;
        return <SfxCue key={"sw" + k} at={Math.max(0, sec(c.start) - sec(0.4))} src={SFX.sectionSwell} volume={0.18} durationInFrames={sec(2)} />;
      })}
    </AbsoluteFill>
  );
};
