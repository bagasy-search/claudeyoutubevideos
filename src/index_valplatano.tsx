import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainVal, TOTAL_FRAMES} from './valplatano/Main_valplatano';

const Root: React.FC = () => (
  <Composition id="Full" component={MainVal} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
