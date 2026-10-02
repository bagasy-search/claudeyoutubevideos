import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainValAvena, TOTAL_FRAMES} from './valavena/Main_valavena';

const Root: React.FC = () => (
  <Composition id="ValAvena" component={MainValAvena} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
