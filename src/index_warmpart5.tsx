// Entry MÍNIMO solo-warmpart5 para Remotion (bundle liviano / farm render).
import './index.css';
import { registerRoot, Composition } from 'remotion';
import { MainWarmpart5, TOTAL_FRAMES_WARMPART5 } from './VideoEdit/Main_warmpart5';

const Root = () => (
  <Composition
    id="Warmpart5"
    component={MainWarmpart5}
    durationInFrames={TOTAL_FRAMES_WARMPART5}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
