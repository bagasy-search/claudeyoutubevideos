import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_condensa.gen";
import { AVATAR_WINDOWS, AVATAR_WINDOWS_LOOP, TOTAL_CONDENSA, AVATAR_END, TAIL_AT } from "./avatar_condensa.gen";

// ── "FÁCIL — Cómo Frenar la CONDENSACIÓN en la VENTANA y el Moho Negro" ──────────
// El Constructor Libre (ES neutro LATAM). AVATAR PARCIAL: el creador grabó 10:49 con
// su propio audio; de ahí en adelante la narración es la COLA del master Fish
// (`condensa_tail.wav`, cortada por palabra en el silencio entre "…aguanta ahí meses."
// y "Cuando llega la primavera…") y el mismo avatar sigue EN BUCLE y MUDO como fondo
// garantizado — nunca hay hueco: el contenido tapa al avatar, no al revés.
export const TOTAL_FRAMES_CONDENSA = Math.round(TOTAL_CONDENSA * 30);

export const MainCondensa: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
    <CinematicWrap grain={0} vignette={0}>
      <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
        <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />

        {CUES.map((cue) => (
          <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
            {cue.el(sec(cue.dur))}
          </Sequence>
        ))}

        {/* TRAMO 1 — avatar real del creador, con SU propio audio (lipsync exacto) */}
        <Sequence from={0} durationInFrames={sec(AVATAR_END)}>
          <AvatarLayer src="condensa_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
        </Sequence>

        {/* TRAMO 2 — el mismo avatar EN BUCLE y MUDO: fondo garantizado bajo el b-roll */}
        <Sequence from={sec(AVATAR_END)} durationInFrames={sec(TOTAL_CONDENSA - AVATAR_END)}>
          <AvatarLayer
            src="condensa_opt.mp4"
            windows={AVATAR_WINDOWS_LOOP}
            accent={COLORS.accent}
            wav="condensa_tail.wav"
            loop
            muted
          />
        </Sequence>

        {/* COLA DE NARRACIÓN (Fish `freebuilder`) desde la costura */}
        <Sequence from={sec(TAIL_AT)}>
          <Audio src={staticFile("condensa_tail.wav")} />
        </Sequence>

        {OVERLAYS.map((cue) => (
          <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
            {cue.el(sec(cue.dur))}
          </Sequence>
        ))}
      </AbsoluteFill>
    </CinematicWrap>
  </AbsoluteFill>
);
