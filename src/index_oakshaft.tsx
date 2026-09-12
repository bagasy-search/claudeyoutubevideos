// Entry MÍNIMO solo-oakshaft para Remotion (bundle liviano / farm render).
import './index.css';
import { registerRoot, Composition } from 'remotion';
import { MainOakshaft, TOTAL_FRAMES_OAKSHAFT } from './VideoEdit/Main_oakshaft';

const Root = () => (
  <Composition
    id="Oakshaft"
    component={MainOakshaft}
    durationInFrames={TOTAL_FRAMES_OAKSHAFT}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
