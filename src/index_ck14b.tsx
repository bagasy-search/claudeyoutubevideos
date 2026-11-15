// Entry MÍNIMO solo-ck14b (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './ck14b/cues.gen';
import { ESC_CK14B } from './ck14b/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_CK14B} />;
const Root = () => (
  <Composition id="Ck14b" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
