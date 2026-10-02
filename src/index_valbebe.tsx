import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainValBebe, TOTAL_FRAMES} from './valbebe/Main_valbebe';

const Root: React.FC = () => (
  <Composition id="ValBebe" component={MainValBebe} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
