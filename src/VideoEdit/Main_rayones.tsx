import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_rayones.gen";
import { AVATAR_WINDOWS, TOTAL_RAYONES } from "./avatar_rayones.gen";

// ── "Los Rayones Del Auto Como Nuevos" — Constructor Libre · Tomás ──
// CLIPS-FIRST DENSO: clips reales de YouTube + cientos de imágenes web + diagramas.
// Densidad máxima (cada mini-frase + ráfagas + flashes <1s). SIN filtros. Cada beat
// anclado al ms exacto del Whisper. OVERLAYS a medida encima del clip vivo.
export const TOTAL_FRAMES_RAYONES = Math.round(TOTAL_RAYONES * 30);

export const MainRayones: React.FC = () => {
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
          <AvatarLayer src="rayones_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
