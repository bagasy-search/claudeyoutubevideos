import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainValRomero, TOTAL_FRAMES} from './valromero/Main_valromero';

const Root: React.FC = () => (
  <Composition id="ValRomero" component={MainValRomero} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
