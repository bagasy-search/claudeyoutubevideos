// Entry MÍNIMO — galería del kit AGUA OXIGENADA para Remotion Studio.
// Uso: npx remotion studio src/index_pxkit.tsx
import './index.css';
import {registerRoot, Composition} from 'remotion';
import {PeroxideShowcase, TOTAL_FRAMES_PXKIT} from './peroxide/PeroxideShowcase';

const PxKitRoot: React.FC = () => (
  <Composition
    id="PeroxideKit"
    component={PeroxideShowcase}
    durationInFrames={TOTAL_FRAMES_PXKIT}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(PxKitRoot);
