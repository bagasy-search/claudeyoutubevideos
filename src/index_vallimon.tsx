import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainValLimon, TOTAL_FRAMES} from './vallimon/Main_vallimon';

const Root: React.FC = () => (
  <Composition id="ValLimon" component={MainValLimon} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
