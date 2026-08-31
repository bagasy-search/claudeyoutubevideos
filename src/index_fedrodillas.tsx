import { Composition, registerRoot } from "remotion";
import { MainFedrodillas, TOTAL_FRAMES_FEDRODILLAS } from "./_fed6/VideoEdit/Main_fedrodillas";

const Root: React.FC = () => (
  <Composition id="Fedrodillas" component={MainFedrodillas}
    durationInFrames={TOTAL_FRAMES_FEDRODILLAS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
