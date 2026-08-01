import React from "react";
import {Composition, registerRoot} from "remotion";
import {BagasyTimeline_vaf1bq9f6c4j} from "./VideoEdit/Main_vaf1bq9f6c4j";

const Root: React.FC = () => <Composition
  id="Bagasy-vaf1bq9f6c4j"
  component={BagasyTimeline_vaf1bq9f6c4j}
  durationInFrames={46079}
  fps={30}
  width={1920}
  height={1080}
/>;
registerRoot(Root);
