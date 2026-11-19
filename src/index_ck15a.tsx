// Entry MÍNIMO solo-ck15a (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './ck15a/cues.gen';
import { ESC_CK15A } from './ck15a/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_CK15A} />;
const Root = () => (
  <Composition id="Ck15a" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
