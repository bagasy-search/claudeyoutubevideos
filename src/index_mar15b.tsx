// Entry MÍNIMO solo-mar15b (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './mar15b/cues.gen';
import { ESC_MAR15B } from './mar15b/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_MAR15B} />;
const Root = () => (
  <Composition id="Mar15b" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
