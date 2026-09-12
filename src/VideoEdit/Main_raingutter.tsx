import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_raingutter.gen";
import { AVATAR_WINDOWS, TOTAL_RAINGUTTER } from "./avatar_raingutter.gen";

// ── "This Amish Rain Gutter Trick Gives You a Zero Water Bill" — Claudio Yoder (EN) ──
// Avatar full en tramos retóricos + b-roll REAL (stock Pexels + fotos web) + presentador gpt-image-2
// + kit premium THEME_EARTH. Música calma en loop, bien abajo.
export const TOTAL_FRAMES_RAINGUTTER = Math.round(TOTAL_RAINGUTTER * 30);

const MusicBed: React.FC = () => {
  const f = useCurrentFrame();
  const s = f / 30;
  const vol = interpolate(
    s,
    [0, 4, 10, 24, 30, TOTAL_RAINGUTTER - 6, TOTAL_RAINGUTTER],
    [0.06, 0.12, 0.15, 0.15, 0.1, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile("raingutter_music.mp3")} loop volume={vol} />;
};

export const MainRaingutter: React.FC = () => {
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
          <AvatarLayer src="raingutter_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
