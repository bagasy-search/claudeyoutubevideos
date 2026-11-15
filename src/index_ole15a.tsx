// Entry MÍNIMO solo-ole15a (farm render).
import './index.css';
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { LorMain } from './lor/Main';
import { CUES } from './ole15a/cues.gen';
import { ESC_OLE15A } from './ole15a/Escenas';

const Comp: React.FC = () => <LorMain cu={CUES} esc={ESC_OLE15A} />;
const Root = () => (
  <Composition id="Ole15a" component={Comp} durationInFrames={CUES.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
