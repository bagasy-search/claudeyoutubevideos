import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainValMagnesia, TOTAL_FRAMES} from './valmagnesia/Main_valmagnesia';

const Root: React.FC = () => (
  <Composition id="ValMagnesia" component={MainValMagnesia} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
