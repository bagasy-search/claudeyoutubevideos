// Entry propio del video "Lo que el Agua en Ayunas le Hace a sus Riñones Después de los 60".
// Comp id: "Bas-AguaAyunas60". ⛔ NO usar el entry compartido src/index.tsx.
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainAguaAyunas60, TOTAL_AA} from './bastida/Main_aguaayunas60';

const Root: React.FC = () => (
  <>
    <Composition
      id="Bas-AguaAyunas60"
      component={MainAguaAyunas60}
      durationInFrames={TOTAL_AA}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
