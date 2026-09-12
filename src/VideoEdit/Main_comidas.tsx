import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES, OVERLAYS } from "./cues_comidas.gen";

// ── COMIDAS — "25 Comidas Olvidadas, Baratas y Fáciles, para Cuando Cocinás Solo".
// Canal Abuela Rosa. Clip-forward por frase (match_v3) + fotos vintage on-theme.
// Voz clonada anciana. Nicho de comida humilde nostálgica.
const SECONDS = 1019;
export const TOTAL_FRAMES_COMIDAS = Math.round(SECONDS * 30); // 30570

// Inicios de las 25 comidas → grade + stingers.
const ACTS = [0, 80, 121, 163, 201, 236, 269, 303, 339, 376, 413, 453, 489, 524, 557, 592, 627, 663, 700, 735, 769, 804, 836, 872, 908, 948];

const TINTS = ["#A9794A", "#6F8478", "#6E8B47", "#C8904A"];
const GRADE: GradeRange[] = ACTS.map((from, i) => ({
  from,
  to: ACTS[i + 1] ?? SECONDS,
  tint: TINTS[i % TINTS.length],
  strength: 0.06,
}));

export const MainComidas: React.FC = () => {
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
          {OVERLAYS.map((cue) => (
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
      <Audio src={staticFile("comidas.wav")} />
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.18} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.2} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};
