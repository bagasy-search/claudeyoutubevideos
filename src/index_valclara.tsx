import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainValClara, TOTAL_FRAMES} from './valclara/Main_valclara';

const Root: React.FC = () => (
  <Composition id="ValClara" component={MainValClara} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
