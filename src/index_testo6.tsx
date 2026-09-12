import React from "react";
import {Composition, registerRoot} from "remotion";
import {BagasyTimeline_testo6} from "./VideoEdit/Main_testo6";
import timeline from "./VideoEdit/timeline_testo6.json";

const Root: React.FC = () => <Composition
  id="Bagasy-testo6"
  component={BagasyTimeline_testo6}
  durationInFrames={(timeline as any).duration_in_frames}
  fps={30}
  width={1920}
  height={1080}
/>;
registerRoot(Root);
