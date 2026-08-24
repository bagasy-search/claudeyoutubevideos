import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MethodStackScene} from './bastida/scenes7/MethodStackScene';

const Root: React.FC = () => (
  <Composition id="MSProbe" component={MethodStackScene} durationInFrames={1660} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
