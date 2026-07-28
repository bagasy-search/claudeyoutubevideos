import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { SfxCue, POPS, SFX } from "./components/Sfx";
import { CUES, AVATAR_WINDOWS } from "./cues_vwtchhlmzl7f.gen";

// Levi Lapp Jardín — "25 usos del agua oxigenada que los Amish guardaron 60 años".
// Avatar HeyGen (avatar_vwtchhlmzl7f.mp4) = pista de audio + ventanas full/hidden.
// Los CUES tapan a pantalla completa cuando el avatar está "hidden".
export const TOTAL_FRAMES_VWTCHHLMZL7F = 44370;

export const Mainvwtchhlmzl7f: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
    <TechBackground glowX={50} glowY={44} hue="amber" drift={0.4} />
    <AvatarLayer src="avatar_vwtchhlmzl7f.mp4" wav="vwtchhlmzl7f.wav" windows={AVATAR_WINDOWS as unknown as AvatarWindow[]} />
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
        {cue.el(sec(cue.dur))}
      </Sequence>
    ))}
    {CUES.map((cue, i) => (
      <SfxCue
        key={"sfx" + cue.key}
        at={sec(cue.start)}
        src={cue.start < 45 ? (i % 2 === 0 ? SFX.whoosh2 : SFX.swish) : POPS[i % POPS.length]}
        volume={0.26}
        durationInFrames={38}
      />
    ))}
  </AbsoluteFill>
);
