import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_oakshaft.gen";
import { AVATAR_WINDOWS, TOTAL_OAKSHAFT } from "./avatar_oakshaft.gen";

// ── "Before Electricity: How Solid Oak Becomes a Water Wheel Shaft (1935)" — Claudio Yoder (EN) ──
// 54 imágenes IA (gpt-image-2 low, presentador barba gris) 1:1 a su frase + 24 clips stock Pexels
// + AVATAR full en tramos retóricos + kit premium THEME_EARTH. Música calma en loop, bien abajo (amish pausado).
export const TOTAL_FRAMES_OAKSHAFT = Math.round(TOTAL_OAKSHAFT * 30);

const MusicBed: React.FC = () => {
  const f = useCurrentFrame();
  const s = f / 30;
  const vol = interpolate(
    s,
    [0, 4, 10, 24, 30, TOTAL_OAKSHAFT - 6, TOTAL_OAKSHAFT],
    [0.06, 0.12, 0.15, 0.15, 0.1, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile("oakshaft_music.mp3")} loop volume={vol} />;
};

export const MainOakshaft: React.FC = () => {
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
          <AvatarLayer src="oakshaft_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
