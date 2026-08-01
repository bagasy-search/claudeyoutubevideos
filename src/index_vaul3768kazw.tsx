import React from "react";
import {Composition, registerRoot} from "remotion";
import {BagasyTimeline_vaul3768kazw} from "./VideoEdit/Main_vaul3768kazw";
import timeline from "./VideoEdit/timeline_vaul3768kazw.json";

const Root: React.FC = () => <Composition
  id="Bagasy-vaul3768kazw"
  component={BagasyTimeline_vaul3768kazw}
  durationInFrames={timeline.duration_in_frames}
  fps={30}
  width={1920}
  height={1080}
/>;
registerRoot(Root);
