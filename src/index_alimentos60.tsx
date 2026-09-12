// Entry MÍNIMO solo-Alimentos60 para Remotion (bundle liviano).
// Uso: npx remotion compositions src/index_alimentos60.tsx
import './index.css';
import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {MainAlimentos60, TOTAL_FRAMES} from './valeria/Main_alimentos60';

const Root: React.FC = () => (
  <Composition
    id="Alimentos60"
    component={MainAlimentos60}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
