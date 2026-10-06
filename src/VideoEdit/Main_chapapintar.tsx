import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayerSal } from "./scenes/AvatarLayerSal";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_chapapintar.gen";
import { AVATAR_WINDOWS, TOTAL_CHAPAPINTAR } from "./avatar_chapapintar.gen";

// ── "Reparación de Techo de CHAPA — Se Arregla Pintando" ───────────────────────────────────────
// Canal The Free Builder / El Constructor Libre (ES NEUTRO, presentador Tomás).
// AVATAR PARCIAL (500,35 s) + BUCLE horneado en chapapintar_opt.mp4 (20:07) + cola Fish
// `freebuilder_chapa`. El avatar es FONDO en tramo1; en el bucle sólo asoma en respiros.
export const TOTAL_FRAMES_CHAPAPINTAR = Math.round(TOTAL_CHAPAPINTAR * 30);

export const MainChapapintar: React.FC = () => {
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
          <AvatarLayerSal src="chapapintar_opt.mp4" muted windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          <Audio src={staticFile("chapapintar.wav")} />
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
