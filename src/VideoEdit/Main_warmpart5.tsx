import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_warmpart5.gen";
import { AVATAR_WINDOWS, TOTAL_WARMPART5 } from "./avatar_warmpart5.gen";

// ── "This $5 Part Keeps Your Family Warm During Any Power Outage — Amish Secret" — Claudio Yoder (EN) ──
// 96 imágenes IA del sistema (clay-pot heater) mapeadas 1:1 a su frase + AVATAR full en tramos retóricos
// + kit premium THEME_EARTH. Música calma en loop, bien abajo, swell suave en el hook.
export const TOTAL_FRAMES_WARMPART5 = Math.round(TOTAL_WARMPART5 * 30);

const MusicBed: React.FC = () => {
  const f = useCurrentFrame();
  const s = f / 30;
  const vol = interpolate(
    s,
    [0, 4, 10, 24, 30, TOTAL_WARMPART5 - 6, TOTAL_WARMPART5],
    [0.06, 0.12, 0.15, 0.15, 0.1, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile("warmpart5_music.mp3")} loop volume={vol} />;
};

export const MainWarmpart5: React.FC = () => {
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
          <AvatarLayer src="warmpart5_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
