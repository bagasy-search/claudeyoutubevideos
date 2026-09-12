import React from "react";
import {Composition, registerRoot} from "remotion";
import {
  MainVbb0rdkrfduoRedo,
  TOTAL_FRAMES_VBB0RDKRFDUO_REDO,
} from "./VideoEdit/Main_vbb0rdkrfduo_redo";

export const Vbb0rdkrfduoRedoRoot: React.FC = () => (
  <>
    <Composition
      id="Vbb0rdkrfduoRedo"
      component={MainVbb0rdkrfduoRedo}
      durationInFrames={TOTAL_FRAMES_VBB0RDKRFDUO_REDO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Vbb0rdkrfduoRedoRoot);
