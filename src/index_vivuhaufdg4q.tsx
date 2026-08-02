import React from "react";
import {Composition, registerRoot} from "remotion";
import {BagasyTimeline_vivuhaufdg4q} from "./VideoEdit/Main_vivuhaufdg4q";

const Root: React.FC = () => <Composition
  id="Bagasy-vivuhaufdg4q"
  component={BagasyTimeline_vivuhaufdg4q}
  durationInFrames={25879}
  fps={30}
  width={1920}
  height={1080}
/>;
registerRoot(Root);
