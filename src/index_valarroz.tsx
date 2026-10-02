import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainValArroz, TOTAL_FRAMES} from './valarroz/Main_valarroz';

const Root: React.FC = () => (
  <Composition id="ValArroz" component={MainValArroz} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
