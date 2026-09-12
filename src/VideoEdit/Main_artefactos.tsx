import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_artefactos.gen";

// cross-dissolve sutil entre tomas (estética documental, no corte duro seco) — igual que barcos
const DIS = 10; // ~0.33s
const FadeIn: React.FC<{ children: React.ReactNode; on: boolean }> = ({ children, on }) => {
  const f = useCurrentFrame();
  const op = on ? interpolate(f, [0, DIS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// ── 7 ARTEFACTOS ANTIGUOS QUE NO DEBERÍAN EXISTIR — Crónicas Perdidas · FACELESS ──
// Voz clonada (public/artefactos.wav) como pista continua desde 0; cada beat anclado
// al ms real de la narración. SIN filtros de color (grano 0, viñeta 0). Dur ~22.7 min.
const SECONDS = 1360;
export const TOTAL_FRAMES_ART = Math.round(SECONDS * 30);

export const MainArtefactos: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.8} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="cold" drift={0.5} />
          {CUES.map((cue, i) => {
            // cada toma entra cruzando-disolviendo sobre la anterior (se solapan DIS frames)
            const from = i === 0 ? sec(cue.start) : sec(cue.start) - DIS;
            const dur = i === 0 ? sec(cue.dur) : sec(cue.dur) + DIS;
            return (
              <Sequence key={cue.key} from={from} durationInFrames={dur}>
                <FadeIn on={i !== 0}>{cue.el(dur)}</FadeIn>
              </Sequence>
            );
          })}
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>

      {/* NARRACIÓN: voz clonada, pista continua desde 0 */}
      <Audio src={staticFile("artefactos.wav")} />
    </AbsoluteFill>
  );
};
