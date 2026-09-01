// Entry propio del video "Esto le hace el limón a sus riñones en ayunas" (Dr. Bastida).
// ⛔ NO usar el entry compartido src/index.tsx (otra sesión lo apunta a otro video).
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainLimonAyunas, TOTAL_L} from './bastida/Main_limonayunas';

const Root: React.FC = () => (
  <>
    <Composition
      id="Bas-LimonAyunas"
      component={MainLimonAyunas}
      durationInFrames={TOTAL_L}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(Root);
