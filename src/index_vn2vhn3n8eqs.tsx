// Entry AISLADO de este video: registra SOLO su composición.
// Nunca tocar src/Root.tsx — con varios agentes en el mismo repo, se pisan.
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainVn2, TOTAL_FRAMES_VN2} from './VideoEdit/Main_vn2vhn3n8eqs';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Vn2Aceites"
      component={MainVn2}
      durationInFrames={TOTAL_FRAMES_VN2}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RemotionRoot);
