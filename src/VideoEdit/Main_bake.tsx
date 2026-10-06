import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_bake.gen";

// BAKE-OFF — ventana [720-840s] de artefactos, re-basada a 0. Se renderiza 3 veces
// cambiando SOLO el contenido de los clips (as-is / cull / crop) para comparar procesos.
const DIS = 10;
const FadeIn: React.FC<{ children: React.ReactNode; on: boolean }> = ({ children, on }) => {
  const f = useCurrentFrame();
  const op = on ? interpolate(f, [0, DIS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

export const TOTAL_FRAMES_BAKE = Math.round(122 * 30);

export const MainBake: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.8} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="cold" drift={0.5} />
          {CUES.map((cue, i) => {
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
      <Audio src={staticFile("bake.wav")} />
    </AbsoluteFill>
  );
};
