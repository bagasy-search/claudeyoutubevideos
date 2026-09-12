import React from "react";
import {Composition, registerRoot} from "remotion";
import {
  MainVfh490rruvab,
  TOTAL_FRAMES_VFH490RRUVAB,
} from "./VideoEdit/Main_vfh490rruvab";

export const Vfh490rruvabRoot: React.FC = () => (
  <>
    <Composition
      id="Vfh490rruvab"
      component={MainVfh490rruvab}
      durationInFrames={TOTAL_FRAMES_VFH490RRUVAB}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Vfh490rruvabRoot);
