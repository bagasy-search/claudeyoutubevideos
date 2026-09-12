// Entry MÍNIMO solo-raingutter para Remotion (bundle liviano / farm render).
import './index.css';
import { registerRoot, Composition } from 'remotion';
import { MainRaingutter, TOTAL_FRAMES_RAINGUTTER } from './VideoEdit/Main_raingutter';

const Root = () => (
  <Composition
    id="Raingutter"
    component={MainRaingutter}
    durationInFrames={TOTAL_FRAMES_RAINGUTTER}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
