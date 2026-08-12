import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_pxwash.gen";
import { AVATAR_WINDOWS, TOTAL_PXWASH } from "./avatar_pxwash.gen";

// ── "9 Hydrogen Peroxide Tricks Pressure Washing Companies Don't Want You to Know" ──
// Canal Agua Oxigenada (EN, avatar handyman). Look PREMIUM ROJO/NEGRO/BLANCO (THEME_PEROXIDE).
// CLIPS-FIRST: b-roll real (pressure wash, algas, techos) + 2 imágenes IA + componentes FIRMA
// peróxido (BottleHero/LightTrailCards/ChapterTrailCard/NodeRingToggle/FoamClean, full-bleed) +
// KIT PREMIUM themeado (BigStat/Myth/Vs/Flow/BeforeAfter/PullQuote/Cta/Highlight/Steps/Checklist/
// Hook/Bullet, overlays). Avatar full↔hidden (regla full-o-full, sin PiP).
export const TOTAL_FRAMES_PXWASH = Math.round(TOTAL_PXWASH * 30);

export const MainPxwash: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="red" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="pxwash_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />
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
