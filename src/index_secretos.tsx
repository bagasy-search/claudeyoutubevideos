// Entry MÍNIMO solo-Secretos para Remotion (bundle liviano).
// Uso: npx remotion compositions src/index_secretos.tsx
import './index.css';
import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {MainSecretos, TOTAL_FRAMES_SECRETOS} from './VideoEdit/Main_secretos';

const Root: React.FC = () => (
  <Composition
    id="Secretos"
    component={MainSecretos}
    durationInFrames={TOTAL_FRAMES_SECRETOS}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
