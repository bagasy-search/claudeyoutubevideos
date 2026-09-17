import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainValNivea, TOTAL_FRAMES} from './valnivea/Main_valnivea';

const Root: React.FC = () => (
  <Composition id="ValNivea" component={MainValNivea} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
