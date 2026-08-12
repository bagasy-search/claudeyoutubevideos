// Entry MÍNIMO — primer minuto premium del canal Agua Oxigenada (video pxwash).
// Uso: npx remotion studio src/index_pxfirst.tsx
import './index.css';
import {registerRoot, Composition} from 'remotion';
import {PeroxideFirstMinute, TOTAL_FRAMES_PXFIRST} from './peroxide/PeroxideFirstMinute';

const PxFirstRoot: React.FC = () => (
  <Composition
    id="PeroxideFirstMinute"
    component={PeroxideFirstMinute}
    durationInFrames={TOTAL_FRAMES_PXFIRST}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(PxFirstRoot);
