import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainTfbtapa, TOTAL_FRAMES} from './tfbtapa/Main_tfbtapa';

const Root: React.FC = () => (
  <Composition id="Tfbtapa" component={MainTfbtapa} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
