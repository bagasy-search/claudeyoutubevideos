import React from "react";
import {Composition, registerRoot} from "remotion";
import {
  MainVd4f4gksltnz,
  TOTAL_FRAMES_VD4F4GKSLTNZ,
} from "./VideoEdit/Main_vd4f4gksltnz";

export const Vd4f4gksltnzRoot: React.FC = () => (
  <>
    <Composition
      id="Vd4f4gksltnz"
      component={MainVd4f4gksltnz}
      durationInFrames={TOTAL_FRAMES_VD4F4GKSLTNZ}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Vd4f4gksltnzRoot);
