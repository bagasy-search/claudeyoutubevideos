import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { COLORS, sec } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { SfxCue, POPS } from "./components/Sfx";
import { AVATAR_V0TOHHE3CVS6 } from "./avatar_v0tohhe3cvs6.gen";
import { CUES_V0TOHHE3CVS6 } from "./cues_v0tohhe3cvs6.gen";

export const TOTAL_FRAMES_V0TOHHE3CVS6 = 42989;

export const MainV0TOHHE3CVS6: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
    <TechBackground glowX={48} glowY={42} hue="cold" drift={0.35} />
    <AvatarLayer src="v0tohhe3cvs6_opt.mp4" wav="v0tohhe3cvs6.wav" windows={AVATAR_V0TOHHE3CVS6} accent="#C2A56B" />
    {CUES_V0TOHHE3CVS6.map((cue) => (
      <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)} premountFor={30}>
        {cue.el(sec(cue.dur))}
      </Sequence>
    ))}
    {CUES_V0TOHHE3CVS6.map((cue, index) =>
      cue.kind !== "raw" && index % 6 === 0 ? (
        <SfxCue key={"sfx-" + cue.key} at={sec(cue.start)} src={POPS[index % POPS.length]} volume={0.08} />
      ) : null,
    )}
  </AbsoluteFill>
);
