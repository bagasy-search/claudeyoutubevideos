// Entry MÍNIMO solo-lou15a (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './lou15a/cues.gen';
import { ESC_LOU15A } from './lou15a/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_LOU15A} />;
const Root = () => (
  <Composition id="Lou15a" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
