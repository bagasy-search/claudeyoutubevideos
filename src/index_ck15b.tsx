// Entry MÍNIMO solo-ck15b (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './ck15b/cues.gen';
import { ESC_CK15B } from './ck15b/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_CK15B} />;
const Root = () => (
  <Composition id="Ck15b" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
