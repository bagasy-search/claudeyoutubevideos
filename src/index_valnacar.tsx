import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainValNacar, TOTAL_FRAMES} from './valnacar/Main_valnacar';

const Root: React.FC = () => (
  <Composition id="ValNacar" component={MainValNacar} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
