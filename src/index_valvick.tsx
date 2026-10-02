import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainValVick, TOTAL_FRAMES} from './valvick/Main_valvick';

const Root: React.FC = () => (
  <Composition id="ValVick" component={MainValVick} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
