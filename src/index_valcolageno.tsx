import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainValColageno, TOTAL_FRAMES} from './vac/Main_valcolageno';

const Root: React.FC = () => (
  <Composition id="ValColageno" component={MainValColageno} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
