// Entry MÍNIMO solo-ValeriaVaselina para Remotion (bundle liviano).
// Uso: npx remotion compositions src/index_valeriavaselina.tsx
import './index.css';
import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {MainValeriaVaselina, TOTAL_FRAMES} from './valeria/Main_valeriavaselina';

const Root: React.FC = () => (
  <Composition
    id="ValeriaVaselina"
    component={MainValeriaVaselina}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
