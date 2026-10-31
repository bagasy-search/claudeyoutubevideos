import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_maquinas.gen";
import SFX from "./sfx_maquinas.json";

// ── 7 MÁQUINAS ANTIGUAS QUE HOY NO PODRÍAMOS CONSTRUIR — Crónicas Perdidas · FACELESS ──
const DIS = 10;
const FadeIn: React.FC<{ children: React.ReactNode; on: boolean }> = ({ children, on }) => {
  const f = useCurrentFrame();
  const op = on ? interpolate(f, [0, DIS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};
const endOf = (a: { start: number; dur: number }[]) => a.reduce((m, c) => Math.max(m, c.start + c.dur), 0);
const SECONDS = Math.max(endOf(CUES), endOf(OVERLAYS)) + 0.8;
export const TOTAL_FRAMES_MAQ = Math.round(SECONDS * 30);

export const MainMaquinas: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.8} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="amber" drift={0.5} />
          {CUES.map((cue, i) => {
            const from = i === 0 ? sec(cue.start) : sec(cue.start) - DIS;
            const dur = i === 0 ? sec(cue.dur) : sec(cue.dur) + DIS;
            return (
              <Sequence key={cue.key} from={Math.max(0, from)} durationInFrames={dur}>
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
      <Audio src={staticFile("maquinas.wav")} />
      <Audio src={staticFile("sfx/cp_music.wav")} loop volume={0.07} />
      {/* DISEÑO DE SONIDO: risers/booms/whoosh en aperturas de sección y reveals */}
      {(SFX as { t: number; src: string; g: number }[]).map((s, i) => (
        <Sequence key={"sfx" + i} from={Math.max(0, sec(s.t))} durationInFrames={150}>
          <Audio src={staticFile(s.src)} volume={s.g} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
