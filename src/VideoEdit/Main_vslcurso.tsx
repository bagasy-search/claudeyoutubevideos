import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayerSal } from "./scenes/AvatarLayerSal";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_vslcurso.gen";
import { AVATAR_WINDOWS, TOTAL_VSLCURSO } from "./avatar_vslcurso.gen";

// ── VSL de la landing constructorlibre.com/curso ──────────────────────────────────────────────
// Curso "De $3 a $180 por Pared" (US$297). Presentador Tomás. Máster 277,632 s.
//
// ⛔⛔ 0 → 17,40 s el avatar va SIEMPRE `hidden`: ese tramo del audio es voz Fish (el hook se
//    regrabó sobre comentarios REALES de YouTube) y la boca del avatar no coincide. El build
//    exige ≥97 % de cobertura de b-roll ahí y AVATAR_WINDOWS lo deja oculto.
// ⛔ El avatar va MUTEADO: el audio sale de UN solo <Audio> con el máster empalmado.
// ⛔ Cero <Sequence> escrita a mano: todo sale del beatsheet, que es lo que miran las compuertas.
export const TOTAL_FRAMES_VSLCURSO = Math.round(TOTAL_VSLCURSO * 30);

export const MainVslcurso: React.FC = () => {
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
          <AvatarLayerSal src="vslcurso_opt.mp4" wav="vslcurso.wav" muted windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          <Audio src={staticFile("vslcurso.wav")} />
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
