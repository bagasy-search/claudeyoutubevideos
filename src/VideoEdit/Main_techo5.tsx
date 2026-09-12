import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_techo5.gen";
import { AVATAR_WINDOWS, TOTAL_TECHO5 } from "./avatar_techo5.gen";

// ── "Líquido de $5 impermeabiliza cualquier techo / ¿Por qué fue prohibido?" — Constructor Libre · Tomás ──
// IMAGE-FIRST híbrido: tomas ≤3s (imágenes on-topic Modal) + clips buenos + 42 componentes
// KIT PREMIUM (THEME_EARTH). Avatar full↔hidden (regla full-o-full, sin PiP).
export const TOTAL_FRAMES_TECHO5 = Math.round(TOTAL_TECHO5 * 30);

export const MainTecho5: React.FC = () => {
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
          <AvatarLayer src="techo5_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
