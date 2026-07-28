// Entry PROPIO de este video (no se toca src/Root.tsx: es compartido con los otros agentes).
//   ENTRY=src/index_v0w7c4w70kfg.tsx node scripts/farm.mjs v0w7c4w70kfg Canas <frames> <chunks>
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Main_v0w7c4w70kfg, TOTAL_FRAMES_ACEITE} from './VideoEdit/Main_v0w7c4w70kfg';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Canas"
    component={Main_v0w7c4w70kfg}
    durationInFrames={TOTAL_FRAMES_ACEITE}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RemotionRoot);
