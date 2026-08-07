// Entry MÍNIMO solo-oillamp1 para Remotion (bundle liviano / farm render).
import './index.css';
import { registerRoot, Composition } from 'remotion';
import { MainOillamp1, TOTAL_FRAMES_OILLAMP1 } from './VideoEdit/Main_oillamp1';

const Root = () => (
  <Composition
    id="Oillamp1"
    component={MainOillamp1}
    durationInFrames={TOTAL_FRAMES_OILLAMP1}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
