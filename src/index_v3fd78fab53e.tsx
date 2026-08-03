import React from "react";
import {Composition, registerRoot} from "remotion";
import {BagasyTimeline_v3fd78fab53e} from "./VideoEdit/Main_v3fd78fab53e";

const Root: React.FC = () => <Composition
  id="Bagasy-v3fd78fab53e"
  component={BagasyTimeline_v3fd78fab53e}
  durationInFrames={42010}
  fps={30}
  width={1920}
  height={1080}
/>;
registerRoot(Root);
