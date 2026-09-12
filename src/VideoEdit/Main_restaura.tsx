import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_restaura.gen";
import { AVATAR_WINDOWS, TOTAL_RESTAURA } from "./avatar_restaura.gen";

// ── "Madera vieja y gris vuelve a ser nueva" — Constructor Libre · Tomás ──
// IMAGE-FIRST (pivote: el matcheo de clips dio off-topic en el nicho escaso):
// 195 beats de b-roll = 195 imágenes on-topic gpt-image-2 low casual, CADA una
// anclada al ms de public/captions_restaura.json, contigua sin huecos.
// Componentes: KIT PREMIUM themeable (THEME_EARTH) — 66 momentos fuertes
// (los 5 pasos + 5 trucos NumberedSteps, 4 errores MythTruth, antes/después
// BeforeAfter, cifras BigStat, listas Checklist, cita PullQuote, VsDuel, CTA
// Manual x3) como overlays transparentes en zona segura, b-roll contiguo debajo,
// avatar full al abrir → PiP quieto abajo-derecha.
export const TOTAL_FRAMES_RESTAURA = Math.round(TOTAL_RESTAURA * 30);

export const MainRestaura: React.FC = () => {
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
          <AvatarLayer src="restaura_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
