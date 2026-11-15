// Entry MÍNIMO solo-ck14a (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './ck14a/cues.gen';
import { ESC_CK14A } from './ck14a/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_CK14A} />;
const Root = () => (
  <Composition id="Ck14a" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
