/**
 * Entry propio del video "El TRUCO del ROMERO para verte 20 años más joven"
 * (Dra. Valeria Alcázar). Evita el OOM del Root grande y aísla el render del farm.
 */
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MainRomero, TOTAL_FRAMES_ROMERO} from './VideoEdit/Main_truco_romero';

const Root: React.FC = () => (
  <Composition
    id="Romero"
    component={MainRomero}
    durationInFrames={TOTAL_FRAMES_ROMERO}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
