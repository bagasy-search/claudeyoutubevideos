// Entry MÍNIMO solo-Oxigenada para Remotion (bundle liviano / compositions check).
import './index.css';
import { registerRoot, Composition } from 'remotion';
import { MainOxigenada, TOTAL_FRAMES_OXIGENADA } from './VideoEdit/Main_oxigenada';

const Root = () => (
  <Composition
    id="Oxigenada"
    component={MainOxigenada}
    durationInFrames={TOTAL_FRAMES_OXIGENADA}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
