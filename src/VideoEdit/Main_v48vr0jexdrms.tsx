import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {Audio, Video} from "@remotion/media";
import {PREMIUM_CUES_V48VR0JEXDRMS} from "./cues_v48vr0jexdrms.gen";

export const TOTAL_FRAMES_V48VR0JEXDRMS = 40449;

const AvatarBase_v48vr0jexdrms: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(
    frame,
    [0, TOTAL_FRAMES_V48VR0JEXDRMS - 1],
    [1.01, 1.04],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#111914"}}>
      <Video
        src={staticFile("v48vr0jexdrms_opt.mp4")}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(${Math.sin(frame / 700) * 4}px, ${Math.cos(frame / 830) * 3}px) scale(${scale})`,
          filter: "saturate(.94) contrast(1.025)",
        }}
      />
      <AbsoluteFill style={{boxShadow: "inset 0 0 110px rgba(8,13,10,.24)"}} />
    </AbsoluteFill>
  );
};

export const BagasyTimeline_v48vr0jexdrms: React.FC = () => (
  <AbsoluteFill style={{background: "#111914"}}>
    <Audio src={staticFile("v48vr0jexdrms.wav")} />
    <AvatarBase_v48vr0jexdrms />
    {PREMIUM_CUES_V48VR0JEXDRMS.map((cue) => (
      <Sequence
        key={cue.key}
        from={cue.from}
        durationInFrames={cue.duration}
        premountFor={30}
      >
        {cue.el(cue.duration)}
      </Sequence>
    ))}
  </AbsoluteFill>
);
