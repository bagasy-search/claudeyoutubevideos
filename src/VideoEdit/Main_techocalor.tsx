import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_techocalor.gen";
import { AVATAR_WINDOWS, TOTAL_TECHOCALOR } from "./avatar_techocalor.gen";

// ── "El techo trampa de $7 — la barrera radiante" — Constructor Libre · Tomás ──
// CLIPS-FIRST: 173 beats de b-roll (74 clips + 91 stock + 8 imágenes reales),
// CADA asset anclado al ms exacto de public/captions_techocalor.json, contiguo sin
// huecos. Componentes: KIT PREMIUM themeable (THEME_EARTH) — 19 momentos fuertes
// (hook $7, checklist, mecanismo del calor, mito del aislante, VsDuel absorber/
// rebotar, 95% NASA, paso a paso x2, error de 30s, verano/invierno, mito del AC,
// recap, CTA manual) como overlays transparentes en zona segura vía PremiumOverlay,
// b-roll contiguo debajo, avatar PiP quieto abajo-derecha.
export const TOTAL_FRAMES_TECHOCALOR = Math.round(TOTAL_TECHOCALOR * 30);

export const MainTechocalor: React.FC = () => {
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
          <AvatarLayer src="techocalor_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
