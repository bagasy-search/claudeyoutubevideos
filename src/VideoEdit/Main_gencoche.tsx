import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_gencoche.gen";
import { AVATAR_WINDOWS, TOTAL_GENCOCHE } from "./avatar_gencoche.gen";

// ── "Tu coche aparcado es tu generador de emergencia en un apagón" — Constructor Libre · Tomás ──
// STOCK-FIRST (155 clips Pexels on-topic verificados) + 23 componentes KIT PREMIUM (THEME_EARTH) +
// AVATAR full↔hidden (regla full-o-full, sin PiP). IA solo para la guía del presentador.
export const TOTAL_FRAMES_GENCOCHE = Math.round(TOTAL_GENCOCHE * 30);

export const MainGencoche: React.FC = () => {
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
          <AvatarLayer src="gencoche_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
