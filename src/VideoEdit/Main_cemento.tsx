import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_cemento.gen";
import { AVATAR_WINDOWS, TOTAL_CEMENTO } from "./avatar_cemento.gen";

// ── "Los Cemento Del Auto Como Nuevos" — Constructor Libre · Tomás ──
// CLIPS-FIRST DENSO: clips reales de YouTube + cientos de imágenes web + diagramas.
// Densidad máxima (cada mini-frase + ráfagas + flashes <1s). SIN filtros. Cada beat
// anclado al ms exacto del Whisper. OVERLAYS a medida encima del clip vivo.
export const TOTAL_FRAMES_CEMENTO = Math.round(TOTAL_CEMENTO * 30);

export const MainCemento: React.FC = () => {
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
          <AvatarLayer src="cemento_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
