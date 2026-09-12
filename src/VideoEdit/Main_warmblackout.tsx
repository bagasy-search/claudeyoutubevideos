import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_warmblackout.gen";
import { AVATAR_WINDOWS, TOTAL_WARMBLACKOUT } from "./avatar_warmblackout.gen";

// ── "This $5 Part Keeps Your Family Warm During Any Power Outage — Amish Secret" — Claudio Yoder (EN) ──
// 96 imágenes IA del sistema (clay-pot heater) mapeadas 1:1 a su frase + AVATAR full en tramos retóricos
// + kit premium THEME_EARTH. Música calma en loop, bien abajo, swell suave en el hook.
export const TOTAL_FRAMES_WARMBLACKOUT = Math.round(TOTAL_WARMBLACKOUT * 30);

const MusicBed: React.FC = () => {
  const f = useCurrentFrame();
  const s = f / 30;
  const vol = interpolate(
    s,
    [0, 4, 10, 24, 30, TOTAL_WARMBLACKOUT - 6, TOTAL_WARMBLACKOUT],
    [0.06, 0.12, 0.15, 0.15, 0.1, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile("warmblackout_music.mp3")} loop volume={vol} />;
};

export const MainWarmblackout: React.FC = () => {
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
          <AvatarLayer src="warmblackout_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
