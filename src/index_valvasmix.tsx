import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainValVasmix, TOTAL_FRAMES} from './vvm/Main_valvasmix';

const Root: React.FC = () => (
  <Composition id="ValVasmix" component={MainValVasmix} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
