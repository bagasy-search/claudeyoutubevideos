import { Composition, registerRoot } from "remotion";
import { MainFedcolageno, TOTAL_FRAMES_FEDCOLAGENO } from "./_fed6/VideoEdit/Main_fedcolageno";

export const FedcolagenoRoot: React.FC = () => (
  <>
    <Composition id="Fedcolageno" component={MainFedcolageno} durationInFrames={TOTAL_FRAMES_FEDCOLAGENO} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(FedcolagenoRoot);
