import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_lamina15.gen";
import { AVATAR_WINDOWS, TOTAL_LAMINA15 } from "./avatar_lamina15.gen";
import { H3_AUDIO, H3_VOL } from "./h3audio_lamina15.gen";

// ── "No prendas el aire este verano: la lámina térmica de $15" — Constructor Libre ──
// Barrera radiante (aluminio pulido bajo las vigas, con cámara de aire). HÍBRIDO:
// 52 clips Pexels que sobrevivieron a la compuerta per-clip + 157 imágenes gpt-image-2
// auditadas por visión + 123 componentes del kit (29 tipos, THEME_EARTH) + 3 variantes
// propias en el hook (ThermalWipe / CaliperReveal / DustDecay).
// Avatar full↔hidden al 30% de pantalla (regla full-o-full, cero PiP).
export const TOTAL_FRAMES_LAMINA15 = Math.round(TOTAL_LAMINA15 * 30);

export const MainLamina15: React.FC = () => {
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
          <AvatarLayer src="lamina15_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {/* CAMA DE AMBIENTE de los clips de H3 (grapadora, viento, chapa, compresor).
              `Media` mutea TODO el b-roll por diseño y es un componente compartido que
              no se toca, así que el sonido va acá como capa aparte: sólo los clips
              generados, ya nivelados a -24 LUFS en la ingesta, muy por debajo de la
              locución. Una sola perilla (H3_VOL) sube o baja todo el ambiente. */}
          {H3_AUDIO.map((a, i) => (
            <Sequence key={`h3a_${i}`} from={sec(a.start)} durationInFrames={sec(a.dur)}>
              <Audio src={staticFile(a.src)} volume={H3_VOL} />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
