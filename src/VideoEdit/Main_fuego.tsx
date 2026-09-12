import { AbsoluteFill, Sequence, Audio, staticFile, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_estufa.gen";
import { AVATAR_WINDOWS, TOTAL_ESTUFA } from "./avatar_estufa.gen";

export const TOTAL_FRAMES_FUEGO = Math.round(TOTAL_ESTUFA * 30);

// SFX sincronizado [segundo, archivo, volumen] — acentos atados a cada evento del hook.
const SFX: [number, string, number][] = [
  [5.2, "sfx_thump.mp3", 0.26],            // entra el bill
  [10.7, "sfx_text_thud.mp3", 0.3],        // meter / dinero
  [22.97, "sfx_whoosh_soft.mp3", 0.3],     // furnace
  [31.61, "sfx_chime.mp3", 0.26],          // "this hard" keyphrase
  [63.03, "text_slam.mp3", 0.36],          // "One fire. All winter."
  [88.59, "number_slam.mp3", 0.34],        // stat −75%
  [104.08, "stinger_hit.mp3", 0.3],        // "impossible"
  [135.55, "sfx_chime.mp3", 0.26],         // "not how the old world kept warm"
  [163.71, "sfx_chime.mp3", 0.26],         // "forgotten"
  [167.64, "section_swell.mp3", 0.3],      // pivote "let me show you"
  [181.85, "sfx_whoosh_soft.mp3", 0.3],    // heatslow diagrama
  [190.46, "winner_chime.mp3", 0.26],      // wheelbarrow = week
  [196.27, "stinger_hit.mp3", 0.32],       // redacted: one mistake
  [213.94, "stinger_hit.mp3", 0.3],        // redacted: fairy tale
  [220.41, "text_slam.mp3", 0.38],         // "one hour of fire, a whole day of warmth"
];

export const MainFuego: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
          {CUES.filter((c) => c.kind !== "float").map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="estufa_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {CUES.filter((c) => c.kind === "float").map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      <Audio
        src={staticFile("estufa_music.mp3")}
        volume={(f) =>
          interpolate(f, [0, 40, TOTAL_FRAMES_FUEGO - 75, TOTAL_FRAMES_FUEGO], [0, 0.06, 0.06, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          })
        }
      />
      {SFX.map(([at, file, vol], i) => (
        <Sequence key={`sfx${i}`} from={Math.round(at * 30)} durationInFrames={120}>
          <Audio src={staticFile(`sfx/${file}`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
