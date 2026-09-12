// Entry MÍNIMO solo-cytomato para Remotion (bundle liviano / farm render).
import './index.css';
import { registerRoot, Composition } from 'remotion';
import { MainCytomato, TOTAL_FRAMES_CYTOMATO } from './VideoEdit/Main_cytomato';

const Root = () => (
  <Composition
    id="Cytomato"
    component={MainCytomato}
    durationInFrames={TOTAL_FRAMES_CYTOMATO}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
