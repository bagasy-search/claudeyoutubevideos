import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_paredhidro.gen";
import { AVATAR_WINDOWS, TOTAL_PAREDHIDRO } from "./avatar_paredhidro.gen";

// ── "Deja de Tirar Plata: Casi Todos IMPERMEABILIZAN la Pared MAL" ────────────────────────────
// Canal The Free Builder / El Constructor Libre (ES NEUTRO, presentador Tomás).
//
// AVATAR PARCIAL + BUCLE, horneado en paredhidro_opt.mp4 (33:33) junto al máster de audio:
//   · 0 → 897,95 s  el creador grabó de verdad: su PROPIO audio, lipsync exacto. Ahí vive el
//                   14,8% de avatar full del video.
//   · 898,25 → fin  voz Fish `freebuilder` sobre el video en BUCLE. La boca NO coincide, así que
//                   el avatar sólo asoma en 8 respiros de ~2,6 s en aperturas de sección.
//
// ⛔ NO hay Sequence escrita a mano acá (ni hook ni endcard): todo sale del beatsheet, que es lo
// único que miran las compuertas. El QrCorner del molde de barnfloor se sacó a propósito — traía
// texto en INGLÉS quemado ("The Plain Almanac"). El QR de este canal va como pieza flotante al
// lado del avatar, desde el beatsheet.
export const TOTAL_FRAMES_PAREDHIDRO = Math.round(TOTAL_PAREDHIDRO * 30);

export const MainParedhidro: React.FC = () => {
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
          <AvatarLayer src="paredhidro_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
