// Entry MÍNIMO solo-ck14c (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './ck14c/cues.gen';
import { ESC_CK14C } from './ck14c/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_CK14C} />;
const Root = () => (
  <Composition id="Ck14c" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
