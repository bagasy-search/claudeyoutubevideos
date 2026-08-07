import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_cultivosep.gen";
import { AVATAR_WINDOWS, TOTAL_CULTIVOSEP } from "./avatar_cultivosep.gen";

// ── "5 Cultivos que Lamentarás No Haber Plantado en Septiembre" — Levi Lapp Jardín ──
// STOCK-FIRST (Pexels) + componentes FIRMA a medida (CropShowcase por cultivo, Perséfone,
// almidón→azúcar, vernalización, tierra-heladera) + kit premium THEME_EARTH + avatar Levi full.
export const TOTAL_FRAMES_CULTIVOSEP = Math.round(TOTAL_CULTIVOSEP * 30);

export const MainCultivosep: React.FC = () => {
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
          <AvatarLayer src="cultivosep_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
