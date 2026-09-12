import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS, SFXCUES } from "./cues_pxpest.gen";
import { AVATAR_WINDOWS, TOTAL_PXPEST } from "./avatar_pxpest.gen";

// "11 Hydrogen Peroxide Secrets Exterminators Don't Want You to Know" (canal Agua Oxigenada EN, plagas).
export const TOTAL_FRAMES_PXPEST = Math.round(TOTAL_PXPEST * 30);

export const MainPxpest: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="red" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="pxpest_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {SFXCUES.map((s, i) => (
            <Sequence key={"sfx" + i} from={sec(s.start)} durationInFrames={60} layout="none">
              <Audio src={staticFile(s.src)} volume={s.vol} />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
