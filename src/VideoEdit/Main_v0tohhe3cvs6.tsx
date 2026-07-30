import React from "react";
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {Video} from "@remotion/media";
import {sec} from "./theme";
import {PREMIUM_CUES_V0TOHHE3CVS6} from "./cues_v0tohhe3cvs6.gen";

export const TOTAL_FRAMES_V0TOHHE3CVS6 = 41814;

const AvatarBase_v0tohhe3cvs6: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, TOTAL_FRAMES_V0TOHHE3CVS6 - 1], [1.012, 1.042], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const driftX = Math.sin(frame / 690) * 5;
  const driftY = Math.cos(frame / 820) * 3;
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#171912"}}>
      <Video
        src={staticFile("avatar_v0tohhe3cvs6.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 50%",
          transform: `translate(${driftX}px, ${driftY}px) scale(${scale})`,
          filter: "saturate(0.94) contrast(1.025)",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: "inset 0 0 110px rgba(13,12,7,0.2)",
        }}
      />
    </AbsoluteFill>
  );
};

export const MainV0TOHHE3CVS6: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: "#171912"}}>
    <AvatarBase_v0tohhe3cvs6 />
    {PREMIUM_CUES_V0TOHHE3CVS6.map((cue) => (
      <Sequence
        key={cue.key}
        from={sec(cue.start)}
        durationInFrames={sec(cue.dur)}
        premountFor={30}
      >
        {cue.el(sec(cue.dur))}
      </Sequence>
    ))}
  </AbsoluteFill>
);
