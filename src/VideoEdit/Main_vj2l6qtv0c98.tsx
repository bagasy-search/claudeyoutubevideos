import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_vj2l6qtv0c98.gen";
import { AVATAR_WINDOWS, TOTAL_VJ2L6QTV0C98 } from "./avatar_vj2l6qtv0c98.gen";

// ── "5 Cultivos que Lamentarás No Haber Plantado en Agosto" — Levi Lapp Jardín (Amish, avatar) ──
// HÍBRIDO con AVATAR: b-roll REAL de stock (Pexels) + imágenes personales gpt-image-2 (Levi/Amos)
// + kit de componentes (rule por cultivo, StatBig, KineticQuote, AgedDoc pergamino, CrossSection…).
// Avatar full ↔ hidden (regla full-o-visual-full, sin PiP). Marca serif terrosa, pacing pausado.
export const TOTAL_FRAMES_VJ2L6QTV0C98 = Math.round(TOTAL_VJ2L6QTV0C98 * 30);

export const MainVj2l6qtv0c98: React.FC = () => {
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
          <AvatarLayer src="vj2l6qtv0c98_opt.mp4" wav="vj2l6qtv0c98.wav" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
