import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { TechBackground } from "./components/TechBackground";
import { SectionStinger } from "./components/SectionFx";
import { CUES_V55LHDE2F1A4 } from "./cues_v55lhde2f1a4.gen";

export const TOTAL_FRAMES_V55LHDE2F1A4 = 35609;
const FPS = 30;
const SECTION_STARTS = [72,235,455,675,875,1055] as const;

export const MainV55lhde2f1a4: React.FC = () => {
  const frame = useCurrentFrame();
  const avatarScale = interpolate(frame, [0, TOTAL_FRAMES_V55LHDE2F1A4], [1.0, 1.045], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{backgroundColor:"#17120d"}}>
      <TechBackground />
      <AbsoluteFill style={{transform:`scale(${avatarScale})`, transformOrigin:"50% 46%"}}>
        <Video
          src={staticFile("avatar_v55lhde2f1a4.mp4")}
          style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"50% 50%"}}
        />
      </AbsoluteFill>
      {CUES_V55LHDE2F1A4.map((cue) => {
        const from = Math.round(cue.start * FPS);
        const durationInFrames = Math.max(1, Math.min(
          Math.round(cue.dur * FPS),
          TOTAL_FRAMES_V55LHDE2F1A4 - from,
        ));
        return (
          <Sequence key={cue.key} from={from} durationInFrames={durationInFrames} premountFor={FPS}>
            {cue.el(durationInFrames)}
          </Sequence>
        );
      })}
      {SECTION_STARTS.map((start) => (
        <Sequence key={start} from={Math.round(start * FPS)} durationInFrames={18}>
          <SectionStinger durationInFrames={18} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
