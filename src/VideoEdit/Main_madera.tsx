import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_madera.gen";
import { AVATAR_WINDOWS, TOTAL_MADERA } from "./avatar_madera.gen";

// ── "Por Qué La Madera De Antes Duraba 100 Años" — Constructor Libre · Tomás ──
// Remake re-angulado del hit del canal (líquido $2 madera). CLIPS-FIRST DENSO:
// clips reales de YouTube + imágenes Modal + diagramas. Cada beat anclado al ms
// exacto del Whisper. OVERLAYS a medida (MaderaCards) encima del clip vivo.
export const TOTAL_FRAMES_MADERA = Math.round(TOTAL_MADERA * 30);

export const MainMadera: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="blue" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="madera_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
