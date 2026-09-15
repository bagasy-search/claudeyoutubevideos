import { registerRoot, Composition } from "remotion";
import { MainFcscuello, TOTAL_FRAMES_FCSCUELLO } from "./_fed6/VideoEdit/Main_fcscuello";

const Root: React.FC = () => (
  <Composition id="Fcscuello" component={MainFcscuello} durationInFrames={TOTAL_FRAMES_FCSCUELLO} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
