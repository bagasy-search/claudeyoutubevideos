// Entry MÍNIMO solo-mar15a (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './mar15a/cues.gen';
import { ESC_MAR15A } from './mar15a/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_MAR15A} />;
const Root = () => (
  <Composition id="Mar15a" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
