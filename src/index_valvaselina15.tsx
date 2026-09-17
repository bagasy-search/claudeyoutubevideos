import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainValVaselina15, TOTAL_FRAMES} from './vvs/Main_valvaselina15';

const Root: React.FC = () => (
  <Composition id="ValVaselina15" component={MainValVaselina15} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
