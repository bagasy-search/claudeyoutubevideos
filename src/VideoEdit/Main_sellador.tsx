import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_sellador.gen";
import { AVATAR_WINDOWS, TOTAL_SELLADOR } from "./avatar_sellador.gen";

// ── "Sellador penetrante vs película" — Constructor Libre · Tomás / Don Vicente ──
// IMAGE-FIRST: 366 tomas de b-roll (imágenes on-topic gpt-image-2 low casual, pacing
// ~3.9s ancladas al ms de captions_sellador.json) + 41 componentes KIT PREMIUM
// (THEME_EARTH). Avatar full↔hidden (regla full-o-full, sin PiP).
export const TOTAL_FRAMES_SELLADOR = Math.round(TOTAL_SELLADOR * 30);

export const MainSellador: React.FC = () => {
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
          <AvatarLayer src="sellador_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
