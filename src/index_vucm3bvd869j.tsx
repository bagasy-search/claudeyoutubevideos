// Entry PROPIO de este video (no se toca src/Root.tsx: es compartido con los otros agentes).
//   ENTRY=src/index_vucm3bvd869j.tsx node scripts/farm.mjs vucm3bvd869j Hormigueo <frames> <chunks>
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Main_vucm3bvd869j, TOTAL_FRAMES_VUCM} from './VideoEdit/Main_vucm3bvd869j';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Hormigueo"
    component={Main_vucm3bvd869j}
    durationInFrames={TOTAL_FRAMES_VUCM}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RemotionRoot);
