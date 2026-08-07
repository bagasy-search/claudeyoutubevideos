// Entry MÍNIMO solo-endlessheat para Remotion (bundle liviano / farm render).
import './index.css';
import { registerRoot, Composition } from 'remotion';
import { MainEndlessheat, TOTAL_FRAMES_ENDLESSHEAT } from './VideoEdit/Main_endlessheat';

const Root = () => (
  <Composition
    id="Endlessheat"
    component={MainEndlessheat}
    durationInFrames={TOTAL_FRAMES_ENDLESSHEAT}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
