// Entry MÍNIMO solo-apa14a (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './apa14a/cues.gen';
import { ESC_APA14A } from './apa14a/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_APA14A} />;
const Root = () => (
  <Composition id="Apa14a" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
