// Entry propio del video #7 de Bastida (proteínas). Comp id: "Bas-Main-R7"
// ⛔ NO usar el entry compartido src/index.tsx (otra sesión lo apunta a otro video).
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainBastidaRenal7, TOTAL_R7} from './bastida/Main_bastidarenal7';

const Root: React.FC = () => (
  <>
    <Composition
      id="Bas-Main-R7"
      component={MainBastidaRenal7}
      durationInFrames={TOTAL_R7}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
