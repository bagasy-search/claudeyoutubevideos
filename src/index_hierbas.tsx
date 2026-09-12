// Entry MÍNIMO solo-Hierbas para Remotion (bundle liviano / compositions check).
import './index.css';
import { registerRoot, Composition } from 'remotion';
import { MainHierbas, TOTAL_FRAMES_HIERBAS } from './VideoEdit/Main_hierbas';

const Root = () => (
  <Composition
    id="Hierbas"
    component={MainHierbas}
    durationInFrames={TOTAL_FRAMES_HIERBAS}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
