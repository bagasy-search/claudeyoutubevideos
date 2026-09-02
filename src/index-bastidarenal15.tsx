// Entry propio del video #15 de Bastida (señales de riñón en peligro). Comp id: "Bas-Main15"
// ⛔ NO usar el entry compartido src/index.tsx (otra sesión lo apunta a otro video).
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainBastidaRenal15, TOTAL_R15} from './bastida/Main_bastidarenal15';

const Root: React.FC = () => (
  <>
    <Composition
      id="Bas-Main15"
      component={MainBastidaRenal15}
      durationInFrames={TOTAL_R15}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
