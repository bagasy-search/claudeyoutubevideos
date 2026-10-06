import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayerSal } from "./scenes/AvatarLayerSal";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_fbesponja.gen";
import { AVATAR_WINDOWS, TOTAL_FBESPONJA } from "./avatar_fbesponja.gen";

// ── "Mete una Esponja en el Caño de la Ducha y Mira el Milagro" ──────────────────────────────
// Canal The Free Builder / El Constructor Libre (ES NEUTRO, presentador Tomás).
//
// AVATAR PARCIAL + BUCLE, horneado en fbesponja_opt.mp4 (28:35) junto al máster de audio:
//   · 0 → 929,77 s  el creador grabó de verdad: su PROPIO audio, lipsync exacto. El avatar es el
//                   FONDO GARANTIZADO de todo este tramo.
//   · 930,12 → fin  voz Fish `freebuilder_esponja` (clonada del propio avatar) sobre el video en
//                   BUCLE. La boca NO coincide -> regla 2.bis.1: CERO ventanas de avatar acá, los
//                   135 momentos del tramo 2 tienen plano propio y la cobertura es del 100%.
//
// ⛔ NO hay Sequence escrita a mano acá (ni hook ni endcard): todo sale del beatsheet, que es lo
// único que miran las compuertas.
export const TOTAL_FRAMES_FBESPONJA = Math.round(TOTAL_FBESPONJA * 30);

export const MainFbesponja: React.FC = () => {
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
          <AvatarLayerSal src="fbesponja_opt.mp4" wav="fbesponja.m4a" muted windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          <Audio src={staticFile("fbesponja.m4a")} />
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
