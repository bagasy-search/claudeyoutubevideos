import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_abuela.gen";
import { AVATAR_WINDOWS, TOTAL_ABUELA } from "./avatar_abuela.gen";

// ── "25 Comidas Olvidadas que Hacíamos Cuando No Alcanzaba la Plata" — Abuela Rosa ──
// VIDEO CON AVATAR: la Abuela Rosa habla a cámara (full) en hook/intro/CTA/mitad/#1-puchero/
// cierre; durante las 25 comidas va en PiP de esquina (quieta) o hidden (b-roll de comida a
// pantalla completa), alternando. B-roll = footage real del proyecto comidas (clips + stock +
// fotos verificadas), anclado a los tiempos reales del avatar. Audio de narración = el propio
// video del avatar (HeyGen). 30 fps (como TODO el proyecto: sec()/FPS son 30). El master del
// avatar es 25fps pero <Video> lo reproduce por TIEMPO real, así que sincroniza igual.
export const TOTAL_FRAMES_ABUELA = Math.round(TOTAL_ABUELA * 30);

export const MainAbuela: React.FC = () => {
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
          <AvatarLayer src="abuela_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
