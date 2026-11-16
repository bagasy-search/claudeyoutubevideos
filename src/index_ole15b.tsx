// Entry MÍNIMO solo-ole15b (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './ole15b/cues.gen';
import { ESC_OLE15B } from './ole15b/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_OLE15B} />;
const Root = () => (
  <Composition id="Ole15b" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
