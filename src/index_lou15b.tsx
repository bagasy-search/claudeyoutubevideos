// Entry MÍNIMO solo-lou15b (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './lou15b/cues.gen';
import { ESC_LOU15B } from './lou15b/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_LOU15B} />;
const Root = () => (
  <Composition id="Lou15b" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
