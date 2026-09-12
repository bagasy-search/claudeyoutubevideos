import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {
  MainVbb0rdkrfduo,
  TOTAL_FRAMES_VBB0RDKRFDUO,
} from "./VideoEdit/Main_vbb0rdkrfduo";

const Vbb0rdkrfduoRoot: React.FC = () => (
  <Composition
    id="Vbb0rdkrfduo"
    component={MainVbb0rdkrfduo}
    durationInFrames={TOTAL_FRAMES_VBB0RDKRFDUO}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Vbb0rdkrfduoRoot);
