// Entry propio del video #16 de Bastida (señales de riñón en peligro). Comp id: "Bas-Main16"
// ⛔ NO usar el entry compartido src/index.tsx (otra sesión lo apunta a otro video).
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainBastidaRenal16, TOTAL_R16} from './bastida/Main_bastidarenal16';

const Root: React.FC = () => (
  <>
    <Composition
      id="Bas-Main16"
      component={MainBastidaRenal16}
      durationInFrames={TOTAL_R16}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
