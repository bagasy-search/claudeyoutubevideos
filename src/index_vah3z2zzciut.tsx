import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVah3z2zzciut, TOTAL_FRAMES_VAH3Z2ZZCIUT } from "./VideoEdit/Main_vah3z2zzciut";

const Root: React.FC = () => (
  <Composition
    id="Vah3z2zzciut"
    component={MainVah3z2zzciut}
    durationInFrames={TOTAL_FRAMES_VAH3Z2ZZCIUT}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
