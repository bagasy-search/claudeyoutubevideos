// Entry MÍNIMO solo-ck15c (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './ck15c/cues.gen';
import { ESC_CK15C } from './ck15c/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_CK15C} />;
const Root = () => (
  <Composition id="Ck15c" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
