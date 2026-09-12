import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_oillamp1.gen";
import { AVATAR_WINDOWS, TOTAL_OILLAMP1 } from "./avatar_oillamp1.gen";

// ── "The Amish Oil Lamp That Survives Any Power Outage (No Electricity Needed)" — Claudio Yoder (EN) ──
// 72 imágenes IA (gpt-image-2, presentador barba gris) 1:1 a su frase + 28 clips stock Pexels
// + AVATAR full en tramos retóricos + kit premium THEME_EARTH. Música calma en loop, bien abajo.
export const TOTAL_FRAMES_OILLAMP1 = Math.round(TOTAL_OILLAMP1 * 30);

const MusicBed: React.FC = () => {
  const f = useCurrentFrame();
  const s = f / 30;
  const vol = interpolate(
    s,
    [0, 4, 10, 24, 30, TOTAL_OILLAMP1 - 6, TOTAL_OILLAMP1],
    [0.06, 0.12, 0.15, 0.15, 0.1, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile("oillamp1_music.mp3")} loop volume={vol} />;
};

export const MainOillamp1: React.FC = () => {
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
          <AvatarLayer src="oillamp1_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <MusicBed />
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
