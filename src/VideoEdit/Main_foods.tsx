import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_foods.gen";
import { AVATAR_WINDOWS, TOTAL_FOODS } from "./avatar_foods.gen";

// ── "STOP Refrigerating These 20 Foods — The Amish Left Them Out On Purpose" ──
// Claudio · Amish Off-Grid Claudio. MODO AVATAR. Grade cálido, sin filtros/temblor.
// Avatar full en picos emotivos + identidad; hidden = b-roll full; right = split venta.
// Reglas: img/clip ≤3s salvo componentes-texto (hold). Funnel → The Plain Almanac.
export const TOTAL_FRAMES_FOODS = Math.round(TOTAL_FOODS * 30);

export const MainFoods: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="foods_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
