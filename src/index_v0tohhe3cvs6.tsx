import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainV0TOHHE3CVS6, TOTAL_FRAMES_V0TOHHE3CVS6 } from "./VideoEdit/Main_v0tohhe3cvs6";

const RootV0TOHHE3CVS6 = () => (
  <Composition
    id="V0TOHHE3CVS6"
    component={MainV0TOHHE3CVS6}
    durationInFrames={TOTAL_FRAMES_V0TOHHE3CVS6}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RootV0TOHHE3CVS6);
