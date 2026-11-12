// Entry MÍNIMO solo-swl11f (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './swl11f/cues.gen';
import { ESC_SWL11F } from './swl11f/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_SWL11F} />;
const Root = () => (
  <Composition id="Swl11f" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
