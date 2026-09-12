import {Composition, registerRoot} from 'remotion';
import React from 'react';
import {MainValeriaBocaSeca, TOTAL_FRAMES} from './valeria/Main_valeriabocaseca';

const Root: React.FC = () => (
  <Composition
    id="ValeriaBocaSeca"
    component={MainValeriaBocaSeca}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
