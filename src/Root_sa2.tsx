import "./index.css";
import { Composition } from "remotion";
import { MainSalitre2, TOTAL_FRAMES_SA2 } from "./VideoEdit/Main_salitre2";

export const RootSA2: React.FC = () => (
  <>
    <Composition id="Salitre2" component={MainSalitre2} durationInFrames={TOTAL_FRAMES_SA2} fps={30} width={1920} height={1080} />
  </>
);
