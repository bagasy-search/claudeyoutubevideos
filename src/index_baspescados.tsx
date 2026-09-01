// Entry propio del video "5 Pescados para Proteger los Riñones y Bajar la Creatinina". Comp id: "Bas-Baspescados"
// ⛔ NO usar el entry compartido src/index.tsx (otra sesión lo apunta a otro video).
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainBaspescados, TOTAL_BP} from './bastida/Main_baspescados';

const Root: React.FC = () => (
  <>
    <Composition
      id="Bas-Baspescados"
      component={MainBaspescados}
      durationInFrames={TOTAL_BP}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
