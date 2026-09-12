// Entry MÍNIMO solo-Ollabarro para Remotion (bundle liviano / compositions check).
import './index.css';
import { registerRoot, Composition } from 'remotion';
import { MainOllabarro, TOTAL_FRAMES_OLLABARRO } from './VideoEdit/Main_ollabarro';

const Root = () => (
  <Composition
    id="Ollabarro"
    component={MainOllabarro}
    durationInFrames={TOTAL_FRAMES_OLLABARRO}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
