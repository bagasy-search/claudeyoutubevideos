/**
 * Entry LIMPIO — solo la composición "Val-RosemaryHero" (demo de motion-design del romero
 * en la paleta del canal Dra. Valeria Alcázar). Sin el resto del proyecto.
 *
 * Previsualizar:  npx remotion studio src/index_rosemaryhero.tsx
 */
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {RosemaryHero} from './valeria/RosemaryHero';

const Root: React.FC = () => (
  <Composition
    id="Val-RosemaryHero"
    component={RosemaryHero}
    durationInFrames={300}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
