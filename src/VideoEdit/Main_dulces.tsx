import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES } from "./cues_dulces.gen";

// ── 20 DULCES DE LA ABUELA QUE YA NO SE HACEN — documental FACELESS (~27 min) ──
// Canal Abuela Rosa. Voz clonada anciana (public/dulces.wav, pista continua) +
// footage REAL (clips broll/*.mp4 + fotos real/*.jpg) + componentes del kit.
const SECONDS = 1605;
export const TOTAL_FRAMES_DUL = Math.round(SECONDS * 30); // 48150

// Inicios de sección (de beatsheet/_dulces_starts.json) → grade ranges + stingers.
const ACTS = [0, 88.05, 146.97, 228.02, 285.7, 345.33, 402.68, 468.6, 525.32, 588.85, 646.08, 715.01, 792.75, 850.45, 910.64, 975.01, 1038.39, 1103.71, 1166.23, 1232.14, 1297.06, 1357.11, 1486.35];

const TINTS = ["#A9794A", "#6F8478", "#6E8B47", "#C8904A"];
const EMOTIONAL = new Set([21, 22]); // extras + cierre
const GRADE: GradeRange[] = ACTS.map((from, i) => ({
  from,
  to: ACTS[i + 1] ?? SECONDS,
  tint: EMOTIONAL.has(i) ? "#6F8478" : TINTS[i % TINTS.length],
  strength: EMOTIONAL.has(i) ? 0.08 : 0.06,
}));

export const MainDulces: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.8} grain={0.06}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="amber" drift={0.5} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <SectionGrade ranges={GRADE} />
          {ACTS.filter((t) => t > 0).map((t) => (
            <Sequence key={"stg" + t} from={sec(t) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      <Audio src={staticFile("dulces.wav")} />
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.18} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.2} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};
