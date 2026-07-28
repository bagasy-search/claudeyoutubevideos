import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Main_vsdjytp30ogs, TOTAL_FRAMES} from './VideoEdit/Main_vsdjytp30ogs';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Manos_vsdjytp30ogs"
    component={Main_vsdjytp30ogs}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RemotionRoot);
