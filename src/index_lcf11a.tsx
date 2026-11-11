// Entry MÍNIMO solo-lcf11a (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './lcf11a/cues.gen';
import { ESC_LCF11A } from './lcf11a/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_LCF11A} />;
const Root = () => (
  <Composition id="Lcf11a" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
