import React from "react";
import {Composition, registerRoot} from "remotion";
import {BagasyTimeline_v48vr0jexdrms} from "./VideoEdit/Main_v48vr0jexdrms";

const Root: React.FC = () => <Composition
  id="Bagasy-v48vr0jexdrms"
  component={BagasyTimeline_v48vr0jexdrms}
  durationInFrames={40449}
  fps={30}
  width={1920}
  height={1080}
/>;
registerRoot(Root);
