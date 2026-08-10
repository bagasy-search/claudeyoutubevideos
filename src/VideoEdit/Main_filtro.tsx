import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_filtro.gen";
import { AVATAR_WINDOWS, TOTAL_FILTRO } from "./avatar_filtro.gen";

// ── "Filtro de agua casero de $10 que purifica cualquier tanque" — Constructor Libre · Claudio Mendoza ──
// Filtro de arena lenta (biosand): balde + grava/arena/carbón + capa biológica viva.
// STOCK REAL (Pexels, 195 clips) + AVATAR full↔hidden (regla full-o-full, sin PiP) + kit premium THEME_EARTH.
export const TOTAL_FRAMES_FILTRO = Math.round(TOTAL_FILTRO * 30);

export const MainFiltro: React.FC = () => {
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
          <AvatarLayer src="filtro_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
