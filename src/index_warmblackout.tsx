// Entry MÍNIMO solo-warmblackout para Remotion (bundle liviano / farm render).
import './index.css';
import { registerRoot, Composition } from 'remotion';
import { MainWarmblackout, TOTAL_FRAMES_WARMBLACKOUT } from './VideoEdit/Main_warmblackout';

const Root = () => (
  <Composition
    id="Warmblackout"
    component={MainWarmblackout}
    durationInFrames={TOTAL_FRAMES_WARMBLACKOUT}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
