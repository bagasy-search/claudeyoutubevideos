import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayerSal } from "./scenes/AvatarLayerSal";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_selloladrillo.gen";
import { AVATAR_WINDOWS, TOTAL_SELLOLADRILLO } from "./avatar_selloladrillo.gen";

// ── "Cómo SELLAR una Pared de Ladrillo o Revocar una Chimenea" ────────────────────────────────
// Canal The Free Builder / El Constructor Libre (ES NEUTRO, presentador Tomás).
//
// AVATAR PARCIAL + BUCLE, horneado en selloladrillo_opt.mp4 (20:17) + máster de audio aparte:
//   · 0 → 446,16 s   el creador grabó de verdad: su PROPIO audio, lipsync exacto (avatar de fondo).
//   · 446,46 → fin   voz Fish `freebuilder_sl` sobre el video en BUCLE. La boca NO coincide, así que
//                    el avatar sólo asoma en 7 respiros de ~2,6 s en aperturas de sección.
//
// ⛔ Todo sale del beatsheet (no hay Sequence a mano): es lo único que miran las compuertas.
export const TOTAL_FRAMES_SELLOLADRILLO = Math.round(TOTAL_SELLOLADRILLO * 30);

export const MainSelloladrillo: React.FC = () => {
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
          <AvatarLayerSal src="selloladrillo_opt.mp4" muted windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          <Audio src={staticFile("selloladrillo.wav")} />
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
