// Entry propio del video "Los 3 Tés de la Mañana que Limpian sus Riñones (y 3 que Debe Evitar)".
// Comp id: "Bas-Bastidates". ⛔ NO usar el entry compartido src/index.tsx (otra sesión lo apunta a otro video).
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainBastidates, TOTAL_BAS} from './bastida/Main_bastidates';

const Root: React.FC = () => (
  <>
    <Composition
      id="Bas-Bastidates"
      component={MainBastidates}
      durationInFrames={TOTAL_BAS}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
