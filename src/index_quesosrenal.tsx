// Entry propio del video "4 quesos que dañan / 5 que protegen los riñones". Comp id: "Bas-QuesosRenal"
// ⛔ NO usar el entry compartido src/index.tsx (otra sesión lo apunta a otro video).
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainQuesosRenal, TOTAL_Q} from './bastida/Main_quesosrenal';

const Root: React.FC = () => (
  <>
    <Composition
      id="Bas-QuesosRenal"
      component={MainQuesosRenal}
      durationInFrames={TOTAL_Q}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
