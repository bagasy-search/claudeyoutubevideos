// Entry MÍNIMO solo-apa15a (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './apa15a/cues.gen';
import { ESC_APA15A } from './apa15a/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_APA15A} />;
const Root = () => (
  <Composition id="Apa15a" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
