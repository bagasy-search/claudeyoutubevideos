import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayerSal } from "./scenes/AvatarLayerSal";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_deshumidificador.gen";
import { AVATAR_WINDOWS, TOTAL_DESHUMIDIFICADOR } from "./avatar_deshumidificador.gen";

// ── "¿Moho Tóxico Escondido en tu TECHO? Tienes Que Hacer Esto" ───────────────────────────────
// Canal The Free Builder / El Constructor Libre (ES NEUTRO, presentador Tomás).
//
// AVATAR PARCIAL + BUCLE, horneado en deshumidificador_opt.mp4 (21:19) junto al máster de audio:
//   · 0 → 965,29 s  el creador grabó de verdad: su PROPIO audio, lipsync exacto (el 24% de avatar
//                   full del video vive en su mayoría acá).
//   · 965,59 → fin  voz Fish `freebuilder_mt` sobre el video en BUCLE. La boca NO coincide, así que
//                   el avatar sólo asoma en 5 respiros de ~2,6 s en aperturas de sección.
//
// ⛔ NO hay Sequence escrita a mano acá (ni hook ni endcard): todo sale del beatsheet, que es lo
// único que miran las compuertas.
export const TOTAL_FRAMES_DESHUMIDIFICADOR = Math.round(TOTAL_DESHUMIDIFICADOR * 30);

export const MainDeshumidificador: React.FC = () => {
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
          <AvatarLayerSal src="deshumidificador_opt.mp4" muted windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          <Audio src={staticFile("deshumidificador.wav")} />
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
