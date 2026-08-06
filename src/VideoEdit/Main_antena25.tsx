import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_antena25.gen";
import { AVATAR_WINDOWS, TOTAL_ANTENA25 } from "./avatar_antena25.gen";

// ── "Antena25 Sugi Ban — quemar la madera 80 años" — Constructor Libre · Tomás / Don Ito ──
// IMAGE-FIRST: 366 tomas de b-roll (imágenes on-topic gpt-image-2 low casual, pacing
// ~3.9s ancladas al ms de captions_antena25.json) + 41 componentes KIT PREMIUM
// (THEME_EARTH). Avatar full↔hidden (regla full-o-full, sin PiP).
export const TOTAL_FRAMES_ANTENA25 = Math.round(TOTAL_ANTENA25 * 30);

export const MainAntena25: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="antena25_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
