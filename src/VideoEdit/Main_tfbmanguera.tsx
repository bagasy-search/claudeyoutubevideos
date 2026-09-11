import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayerSal } from "./scenes/AvatarLayerSal";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_tfbmanguera.gen";
import { AVATAR_WINDOWS, TOTAL_TFBMANGUERA } from "./avatar_tfbmanguera.gen";

// ── "Los Plomeros Nos lo Ocultan: Metí la Manguera en el Inodoro y Pasó Esto" ─────────────────
// Canal The Free Builder / El Constructor Libre (ES NEUTRO, presentador Tomás).
//
// AVATAR PARCIAL + BUCLE HORNEADO en tfbmanguera_opt.mp4 (1854,80 s, 30/1 CFR, 0 saltos de PTS):
//   · 0 → 927,92 s      el creador grabó de verdad: su PROPIO audio, lipsync exacto.
//   · 928,49 → fin      voz Fish `freebuilder_manguera` (clon de su propia voz) sobre el video EN
//                       BUCLE. La boca NO coincide → el avatar NUNCA queda a la vista en la cola
//                       (AVATAR_WINDOWS lo deja `hidden` de 927,92 s en adelante, y el build exige
//                       ≥95% de cobertura de b-roll ahí).
//   · la costura del bucle (928,17 s) va tapada por b-roll.
//
// ⛔ El avatar va MUTEADO y el audio sale de UN solo <Audio> con el máster (avatar + cola Fish).
// ⛔ NO hay ninguna <Sequence> escrita a mano acá (ni hook ni endcard): todo sale del beatsheet,
//    que es lo único que miran las compuertas.
export const TOTAL_FRAMES_TFBMANGUERA = Math.round(TOTAL_TFBMANGUERA * 30);

export const MainTfbmanguera: React.FC = () => {
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
          <AvatarLayerSal src="tfbmanguera_opt.mp4" wav="tfbmanguera_amp.wav" muted windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          <Audio src={staticFile("tfbmanguera.m4a")} />
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
