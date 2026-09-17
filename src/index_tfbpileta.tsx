import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainTfbpileta, TOTAL_FRAMES} from './tfbpileta/Main_tfbpileta';

// Entry AISLADO para el farm (tfbpileta).
const Root: React.FC = () => (
  <Composition id="Tfbpileta" component={MainTfbpileta} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
