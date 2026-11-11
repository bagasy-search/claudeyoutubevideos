// Entry MÍNIMO solo-ck11e (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './ck11e/cues.gen';
import { ESC_CK11E } from './ck11e/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_CK11E} />;
const Root = () => (
  <Composition id="Ck11e" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
