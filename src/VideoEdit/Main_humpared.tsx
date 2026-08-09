import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_humpared.gen";
import { AVATAR_WINDOWS, TOTAL_HUMPARED } from "./avatar_humpared.gen";
import { H3_AUDIO, H3_VOL } from "./h3audio_humpared.gen";

// ── "El líquido casero de $3 que frena la humedad de pared desde abajo" — Constructor Libre ──
// Silicato de sodio (vidrio líquido) que angosta los poros capilares. HÍBRIDO:
// 59 clips MiniMax H3 (vlog ultra-real, cama de ambiente nativa) + 13 imágenes gpt-image-2
// + 28 componentes del kit (9 tipos, THEME_EARTH). Avatar full↔hidden (regla full-o-full).
export const TOTAL_FRAMES_HUMPARED = Math.round(TOTAL_HUMPARED * 30);

export const MainHumpared: React.FC = () => {
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
          <AvatarLayer src="humpared_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {/* CAMA DE AMBIENTE de los clips H3 (brocha, raspado, agua, escombro), muy por
              debajo de la locución. Una sola perilla (H3_VOL) sube/baja todo el ambiente. */}
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
