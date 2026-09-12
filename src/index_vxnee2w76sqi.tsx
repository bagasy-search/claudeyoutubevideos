import React from "react";
import {Composition, registerRoot} from "remotion";
import {
  MainVxnee2w76sqi,
  TOTAL_FRAMES_VXNEE2W76SQI,
} from "./VideoEdit/Main_vxnee2w76sqi";

export const Vxnee2w76sqiRoot: React.FC = () => (
  <Composition
    id="VxneeRomero"
    component={MainVxnee2w76sqi}
    durationInFrames={TOTAL_FRAMES_VXNEE2W76SQI}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Vxnee2w76sqiRoot);
