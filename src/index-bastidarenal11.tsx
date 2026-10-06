// Entry propio del video #11 de Bastida (10 alimentos que dañan). Comp id: "Bas-Main11"
// ⛔ NO usar el entry compartido src/index.tsx (otra sesión lo apunta a otro video).
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainBastidaRenal11, TOTAL_R11} from './bastida/Main_bastidarenal11';

const Root: React.FC = () => (
  <>
    <Composition
      id="Bas-Main11"
      component={MainBastidaRenal11}
      durationInFrames={TOTAL_R11}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
